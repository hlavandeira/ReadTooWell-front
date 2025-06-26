import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('Página de inicio de sesión', () => {
    it('permite iniciar sesión con credenciales correctos', async () => {
        const mockToken = 'fake-token';
        const mockUser = {
            id: 1,
            profileName: 'Héctor',
            profilePic: 'fotoPerfil.jpg',
            role: 'USER'
        };

        axios.post.mockResolvedValueOnce({
            data: {
                token: mockToken,
                user: mockUser
            }
        });

        const mockUpdateAuth = jest.fn();

        render(
            <AuthContext.Provider value={{ updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'hector@readtoowell.com' }
        });

        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'Contraseña123_' }
        });

        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/auth/login',
                {
                    email: 'hector@readtoowell.com',
                    password: 'Contraseña123_'
                }
            );

            expect(mockUpdateAuth).toHaveBeenCalledWith(
                mockToken,
                'USER',
                'Héctor',
                'fotoPerfil.jpg',
                1
            );

            expect(mockedNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('muestra error si los datos son incorrectos', async () => {
        axios.post.mockRejectedValueOnce({
            response: {
                data: { error: 'Credenciales incorrectas' }
            }
        });

        render(
            <AuthContext.Provider value={{ updateAuth: jest.fn() }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'fallido@readtoowell.com' }
        });

        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'malacontraseña' }
        });

        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/credenciales incorrectas/i)
            ).toBeInTheDocument();
        });
    });
});
