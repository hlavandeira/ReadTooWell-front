import {
    Paper,
    Avatar,
    Typography,
    Box,
    Tooltip
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import {Link} from 'react-router-dom';

const UserCard = ({user}) => {
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
                gap: 2,
                width: '350px',
                height: '100px',
                overflow: 'hidden',
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
                alt={`Foto de perfil de ${user.username}`}
                sx={{width: 60, height: 60}}
            />
            <Box sx={{
                width: 'calc(100% - 76px)',
                overflow: 'hidden'
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Typography variant="h6" sx={{
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
                <Typography variant="body2" color="text.secondary" sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    @{user.username}
                </Typography>
                {user.biography && (
                    <Typography variant="body2" sx={{
                        mt: 1,
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
        </Paper>
    );
};

export default UserCard;