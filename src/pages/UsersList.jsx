import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    Paper
} from '@mui/material';
import LongUserCard from '../components/LongUserCard';
import {useAuth} from '../context/AuthContext';

const UsersList = ({type}) => {
    const {id} = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const {token} = useAuth();
    const [profileUser, setProfileUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/usuarios/${id}/${type}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const userRes = await axios.get(`http://localhost:8080/usuarios/${id}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setUsers(response.data);
                setProfileUser(userRes.data);
            } catch (error) {
                console.error(`Error fetching ${type}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [id, type, token]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 3}}>
            <Typography variant="h3" sx={{
                mb: 4,
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                {type === 'seguidores' ? 'Seguidores' : 'Seguidos'} de @{profileUser.username}
            </Typography>

            {users.length > 0 ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    alignItems: 'center'
                }}>
                    {users.map(user => (
                        <LongUserCard user={user}/>
                    ))}
                </Box>
            ) : (
                <Paper elevation={0} sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: 'background.paper'
                }}>
                    <Typography variant="h6" color="text.secondary">
                        No hay {type === 'seguidores' ? 'seguidores' : 'usuarios seguidos'}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default UsersList;