import {Trigger} from "./trigger";
import {PollStorage} from "./storage/polls";
import {TriggerStorage} from "./storage/triggers";
import {CommandoClient} from "discord.js-commando";
import {Template} from "./template";
import {Guild, TextChannel, User} from "discord.js";
import {DiscordUtility} from "./discord";
import { getLogger } from "log4js";

export interface RunResponse {completed: number; skipped: number, removed: number, errored: number, disabled: number}

enum TriggerStatus {
    SUCCESS = 1,
    SKIPPED = 2,
    REMOVED = 3,
    DISABLED = 4
}

export class TriggerExecutor {
    public static executeSingle(client: CommandoClient, trigger: Trigger) {
        return new Promise<TriggerStatus>((resolve, reject) => {
            this.runTrigger(trigger, client)
                .then(async (status) => {
                    switch (status) {
                        case TriggerStatus.DISABLED:
                            getLogger().info('Trigger disabled:', trigger)
                            break;
                        case TriggerStatus.SKIPPED:
                            getLogger().info('Trigger skipped:', trigger)
                            break;
                        default:
                            if (trigger.removeAfterExecution) {
                                await this.getTriggerStorage(client, trigger.guildId).remove(trigger)
                                getLogger().info('Trigger executed and removed:', trigger)
                                status = TriggerStatus.REMOVED
                            } else {
                                getLogger().info('Trigger executed and not removed:', trigger)
                            }
                            break;
                    }
                    resolve(status)
                }).catch((e) => {
                    getLogger().error(`Trigger errored ("${e}"):`, trigger)
                    reject(e)
                });
        })
    }

    protected static getTriggerStorage(client: CommandoClient, guildId: string) {
        const guild = client.guilds.find(((value, key) => key === guildId))
        return new TriggerStorage(client.provider, guild)
    }

    protected static getPollStorage(client: CommandoClient, guildId: string) {
        const guild = client.guilds.find(((value, key) => key === guildId))
        return new PollStorage(client.provider, guild)
    }

    public static execute(client: CommandoClient, guildId: string) {
        return new Promise<RunResponse>(async (resolve, reject) => {
            const triggers = await this.getTriggerStorage(client, guildId).get()
            const promises: Promise<TriggerStatus>[] = []
            for (const trigger of triggers) {
                promises.push(this.executeSingle(client, trigger))
            }

            Promise.all(promises)
                .then((results) => {
                    const stats: RunResponse = {
                        completed: 0,
                        skipped: 0,
                        removed: 0,
                        errored: 0,
                        disabled: 0
                    }
                    for (const result of results) {
                        if (!result) {
                            stats.errored++
                            continue
                        }
                        switch (result) {
                            case TriggerStatus.DISABLED:
                                stats.disabled++;
                                break;
                            case TriggerStatus.SKIPPED:
                                stats.skipped++;
                                break;
                            default:
                                stats.completed++
                                if (result === TriggerStatus.REMOVED) {
                                    stats.removed++
                                }
                                break;
                        }
                    }
                    resolve(stats)
                })
                .catch((e) => reject(e))
        });
    }

    protected static runTrigger(trigger: Trigger, client: CommandoClient): Promise<TriggerStatus> {
        return new Promise<TriggerStatus>(async (resolve, reject) => {
            if (!trigger.enabled) {
                resolve(TriggerStatus.DISABLED)
                return
            }

            // Fetch guild information
            const guild = client.guilds.get(trigger.guildId)
            if (!guild) {
                reject(`Unable to find guild!`)
                return;
            }

            const poll = await this.getPollStorage(client, trigger.guildId).update(trigger.code)

            const conditionParsed = Template.parse(poll, trigger.condition, client, guild)
            if (conditionParsed !== "true") {
                resolve(TriggerStatus.SKIPPED)
                return;
            }

            await this.guildPrepareMentionedUsers(trigger.message, guild)
            const message = Template.parse(poll, trigger.message, client, guild)

            if (!message.length) {
               reject(`Message is empty.`)
                return;
            }
            /** @var channel TextChannel|User **/
            let channel;

            const channelInfo = new DiscordUtility().extractChannelId(trigger.channelId)
            if (channelInfo.channelType === "channel") {
                channel = client.channels.get(channelInfo.channelId) as TextChannel
            } else if (channelInfo.channelType === "user") {
                channel = client.users.get(channelInfo.channelId) as User
            } else {
                reject(`Unable to resolve target channel for trigger ${trigger.id}.`)
                return;
            }
            channel.send(message)
                .then(() => resolve(TriggerStatus.SUCCESS))
                .catch(reject);
        });
    }

    protected static async guildPrepareMentionedUsers(message: string, guild: Guild) {
        const regex = /\w+\.mention\(['"](.*?)['"]\)/g;
        let m;

        while ((m = regex.exec(message)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            for (const match of m) {
                await guild.fetchMembers(match, 1)
            }
        }
    }
}
