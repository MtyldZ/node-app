import express, {Application} from "express";
import {applyMiddlewares} from "./middlewares";
import {connectDB} from "./db";
import {applyRoutes} from "./routes";

export class App {
    public app: Application;

    constructor() {
        this.app = express();

        applyMiddlewares(this.app);
        applyRoutes(this.app);

        connectDB();
    }

    public listen() {
        const port = process.env.PORT;
        this.app.listen(port, () => {
            console.log(`App listening on the http://localhost:${port}`);
        });
    }
}
