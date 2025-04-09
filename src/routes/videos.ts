import express, {Request, Response} from "express";
import {videos, VideoType} from "../db/db";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/Request";
import {URIParamsVideoIdModel} from "../models/URIParamsVideoIdModel";
import {HTTP_STATUS_CODES} from "../utils/http-status-codes";
import {APIErrorResult} from "../types/APIErrorResult";
import {Resolutions} from "../enums/video.enums";
import {CreateVideoInputModel} from "../models/CreateVideoInputModel";
import {UpdateVideoInputModel} from "../models/UpdateVideoInputModel";


export const getVideosRouter = () => {

    const router = express.Router();

    router.get('/', (_req: Request, res: Response) => {
        res.json(videos);
    })

    router.post('/', (req: RequestWithBody<CreateVideoInputModel>, res: Response) => {
        const {title, author, availableResolutions} = req.body;
        const apiErrors: APIErrorResult = {errorsMessages: []};

        if (typeof title !== "string" || !title || title.length > 40) {
            apiErrors.errorsMessages.push({message: "invalid title", field: "title"});
        }

        if (typeof author !== "string" || !author || title.length > 20) {
            apiErrors.errorsMessages.push({message: "invalid author", field: "author"});
        }

        if (!Array.isArray(availableResolutions) || !availableResolutions.length) {
            apiErrors.errorsMessages.push({message: "invalid availableResolutions", field: "availableResolutions"});
        } else {
            const invalidResolutions = availableResolutions.filter(r => !Object.values(Resolutions).includes(r))

            if (invalidResolutions.length > 0) {
                apiErrors.errorsMessages.push({
                    message: "invalid availableResolutions", field: "availableResolutions",
                })
            }
        }

        if (apiErrors.errorsMessages.length) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(apiErrors);
            return;
        }

        const createdAt = new Date()
        const publicationDate = new Date(createdAt)
        publicationDate.setDate(createdAt.getDate() + 1);

        const newVideo: VideoType = {
            id: +(new Date()),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions
        }

        videos.push(newVideo);
        res.status(HTTP_STATUS_CODES.CREATED).json(newVideo);
    })

    router.get('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response) => {
        const foundVideo = videos.find(video => video.id === +req.params.id);

        if (!foundVideo) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }

        res.json(foundVideo);
    })

    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsVideoIdModel, UpdateVideoInputModel>, res: Response) => {
        const videoId = +req.params.id;
        const {
            title,
            author,
            canBeDownloaded,
            minAgeRestriction,
            publicationDate,
            availableResolutions
        } = req.body
        const apiErrors: APIErrorResult = {errorsMessages: []};

        if (typeof title !== "string" || !title || title.length > 40) {
            apiErrors.errorsMessages.push({message: "invalid title", field: "title"});
        }

        if (typeof author !== "string" || !author || title.length > 20) {
            apiErrors.errorsMessages.push({message: "invalid author", field: "author"});
        }

        if (typeof canBeDownloaded !== "boolean") {
            apiErrors.errorsMessages.push({
                message: "invalid canBeDownloaded", field: "canBeDownloaded",
            })
        }

        if (typeof minAgeRestriction !== "number" || (minAgeRestriction > 18 || minAgeRestriction < 1)) {
            apiErrors.errorsMessages.push({
                message: "invalid minAgeRestriction", field: "minAgeRestriction",
            })
        }

        const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(Z|([+-])\d{2}:\d{2})?$/;
        if (!publicationDate || !iso8601Regex.test(publicationDate)) {
            apiErrors.errorsMessages.push({
                message: "invalid publicationDate", field: "publicationDate",
            });
        }

        if (!Array.isArray(availableResolutions) || !availableResolutions.length) {
            apiErrors.errorsMessages.push({message: "invalid availableResolutions", field: "availableResolutions"});
        } else {
            const invalidResolutions = availableResolutions.filter(r => !Object.values(Resolutions).includes(r))

            if (invalidResolutions.length) {
                apiErrors.errorsMessages.push({
                    message: "invalid availableResolutions", field: "availableResolutions"
                })
            }
        }

        if (apiErrors.errorsMessages.length) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(apiErrors);
            return;
        }

        const video = videos.find(video => video.id === videoId);
        if (!video) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND)
            return;
        }

        video.title = title;
        video.author = author;
        video.canBeDownloaded = canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction;
        video.publicationDate = publicationDate;
        video.availableResolutions = availableResolutions;

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT)
    })

    router.delete('/:id', (req: RequestWithParams<URIParamsVideoIdModel>, res: Response) => {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === +req.params.id) {
                videos.splice(i, 1);
                res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
                return;
            }
        }

        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
    })

    return router;
}
