import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";
import {PollStorage} from "../../lib/storage/polls";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'doodle-update',
            group: 'doodle',
            memberName: 'update',
            description: 'Update an existing Doodle link\'s data',
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
        if (!await new PollStorage(this.client.provider, msg.guild).update(code)) {
            return msg.channel.send("Poll already not in list.");
        }
        return msg.channel.send("Updated poll in list.")
    }
}
