import {
    Box,
    Typography,
    Button,
    Paper,
    Avatar,
    List,
    ListItem
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const RequestCard = ({request, activeTab, onStatusChange}) => {
    return (
        <Paper elevation={3} sx={{mb: 3, p: 2, display: 'flex'}}>
            <Box sx={{
                mr: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                minWidth: 150
            }}>
                <Avatar
                    src={request.user.profilePic || "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1741801696/readtoowell/profilepics/pfp.jpg"}
                    alt={`Foto de ${request.user.username}`}
                    sx={{
                        width: 100,
                        height: 100,
                        mb: 2,
                        border: '2px solid #432818'
                    }}
                />

                {activeTab === 0 && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon/>}
                            onClick={() => onStatusChange(request.id, 1)}
                            fullWidth
                            sx={{textTransform: 'none', backgroundColor: '#008C2F', '&:hover': {backgroundColor: '#28A33D'}}}
                        >
                            Aceptar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CancelIcon/>}
                            onClick={() => onStatusChange(request.id, 2)}
                            fullWidth
                            sx={{textTransform: 'none', backgroundColor: '#8B0000', '&:hover': {backgroundColor: '#A32828'}}}
                        >
                            Rechazar
                        </Button>
                    </>
                )}
            </Box>

            {/* Datos de la solicitud */}
            <Box sx={{flexGrow: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                    <Typography variant="h6" sx={{fontWeight: 'bold', mr: 2}}>
                        {request.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {request.user.email}
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{mt: 1, mb: 2}}>
                    {request.biography}
                </Typography>

                {request.books && request.books.length > 0 && (
                    <Box sx={{mt: 2}}>
                        <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>
                            Libros escritos:
                        </Typography>
                        <List dense>
                            {request.books.map((book) => (
                                <ListItem key={book.id} sx={{py: 0}}>
                                    <Typography variant="body2">
                                        {book.title} ({book.publicationYear})
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: 'block'}}>
                    Fecha de envío: {new Date(request.dateSent).toLocaleDateString()}
                </Typography>
            </Box>
        </Paper>
    );
};

export default RequestCard;