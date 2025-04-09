import express from "express";
import {getVideosRouter} from "./routes/videos";
import {getTestsRouter} from "./routes/tests";

export const app = express();
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)
app.use('/videos', getVideosRouter())
app.use('/testing', getTestsRouter())