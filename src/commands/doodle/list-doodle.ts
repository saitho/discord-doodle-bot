import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {RichEmbed} from "discord.js";
import {DoodleReducedResult, DoodleUtility} from "../../utility/doodle";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'doodle-list',
            group: 'doodle',
            memberName: 'list',
            description: 'List all Doodle links',
        });
    }

    async run(msg: CommandMessage, _) {
        const polls = await this.client.provider.get(msg.guild, "polls")
        const formattedPolls: any[] = [];
        for (const pollId of polls) {
            const pollDetails = (await this.client.provider.get(msg.guild, "poll_" + pollId)) as DoodleReducedResult
            formattedPolls.push(`- [${pollDetails.title}](${DoodleUtility.getPollUrl(pollDetails.code)}) [${pollDetails.code}]`);
        }
        const embed = new RichEmbed();
        embed.setTitle(`**${formattedPolls.length}** polls saved`)
            .setDescription(formattedPolls.join("\n"))
        return msg.channel.sendEmbed(embed)
    }
}
