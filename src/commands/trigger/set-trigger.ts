import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {TextChannel} from "discord.js";
import {TriggerStorage} from "../../lib/storage/triggers";
import * as cron from "node-cron"
import {Scheduler} from "../../lib/scheduler";

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
                    key: 'time',
                    prompt: 'When to check if trigger succeeded (crontab format)',
                    type: 'string'
                },
                {
                    key: 'channel',
                    prompt: 'channel where to post the message. if no channel given it will be sent to the channel that set the trigger.',
                    type: 'string',
                    default: ''
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
        if (!cron.validate(args.time)) {
            return msg.channel.send(`Invalid time format.`)
        }

        const code = args.code
        const polls: string[] = await this.client.provider.get(msg.guild, "polls") ?? []
        if (polls.indexOf(code) === -1) {
            return msg.channel.send("Code not found. Make sure to add it via `doodle-add` command.");
        }

        let channel = msg.channel;
        if (args.channel instanceof TextChannel) {
            channel = args.channel;
        }

        const storage = new TriggerStorage(this.client.provider, msg.guild)
        const trigger = {
            code: code,
            condition: args.condition,
            message: args.message,
            channelId: channel.id,
            removeAfterExecution: args.removeAfterExecution,
            guildId: msg.guild.id,
            executionTime: args.time
        };
        await storage.set(trigger)
        Scheduler.getInstance().schedule(this.client, trigger)

        return msg.channel.send(`set trigger for code ${code}`)
    }
}
