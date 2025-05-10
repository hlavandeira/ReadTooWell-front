import {Box, Typography, Link} from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#121212",
                color: "#ffffff",
                py: 3,
                textAlign: "center"
            }}
        >
            <Typography variant="body2" gutterBottom>
                © {new Date().getFullYear()} Trabajo Fin de Grado - ReadTooWell
            </Typography>
            <Typography variant="body2">
                Desarrollado por Héctor Lavandeira Fernández |{" "}
                <Link
                    href="mailto:correo@ejemplo.com"
                    underline="hover"
                    color="inherit"
                >
                    UO277303@uniovi.es
                </Link>
            </Typography>
        </Box>
    );
};

export default Footer;