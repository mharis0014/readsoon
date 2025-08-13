import { useState } from 'react';

export interface LoginErrors {
    email?: string;
    password?: string;
}

export interface SignupErrors extends LoginErrors {
    username?: string;
    confirmPassword?: string;
}

/**
 * Hook for login form validation
 */
export function useLoginValidation() {
    const [errors, setErrors] = useState<LoginErrors>({});

    const validateLogin = (email: string, password: string) => {
        const ne: LoginErrors = {};
        if (!email) ne.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) ne.email = 'Email is invalid';
        if (!password) ne.password = 'Password is required';
        else if (password.length < 6) ne.password = 'Password must be at least 6 characters';
        setErrors(ne);
        return !Object.keys(ne).length;
    };

    const clearErrors = () => {
        setErrors({});
    };

    const clearFieldError = (field: keyof LoginErrors) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    return { errors, validateLogin, clearErrors, clearFieldError };
}

/**
 * Hook for signup form validation
 */
export function useSignupValidation() {
    const [errors, setErrors] = useState<SignupErrors>({});

    const validateSignup = (email: string, username: string, password: string, confirmPassword: string) => {
        const ne: SignupErrors = {};
        if (!email) ne.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) ne.email = 'Email is invalid';

        if (!username) ne.username = 'Username is required';
        else if (username.length < 3) ne.username = 'Username must be at least 3 characters';

        if (!password) ne.password = 'Password is required';
        else if (password.length < 6) ne.password = 'Password must be at least 6 characters';

        if (!confirmPassword) ne.confirmPassword = 'Please confirm your password';
        else if (password !== confirmPassword) ne.confirmPassword = 'Passwords do not match';

        setErrors(ne);
        return !Object.keys(ne).length;
    };

    const clearErrors = () => {
        setErrors({});
    };

    const clearFieldError = (field: keyof SignupErrors) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    return { errors, validateSignup, clearErrors, clearFieldError };
} 