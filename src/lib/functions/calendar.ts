export class Calendar {
    get today(): string {
        return new Date().toISOString().split('T')[0]
    }
    get tomorrow(): string {
        return this.plusDays(1)
    }
    get yesterday(): string {
        return this.plusDays(-1)
    }
    get thisWeek(): string {
        return this.weekFromNow(0)
    }
    get nextWeek(): string {
        return this.weekFromNow(1)
    }
    weekFromNow(week: number): string {
        return 'range:weekFromNow:' + week
    }
    plusDays(days: number): string {
        const date = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
        return date.toISOString().split('T')[0]
    }
}
