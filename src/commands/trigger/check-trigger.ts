import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {template} from "lodash";
import {Trigger} from "../../lib/trigger";
import {PollStorage} from "../../lib/storage/polls";
import {TriggerStorage} from "../../lib/storage/triggers";
import {DoodleReducedResult} from "../../utility/doodle";
import {Conditional} from "../../lib/conditional";
import {cpus} from "os";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-check',
            group: 'trigger',
            memberName: 'check',
            description: 'Checks status of polls and trigger if necessary',
            guildOnly: true
        });
    }

    async run(msg: CommandMessage, args) {
        const pollStorage = new PollStorage(this.client.provider, msg.guild)
        const triggerStorage = new TriggerStorage(this.client.provider, msg.guild)

        const triggers = await triggerStorage.get()
        const polls = new Set(triggers.map((item) => item.code))

        for (const pollCode of polls) {
            const poll = await pollStorage.update(pollCode)
            for(const trigger of triggers.filter((item) => item.code === pollCode)) {
                await this.runTrigger(trigger, poll)
            }
        }
        return msg.channel.send(`boop`)
    }

    protected async runTrigger(trigger: Trigger, poll: DoodleReducedResult) {
        const condition = Conditional.evaluateCondition(poll, trigger.condition)
        console.log(condition)

        const channel = await this.client.channels.get(trigger.channelId);
    }
}
