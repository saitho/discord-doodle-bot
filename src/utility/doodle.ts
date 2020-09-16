import DoodleParticipant from "../lib/doodle/participant";

export interface DiscordParticipant extends DoodleParticipant {
    readableDates: {date: string; type: Number}[];
}

export interface DoodleReducedResult {
    code: string;
    title: string;
    participants: DiscordParticipant[];
}

export class DoodleUtility {
    public static extractDoodleCode(url: string): string {
        const regex = new RegExp(/^https?:\/\/(?:www\.)?doodle\.com\/poll\/(\w+)$/)
        const matches = url.match(regex)
        return matches![1];
    }

    public static getPollUrl(code: string) {
        return 'https://doodle.com/poll/' + code;
    }
}
