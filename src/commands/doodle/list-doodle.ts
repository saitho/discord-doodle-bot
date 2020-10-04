import {CommandoClient, CommandMessage} from "discord.js-commando";
import {RichEmbed} from "discord.js";
import {DoodleReducedResult, DoodleUtility} from "../../utility/doodle";
import {PollStorage} from "../../lib/storage/polls";
import {Command} from "../../lib/command";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'doodle-list',
            group: 'doodle',
            memberName: 'list',
            description: 'List all Doodle links',
        });
    }

    async runInternal(msg: CommandMessage, _) {
        const pollStorage = new PollStorage(this.client.provider, msg.guild);
        const polls = await pollStorage.get()
        const formattedPolls: any[] = [];
        for (const pollId of polls) {
            const pollDetails = (await pollStorage.find(pollId)) as DoodleReducedResult
            formattedPolls.push(`- [${pollDetails.title}](${DoodleUtility.getPollUrl(pollDetails.code)}) [${pollDetails.code}]`);
        }
        const embed = new RichEmbed();
        embed.setTitle(`**${formattedPolls.length}** polls saved`)
            .setDescription(formattedPolls.join("\n"))
        return embed
    }
}
