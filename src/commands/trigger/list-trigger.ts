import {CommandoClient, CommandMessage} from "discord.js-commando";
import {RichEmbed} from "discord.js";
import {DoodleUtility} from "../../utility/doodle";
import {TriggerStorage} from "../../lib/storage/triggers";
import {Command} from "../../lib/command";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-list',
            group: 'trigger',
            memberName: 'list',
            description: 'List all Triggers',
        });
    }

    async runInternal(msg: CommandMessage, _) {
        const triggerStorage = new TriggerStorage(this.client.provider, msg.guild)
        const triggers = await triggerStorage.get()
        let triggerEmbed = new RichEmbed();
        if (!triggers.length) {
            triggerEmbed.setDescription('No triggers configured. You can add one with `trigger-add`.')
        }
        for (const i in triggers) {
            if (Number(i) > 0) {
                await msg.channel.send(triggerEmbed)
                triggerEmbed = new RichEmbed()
            }
            const trigger = triggers[i]
            const executionTimes = trigger.executionTime.split(';');
            triggerEmbed
                .addField('Enabled?', `${trigger.enabled ? 'yes' : 'no'}`)
                .addField('Poll', `[${trigger.code}](${DoodleUtility.getPollUrl(trigger.code)})`)
                .addField('Condition', `\`${trigger.condition}\``)
                .addField('Execution cron time', executionTimes.map((item) => '`' + item + '`').join(' '))
                .addField('Message', trigger.message)
                .addField('Receiver', `${trigger.channelId}`)
                .addField('Remove after execution?', trigger.removeAfterExecution)
                .setFooter(`Trigger-ID: ${trigger.id}`)
        }
        return triggerEmbed
    }
}
