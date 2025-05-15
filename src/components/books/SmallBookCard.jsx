import React from 'react';
import {Card, CardMedia, CardContent, Typography, Box} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const SmallBookCard = ({libro}) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/detalles/${libro.id}`)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Box onClick={handleRedirect} sx={{cursor: 'pointer'}}>
            <Card
                sx={{
                    width: 160,
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
                        {libro.title}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SmallBookCard;