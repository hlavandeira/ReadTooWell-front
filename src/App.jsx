import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './AuthContext.jsx';
import Catalogo from "./pages/Catalogo.jsx";
import AppBar from "./components/AppBar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import BookDetails from "./pages/BookDetails.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <>
                            <AppBar />
                            <Home />
                        </>
                    } />

                    <Route path="/catalogo" element={
                        <>
                            <AppBar />
                            <Catalogo />
                        </>
                    } />

                    <Route path="/inicio-sesion" element={
                        <>
                            <AppBar />
                            <Login />
                        </>
                    } />

                    <Route path="/registro" element={
                        <>
                            <AppBar />
                            <Register />
                        </>
                    } />

                    <Route path="/detalles/:id" element={
                        <>
                            <AppBar />
                            <BookDetails />
                        </>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;