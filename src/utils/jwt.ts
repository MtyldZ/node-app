import jwt from 'jsonwebtoken';

export function sign<T extends object>(payload: T, signAs: 'user' | 'admin' = 'user', expiresIn = '2w') {
    return jwt.sign(payload, signAs === 'admin' ? process.env.JWT_ADMIN_SECRET : process.env.JWT_USER_SECRET, {expiresIn});
}

export function verify<T extends object>(token: string, verifyAs: 'user' | 'admin' = 'user') {
    return jwt.verify(token, verifyAs === 'admin' ? process.env.JWT_ADMIN_SECRET : process.env.JWT_USER_SECRET) as T;
}
