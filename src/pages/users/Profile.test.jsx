import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { BrowserRouter, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../../apiUrl', () => ({
    __esModule: true,
    default: 'http://localhost:8080'
}));

const mockToken = 'fake-token';
const mockUpdateAuth = jest.fn();
const mockUpdateProfileImage = jest.fn();

const mockProfile = {
    id: 1,
    username: 'usuario1',
    profileName: 'Usuario Prueba',
    biography: 'Biografía original',
    profilePic: 'https://foto-original.jpg',
    role: 0
};

describe('Perfil de usuario', () => {
    beforeEach(() => {
        useParams.mockReturnValue({ id: '1' });
        localStorage.setItem('token', mockToken);

        axios.get.mockImplementation((url) => {
            if (url.includes('/usuarios/1') && !url.includes('seguidores')
                && !url.includes('seguidos') && !url.includes('favoritos')) {

                return Promise.resolve({ data: mockProfile });
            }
            if (url.includes('/seguidores') || url.includes('/seguidos') || url.includes('/favoritos')) {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error(`Unmocked URL: ${url}`));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    it('permite editar y guardar los cambios del perfil correctamente', async () => {
        axios.put.mockResolvedValueOnce({
            data: {
                ...mockProfile,
                profileName: 'Usuario Modificado',
                biography: 'Nueva biografía\\ncon saltos de página'
            }
        });

        render(
            <AuthContext.Provider value={{
                token: mockToken,
                updateAuth: mockUpdateAuth,
                updateProfileImage: mockUpdateProfileImage,
                id: '1'
            }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Usuario Prueba')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /editar perfil/i }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Usuario Prueba')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Biografía original')).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText(/Nombre de perfil/i);
        fireEvent.change(nameInput, { target: { value: 'Usuario Modificado' } });

        const bioInput = screen.getByLabelText('Biografía');
        fireEvent.change(bioInput, { target: { value: 'Nueva biografía\ncon saltos' } });

        fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:8080/usuarios/perfil',
                {
                    profileName: 'Usuario Modificado',
                    biography: 'Nueva biografía\\ncon saltos',
                    profilePic: "https://foto-original.jpg"
                },
                {
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Usuario Modificado')).toBeInTheDocument();
            expect(screen.getByText('Nueva biografía con saltos')).toBeInTheDocument();
        });
    });

    it('muestra errores de validación', async () => {
        render(
            <AuthContext.Provider value={{
                token: mockToken,
                updateAuth: mockUpdateAuth,
                id: '1'
            }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /editar perfil/i }));
        });

        const bioInput = screen.getByLabelText('Biografía');
        fireEvent.change(bioInput, {
            target: { value: 'a'.repeat(2001) }
        });

        const nameInput = screen.getByLabelText(/Nombre de perfil/i);
        fireEvent.change(nameInput, { target: { value: '' } });

        await waitFor(() => {
            expect(screen.getByText('El nombre no puede estar vacío')).toBeInTheDocument();
            expect(screen.getByText('La biografía no puede exceder 2000 caracteres')).toBeInTheDocument();
        });
    });
});