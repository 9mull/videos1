import {Resolutions} from "../enums/video.enums";

export type UpdateVideoInputModel = {
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string,
    availableResolutions: Resolutions[]
}