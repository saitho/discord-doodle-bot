import path from "path";
import {CommandoClient} from "./lib/commandoclient";
import {Scheduler} from "./lib/scheduler";
import {TriggerStorage} from "./lib/storage/triggers";

// Do not use "import" syntax so this file is not needed during build!
const { token, prefix, supportServerInvite } = require('../config.json')

const botConfig = {
    commandPrefix: prefix,
    commandEditableDuration: 10,
    nonCommandEditable: true,
    invite: supportServerInvite
}
const bot: CommandoClient = new CommandoClient(botConfig)
bot.registry
    .registerGroups([
        ["bot", "Meta"],
        ["doodle", "Doodle"],
        ["trigger", "Trigger"]
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'))

bot.init()
    .catch(console.error)

bot.on("ready", async () => {
    // start sub processes
    for (const g of bot.guilds.values()) {
        // Schedule tasks from database
        const triggerStorage = new TriggerStorage(bot.provider, g)
        const triggers = await triggerStorage.get()
        for (const trigger of triggers) {
            Scheduler.getInstance().schedule(bot, trigger)
        }
    }

    await bot.user.setPresence({
        game: {
            name: "They like it bot",
            type: "WATCHING"
        }
    })
    await bot.user.setStatus("idle")
    console.log(`${bot.user.username} is online!`);
})

bot.login(token).catch(console.log);
