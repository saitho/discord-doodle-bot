import axios from "axios";
import {DoodleEvent, DoodleParticipant, DoodlePreferencesType} from "../lib/doodle_event";

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

    public addParticipant(result: DoodleReducedResult, participant: DoodleParticipant, indexDateMap: Map<Number, string>) {
        const dates = participant.preferences
            .filter((value) => value !== DoodlePreferencesType.NO)
            .map((item, index) => {
                return {
                    date: indexDateMap.get(index),
                    type: item
                }
            });
        result.participants.push({
            ...participant,
            readableDates: (dates as {date: string; type: Number}[])
        })
    }

    public static getPollUrl(code: string) {
        return 'https://doodle.com/poll/' + code;
    }

    public extractVotes(code: string): Promise<DoodleReducedResult> {
        return new Promise<DoodleReducedResult>(async (resolve, reject) => {
            const reducedResult: DoodleReducedResult = {
                code: code,
                title: '',
                participants: []
            };
            axios.get('https://doodle.com/api/v2.0/polls/' + code)
                .then((result) => {
                    if (result.status !== 200) {
                        reject(result.statusText);
                    }
                    const data = result.data as DoodleEvent;
                    const indexDateMap = new Map<Number, string>()
                    for (const i in data.options) {
                        indexDateMap.set(Number(i), new Date(+data.options[i].startDateTime).toDateString())
                    }

                    for (const participant of data.participants) {
                        this.addParticipant(reducedResult, participant, indexDateMap);
                    }
                    reducedResult.title = data.title;
                    resolve(reducedResult);
                }).catch(reject);
        });
    }
}
