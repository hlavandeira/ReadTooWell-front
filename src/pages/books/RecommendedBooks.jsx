import {useLocation} from 'react-router-dom';
import {Box, Typography, Grid} from '@mui/material';
import BookCardRating from '../../components/books/BookCardRating';

const RecommendedBooks = () => {
    const location = useLocation();
    const {books, title} = location.state || {books: [], title: ''};

    return (
        <Box sx={{maxWidth: 1200, mx: 'auto', p: 3}}>
            <Typography variant="h3" component="h1" sx={{mb: 4, fontWeight: 'bold', textAlign: 'center', color: '#432818'}}>
                {title}
            </Typography>

            {books.length > 0 ? (
                <Grid container spacing={3} justifyContent="center">
                    {books.map((book) => (
                        <Grid key={book.book.id} sx={{maxWidth: "100%", justifyContent: "center"}}>
                            <BookCardRating libro={book}/>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    No hay libros recomendados disponibles
                </Typography>
            )}
        </Box>
    );
};

export default RecommendedBooks;