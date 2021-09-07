import {Filter} from '../middleware/filter';
import {AuthenticationModel} from './authentication';

declare module 'express' {
    export interface Request {
        authentication: AuthenticationModel;
        filter?: Filter;
    }

    export interface Response {
        json_complete: boolean;
    }
}
