import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import axios from "axios";
import {Box, Button, CircularProgress, Typography, Paper} from "@mui/material";
import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import BookGrid from '../../components/books/BookGrid.jsx';

const Catalog = () => {
    const {token, role} = useAuth();
    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 30;

    const [isAdmin, setIsAdmin] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    const fetchLibros = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/libros", {
                params: {
                    page: page - 1,
                    size: itemsPerPage
                }
            });
            setLibros(response.data.content);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error cargando los libros:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLibros();
    }, [page]);

    useEffect(() => {
        if (!token) {
            return;
        }
        const verifyAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:8080/usuarios/verificar-admin', {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setIsAdmin(response.data);
            } catch (error) {
                console.error('Error verificando rol:', error);
                setIsAdmin(false);
            }
        };

        verifyAdmin();
    }, [token]);

    const handlePageChange = (event, newPage) => {
        setSearchParams({page: newPage});
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    if (!libros.length) {
        return (
            <Typography variant="h6" align="center" mt={4}>
                No se encontraron libros
            </Typography>
        );
    }

    return (
        <>
            <BookGrid
                titulo="Catálogo de libros"
                libros={libros}
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isAdmin={isAdmin}
                onBookDelete={(deletedBookId) => {
                    setLibros(libros.filter(book => book.id !== deletedBookId));
                    fetchLibros();
                }}
            />

            {/* Botón para ver libros desactivados (solo admin) */}
            {isAdmin && (
                <Box sx={{display: 'flex', justifyContent: 'center', mb: 4}}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/libros/eliminados")}
                        sx={{
                            height: '36px',
                            textTransform: 'none',
                            color: 'white',
                            backgroundColor: '#432818',
                            '&:hover': {
                                backgroundColor: '#5a3a23'
                            }
                        }}
                    >
                        Ver libros desactivados
                    </Button>
                </Box>
            )}

            {/* Sección para enviar sugerencias (solos usuarios y autores) */}
            {(role === 0 || role === 1) && (
                <Paper elevation={3} sx={{
                    p: 3,
                    mt: 4,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                }}>
                    <Typography variant="h5" sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#432818',
                        textAlign: 'center'
                    }}>
                        ¿Crees que falta algún libro?
                    </Typography>
                    <Typography variant="body1" sx={{
                        mb: 3,
                        textAlign: 'center',
                        color: 'text.secondary'
                    }}>
                        ¡Ayúdanos a mejorar nuestro catálogo! Puedes sugerir libros que te gustaría ver en nuestra
                        plataforma.
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/libros/sugerencia")}
                            sx={{
                                py: 1,
                                px: 3,
                                textTransform: 'none',
                                backgroundColor: '#432818',
                                '&:hover': {
                                    backgroundColor: '#5a3a23'
                                },
                                borderRadius: 2
                            }}
                        >
                            Sugerir un libro
                        </Button>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default Catalog;