
const API_URL = 'http://localhost:8080/api/auth';

export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
    token: string;
    refreshToken: string;
    username: string;
    role?: string;
}
export interface RegisterRequest {
    username: string;
    password: string;
    name: string;
    email: string;
}

export interface RegisterResponse {
    message: string;
}

export async function loginRequest(login : LoginRequest) : Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    });

    console.log("Login response:", response);

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
}

export async function register(register: RegisterRequest) : Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(register)
    }); 

    if (!response.ok) {
        const errorText = await response.json();
        throw new Error( errorText.error || 'Registration failed');
    }

    return {message: "You have successfully registered! Please log in to continue."};
}


