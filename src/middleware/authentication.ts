import {Request, Response, NextFunction} from 'express';
import {verify} from '../utils/jwt';

export function authenticationMiddleware(type: 'user' | 'admin', throwsError = true) {
    return (request: Request, response: Response, next: NextFunction) => {
        request.authentication = {};
        try {
            const token = request.headers.authorization.split(' ')[1];
            request.authentication[type] = verify(token, type);
        } catch (e) {
            if (throwsError) {
                response.status(401).send('Unauthorized');
                return;
            }
        }

        next();
    };
}
