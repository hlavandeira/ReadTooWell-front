import {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

const AddCollectionDialog = ({open, onClose, onSave, error}) => {
    const [name, setName] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSave = () => {
        if (!name.trim()) {
            setLocalError('El nombre es obligatorio');
            return;
        }
        onSave(name);
    };

    useEffect(() => {
        if (!open) {
            setName('');
            setLocalError('');
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{
                backgroundColor: '#432818',
                color: 'white',
                fontWeight: 'bold'
            }}>
                Añadir nueva colección
            </DialogTitle>
            <DialogContent sx={{minWidth: '400px', mt: 2}}>
                <TextField
                    fullWidth
                    label="Nombre de la colección"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setLocalError('');
                    }}
                    error={!!localError || !!error}
                    helperText={localError || error}
                    sx={{mt: 1}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{color: '#432818', textTransform: 'none'}}>
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary"
                        sx={{backgroundColor: '#432818', textTransform: 'none'}}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCollectionDialog;