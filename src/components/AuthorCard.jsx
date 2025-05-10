import {Avatar, Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const AuthorCard = ({user}) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                cursor: 'pointer',
                textAlign: 'center',
                p: 2,
                '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.3s ease'
                }
            }}
            onClick={() => navigate(`/perfil/${user.id}`)}
        >
            <Avatar
                src={user.profilePic || "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1741801696/readtoowell/profilepics/pfp.jpg"}
                alt={user.profileName}
                sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '3px solid #8B0000'
                }}
            />
            <Typography variant="h6" sx={{fontWeight: 'bold', mb: 0.5}}>
                {user.profileName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                @{user.username}
            </Typography>
        </Box>
    );
};

export default AuthorCard;