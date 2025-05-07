import React from 'react';
import {Chip} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const GenreButton = ({genre}) => {
    const navigate = useNavigate();

    return (
        <Chip
            label={genre.name}
            clickable
            onClick={() => navigate(`/genero/${genre.id}`, {
                state: {
                    genreName: genre.name
                }
            })}
            sx={{
                borderRadius: '16px',
                backgroundColor: '#834F30',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#A0613A',
                    transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out'
            }}
        />
    );
};

export default GenreButton;