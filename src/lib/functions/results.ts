import {Template} from "../template";

export class Results {
    protected poll: Template

    constructor(poll: Template) {
        this.poll = poll
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

    public undecidedUser(date: string): string[] {
        const results = this.poll.results.get(date)
        return results ? results.undecidedUser : []
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
