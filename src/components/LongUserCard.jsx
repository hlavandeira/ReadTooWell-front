import {
    Paper,
    Avatar,
    Typography,
    Box,
    Tooltip,
    Stack,
    Divider,
    CircularProgress
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import {Link} from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import API_URL from '../apiUrl';

const LongUserCard = ({user}) => {
    const [counts, setCounts] = useState({
        followers: 0,
        following: 0,
        loading: true
    });
    const {token} = useAuth();

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [followersRes, followingRes] = await Promise.all([
                    axios.get(`${API_URL}/usuarios/${user.id}/seguidores`, {
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/usuarios/${user.id}/seguidos`, {
                        headers: {Authorization: `Bearer ${token}`}
                    })
                ]);

                setCounts({
                    followers: followersRes.data.length,
                    following: followingRes.data.length,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching user counts:', error);
                setCounts(prev => ({...prev, loading: false}));
            }
        };

        fetchCounts();
    }, [user.id, token]);

    return (
        <Paper
            elevation={3}
            component={Link}
            to={`/perfil/${user.id}`}
            sx={{
                p: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                width: '100%',
                minWidth: '400px',
                maxWidth: '600px',
                height: '120px',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                },
                transition: 'all 0.3s ease'
            }}
        >
            <Avatar
                src={user.profilePic || "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1741801696/readtoowell/profilepics/pfp.jpg"}
                sx={{width: 80, height: 80}}
            />

            <Box sx={{
                flexGrow: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {user.profileName}
                    </Typography>
                    {user.role === 1 && (
                        <Tooltip title="Autor verificado" arrow>
                            <VerifiedIcon fontSize="small" sx={{color: '#8B0000'}}/>
                        </Tooltip>
                    )}
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    @{user.username}
                </Typography>

                {user.biography && (
                    <Typography variant="body2" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {user.biography}
                    </Typography>
                )}
            </Box>

            <Divider orientation="vertical" flexItem sx={{mx: 2}}/>

            <Stack direction="column" spacing={1} sx={{minWidth: '120px'}}>
                {counts.loading ? (
                    <CircularProgress size={20}/>
                ) : (
                    <>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <PersonAddIcon fontSize="small" color="action"/>
                            <Typography variant="body2">
                                <strong>{counts.following}</strong> seguidos
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <PeopleIcon fontSize="small" color="action"/>
                            <Typography variant="body2">
                                <strong>{counts.followers}</strong> seguidores
                            </Typography>
                        </Box>
                    </>
                )}
            </Stack>
        </Paper>
    );
};

export default LongUserCard;