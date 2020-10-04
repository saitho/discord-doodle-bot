import {CommandMessage} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";
import {CommandoClient} from "../../lib/commandoclient";
import {TriggerExecutor} from "../../lib/trigger_executor";
import {Command} from "../../lib/command";

module.exports = class CheckCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-check',
            group: 'trigger',
            memberName: 'check',
            description: 'Checks status of polls and trigger if necessary',
            guildOnly: true
        });
    }

    async runInternal(msg: CommandMessage, args): Promise<Message|RichEmbed> {
        const message = new RichEmbed()
        const stats = await TriggerExecutor.execute(this.client, msg.guild.id)
        message.setTitle('Trigger status')
            .addField('Completed:', `${stats.completed} (${stats.removed} removed)`)
            .addField('Skipped:', stats.skipped)
            .addField('Errored:', stats.errored)
        return message
    }
}
