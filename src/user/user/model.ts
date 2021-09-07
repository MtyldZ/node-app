import {ModelBase} from '../model';

export interface UserRegisterModel {
    email: string;
    password: string;
    name: string;
    age: number;
}

export interface UserModel extends ModelBase {
    email: string;
    name: string;
    age: number;
}

export interface UserChangePasswordModel {
    passwordOld: string;
    password: string;
    passwordConfirm: string;
}
