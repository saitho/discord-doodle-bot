import {DoodleReducedResult} from "../../utility/doodle";
import axios from "axios";
import {ObjectStorage} from "./object_storage";
import DoodleEvent from "../doodle/event";
import DoodleParticipant from "../doodle/participant";

export class PollStorage extends ObjectStorage<DoodleReducedResult, string> {
    idStorageName = 'polls'
    objectStoragePrefix = 'poll_'

    protected async mapIdToObject(code: string) {
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
                        indexDateMap.set(Number(i), new Date(+data.options[i].startDateTime).toISOString().split('T')[0])
                    }

                    for (const participant of data.participants) {
                        this.addParticipant(reducedResult, participant, indexDateMap);
                    }
                    reducedResult.title = data.title;
                    resolve(reducedResult);
                }).catch(reject);
        });
    }

    public addParticipant = (result: DoodleReducedResult, participant: DoodleParticipant, indexDateMap: Map<Number, string>) => {
        const dates = participant.preferences
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
    };

}
