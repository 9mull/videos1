import express, {Request, Response} from "express";
import {videos} from "../db/db";


export const getTestsRouter = () => {
    const router = express.Router();

    router.delete('/all-data', (req: Request, res: Response) => {
        videos.length = 0;

        res.sendStatus(204);
    })

    return router;
}
