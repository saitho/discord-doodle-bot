export class DoodleUtility {
    public static extractDoodleCode(url: string): string {
        const regex = new RegExp(/^https?:\/\/(?:www\.)?doodle\.com\/poll\/(\w+)$/)
        const matches = url.match(regex)
        return matches![1];
    }
}
