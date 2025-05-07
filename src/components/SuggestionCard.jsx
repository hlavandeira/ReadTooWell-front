import {Avatar, Box, Button, Card, CardContent, Typography, Grid} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const SuggestionCard = ({suggestion, activeTab, onStatusChange}) => {
    const handleAccept = () => {
        onStatusChange(suggestion.id, 1);
    };

    const handleReject = () => {
        onStatusChange(suggestion.id, 2);
    };

    return (
        <Card sx={{
            mb: 3,
            boxShadow: 3
        }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid>
                        <Box display="flex" flexDirection="column">
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar
                                    src={suggestion.user.profilePic}
                                    alt={suggestion.user.username}
                                    sx={{width: 56, height: 56, mr: 2}}
                                />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        @{suggestion.user.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {suggestion.user.email}
                                    </Typography>
                                </Box>
                            </Box>

                            {activeTab === 0 && (
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<CheckCircleIcon/>}
                                        onClick={handleAccept}
                                        fullWidth
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#008C2F',
                                            '&:hover': {backgroundColor: '#28A33D'}
                                        }}
                                    >
                                        Aceptar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<CancelIcon/>}
                                        onClick={handleReject}
                                        fullWidth
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#8B0000',
                                            '&:hover': {backgroundColor: '#A32828'},
                                            mt: 1
                                        }}
                                    >
                                        Rechazar
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    <Grid sx={{pl: 3}}>
                        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                            <Box>
                                <Typography variant="h6" sx={{mb: 1}}>
                                    <strong>Título:</strong> {suggestion.title}
                                </Typography>
                                <Typography variant="body1" sx={{mb: 1}}>
                                    <strong>Autor:</strong> {suggestion.author}
                                </Typography>
                                <Typography variant="body1" sx={{mb: 1}}>
                                    <strong>Año de publicación:</strong> {suggestion.publicationYear}
                                </Typography>
                            </Box>

                            <Typography variant="caption" color="text.secondary" sx={{mt: 2, display: 'block'}}>
                                Fecha de envío: {new Date(suggestion.dateSent).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default SuggestionCard;