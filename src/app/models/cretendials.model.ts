export class Credentials {
    customer!: string;
    user!: string;
    password!: string;
    constructor(customer: string, user: string, password: string) {
        this.customer = customer;
        this.user = user;
        this.password = password;
    }
}