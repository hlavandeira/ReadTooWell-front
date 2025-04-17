import {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {
    Box,
    Typography,
    Avatar,
    Paper,
    Chip,
    LinearProgress,
    CircularProgress,
    Grid
} from '@mui/material';
import RatedBookCard from '../components/RatedBookCard.jsx';
import GenreButton from "../components/GenreButton.jsx";

const YearRecap = () => {
    const {name, profilePic, id} = useAuth();
    const [loading, setLoading] = useState(true);
    const [yearRecap, setYearRecap] = useState(null);
    const currentYear = new Date().getFullYear();

    const [userBio, setUserBio] = useState('');

    useEffect(() => {
        const fetchYearRecap = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/biblioteca/resumen-anual', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setYearRecap(response.data);

                const responseUser = await axios.get(`http://localhost:8080/usuarios/${id}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setUserBio(responseUser.data.biography);
            } catch (error) {
                console.error('Error fetching year recap:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchYearRecap();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    if (!yearRecap) {
        return <Typography>No se pudo cargar el resumen anual</Typography>;
    }

    return (
        <Box sx={{maxWidth: 1200, mx: 'auto', p: 3}}>
            {/* Encabezado */}
            <Box sx={{textAlign: 'center', mb: 4}}>
                <Typography variant="h3" component="h1" sx={{fontWeight: 'bold', color: '#432818'}}>
                    Resumen de {currentYear}
                </Typography>
                <Typography variant="h5" component="h2" color="text.secondary" sx={{fontWeight: 'bold'}}>
                    ¡Todo lo que has leído este año!
                </Typography>
                <Box justifyContent='center' sx={{display: 'flex', alignItems: 'center', gap: 3, mt: 2}}>
                    <Avatar
                        src={profilePic ? profilePic : "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1741801696/readtoowell/profilepics/pfp.jpg"}
                        alt="Foto de perfil"
                        sx={{width: 150, height: 150, border: '3px solid #8B0000'}}
                    />
                    <Box sx={{maxWidth: 400}}>
                        <Typography variant="h4" component="h2" sx={{fontWeight: 'bold'}}>
                            {name}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.4,
                                fontSize: 13
                            }}
                        >
                            {userBio.replace(/\\n/g, ' ') || ''}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Estadísticas principales */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid container spacing={3} sx={{ mb: 4, maxWidth: '600px', justifyContent: 'center' }}>
                    <Grid item>
                        <Paper elevation={3} sx={{ p: 3, minWidth: 200, borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Libros leídos:
                            </Typography>
                            <Typography variant="h2" sx={{ color: '#8B0000', fontWeight: 'bold' }}>
                                {yearRecap.totalBooksRead}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper elevation={3} sx={{ p: 3, minWidth: 200, borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Páginas leídas:
                            </Typography>
                            <Typography variant="h2" sx={{ color: '#8B0000', fontWeight: 'bold' }}>
                                {yearRecap.totalPagesRead.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>


            {/* Objetivos anuales */}
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Paper elevation={3} sx={{p: 3, mb: 4, borderRadius: 2, width: '80%'}}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign: "center" }}>
                        Tus objetivos para este año
                    </Typography>

                    {yearRecap.annualGoals.map((goal) => (
                        <Box key={goal.id} sx={{mb: 3}}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                <Typography variant="h6">
                                    {goal.currentAmount.toLocaleString()} {goal.type.toLowerCase()} de {goal.amount.toLocaleString()} ({goal.percentage.toFixed(1)}%)
                                </Typography>
                                <Chip
                                    label={`${goal.remainingDays} días restantes`}
                                    size="small"
                                    sx={{backgroundColor: '#f0e6dd', color: '#432818'}}
                                />
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={goal.percentage}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#f0f0f0',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: goal.type === 'Libros' ? '#432818' : '#8B0000',
                                        borderRadius: 5
                                    }
                                }}
                            />
                        </Box>
                    ))}
                </Paper>
            </Box>

            {/* Géneros más leídos */}
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Paper elevation={3} sx={{p: 3, mb: 4, borderRadius: 2, width: '80%'}}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign: "center" }}>
                        Géneros que más has leído
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1}}>
                        {yearRecap.mostReadGenres?.length > 0 ? (
                            yearRecap.mostReadGenres.map((genre) => (
                                <GenreButton key={genre.id} genre={genre} />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No se especificaron géneros
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>

            {/* Libros mejor valorados */}
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, width: '80%' }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign: "center" }}>
                        Los libros que más te han gustado
                    </Typography>
                    <Grid
                        container
                        spacing={8}
                        sx={{
                            justifyContent: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        {yearRecap.topRatedBooks.map((book) => (
                            <Grid item key={book.id}>
                                <RatedBookCard libro={book} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
};

export default YearRecap;