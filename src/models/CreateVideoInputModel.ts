import {Resolutions} from "../enums/video.enums";

export type CreateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions: Resolutions[]
}