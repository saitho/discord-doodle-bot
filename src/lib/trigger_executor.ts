import {Trigger} from "./trigger";
import {PollStorage} from "./storage/polls";
import {TriggerStorage} from "./storage/triggers";
import {CommandoClient} from "discord.js-commando";
import {Template} from "./template";
import {TextChannel} from "discord.js";

export interface RunResponse {completed: number; skipped: number, removed: number, errored: number}

export class TriggerExecutor {
    public static executeSingle(client: CommandoClient, trigger: Trigger) {
        return new Promise<boolean>(async (resolve, reject) => {
            const status = await this.runTrigger(trigger, client)
            if (status === null) {
                console.log('Trigger errored:')
                console.log(trigger)
                reject()
            } else if (!status) {
                console.log('Trigger skipped:')
                console.log(trigger)
            } else if (status) {
                if (trigger.removeAfterExecution) {
                    await this.getTriggerStorage(client, trigger.guildId).remove(trigger)
                    console.log('Trigger executed and removed:')
                } else {
                    console.log('Trigger executed and not removed:')
                }
                console.log(trigger)
            }


            resolve(status)
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

    public static async execute(client: CommandoClient, guildId: string): Promise<RunResponse> {
        const triggers = await this.getTriggerStorage(client, guildId).get()

        const stats: RunResponse = {
            completed: 0,
            skipped: 0,
            removed: 0,
            errored: 0
        }
        for (const trigger of triggers) {
            const result = await this.executeSingle(client, trigger)
            if (result === null) {
                stats.errored++
                continue
            } else if (!result) {
                stats.skipped++
                continue
            }
            stats.completed++
            if (trigger.removeAfterExecution) {
                stats.removed++
            }
        }

        return stats;
    }

    protected static async runTrigger(trigger: Trigger, client: CommandoClient): Promise<boolean> {
        const poll = await this.getPollStorage(client, trigger.guildId).update(trigger.code)

        return new Promise<boolean>((resolve, reject) => {
            const conditionParsed = Template.parse(poll, trigger.condition, client)
            if (conditionParsed !== "true") {
                resolve(false)
            }

            const channel = client.channels.get(trigger.channelId) as TextChannel
            channel.send(Template.parse(poll, trigger.message, client))
                .then(() => resolve(true))
                .catch(reject);
        });
    }
}
