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

        let polls: string[] = await this.client.provider.get(msg.guild, "polls") ?? []
        const pollPos = polls.indexOf(code)
        if (pollPos === -1) {
            return msg.channel.send("Poll not in list.")
        }

        await this.client.provider.set(msg.guild, "polls", polls.filter((item) => item !== code))
        await this.client.provider.remove(msg.guild, "poll_" + code)
        return msg.channel.send("Removed poll from list.")
    }
}
