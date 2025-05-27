import React from 'react';
import {Card, CardMedia, CardContent, Typography, Box, Rating} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const SmallBookCardRating = ({libro}) => {
    const navigate = useNavigate();

    const handleRedirectToDetails = () => {
        navigate(`/detalles/${libro.book.id}`);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Box onClick={handleRedirectToDetails} sx={{cursor: 'pointer'}}>
            <Card
                sx={{
                    width: 180,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s",
                    "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                    },
                }}
            >
                <Box sx={{
                    width: "100%",
                    height: 250,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <CardMedia
                        component="img"
                        image={libro.book.cover}
                        alt={`Portada de ${libro.book.title}`}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        onError={(e) => {
                            e.target.src = "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743761214/readtoowell/covers/error_s7dry1.jpg";
                        }}
                    />
                </Box>

                <CardContent sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 1.5
                }}>
                    <Box>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                            sx={{
                                textAlign: "center",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                minHeight: "3em",
                                lineHeight: "1.5em",
                                fontSize: "0.9rem"
                            }}
                        >
                            {libro.book.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                textAlign: "center",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                mb: 1
                            }}
                        >
                            {libro.book.author}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Rating
                            value={libro.averageRating}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{mb: 0.5}}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {libro.averageRating?.toFixed(1) || 'Sin valoraciones'}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SmallBookCardRating;