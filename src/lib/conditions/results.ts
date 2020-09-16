import {Conditional} from "../conditional";

export class ResultsConditions {
    protected poll: Conditional

    constructor(poll: Conditional) {
        this.poll = poll
    }

    public yes(date: string): number {
        const results = this.poll.results.get(date)
        return results ? results.yes : 0
    }
    public no(date: string): number {
        const results = this.poll.results.get(date)
        return results ? results.no : 0

    }
    public maybe(date: string): number {
        const results = this.poll.results.get(date)
        return results ? results.maybe : 0

    }
}
