import {
    Container,
    Grid,
    Typography,
    Box,
    Pagination
} from "@mui/material";
import BookCard from "./books/BookCard.jsx";

const BookGrid = ({titulo, libros = [], page, totalPages, onPageChange}) => {
    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                    fontFamily: '"Domine", serif',
                    fontOpticalSizing: 'auto',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    letterSpacing: '1px',
                    color: '#432818'
                }}
            >
                {titulo}
            </Typography>

            <Box display="flex" justifyContent="center">
                <Grid
                    container
                    spacing={4}
                    sx={{
                        maxWidth: "100%",
                        justifyContent: "center"
                    }}
                >
                    {libros.map((libro) => (
                        <Grid key={libro.id}>
                            <BookCard libro={libro}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {totalPages > 1 && onPageChange && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={onPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                        sx={{'& .MuiPaginationItem-root': {fontSize: '1rem'}}}
                    />
                </Box>
            )}
        </Container>
    );
};

export default BookGrid;
