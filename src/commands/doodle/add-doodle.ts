import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";
import {PollStorage} from "../../lib/storage/polls";

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

    async run(msg: CommandMessage, args) {
        const code = DoodleUtility.extractDoodleCode(args.url)
        if (!await new PollStorage(this.client.provider, msg.guild).add(code)) {
            return msg.channel.send("Poll already in list.");
        }
        return msg.channel.send("Added poll to list.")
    }
}
