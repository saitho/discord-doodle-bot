import {DiscordParticipant, DoodleReducedResult} from "../utility/doodle";
import {template} from "lodash";
import {Calendar} from "./functions/calendar";
import {Results} from "./functions/results";
import {User} from "./functions/user";
import {CommandoClient} from "discord.js-commando";
import {DoodlePreferencesType} from "./doodle/preferences_type";
import {Guild} from "discord.js";
import {getLogger} from "log4js";

export interface PollResult {
    date: string;
    yesUser: string[];
    noUser: string[];
    maybeUser: string[];
    undecidedUser: string[];
}

export class Template {
    protected result: DoodleReducedResult;

    public static parse(result: DoodleReducedResult, condition: string, client: CommandoClient, guild: Guild) {
        const poll = new this(result)
        const calendarFunc = new Calendar()
        const resultsFunc = new Results(poll)
        const usersFunc = new User(client, guild)

        getLogger().debug(`Parsing message "${condition}" via Template`)
        return template(condition)({
            poll: poll,
            p: poll,
            date: calendarFunc,
            d: calendarFunc,
            results: resultsFunc,
            r: resultsFunc,
            user: usersFunc,
            u: usersFunc
        })
    }

    // protected
    public constructor(result: DoodleReducedResult) {
        this.result = result
    }

    public get results() {
        const results = new Map<string, PollResult>()

        for (const p of this.result.participants) {
            for (const d of p.readableDates) {
                let result = results.get(d.date)
                if (!result) {
                    result = {
                        date: d.date,
                        yesUser: [],
                        noUser: [],
                        maybeUser: [],
                        undecidedUser: []
                    }
                }
                switch (d.type) {
                    case null: // Undecided
                        result.undecidedUser.push(p.name)
                        break
                    case DoodlePreferencesType.NO:
                        result.noUser.push(p.name)
                        break
                    case DoodlePreferencesType.YES:
                        result.yesUser.push(p.name)
                        break;
                    case DoodlePreferencesType.YESNOIFNEEDBE:
                        result.maybeUser.push(p.name)
                        break;
                }
                results.set(d.date, result)
            }
        }

        return results
    }

    public get participant(): Map<string, DiscordParticipant> {
        const m = new Map<string, DiscordParticipant>();
        for (const p of this.result.participants) {
            m.set(p.name, p);
        }
        return m;
    }
}
