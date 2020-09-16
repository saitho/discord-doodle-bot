import {CommandoClient, SQLiteProvider} from "discord.js-commando";
const { token, prefix, supportServerInvite } = require("../config.json");
import path from "path";
import sqlite from 'sqlite';

const bot: CommandoClient = new CommandoClient({
    commandPrefix: prefix,
    commandEditableDuration: 10,
    nonCommandEditable: true,
    invite: supportServerInvite
})

bot.registry
    .registerGroups([
        ["bot", "Meta"],
        ["doodle", "Doodle"],
        ["trigger", "Trigger"]
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'))

sqlite.open(path.join(__dirname, 'database.sqlite3')).then(async (database) => {
    await bot.setProvider(new SQLiteProvider(database));
}).catch((e) => {
    console.error(`Failed to connect to database: ${e}`)
})

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
})

bot.login(token).catch(console.log);
