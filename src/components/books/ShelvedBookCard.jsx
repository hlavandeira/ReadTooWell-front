import {Card, CardMedia, CardContent, Typography, Button, Box} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const ShelvedBookCard = ({book, onDelete, onFormatClick}) => {
    const navigate = useNavigate();

    return (
        <Card sx={{
            display: 'flex',
            height: 200,
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'hidden',
            '&:hover': {
                boxShadow: 6,
                transition: 'box-shadow 0.3s ease'
            }
        }}>
            {/* Portada */}
            <Box sx={{width: 140, flexShrink: 0}}>
                <CardMedia
                    component="img"
                    height="100%"
                    image={book.cover}
                    alt={book.title}
                    onClick={() => navigate(`/detalles/${book.id}`)}
                    sx={{
                        objectFit: 'cover',
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.9
                        }
                    }}
                />
            </Box>

            {/* Datos del libro */}
            <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                overflow: 'hidden'
            }}>
                {/* Título y autor */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 2,
                    mb: 0.5
                }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        noWrap
                        sx={{
                            fontWeight: 'bold',
                            flexShrink: 0,
                            maxWidth: '60%'
                        }}
                    >
                        {book.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            textAlign: 'left'
                        }}
                    >
                        {book.author}
                    </Typography>
                </Box>

                {/* Editorial y año */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 1.5
                }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            fontSize: 14
                        }}
                    >
                        {book.publisher || 'Editorial no especificada'}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            fontSize: 14
                        }}
                    >
                        {book.publicationYear || '--'}
                    </Typography>
                </Box>

                {/* Sinopsis */}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.4,
                        fontSize: 13
                    }}
                >
                    {book.synopsis.replace(/\\n/g, ' ') || 'Sinopsis no disponible'}
                </Typography>
            </CardContent>

            {/* Botones */}
            <Box sx={{
                width: 120,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                gap: 1
            }}>
                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation();
                        onFormatClick(book.id);
                    }}
                    sx={{
                        textTransform: 'none',
                        borderColor: '#432818',
                        backgroundColor: '#432818',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#432818e6',
                            borderColor: '#5a3a23'
                        }
                    }}
                >
                    Formatos
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    sx={{
                        textTransform: 'none',
                        borderColor: '#8B0000',
                        color: '#8B0000',
                        '&:hover': {
                            backgroundColor: '#8B000010',
                            borderColor: '#A52A2A'
                        }
                    }}
                >
                    Eliminar
                </Button>
            </Box>
        </Card>
    );
};

export default ShelvedBookCard;