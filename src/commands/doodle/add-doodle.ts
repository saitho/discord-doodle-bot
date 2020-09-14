import { CommandoClient, Command, CommandMessage } from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'add',
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

    async run(msg: CommandMessage, args) {
        const code = DoodleUtility.extractDoodleCode(args.url)
        // todo: add poll to database
        return msg.channel.send("Added poll to list." + code)
    }
}
