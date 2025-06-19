import {Card, CardMedia, CardContent, Typography, IconButton, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate} from 'react-router-dom';

const ListedBook = ({book, onDelete}) => {
    const navigate = useNavigate();

    return (
        <Card sx={{
            display: 'flex',
            height: 180,
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
            }
        }}>
            {/* Portada */}
            <Box sx={{width: 120, flexShrink: 0}}>
                <CardMedia
                    component="img"
                    height="100%"
                    image={book.book.cover}
                    alt={book.book.title}
                    onClick={() => navigate(`/detalles/${book.book.id}`)}
                    sx={{
                        objectFit: 'cover',
                        cursor: 'pointer',
                        '&:hover': {opacity: 0.9}
                    }}
                />
            </Box>

            {/* Detalles del libro */}
            <CardContent sx={{
                flexGrow: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    pr: 4
                }}>
                    {book.book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {book.book.author}
                </Typography>

                <Box sx={{display: 'flex', gap: 2, mt: 1, mb: 1}}>
                    <Typography variant="caption" color="text.secondary">
                        {book.book.publisher}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {book.book.publicationYear}
                    </Typography>
                </Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flexGrow: 1
                    }}
                >
                    {book.book.synopsis?.replace(/\\n/g, ' ') || 'Sin sinopsis disponible'}
                </Typography>
            </CardContent>

            {/* Botón de eliminar */}
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(book.book.id);
                }}
                aria-label="Borrar libro de lista"
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: '#8B0000',
                    '&:hover': {
                        backgroundColor: '#8B000010'
                    }
                }}
            >
                <DeleteIcon fontSize="small"/>
            </IconButton>
        </Card>
    );
};

export default ListedBook;