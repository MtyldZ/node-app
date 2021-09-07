import {ControllerBase} from '../../controller';
import {Request} from 'express';
import {validationMiddleware} from '../../middleware/validate-model';
import {body} from 'express-validator';
import {SessionCreateModel, UserSessionModel} from './model';
import {User} from '../../db/user';
import {UnauthorizedError} from '../../errors/unauthorized.error';
import {compare} from 'bcrypt';
import {sign} from '../../utils/jwt';

export class SessionController extends ControllerBase {
    protected initialize(): void {
        this.post('/', this.login, validationMiddleware(
            body('email').isString().isLength({min: 3}),
            body('password').isString().isLength({min: 3}),
        ));
    }

    private login = async (request: Request<any, any, SessionCreateModel>) => {
        const {body} = request;
        const {email, password} = body;

        const userListWithSameEmail = await User.findByEmail(email);
        if (userListWithSameEmail.length === 0) {
            throw new UnauthorizedError('Email or password incorrect');
        }

        const foundUser = userListWithSameEmail[0];
        if (!await compare(password, foundUser.password)) {
            throw new UnauthorizedError('Username or password incorrect');
        }

        return {
            token: sign<UserSessionModel>({
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
            }, foundUser.role),
        };
    };

}
