import {Box, Typography, Avatar, Rating} from '@mui/material';

const SmallShelvedBookCard = ({book}) => {

    const readingStatusMap = {
        0: 'Pendiente',
        1: 'Leyendo',
        2: 'Leído',
        3: 'Pausado',
        4: 'Abandonado'
    };

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            alignItems: 'center'
        }}>
            {/* Portada */}
            <Avatar
                src={book.book.cover}
                alt={book.book.title}
                variant="square"
                sx={{
                    width: 60,
                    height: 90,
                    borderRadius: '4px'
                }}
            />

            {/* Datos del libro */}
            <Box sx={{flex: 1}}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {book.book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {book.book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {book.book.publicationYear}
                </Typography>
            </Box>

            {/* Puntuación y estado de lectura del usuario */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                minWidth: '100px'
            }}>
                <Rating
                    value={book.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                />
                <Typography
                    variant="caption"
                    color={
                        book.readingStatus === 1 ? '#4C88A8' :
                            book.readingStatus === 2 ? '#1C945C' :
                                book.readingStatus === 3 ? '#DEA807' :
                                    book.readingStatus === 4 ? '#CC4D3D' :
                                        '#6c757d'
                    }
                    sx={{mt: 0.5}}
                >
                    {readingStatusMap[book.readingStatus]}
                </Typography>
            </Box>
        </Box>
    );
};

export default SmallShelvedBookCard;