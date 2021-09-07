import {Application} from 'express';
import {UserModule} from "./user/module";

export function applyRoutes(application: Application) {
    application.use('/', UserModule.create());
}
