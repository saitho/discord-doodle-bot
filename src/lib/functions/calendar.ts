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
    plusDays(days: number): string {
        const date = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
        return date.toISOString().split('T')[0]
    }
}
