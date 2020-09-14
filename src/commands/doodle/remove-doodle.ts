import { CommandoClient, Command, CommandMessage } from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'remove',
            group: 'doodle',
            memberName: 'remove',
            description: 'Remove a Doodle link',
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

    async run(msg: CommandMessage, args) {
        const code = DoodleUtility.extractDoodleCode(args.url)
        // todo: remove poll from database
        return msg.channel.send("Removed poll from list." + code)
    }
}
