import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthPage from './AuthPage';
import { supabase } from '../supabaseClient'; // We will mock this

// Mock the supabase client
vi.mock('../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
        },
    },
}));

describe('AuthPage Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    it('renders email and password input fields and Login/Sign Up buttons', () => {
        render(<AuthPage />);

        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    it('allows typing into email and password fields', () => {
        render(<AuthPage />);

        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('calls supabase.auth.signInWithPassword when Login button is clicked', async () => {
        const mockEmail = 'test@example.com';
        const mockPassword = 'password123';
        supabase.auth.signInWithPassword.mockResolvedValue({ error: null }); // Simulate successful login

        render(<AuthPage />);

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: mockEmail } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: mockPassword } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: mockEmail,
                password: mockPassword,
            });
        });
    });

    it('calls supabase.auth.signUp when Sign Up button is clicked', async () => {
        const mockEmail = 'test@example.com';
        const mockPassword = 'password123';
        supabase.auth.signUp.mockResolvedValue({ error: null }); // Simulate successful sign up

        render(<AuthPage />);

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: mockEmail } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: mockPassword } });
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: mockEmail,
                password: mockPassword,
            });
        });
    });

    it('displays an error message if login fails', async () => {
        const errorMessage = 'Invalid login credentials';
        supabase.auth.signInWithPassword.mockResolvedValue({ error: { message: errorMessage } });

        render(<AuthPage />);

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('displays an error message if sign up fails', async () => {
        const errorMessage = 'User already registered';
        supabase.auth.signUp.mockResolvedValue({ error: { message: errorMessage } });

        render(<AuthPage />);

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
