import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Library from './Library';
import UpdateProgressDialog from '../components/dialogs/UpdateProgressDialog.jsx';
import { BrowserRouter, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useSearchParams: jest.fn(),
}));

const mockToken = 'fake-token';
const mockUpdateAuth = jest.fn();
const mockNavigate = jest.fn();

const mockCurrentlyReadingBook = {
    id: { bookId: 1 },
    book: {
        id: 1,
        title: 'El nombre del viento',
        author: 'Patrick Rothfuss',
        cover: 'cover-url.jpg',
        pageNumber: 400,
    },
    progress: 100,
    progressType: 'paginas',
    readingStatus: 1 // Leyendo
};

describe('Biblioteca personal', () => {
    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        useSearchParams.mockReturnValue([new URLSearchParams(), jest.fn()]);

        axios.get.mockImplementation((url) => {
            if (url === 'http://localhost:8080/biblioteca') {
                return Promise.resolve({
                    data: {
                        content: [mockCurrentlyReadingBook],
                        totalPages: 1
                    }
                });
            }
            if (url === 'http://localhost:8080/listas') {
                return Promise.resolve({
                    data: { content: [], totalPages: 1 }
                });
            }
            if (url === 'http://localhost:8080/libros/generos') {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error(`Unmocked URL: ${url}`));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    it('permite actualizar el progreso de un libro al 50%', async () => {
        axios.put.mockResolvedValueOnce({});

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <Library />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('El nombre del viento')).toBeInTheDocument();
        });

        const updateButtons = screen.getAllByRole('button', { name: /actualizar progreso/i });

        expect(updateButtons.length).toBeGreaterThan(0);
        expect(updateButtons[0]).toBeInTheDocument();
        expect(updateButtons[0]).toBeVisible();

        fireEvent.click(updateButtons[0]);

        await waitFor(() => {
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
            expect(within(dialog).getByText('Actualizar progreso')).toBeInTheDocument();
        });

        const progressInput = screen.getByLabelText(/páginas leídas|porcentaje completado/i);
        fireEvent.change(progressInput, { target: { value: '200' } });

        fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                `http://localhost:8080/biblioteca/1/progreso`,
                null,
                {
                    params: {
                        tipoProgreso: 'paginas',
                        progreso: 200
                    },
                    headers: {
                        Authorization: `Bearer ${mockToken}`
                    }
                }
            );
        });
    });

    it('mueve el libro a "leídos" cuando se completa al 100%', async () => {
        axios.put.mockResolvedValueOnce({});

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <Library />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/El nombre del viento/i)).toBeInTheDocument();
        });

        const updateButtons = screen.getAllByRole('button', { name: /actualizar progreso/i });
        fireEvent.click(updateButtons[0]);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const progressInput = screen.getByLabelText(/páginas leídas|porcentaje completado/i);
        fireEvent.change(progressInput, { target: { value: '400' } });

        axios.get.mockImplementation((url) => {
            if (url === 'http://localhost:8080/biblioteca') {
                return Promise.resolve({
                    data: {
                        content: [],
                        totalPages: 1
                    }
                });
            }
            return Promise.resolve({ data: [] });
        });

        fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

        await waitFor(() => {
            expect(screen.queryByText('El nombre del viento')).not.toBeInTheDocument();
        });

        expect(axios.put).toHaveBeenCalledWith(
            `http://localhost:8080/biblioteca/1/progreso`,
            null,
            {
                params: {
                    tipoProgreso: 'paginas',
                    progreso: 400
                },
                headers: {
                    Authorization: `Bearer ${mockToken}`
                }
            }
        );
    });
});

describe('Diálogo para actualizar el progreso', () => {
    it('permite cambiar entre porcentaje y páginas', async () => {
        const mockOnClose = jest.fn();
        const mockOnProgressUpdated = jest.fn();

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <UpdateProgressDialog
                    open={true}
                    onClose={mockOnClose}
                    book={mockCurrentlyReadingBook}
                    onProgressUpdated={mockOnProgressUpdated}
                />
            </AuthContext.Provider>
        );

        expect(screen.getByLabelText('Páginas')).toBeChecked();

        fireEvent.click(screen.getByLabelText('Porcentaje'));

        expect(screen.getByLabelText(/porcentaje completado/i)).toBeInTheDocument();
    });
});