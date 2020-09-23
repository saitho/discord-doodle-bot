import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {Trigger} from "../../lib/trigger";
import {PollStorage} from "../../lib/storage/polls";
import {TriggerStorage} from "../../lib/storage/triggers";
import {DoodleReducedResult} from "../../utility/doodle";
import {RichEmbed, TextChannel} from "discord.js";
import {Template} from "../../lib/template";

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

    async run(msg: CommandMessage, args) {
        const pollStorage = new PollStorage(this.client.provider, msg.guild)
        const triggerStorage = new TriggerStorage(this.client.provider, msg.guild)

        const triggers = await triggerStorage.get()
        const polls = new Set(triggers.map((item) => item.code))

        const stats = {
            completed: 0,
            skipped: 0,
            removed: 0,
            errored: 0
        }
        for (const pollCode of polls) {
            const poll = await pollStorage.update(pollCode)
            for(const trigger of triggers.filter((item) => item.code === pollCode)) {
                const result = await this.runTrigger(trigger, poll, msg.client)
                if (result === null) {
                    console.log('Trigger errored:')
                    console.log(trigger)
                    stats.errored++
                    continue
                } else if (!result) {
                    console.log('Trigger skipped:')
                    console.log(trigger)
                    stats.skipped++
                    continue
                }
                stats.completed++
                if (trigger.removeAfterExecution) {
                    console.log('Trigger executed and removed:')
                    console.log(trigger)
                    stats.removed++
                    await triggerStorage.remove(trigger)
                } else {
                    console.log('Trigger executed and not removed:')
                    console.log(trigger)
                }
            }
        }
        const embed = new RichEmbed()
        embed.setTitle('Trigger status')
            .addField('Completed:', `${stats.completed} (${stats.removed} removed)`)
            .addField('Skipped:', stats.skipped)
            .addField('Errored:', stats.errored)
        return msg.channel.send(embed)
    }

    protected async runTrigger(trigger: Trigger, poll: DoodleReducedResult, client: CommandoClient): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const condition = Template.parse(poll, trigger.condition, client)
            if (!condition) {
                resolve(false)
            }

            const channel = this.client.channels.get(trigger.channelId) as TextChannel
            channel.send(Template.parse(poll, trigger.message, client))
                .then(() => resolve(true))
                .catch(reject);
        });
    }
}
