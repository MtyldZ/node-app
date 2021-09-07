import {newSchema} from './schema';
import {model} from 'mongoose';
import {UserEntity, UserModel} from './entity/user';

const userSchema = newSchema<UserEntity>({
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    age: {type: Number, required: true},
    role: {type: String},
    is_deleted: {type: Boolean},
});

userSchema.static('findByEmail', function (email: string) {
    return this.find({email, is_deleted: false});
});

export const User = model<UserEntity, UserModel>('users', userSchema);
