import {Command as DiscordCommand, CommandInfo, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";

export abstract class Command extends DiscordCommand {
    protected abstract runInternal(msg: CommandMessage, args: object|string|string[]): Promise<Message|RichEmbed|string>

    async run(msg: CommandMessage, args): Promise<Message> {
        msg.channel.startTyping()
        try {
            const message = await this.runInternal(msg, args)
            return msg.channel.send(message);
        } catch (error) {
            let message: RichEmbed = new RichEmbed()
            message.setColor("RED")
                .setTitle("Error message")
                .setDescription(error)
            msg.channel.stopTyping()
            return msg.channel.send(message);
        }
    }
}
