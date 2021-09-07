export interface UserSessionModel {
    id: string;
    email: string;
    name: string;
}

export interface AdminSessionModel {
    id: string;
    username: string;
    status: string;
}

export interface AuthenticationModel {
    user?: UserSessionModel;
    admin?: AdminSessionModel;
    authorities?: string[];
}
