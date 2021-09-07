import {HttpError} from './http-error';

export class ForbiddenError<T> extends HttpError<{ error_body_message: string, details: T }> {
    constructor(message: string, details?: T) {
        super(403, {error_body_message: message, details});
    }
}
