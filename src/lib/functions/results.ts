import {Template} from "../template";

export class Results {
    protected poll: Template

    constructor(poll: Template) {
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


    public yesUser(date: string): string[] {
        const results = this.poll.results.get(date)
        return results ? results.yesUser : []
    }

    public noUser(date: string): string[] {
        const results = this.poll.results.get(date)
        return results ? results.noUser : []
    }

    public maybeUser(date: string): string[] {
        const results = this.poll.results.get(date)
        return results ? results.maybeUser : []
    }
}
