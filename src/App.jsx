import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AuthProvider} from './context/AuthContext.jsx';
import Catalog from "./pages/Catalog.jsx";
import AppBar from "./components/AppBar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import RequireAuth from "./context/RequireAuth";
import Search from "./pages/Search.jsx";
import BooksByGenre from "./pages/BooksByGenre.jsx";
import BooksByAuthor from "./pages/BooksByAuthor.jsx";
import Library from "./pages/Library.jsx";
import Bookshelf from "./pages/Bookshelf.jsx";
import BookList from "./pages/BookList.jsx";
import Goal from "./pages/Goal.jsx";
import YearRecap from "./pages/YearRecap.jsx";
import Profile from "./pages/Profile.jsx";
import SearchUsers from "./pages/SearchUsers.jsx";
import UsersList from "./pages/UsersList.jsx";
import RequestList from "./pages/RequestList.jsx";
import SuggestionList from "./pages/SuggestionList.jsx";

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
                            <Catalog/>
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

                    <Route path="/genero/:idGenero" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <BooksByGenre/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/buscar" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <Search/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/autor" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <BooksByAuthor/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/biblioteca" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <Library/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/biblioteca/:status" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <Bookshelf/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/listas/:idList" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <BookList/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/objetivos-lectura" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <Goal/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/resumen" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <YearRecap/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/perfil/:id" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <Profile/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/buscar/usuarios" element={
                        <RequireAuth>
                            <>
                                <AppBar/>
                                <SearchUsers/>
                            </>
                        </RequireAuth>
                    }/>

                    <Route path="/perfil/:id/seguidores" element={
                        <>
                            <AppBar/>
                            <UsersList type="seguidores"/>
                        </>
                    }/>

                    <Route path="/perfil/:id/seguidos" element={
                        <>
                            <AppBar/>
                            <UsersList type="seguidos"/>
                        </>
                    }/>

                    <Route path="/admin/verificaciones" element={
                        <>
                            <AppBar/>
                            <RequestList/>
                        </>
                    }/>

                    <Route path="/admin/sugerencias" element={
                        <>
                            <AppBar/>
                            <SuggestionList/>
                        </>
                    }/>

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;