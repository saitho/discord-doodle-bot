import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {TextChannel} from "discord.js";
import {TriggerStorage} from "../../lib/storage/triggers";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-set',
            group: 'trigger',
            memberName: 'set',
            description: 'set a new Doodle trigger',
            guildOnly: true,
            examples: [
                'Send message to #dev channel if more than 1 person said yes for date 2020-09-15:\n`trigger-set c46457x3iyz5ue6w "${poll.results.get(\'2020-09-15\').yes > 1" "${poll.results.get(\'2020-09-15\').yes} people are available" #dev`'
            ],
            args: [
                {
                    key: 'code',
                    prompt: 'Doodle code',
                    type: 'string'
                },
                {
                    key: 'condition',
                    prompt: 'Condition that has to be met',
                    type: 'string'
                },
                {
                    key: 'message',
                    prompt: 'Message to post',
                    type: 'string'
                },
                {
                    key: 'url',
                    prompt: 'Webhook URL to post to',
                    type: 'string'
                },
                {
                    key: 'removeAfterExecution',
                    prompt: 'Remove trigger after successful execution (enabled per default)',
                    type: 'boolean',
                    default: true
                },
            ],
        });
    }

    async run(msg: CommandMessage, args) {
        const code = args.code
        const polls: string[] = await this.client.provider.get(msg.guild, "polls") ?? []
        if (polls.indexOf(code) === -1) {
            return msg.channel.send("Code not found. Make sure to add it via `doodle-add` command.");
        }

        const storage = new TriggerStorage(this.client.provider, msg.guild)
        await storage.set({
            code: code,
            condition: args.condition,
            message: args.message,
            url: args.url,
            removeAfterExecution: args.removeAfterExecution
        })

        return msg.channel.send(`set trigger for code ${code}`)
    }
}
