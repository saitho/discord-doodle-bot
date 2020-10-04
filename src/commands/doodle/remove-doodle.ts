import { CommandoClient, CommandMessage } from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";
import {PollStorage} from "../../lib/storage/polls";
import {TriggerStorage} from "../../lib/storage/triggers";
import {Command} from "../../lib/command";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'doodle-remove',
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

    async runInternal(msg: CommandMessage, args) {
        const code = DoodleUtility.extractDoodleCode(args.url)
        if (!await new PollStorage(this.client.provider, msg.guild).remove(code)) {
            return `Poll not in list.`
        }
        const removedTriggers = await new TriggerStorage(this.client.provider, msg.guild).removeByPollCode(code)
        return `Removed poll from list and ${removedTriggers} associated triggers.`
    }
}
