import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {Trigger} from "../../lib/trigger";
import {PollStorage} from "../../lib/storage/polls";
import {TriggerStorage} from "../../lib/storage/triggers";
import {DoodleReducedResult} from "../../utility/doodle";
import {Template} from "../../lib/template";
import axios from "axios";
import {RichEmbed} from "discord.js";

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
                const result = await this.runTrigger(trigger, poll)
                if (result === null) {
                    console.log('Trigger errored: ' + trigger.toString())
                    stats.errored++
                    continue
                } else if (!result) {
                    console.log('Trigger skipped: ' + trigger.toString())
                    stats.skipped++
                    continue
                }
                console.log('Trigger executed: ' + trigger.toString())
                stats.completed++
                if (trigger.removeAfterExecution) {
                    console.log('Trigger removed: ' + trigger.toString())
                    stats.removed++
                    await triggerStorage.remove(trigger)
                }
            }
        }
        const embed = new RichEmbed()
        embed.setTitle('Trigger status')
            .addField('Completed:', `${stats.completed} (${stats.removed} removed)`)
            .addField('Skipped:', stats.skipped)
            .addField('Errored:', stats.errored)
        return msg.channel.sendEmbed(embed)
    }

    protected async runTrigger(trigger: Trigger, poll: DoodleReducedResult): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const condition = Template.parse(poll, trigger.condition)
            if (!condition) {
                resolve(false)
            }

            axios
                .post(trigger.url, {content: Template.parse(poll, trigger.message)})
                .then(() => resolve(true))
                .catch(reject);
        });
    }
}
