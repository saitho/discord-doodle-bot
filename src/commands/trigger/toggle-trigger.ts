import {CommandoClient, CommandMessage} from "discord.js-commando";
import {TriggerStorage} from "../../lib/storage/triggers";
import {Scheduler} from "../../lib/scheduler";
import {Command} from "../../lib/command";

module.exports = class RemoveTrigger extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-toggle',
            group: 'trigger',
            memberName: 'toggle',
            description: 'Toggle a Doodle trigger (enable/disable)',
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
        const trigger = await storage.getById(args.triggerId)
        if (!trigger) {
            return `no trigger found with id ${args.triggerId}`
        }
        if (trigger.enabled) {
            // Disable
            trigger.enabled = false
            await storage.set(trigger)
            Scheduler.getInstance().unschedule(args.triggerId)
            return `Trigger with id ${args.triggerId} is now disabled`
        }
        // Enable
        trigger.enabled = true
        await storage.set(trigger)
        Scheduler.getInstance().schedule(this.client, trigger)
        return `Trigger with id ${args.triggerId} is now enabled`
    }
}
