export type User = {
    name:string
    handle:string
    email:string
    password:string
    _id:string
    description: string
}

export type RegisterForm  = Pick<User, 'name' | 'handle' | 'email'> & {
    password: string;
    password_confirmation: string;
}

export type LoginForm = Pick<User, 'email'>&{
    password: string;
};

export type UserProfileForm = Pick<User, 'handle' | 'description'>