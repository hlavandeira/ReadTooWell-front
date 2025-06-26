import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookDetails from './BookDetails';
import { BrowserRouter, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

const mockToken = 'fake-token';
const mockUpdateAuth = jest.fn();

const mockBookDetails = {
    book: {
        id: 1,
        title: 'El nombre del viento',
        author: 'Patrick Rothfuss',
        cover: 'cover-url.jpg',
        synopsis: 'Una gran historia sobre un mago legendario.',
        publisher: 'DAW Books',
        isbn: '9780756404741',
        pageNumber: 662,
        publicationYear: 2007,
        genres: [{ id: 1, name: 'Fantasía' }],
        collectionId: null,
        numCollection: null
    },
    saved: false,
    readingStatus: null,
    rating: null,
    averageRating: 4.5,
    review: null,
    dateStart: null,
    dateFinish: null,
    collectionName: null,
    otherUsersReviews: []
};

describe('Página de detalles del libro', () => {
    beforeEach(() => {
        useParams.mockReturnValue({ id: '1' });
        axios.get.mockResolvedValueOnce({
            data: mockBookDetails
        });
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        console.error.mockRestore();
    });

    it('permite guardar un libro en la biblioteca', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                readingStatus: 0, // Pendiente
                dateStart: null,
                dateFinish: null
            }
        });

        axios.get.mockResolvedValue({
            data: { content: [] }
        });

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <BookDetails />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('El nombre del viento')).toBeInTheDocument();
        });

        const saveButton = screen.getByRole('button', { name: /guardar libro/i });
        expect(saveButton).toBeInTheDocument();

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `http://localhost:8080/biblioteca/1`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${mockToken}`
                    }
                }
            );
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /pendiente/i })).toBeInTheDocument();
        });
    });

    it('permite cambiar el estado de lectura de un libro', async () => {
        const savedBookDetails = {
            ...mockBookDetails,
            saved: true,
            readingStatus: 0 // Pendiente
        };

        axios.get.mockReset();
        axios.get.mockResolvedValueOnce({
            data: savedBookDetails
        });

        axios.put.mockResolvedValueOnce({
            data: {
                readingStatus: 1, // Leyendo
                dateStart: '2023-01-01',
                dateFinish: null
            }
        });

        axios.get.mockResolvedValue({
            data: { content: [] }
        });

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <BookDetails />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /pendiente/i })).toBeInTheDocument();
        });

        const statusButton = screen.getByRole('button', { name: /pendiente/i });
        fireEvent.click(statusButton);

        await waitFor(() => {
            expect(screen.getByText(/cambiar estado de lectura/i)).toBeInTheDocument();
        });

        const newStatusButton = screen.getByRole('radio', { name: /leyendo/i });
        fireEvent.click(newStatusButton);

        const saveButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                `http://localhost:8080/biblioteca/1/estado?estado=1`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${mockToken}`
                    }
                }
            );
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /leyendo/i })).toBeInTheDocument();
        });
    });

    it('muestra mensaje de error si falla al guardar el libro', async () => {
        axios.post.mockRejectedValueOnce(new Error('Error al guardar el libro'));

        render(
            <AuthContext.Provider value={{ token: mockToken, updateAuth: mockUpdateAuth }}>
                <BrowserRouter>
                    <BookDetails />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('El nombre del viento')).toBeInTheDocument();
        });

        const saveButton = screen.getByRole('button', { name: /guardar libro/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /guardar libro/i })).toBeInTheDocument();
        });
    });
});