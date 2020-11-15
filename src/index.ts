import path from "path";
import {CommandoClient} from "./lib/commandoclient";
import {Scheduler} from "./lib/scheduler";
import {TriggerStorage} from "./lib/storage/triggers";

// Do not use "import" syntax so this file is not needed during build!
const { token, prefix, supportServerInvite } = require('../config.json')

// setup logger
import {configure, getLogger} from "log4js";

configure({
    appenders: {
        app: {
            type: "file",
            filename: "log/app.log",
            maxLogSize: 10485760,
            numBackups: 3
        },
        errorFile: {
            type: "file",
            filename: "log/errors.log"
        },
        errors: {
            type: "logLevelFilter",
            level: "ERROR",
            appender: "errorFile"
        }},
    categories: { default: { appenders: ["app", "errors"], level: "INFO" } }
})

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
    .catch(getLogger().error)

bot.on("ready", async () => {
    // start sub processes
    for (const g of bot.guilds.values()) {
        const triggerStorage = new TriggerStorage(bot.provider, g)

        // Run migrations
        await triggerStorage.runMigrations()

        const triggers = await triggerStorage.get()
        // Schedule tasks from database
        for (const trigger of triggers) {
            Scheduler.getInstance().schedule(bot, trigger)
        }
    }

    await bot.user.setPresence({
        game: {
            name: "Some like it bot",
            type: "WATCHING"
        }
    })
    await bot.user.setStatus("idle")
    getLogger().info(`${bot.user.username} is online!`);
})

bot.login(token).catch(getLogger().error);
