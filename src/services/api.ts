import { User, LoginRequest, RegisterRequest, ApiResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    auth: {
        login: async (credentials: LoginRequest): Promise<ApiResponse<User>> => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                });
                const data = await response.json();
                return { data };
            } catch (error) {
                return { error: 'Failed to login' };
            }
        },

        register: async (userData: RegisterRequest): Promise<ApiResponse<User>> => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
                const data = await response.json();
                return { data };
            } catch (error) {
                return { error: 'Failed to register' };
            }
        },
    },
}; 