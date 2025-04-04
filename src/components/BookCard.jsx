import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ libro }) => {
    const navigate = useNavigate();

    return (
        <Box onClick={() => navigate(`/detalles/${libro.id}`)} sx={{ cursor: 'pointer' }}>
            <Card
                sx={{
                    width: 200,
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
                    height: 300,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <CardMedia
                        component="img"
                        image={libro.cover}
                        alt={`Portada de ${libro.title}`}
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
                    p: 0.75
                }}>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{
                            textAlign: "center",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "3em",
                            lineHeight: "1.5em",
                            fontSize: "1.05rem"
                        }}
                    >
                        {libro.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            textAlign: "center",
                            mt: 0.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                        }}
                    >
                        {libro.author}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BookCard;