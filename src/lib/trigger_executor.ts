import {Trigger} from "./trigger";
import {PollStorage} from "./storage/polls";
import {TriggerStorage} from "./storage/triggers";
import {CommandoClient} from "discord.js-commando";
import {Template} from "./template";
import {TextChannel} from "discord.js";

export interface RunResponse {completed: number; skipped: number, removed: number, errored: number}

enum TriggerStatus {
    SUCCESS = 1,
    SKIPPED = 2,
    REMOVED = 3
}

export class TriggerExecutor {
    public static executeSingle(client: CommandoClient, trigger: Trigger) {
        return new Promise<TriggerStatus>((resolve, reject) => {
            this.runTrigger(trigger, client)
                .then(async (status) => {
                    switch (status) {
                        case TriggerStatus.SKIPPED:
                            console.log('Trigger skipped:')
                            console.log(trigger)
                            break;
                        default:
                            if (trigger.removeAfterExecution) {
                                await this.getTriggerStorage(client, trigger.guildId).remove(trigger)
                                console.log('Trigger executed and removed:')
                                status = TriggerStatus.REMOVED
                            } else {
                                console.log('Trigger executed and not removed:')
                            }
                            console.log(trigger)
                            break;
                    }
                    resolve(status)
                }).catch((e) => {
                    console.log(`Trigger errored ("${e}"):`)
                    console.log(trigger)
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
                        errored: 0
                    }
                    for (const result of results) {
                        if (!result) {
                            stats.errored++
                            continue
                        }
                        switch (result) {
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

    protected static async runTrigger(trigger: Trigger, client: CommandoClient): Promise<TriggerStatus> {
        const poll = await this.getPollStorage(client, trigger.guildId).update(trigger.code)

        return new Promise<TriggerStatus>((resolve, reject) => {
            const conditionParsed = Template.parse(poll, trigger.condition, client)
            if (conditionParsed !== "true") {
                resolve(TriggerStatus.SKIPPED)
            }

            const channel = client.channels.get(trigger.channelId) as TextChannel
            const message = Template.parse(poll, trigger.message, client)
            if (!message.length) {
               reject(`Message is empty.`)
            }
            channel.send(message)
                .then(() => resolve(TriggerStatus.SUCCESS))
                .catch(reject);
        });
    }
}
