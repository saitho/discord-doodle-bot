import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {DoodleUtility} from "../../utility/doodle";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'update',
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

        const polls: string[] = await this.client.provider.get(msg.guild, "polls") ?? []
        if (polls.indexOf(code) === -1) {
            return msg.channel.send("Poll already not in list.");
        }
        await this.client.provider.set(msg.guild, "poll_" + code, await new DoodleUtility().extractVotes(code))
        return msg.channel.send("Updated poll in list.")
    }
}
