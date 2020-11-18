import { CommandoClient, CommandMessage } from "discord.js-commando";
import {Command} from "../../lib/command";

module.exports = class ReactCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: '..',
            group: 'bot',
            memberName: '..',
            description: 'I react to your message...'
        });
    }

    async runInternal(msg: CommandMessage, args) {
        if (!msg.guild) {
            return
        }
        const emojis = ['🙈', '😱', '🤔'];
        await msg.react(emojis[~~(emojis.length * Math.random())])
        return
    }
}
