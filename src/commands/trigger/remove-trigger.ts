import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {TriggerStorage} from "../../lib/storage/triggers";
import {Scheduler} from "../../lib/scheduler";

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

    async run(msg: CommandMessage, args) {
        const storage = new TriggerStorage(this.client.provider, msg.guild)
        Scheduler.getInstance().unschedule(args.triggerId)
        await storage.removeById(args.triggerId)
        return msg.channel.send(`remove trigger with id ${args.triggerId}`)
    }
}
