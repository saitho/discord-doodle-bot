import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
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

        const polls: string[] = await this.client.provider.get(msg.guild, "polls") ?? []
        if (polls.indexOf(code) !== -1) {
            return msg.channel.send("Poll already in list.");
        }
        await this.client.provider.set(msg.guild, "polls", [...polls, code])

        await this.client.provider.set(msg.guild, "poll_" + code, await new DoodleUtility().extractVotes(code))
        return msg.channel.send("Added poll to list.")
    }
}
