import {HttpError} from './http-error';

export class UnprocessableEntity<T> extends HttpError<{ error_body_message: string, details: T }> {
    constructor(message: string, details?: T) {
        super(422, {error_body_message: message, details});
    }
}
