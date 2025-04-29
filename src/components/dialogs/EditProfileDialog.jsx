import {useState, useRef, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Avatar,
    Box,
    Typography,
    Alert
} from '@mui/material';
import axios from 'axios';

const EditProfileDialog = ({open, onClose, profile, onSave}) => {
    const [editForm, setEditForm] = useState({
        profileName: profile.profileName,
        biography: profile.biography?.replace(/\\n/g, ' ') || '',
        profilePic: profile.profilePic || ''
    });
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({
        profileName: '',
        profilePic: '',
        biography: ''
    });
    const [submitError, setSubmitError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        validateForm();
    }, [editForm]);

    const validateForm = () => {
        const newErrors = {};

        if (!editForm.profileName.trim()) {
            newErrors.profileName = 'El nombre no puede estar vacío';
        }

        if (editForm.biography.length > 2000) {
            newErrors.biography = `La biografía no puede exceder 2000 caracteres`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // Tamaño máximo: 5MB

        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                profilePic: 'Solo se permiten imágenes JPEG, PNG o GIF'
            }));
            return;
        }

        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                profilePic: 'La imagen no puede ser mayor a 5MB'
            }));
            return;
        }

        setUploading(true);
        setErrors(prev => ({...prev, profilePic: ''}));
        setSubmitError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'readtoowell_preset');

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dfrgrfw4c/image/upload',
                formData
            );

            setEditForm(prev => ({
                ...prev,
                profilePic: response.data.secure_url
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            setErrors(prev => ({
                ...prev,
                profilePic: 'Error al subir la imagen. Inténtalo de nuevo.'
            }));
        } finally {
            setUploading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditForm(prev => ({...prev, [name]: value}));
        setSubmitError('');
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            setSubmitError('Por favor, corrige los errores antes de guardar');
            return;
        }

        onSave(editForm);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{backgroundColor: '#432818', color: 'white', fontWeight: 'bold'}}>
                Editar perfil
            </DialogTitle>
            <DialogContent sx={{p: 3}}>
                {submitError && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {submitError}
                    </Alert>
                )}

                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3}}>
                    <Avatar
                        src={editForm.profilePic || "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1741801696/readtoowell/profilepics/pfp.jpg"}
                        alt="Foto de perfil"
                        sx={{
                            width: 100,
                            height: 100,
                            border: '2px solid #8B0000',
                            cursor: 'pointer',
                            mb: 1,
                            mt: 1.5
                        }}
                        onClick={handleImageClick}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{display: 'none'}}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleImageClick}
                        disabled={uploading}
                        sx={{textTransform: 'none', color: '#8B0000', borderColor: '#8B0000'}}
                    >
                        {uploading ? <CircularProgress size={24}/> : 'Cambiar foto'}
                    </Button>
                    {errors.profilePic && (
                        <Typography color="error" variant="body2" sx={{mt: 1}}>
                            {errors.profilePic}
                        </Typography>
                    )}
                </Box>

                <TextField
                    fullWidth
                    label="Nombre de perfil"
                    name="profileName"
                    value={editForm.profileName}
                    onChange={handleChange}
                    error={!!errors.profileName}
                    helperText={errors.profileName}
                    sx={{mb: 3}}
                    required
                />

                <TextField
                    fullWidth
                    label="Biografía"
                    name="biography"
                    value={editForm.biography}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    error={!!errors.biography}
                    helperText={errors.biography}
                    inputProps={{maxLength: 2000}}
                />
                <Typography
                    variant="caption"
                    color={editForm.biography.length > 2000 ? 'error' : 'textSecondary'}
                    sx={{display: 'block', textAlign: 'right'}}
                >
                    {editForm.biography.length}/{2000}
                </Typography>
            </DialogContent>
            <DialogActions sx={{p: 2}}>
                <Button
                    onClick={onClose}
                    sx={{textTransform: 'none', color: '#6c757d'}}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={uploading || Object.keys(errors).length > 0}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#432818',
                        '&:hover': {backgroundColor: '#5a3a23'}
                    }}
                >
                    Guardar cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;