import {Command as DiscordCommand, CommandMessage} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";
import {getLogger} from "log4js";

export abstract class Command extends DiscordCommand {
    protected abstract runInternal(msg: CommandMessage, args: object|string|string[]): Promise<Message|RichEmbed|string>

    async run(msg: CommandMessage, args): Promise<Message> {
        msg.channel.startTyping()
        try {
            const message = await this.runInternal(msg, args)
            const sendMessage = msg.channel.send(message)
            msg.channel.stopTyping(true)
            return sendMessage;
        } catch (error) {
            let message: RichEmbed = new RichEmbed()
            getLogger().error('Error while sending a message!', error, msg)
            message.setColor("RED")
                .setTitle("Error message")
                .setDescription(error)
            msg.channel.stopTyping(true)
            return msg.channel.send(message);
        }
    }
}
