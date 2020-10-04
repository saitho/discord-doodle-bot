import {CommandoClient, CommandMessage} from "discord.js-commando";
import {TriggerStorage} from "../../lib/storage/triggers";
import {Scheduler} from "../../lib/scheduler";
import {Command} from "../../lib/command";

module.exports = class RemoveTrigger extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-remove',
            group: 'trigger',
            memberName: 'remove',
            description: 'Remove a Doodle trigger',
            guildOnly: true,
            args: [
                {
                    key: 'triggerId',
                    prompt: 'Trigger ID',
                    type: 'string'
                }
            ],
        });
    }

    async runInternal(msg: CommandMessage, args) {
        const storage = new TriggerStorage(this.client.provider, msg.guild)
        Scheduler.getInstance().unschedule(args.triggerId)
        if (await storage.removeById(args.triggerId)) {
            return `removed trigger with id ${args.triggerId}`
        }
        return `unable to remove trigger with id ${args.triggerId}`
    }
}
