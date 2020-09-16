import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {RichEmbed} from "discord.js";
import {DoodleUtility} from "../../utility/doodle";
import {TriggerStorage} from "../../lib/storage/triggers";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-list',
            group: 'trigger',
            memberName: 'list',
            description: 'List all Triggers',
        });
    }

    async run(msg: CommandMessage, _) {
        const triggerStorage = new TriggerStorage(this.client.provider, msg.guild)
        const triggers = await triggerStorage.get()
        const embeds: RichEmbed[] = []
        for (const trigger of triggers) {
            const triggerEmbed = new RichEmbed();
            triggerEmbed
                .addField('Poll', `[${trigger.code}](${DoodleUtility.getPollUrl(trigger.code)})`)
                .addField('Condition', `\`${trigger.condition}\``)
                .addField('Message', trigger.message)
                .addField('Receiver', `<#${trigger.channelId}>`)
            embeds.push(triggerEmbed)
        }
        return msg.channel.send(...embeds)
    }
}
