import {HttpError} from './http-error';

export class ConflictError<T> extends HttpError<{ error_body_message: string, details: T }> {
    constructor(message: string, details?: T) {
        super(409, {error_body_message: message, details});
    }
}
