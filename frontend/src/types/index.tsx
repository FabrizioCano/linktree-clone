export type User = {
    name:string
    handle:string
    email:string
    password:string
}

export type RegisterForm  = Pick<User, 'name' | 'handle' | 'email'> & {
    password: string;
    password_confirmation: string;
}

export type LoginForm = Pick<User, 'email'>&{
    password: string;
};