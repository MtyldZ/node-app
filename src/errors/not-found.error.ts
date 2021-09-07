import {HttpError} from './http-error';

export class NotFoundError<T> extends HttpError<{ error_body_message: string, details: T }> {
    constructor(message: string, details?: T) {
        super(404, {error_body_message: message, details});
    }
}
