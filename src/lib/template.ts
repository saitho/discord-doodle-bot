import {DiscordParticipant, DoodleReducedResult} from "../utility/doodle";
import {template} from "lodash";
import {DoodlePreferencesType} from "./doodle_event";
import {DateConditions} from "./conditions/date";
import {ResultsConditions} from "./conditions/results";

export class Template {
    protected result: DoodleReducedResult;

    public static parse(result: DoodleReducedResult, condition: string) {
        const poll = new this(result)
        return template(condition)({
            poll: poll,
            date: new DateConditions(),
            results: new ResultsConditions(poll)
        })
    }

    // protected
    public constructor(result: DoodleReducedResult) {
        this.result = result
    }

    public get results() {
        const results = new Map<string, { date: string; yes: number; no: number; maybe: number }>()

        for (const p of this.result.participants) {
            for (const d of p.readableDates) {
                let result = results.get(d.date)
                if (!result) {
                    result = {
                        date: d.date,
                        yes: 0,
                        no: 0,
                        maybe: 0
                    }
                }
                switch (d.type) {
                    case DoodlePreferencesType.NO:
                        result.no++
                        break
                    case DoodlePreferencesType.YES:
                        result.yes++
                        break;
                    case DoodlePreferencesType.YESNOIFNEEDBE:
                        result.maybe++
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
