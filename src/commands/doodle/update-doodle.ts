import {CommandoClient, CommandMessage} from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";
import {PollStorage} from "../../lib/storage/polls";
import {Command} from "../../lib/command";

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

    async runInternal(msg: CommandMessage, args) {
        const code = DoodleUtility.extractDoodleCode(args.url)
        if (!await new PollStorage(this.client.provider, msg.guild).update(code)) {
            return `Poll already not in list.`
        }
        return `Updated poll in list.`
    }
}
