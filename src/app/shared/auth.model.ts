export type JwtResponse = {
    sub: string;
    role: string;
    name: string;
    iat: string;
    exp: string;
};

export type LoginCredentials = { email: string, password: string };

export type RegisterBody = {
    name: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    email: string;
    id: number;
    name: string;
    role: string;
};
