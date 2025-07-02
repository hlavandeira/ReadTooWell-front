import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Goal from './Goal';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

jest.mock('../apiUrl', () => ({
    __esModule: true,
    default: 'http://localhost:8080'
}));

const mockToken = 'fake-token';
const mockUpdateAuth = jest.fn();

describe('Objetivos de lectura', () => {
    const mockGoal = {
        id: 1,
        type: 'Libros',
        duration: 'Mensual',
        amount: 5,
        currentAmount: 2,
        dateStart: '2025-01-01',
        dateFinish: '2025-01-31',
        remainingDays: 15,
        completed: false
    };

    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/objetivos/en-curso')) {
                return Promise.resolve({
                    data: [mockGoal]
                });
            }
            if (url.includes('/objetivos/terminados')) {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error(`Unmocked URL: ${url}`));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('muestra correctamente los objetivos en curso', async () => {
        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <Goal />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Objetivo mensual de enero: 2 libros de 5/i)).toBeInTheDocument();
            expect(screen.getByText(/40\.0%/i)).toBeInTheDocument();
            expect(screen.getByText(/1 de enero de 2025 - 31 de enero de 2025/i)).toBeInTheDocument();
            expect(screen.getByText(/Tiempo restante: 15 días/i)).toBeInTheDocument();
        });
    });

    it('permite crear un nuevo objetivo', async () => {
        const newGoal = {
            id: 2,
            type: 'Libros',
            duration: 'Anual',
            amount: 40,
            currentAmount: 0,
            dateStart: '2025-01-01',
            dateFinish: '2025-12-31',
            remainingDays: 334,
            completed: false
        };

        axios.post.mockResolvedValueOnce({
            data: newGoal
        });

        axios.get.mockImplementation((url) => {
            if (url.includes('/objetivos/en-curso')) {
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            type: 'Libros',
                            duration: 'Mensual',
                            amount: 5,
                            currentAmount: 2,
                            dateStart: '2025-01-01',
                            dateFinish: '2025-01-31',
                            remainingDays: 15,
                            completed: false
                        }
                    ]
                });
            }
            if (url.includes('/objetivos/terminados')) {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error(`Unmocked URL: ${url}`));
        });

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <Goal />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /comenzar nuevo objetivo/i }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Nuevo objetivo de lectura')).toBeInTheDocument();
        });

        const bookRadio = screen.getByLabelText('Número de libros');
        expect(bookRadio).toBeChecked();

        const monthlyRadio = screen.getByLabelText('Objetivo mensual');
        expect(monthlyRadio).toBeChecked();

        fireEvent.click(screen.getByLabelText('Objetivo anual'));
        expect(screen.getByLabelText('Objetivo anual')).toBeChecked();

        const amountInput = screen.getByLabelText('Libros a leer');
        fireEvent.change(amountInput, { target: { value: '40' } });

        fireEvent.click(screen.getByRole('button', { name: /crear objetivo/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/objetivos',
                {
                    type: 'Libros',
                    duration: 'Anual',
                    amount: 40
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
            expect(screen.getByText(/Objetivo anual de 2025: 0 libros de 40/i)).toBeInTheDocument();
            expect(screen.getByText('0.0%')).toBeInTheDocument();
            expect(screen.getByText(/1 de enero de 2025 - 31 de diciembre de 2025/i)).toBeInTheDocument();
            expect(screen.getByText(/Tiempo restante: 334 días/i)).toBeInTheDocument();
        });
    });

    it('permite eliminar un objetivo existente', async () => {
        axios.delete.mockResolvedValueOnce({});

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <Goal />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Objetivo mensual de enero/i)).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByRole('button', { name: /Borrar objetivo/i });
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                'http://localhost:8080/objetivos/1',
                {
                    headers: {
                        Authorization: `Bearer ${mockToken}`
                    }
                }
            );
        });
    });
});