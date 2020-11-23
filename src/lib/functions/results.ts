import {Template} from "../template";
import {startOfWeek, addDays} from 'date-fns'


export class Results {
    protected poll: Template

    constructor(poll: Template) {
        this.poll = poll
    }

    protected getDateRange(dateFormat: string): Date[] {
        const rangeType = dateFormat.split(':')[0]
        const dates: Date[] = [];
        let start = 0;
        if (rangeType === 'nextWeek') {
            start = 7;
        }
        const weekStart = startOfWeek(Date.now(), {weekStartsOn: 1});
        for (let i = start; i < start+7; i++) {
            dates.push(addDays(weekStart, i))
        }
        return dates;
    }

    protected getPollUsers(key: string, date: string) {
        if (date.startsWith('range:')) {
            let results: string[] = [];
            const dates = this.getDateRange(date);
            for (let i = 0; i < dates.length; i++) {
                const dateString = dates[i].toISOString().split('T')[0];
                const result = this.poll.results.get(dateString);
                if (result) {
                    if (i === 0) {
                        results = result[key];
                        continue;
                    }
                    results = results.filter(x => result[key].includes(x));
                }
            }

            return results;
        }
        const results = this.poll.results.get(date)
        return results ? results[key] : []
    }

    public yesUser(date: string): string[] {
        return this.getPollUsers('yesUser', date);
    }

    public noUser(date: string): string[] {
        return this.getPollUsers('noUser', date);
    }

    public maybeUser(date: string): string[] {
        return this.getPollUsers('maybeUser', date);
    }

    public undecidedUser(date: string): string[] {
        return this.getPollUsers('undecidedUser', date);
    }

    public yes(date: string): number {
        return this.yesUser(date).length
    }

    public no(date: string): number {
        return this.noUser(date).length
    }

    public maybe(date: string): number {
        return this.maybeUser(date).length
    }

    public undecided(date: string): number {
        return this.undecidedUser(date).length
    }
}
