import {useEffect, useState} from "react";
import axios from "axios";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useSearchParams} from 'react-router-dom';
import BookGrid from '../components/BookGrid.jsx';

const Catalog = () => {
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 30;

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
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

        fetchLibros();
    }, [page]);

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
        <BookGrid
            titulo="Catálogo de libros"
            libros={libros}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
};

export default Catalog;
