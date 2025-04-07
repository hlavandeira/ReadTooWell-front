import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AuthProvider} from './context/AuthContext.jsx';
import Catalogo from "./pages/Catalogo.jsx";
import AppBar from "./components/AppBar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import RequireAuth from "./context/RequireAuth";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <>
                            <AppBar/>
                            <Home/>
                        </>
                    }/>

                    <Route path="/catalogo" element={
                        <>
                            <AppBar/>
                            <Catalogo/>
                        </>
                    }/>

                    <Route path="/inicio-sesion" element={
                        <>
                            <AppBar/>
                            <Login/>
                        </>
                    }/>

                    <Route path="/registro" element={
                        <>
                            <AppBar/>
                            <Register/>
                        </>
                    }/>

                    <Route path="/detalles/:id" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <BookDetails/>
                            </>
                        </RequireAuth>
                    }/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;