import {Command, CommandMessage} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";
import {CommandoClient} from "../../lib/commandoclient";
import {TriggerExecutor} from "../../lib/trigger_executor";

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

    async run(msg: CommandMessage, args): Promise<Message> {
        msg.channel.startTyping()
        const stats = await TriggerExecutor.execute(this.client, msg.guild.id)
        const embed = new RichEmbed()
        embed.setTitle('Trigger status')
            .addField('Completed:', `${stats.completed} (${stats.removed} removed)`)
            .addField('Skipped:', stats.skipped)
            .addField('Errored:', stats.errored)
        msg.channel.stopTyping()
        return msg.channel.send(embed);
    }
}
