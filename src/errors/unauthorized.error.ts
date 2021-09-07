import {HttpError} from './http-error';

export class UnauthorizedError<T> extends HttpError<{ error_body_message: string, details: T }> {
    constructor(message: string, details?: T) {
        super(401, {error_body_message: message, details});
    }
}
