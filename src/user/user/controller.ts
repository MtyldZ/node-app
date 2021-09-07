import {Request, Response} from 'express';
import {body, param} from 'express-validator';
import {compare, hashSync} from "bcrypt";
import {ControllerBase} from "../../controller";
import {authenticationMiddleware} from "../../middleware/authentication";
import {validationMiddleware} from "../../middleware/validate-model";
import {UserChangePasswordModel, UserModel, UserRegisterModel} from "./model";
import {User} from "../../db/user";
import {ConflictError} from "../../errors/conflict";
import {sign} from "../../utils/jwt";
import {UserSessionModel} from "../../@types/authentication";
import {InternalServerError} from "../../errors/internal-server.error";
import {filter, filterMiddleware, sort} from "../../middleware/filter";
import {UserEntity} from "../../db/entity/user";
import {NotFoundError} from "../../errors/not-found.error";
import {passwordChecker} from "../../utils/password-checker";
import {UnprocessableEntity} from "../../errors/unprocessable-entity";

export class UserController extends ControllerBase {
    protected initialize(): void {
        this.post('/', this.register, validationMiddleware(
            body('email').isEmail().isLength({min: 3}),
            body('password').isString().isLength({min: 3}),
            body('name').isString().isLength({min: 3}),
        ));
        this.get('/', this.getList, filterMiddleware(
            filter('email'),
            sort('email'),
            filter('name'),
            sort('name'),
            filter('age'),
            sort('age'),
            filter('created_at_time', {compareAs: 'gte', isDate: true}),
            filter('created_at_time', {compareAs: 'lte', isDate: true}),
        ), authenticationMiddleware('admin'));
        this.get('/:id', this.getById, validationMiddleware(
            param('id').isMongoId(),
        ), authenticationMiddleware('admin'));
        this.put('/password', this.changePassword, validationMiddleware(
            body('passwordOld').isString(),
            body('password').isString(),
            body('passwordConfirm').isString(),
        ), authenticationMiddleware('user'));
    }

    private register = async (request: Request<any, any, UserRegisterModel>) => {
        const {email, password, name} = request.body;

        const userListWithSameEmail = await User.findByEmail(email);
        if (userListWithSameEmail.length !== 0) {
            throw new ConflictError('Email already in use.');
        }

        if (!passwordChecker(password)) {
            throw new UnprocessableEntity('Password must include at least one character and a digit.');
        }

        const hashedPassword = hashSync(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            is_deleted: false,
            role: 'user',
        });

        return await newUser.save()
            .then(() => {
                return {
                    token: sign<UserSessionModel>({
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                    }, 'user'),
                };
            })
            .catch(() => {
                throw new InternalServerError('Server error.');
            });
    }

    private getList = async (request: Request, response: Response) => {
        const users = await User.findByFilter(request.filter);
        const userCount = await User.countDocuments(request.filter.search);

        response.set('x-total-count', userCount.toString());
        return users.map(user => this.toModel(user));
    };

    private getById = async (request: Request<{ id: string }, any, any>) => {
        const {id} = request.params;

        const user: UserEntity = await User.findById(id);
        if (!user) {
            throw new NotFoundError(`User not found with id ${id}`);
        }

        return this.toModel(user);
    };

    private changePassword = async (request: Request<any, any, UserChangePasswordModel>) => {
        const {passwordOld, password, passwordConfirm} = request.body;
        const {id} = request.authentication.user;

        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError(`User not found with id ${id}`);
        }

        if (!await compare(passwordOld, user.password)) {
            throw new UnprocessableEntity('Old password is wrong.');
        }

        if (password.length < 8) {
            throw new UnprocessableEntity('Password must be longer than 8 characters');
        }

        if (!passwordChecker(password)) {
            throw new UnprocessableEntity('Password must include at least one character and a digit.');
        }

        if (password !== passwordConfirm) {
            throw new UnprocessableEntity('Password and PasswordConfirm are different');
        }


        user.password = hashSync(password, 10);

        return await user.save()
            .then(() => {
                return {
                    token: sign<UserSessionModel>({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }, user.role),
                };
            })
            .catch(() => {
                throw new InternalServerError('Server error.');
            });
    }

    private toModel = (e: UserEntity): UserModel => {
        return {
            id: e.id,
            name: e.name,
            email: e.email,
            age: e.age,
            createdAt: e.created_at_time,
            updatedAt: e.updated_at_time,
        };
    };
}
