export interface AuthResponse {
    token: string;
    id: number;
    role: string;
}

export interface LoginRequest {
    email: string;
    password?: string;
}
