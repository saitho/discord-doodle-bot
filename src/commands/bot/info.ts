import { CommandoClient, CommandMessage } from "discord.js-commando";
import {Command} from "../../lib/command";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'info',
            aliases: ['i'],
            group: 'bot',
            memberName: 'info',
            description: 'shows you information about me.'
        });
    }

    async runInternal(msg: CommandMessage, args) {
        return `We're live!`
    }
}
