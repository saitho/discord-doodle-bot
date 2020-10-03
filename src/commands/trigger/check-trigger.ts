import {Command, CommandMessage} from "discord.js-commando";
import {Message, RichEmbed, TextChannel} from "discord.js";
import {CommandoClient} from "../../lib/commandoclient";
import {RunResponse} from "../../lib/triggerexecutor";

module.exports = class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: 'trigger-check',
            group: 'trigger',
            memberName: 'check',
            description: 'Checks status of polls and trigger if necessary',
            guildOnly: true
        });
    }

    async run(msg: CommandMessage, args): Promise<Message> {
        return new Promise<Message>((resolve => {
            const client = (this.client as CommandoClient)
            const triggerResultListener = function (resultMsg) {
                if (resultMsg.type !== 'run') {
                    return;
                }
                const stats = resultMsg.data as RunResponse

                const embed = new RichEmbed()
                embed.setTitle('Trigger status')
                    .addField('Completed:', `${stats.completed} (${stats.removed} removed)`)
                    .addField('Skipped:', stats.skipped)
                    .addField('Errored:', stats.errored)
                resolve((msg.channel as TextChannel).send(embed))
            }
            const executor = client.getTriggerExecutor(msg.guild)
            if (!executor) {
                console.error('Unable to get Trigger executor for guild!')
                return;
            }
            executor.once('message', triggerResultListener);
            executor.send({
                type: 'run'
            });
        }));
    }
}
