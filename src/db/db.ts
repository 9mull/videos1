import {Resolutions} from "../enums/video.enums";

export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Resolutions[]
}

export const videos: VideoType[] = [
    {
        id: 1,
        title: 'video1',
        author: 'author1',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2025-04-07T10:00:00Z",
        publicationDate: "2025-04-08T11:00:00Z",
        availableResolutions: [Resolutions.P144, Resolutions.P240, Resolutions.P360]
    },
    {
        id: 2,
        title: 'video2',
        author: 'author2',
        canBeDownloaded: true,
        minAgeRestriction: 11,
        createdAt: "2025-04-08T10:00:00Z",
        publicationDate: "2025-04-09T12:00:00Z",
        availableResolutions: [Resolutions.P360, Resolutions.P720]
    },
]