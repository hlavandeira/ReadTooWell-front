import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Avatar,
    Divider,
    Paper,
    CircularProgress,
    Grid,
    Button
} from '@mui/material';
import {useAuth} from '../context/AuthContext.jsx';
import GenreButton from '../components/GenreButton';
import BookCard from '../components/books/BookCard.jsx';
import SmallBookCard from '../components/books/SmallBookCard.jsx';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import EditProfileDialog from '../components/dialogs/EditProfileDialog';
import FavoriteGenresDialog from '../components/dialogs/FavoriteGenresDialog';
import FavoriteBooksDialog from '../components/dialogs/FavoriteBooksDialog';

const Profile = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [favorites, setFavorites] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        profileName: '',
        biography: '',
        profilePic: ''
    });
    const {updateProfileImage, id: currentUserId} = useAuth();

    const [isFollowing, setIsFollowing] = useState(false);

    const [authorBooks, setAuthorBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(false);

    const [favoriteGenresDialogOpen, setFavoriteGenresDialogOpen] = useState(false);
    const [favoriteBooksDialogOpen, setFavoriteBooksDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');

                const [profileRes, followersRes, followingRes, favoritesRes] =
                    await Promise.all([
                        axios.get(`http://localhost:8080/usuarios/${id}`, {
                            headers: {Authorization: `Bearer ${token}`}
                        }),
                        axios.get(`http://localhost:8080/usuarios/${id}/seguidores`, {
                            headers: {Authorization: `Bearer ${token}`}
                        }),
                        axios.get(`http://localhost:8080/usuarios/${id}/seguidos`, {
                            headers: {Authorization: `Bearer ${token}`}
                        }),
                        axios.get(`http://localhost:8080/usuarios/${id}/favoritos`, {
                            headers: {Authorization: `Bearer ${token}`}
                        })
                    ]);

                if (profileRes.data.role === 2) { // Si el usuario es administrador, no dejar ver perfil
                    navigate('/');
                }

                if (currentUserId) {
                    const isUserFollowing = followersRes.data.some(follower => follower.id === parseInt(currentUserId));
                    setIsFollowing(isUserFollowing);
                }

                setProfile(profileRes.data);
                setFollowers(followersRes.data);
                setFollowing(followingRes.data);
                setFavorites(favoritesRes.data);

                setEditForm({
                    profileName: profileRes.data.profileName,
                    biography: profileRes.data.biography.replace(/\\n/g, ' ') || '',
                    profilePic: profileRes.data.profilePic || ''
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    const handleSaveChanges = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:8080/usuarios/perfil',
                {
                    ...updatedData,
                    biography: updatedData.biography.replace(/\n/g, '\\n')
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setProfile(prev => ({
                ...prev,
                ...response.data,
                biography: response.data.biography.replace(/\\n/g, '\n')
            }));
            setEditForm({
                profileName: response.data.profileName,
                biography: response.data.biography.replace(/\\n/g, ' '),
                profilePic: response.data.profilePic
            });

            if (response.data.profilePic) {
                updateProfileImage(response.data.profilePic);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleFollowToggle = async () => {
        try {
            if (!currentUserId) {
                navigate('/login');
                return;
            }
            const token = localStorage.getItem('token');

            if (isFollowing) {
                // Dejar de seguir
                await axios.delete(`http://localhost:8080/usuarios/dejar-seguir/${id}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setIsFollowing(false);
                setFollowers(prev => prev.filter(follower => follower.id !== parseInt(currentUserId)));
            } else {
                // Seguir
                await axios.post(`http://localhost:8080/usuarios/seguir/${id}`, {}, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setIsFollowing(true);
                setFollowers(prev => [...prev, {id: parseInt(currentUserId)}]);
            }
        } catch (error) {
            console.error('Error al seguir/dejar de seguir:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        const fetchAuthorBooks = async () => {
            if (profile?.role !== 1) {
                return;
            }

            const token = localStorage.getItem('token');

            try {
                setBooksLoading(true);
                const response = await axios.get('http://localhost:8080/libros/libros-autor', {
                    params: {
                        authorName: profile.profileName,
                        page: 0,
                        size: 5
                    },
                    headers: {Authorization: `Bearer ${token}`}
                });
                setAuthorBooks(response.data.content);
            } catch (error) {
                console.error('Error fetching author books:', error);
            } finally {
                setBooksLoading(false);
            }
        };

        if (profile?.role === 1) {
            fetchAuthorBooks();
        }
    }, [profile]);

    const handleFavoriteGenresDialogClose = (updated) => {
        setFavoriteGenresDialogOpen(false);
        if (updated) {
            const fetchFavorites = async () => {
                try {
                    const token = localStorage.getItem('token');

                    const favoritesRes = await axios.get(`http://localhost:8080/usuarios/${id}/favoritos`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });

                    setFavorites(favoritesRes.data);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            };

            fetchFavorites();
        }
    };

    const handleFavoriteBooksDialogClose = (updated) => {
        setFavoriteBooksDialogOpen(false);
        if (updated) {
            const fetchFavorites = async () => {
                try {
                    const token = localStorage.getItem('token');

                    const favoritesRes = await axios.get(`http://localhost:8080/usuarios/${id}/favoritos`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });

                    setFavorites(favoritesRes.data);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            };

            fetchFavorites();
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    if (!profile) {
        return <Typography>No se pudo cargar el perfil</Typography>;
    }

    return (
        <Box sx={{maxWidth: 1200, mx: 'auto', p: 3}}>
            {/* Datos del usuario */}
            <Box sx={{textAlign: 'center', mb: 4}}>
                <Avatar
                    src={profile.profilePic || "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1741801696/readtoowell/profilepics/pfp.jpg"}
                    alt="Foto de perfil"
                    sx={{
                        width: 200,
                        height: 200,
                        border: '3px solid #8B0000',
                        mx: 'auto',
                        mb: 2
                    }}
                />

                <Typography variant="h3" sx={{fontWeight: 'bold', mb: 0.5}}>
                    {profile.profileName}
                </Typography>

                <Typography variant="h5" color="text.secondary" sx={{mb: 3}}>
                    @{profile.username}
                </Typography>

                {/* Seguidos y seguidores */}
                <Box sx={{display: 'flex', justifyContent: 'center', gap: 4, mb: 0.5}}>
                    <Typography
                        variant="h6"
                        sx={{cursor: 'pointer', '&:hover': {textDecoration: 'underline'}}}
                        onClick={() => navigate(`/perfil/${id}/seguidos`)}
                    >
                        {following.length} seguidos
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{cursor: 'pointer', '&:hover': {textDecoration: 'underline'}}}
                        onClick={() => navigate(`/perfil/${id}/seguidores`)}
                    >
                        {followers.length} seguidores
                    </Typography>
                </Box>

                {/* Biografía */}
                {profile.biography && (
                    <Paper elevation={0} sx={{
                        p: 3,
                        backgroundColor: 'background.paper',
                        maxWidth: 800,
                        mx: 'auto',
                        mb: 0.5,
                        textAlign: 'center',
                        whiteSpace: 'pre-line'
                    }}>
                        <Typography variant="body1" sx={{lineHeight: 1.6}}>
                            {profile.biography?.replace(/\\n/g, '\n')}
                        </Typography>
                    </Paper>
                )}

                {/* Botón de edición o seguir/seguir */}
                {currentUserId && parseInt(currentUserId) === parseInt(id) ? (
                    <Button
                        variant="contained"
                        startIcon={<EditIcon/>}
                        onClick={handleEditClick}
                        sx={{
                            mt: 2,
                            backgroundColor: '#432818',
                            '&:hover': {backgroundColor: '#5a3a23'},
                            textTransform: 'none'
                        }}
                    >
                        Editar perfil
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        startIcon={isFollowing ? <PersonRemoveIcon/> : <PersonAddIcon/>}
                        onClick={handleFollowToggle}
                        sx={{
                            mt: 2,
                            backgroundColor: isFollowing ? '#8B0000' : '#432818',
                            '&:hover': {
                                backgroundColor: isFollowing ? '#6d0000' : '#5a3a23'
                            },
                            textTransform: 'none'
                        }}
                    >
                        {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                    </Button>
                )}
            </Box>

            {/* Diálogo de edición */}
            <EditProfileDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                profile={profile}
                onSave={handleSaveChanges}
            />

            {/* Si es autor, mostrar sus libros */}
            {profile?.role === 1 && (
                <Box sx={{mt: 6}}>
                    <Typography variant="h4" sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {parseInt(currentUserId) === parseInt(id)
                            ? 'Mis libros'
                            : `Libros escritos por ${profile.profileName}`}
                    </Typography>

                    {/* Algunos libros del autor */}
                    {booksLoading ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress sx={{color: '#8B0000'}}/>
                        </Box>
                    ) : authorBooks.length > 0 ? (
                        <Grid container spacing={3} justifyContent="center">
                            {authorBooks.map(book => (
                                <Grid item key={book.id}>
                                    <SmallBookCard libro={book}/>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper elevation={0} sx={{
                            p: 3,
                            textAlign: 'center',
                            backgroundColor: 'background.paper'
                        }}>
                            <Typography variant="body1" color="text.secondary">
                                {parseInt(currentUserId) === parseInt(id)
                                    ? 'Aún no has publicado ningún libro'
                                    : 'Este autor no ha publicado libros aún'}
                            </Typography>
                        </Paper>
                    )}

                    {/* Botón para ver todos los libros del autor */}
                    {authorBooks.length > 0 && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(`/autor`, {
                                    state: {
                                        authorName: profile.profileName
                                    }
                                })}
                                sx={{
                                    textTransform: 'none',
                                    color: '#432818',
                                    borderColor: '#432818',
                                    '&:hover': {
                                        backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                        borderColor: '#5a3a23'
                                    }
                                }}
                            >
                                Ver todos los libros
                            </Button>
                        </Box>
                    )}
                </Box>
            )}

            <Divider sx={{my: 4, borderColor: 'divider'}}/>

            {/* Géneros favoritos */}
            <Box sx={{mb: 6}}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                    <Typography variant="h4" sx={{mb: 3, fontWeight: 'bold', textAlign: 'center'}}>
                        Géneros favoritos
                    </Typography>
                </Box>

                {favorites?.favoriteGenres?.length > 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 1.5,
                        mb: 2
                    }}>
                        {favorites.favoriteGenres.map((genre) => (
                            <GenreButton key={genre.id} genre={genre}/>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                        No hay géneros favoritos
                    </Typography>
                )}

                {parseInt(currentUserId) === parseInt(id) && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        mt: 3
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => setFavoriteGenresDialogOpen(true)}
                            sx={{
                                height: '36px',
                                textTransform: 'none',
                                color: '#432818',
                                borderColor: '#432818',
                                '&:hover': {
                                    backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                    borderColor: '#5a3a23'
                                }
                            }}
                        >
                            Editar géneros
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Diálogo de géneros favoritos */}
            <FavoriteGenresDialog
                open={favoriteGenresDialogOpen}
                onClose={handleFavoriteGenresDialogClose}
                currentFavoriteGenres={favorites?.favoriteGenres || []}
            />

            <Divider sx={{my: 4, borderColor: 'divider'}}/>

            {/* Libros favoritos */}
            <Box>
                <Typography variant="h4" sx={{mb: 3, fontWeight: 'bold', textAlign: 'center'}}>
                    Libros favoritos
                </Typography>

                {favorites?.favoriteBooks?.length > 0 ? (
                    <Grid container spacing={3} justifyContent="center">
                        {favorites.favoriteBooks.map((book) => (
                            <Grid key={book.id}>
                                <BookCard libro={book}/>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                        No hay libros favoritos
                    </Typography>
                )}

                {parseInt(currentUserId) === parseInt(id) && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        mt: 3
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => setFavoriteBooksDialogOpen(true)}
                            sx={{
                                height: '36px',
                                textTransform: 'none',
                                color: '#432818',
                                borderColor: '#432818',
                                '&:hover': {
                                    backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                    borderColor: '#5a3a23'
                                }
                            }}
                        >
                            Editar libros
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Diálogo de libros favoritos */}
            <FavoriteBooksDialog
                open={favoriteBooksDialogOpen}
                onClose={handleFavoriteBooksDialogClose}
                currentFavoriteBooks={favorites?.favoriteBooks || []}
            />
        </Box>
    );
};

export default Profile;