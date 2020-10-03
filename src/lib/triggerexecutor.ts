import {PollStorage} from "./storage/polls";
import {TriggerStorage} from "./storage/triggers";
import {CommandoClient} from "./commandoclient";
import {argv} from "yargs";
import {token} from "../../config.json";
import {Trigger} from "./trigger";
import {DoodleReducedResult} from "../utility/doodle";
import {Template} from "./template";
import {TextChannel} from "discord.js";

interface TriggerMessage {
    type: string // 'configure', 'run',
    data: any;
}

export interface RunResponse {completed: number; skipped: number, removed: number, errored: number}



async function runTrigger(trigger: Trigger, poll: DoodleReducedResult, client: CommandoClient): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const conditionParsed = Template.parse(poll, trigger.condition, client)
        if (conditionParsed !== "true") {
            resolve(false)
        }

        const channel = this.client.channels.get(trigger.channelId) as TextChannel
        channel.send(Template.parse(poll, trigger.message, client))
            .then(() => resolve(true))
            .catch(reject);
    });
}

async function run(): Promise<RunResponse> {
    return new Promise<RunResponse>((resolve, reject) => {
        const client = new CommandoClient()
        client.on("debug", console.log)
        client.init()
            .catch((e) => reject(e))

        client.once("ready", async () => {
            const guild = client.guilds.find(((value, key) => key === argv.guildId))

            const pollStorage = new PollStorage(client.provider, guild)
            const triggerStorage = new TriggerStorage(client.provider, guild)

            const triggers = await triggerStorage.get()
            const polls = new Set(triggers.map((item) => item.code))

            const stats: RunResponse = {
                completed: 0,
                skipped: 0,
                removed: 0,
                errored: 0
            }
            for (const pollCode of polls) {
                const poll = await pollStorage.update(pollCode)
                for(const trigger of triggers.filter((item) => item.code === pollCode)) {
                    const result = await runTrigger(trigger, poll, client)
                    if (result === null) {
                        console.log('Trigger errored:')
                        console.log(trigger)
                        stats.errored++
                        continue
                    } else if (!result) {
                        console.log('Trigger skipped:')
                        console.log(trigger)
                        stats.skipped++
                        continue
                    }
                    stats.completed++
                    if (trigger.removeAfterExecution) {
                        console.log('Trigger executed and removed:')
                        console.log(trigger)
                        stats.removed++
                        await triggerStorage.remove(trigger)
                    } else {
                        console.log('Trigger executed and not removed:')
                        console.log(trigger)
                    }
                }
            }
            resolve(stats)
        })
        client.login(token).catch(console.log)
    })
}

process.on('message', async (msg: TriggerMessage) => {
    switch (msg.type) {
        case 'run':
            const result = await run();
            process.send!({ type: 'run', data: result });
            break;
        default:
            console.error(`Unknown message type "${msg.type}".`)
            break;
    }
});
