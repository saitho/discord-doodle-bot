import {CommandoClient, CommandMessage} from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";
import {PollStorage} from "../../lib/storage/polls";
import {Command} from "../../lib/command";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'doodle-add',
            group: 'doodle',
            memberName: 'add',
            description: 'add a new Doodle link',
            args: [
                {
                    key: 'url',
                    prompt: 'Doodle URL',
                    type: 'string',
                    validate: (text: string) => {
                        return DoodleUtility.extractDoodleCode(text).length > 0;
                    }
                },
            ],
        });
    }

    async runInternal(msg: CommandMessage, args) {
        const code = DoodleUtility.extractDoodleCode(args.url)
        if (!await new PollStorage(this.client.provider, msg.guild).add(code)) {
            return `Poll already in list.`;
        }
        return `Added poll to list.`
    }
}
