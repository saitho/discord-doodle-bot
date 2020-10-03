import { token, prefix, supportServerInvite } from "../config.json";
import path from "path";
import {CommandoClient} from "./lib/commandoclient";

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
    bot.guilds.forEach((g) => {
        bot.launchTriggerExecutor(g)
    });

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
