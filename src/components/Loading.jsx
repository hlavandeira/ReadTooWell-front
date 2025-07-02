import {Box, CircularProgress} from "@mui/material";
import React from "react";

export function LoadingFallback() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress sx={{color: '#8B0000'}}/>
        </Box>
    );
}