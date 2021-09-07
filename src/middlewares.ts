import express, {Application} from "express";
import cors from 'cors'
import helmet from "helmet";
import {envelopeMiddleware} from "./middleware/envelope";

export function applyMiddlewares(application: Application) {
    application.use(helmet());
    application.use(cors({
        exposedHeaders: ['X-Total-Count'],
    }));
    application.use(express.json());
    application.use(envelopeMiddleware)
}
