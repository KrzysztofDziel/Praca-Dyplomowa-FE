export class User {
    username: string;
    email: string;
    bio: string;

    constructor(username: string, email: string) {
        this.username = username;
        this.email = email;
    }
}