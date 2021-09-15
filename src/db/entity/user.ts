import {EntityBase} from './base';

interface UserFields extends EntityBase {
    email: string;
    password: string;
    name: string;
    age?: number;
}

interface UserMethods {
}

interface UserVirtualFields {
}

interface UserQueries {
}

interface UserStatics {
    findByEmail(email: string): QueryReturnType<UserEntity, UserQueries>;
}

export type UserEntity = Entity<UserFields, UserMethods, UserVirtualFields>;
export type UserModel = Model<UserEntity, UserStatics, UserQueries>;
