import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AuthProvider} from './context/AuthContext.jsx';
import {Box} from "@mui/material";
import RequireAuth from "./context/RequireAuth";
import RequireAdmin from "./context/RequireAdmin";
import AppBar from "./components/AppBar.jsx";
import Footer from "./components/Footer.jsx";
import Catalog from "./pages/books/Catalog.jsx";
import Login from "./pages/users/Login.jsx";
import Register from "./pages/users/Register.jsx";
import Home from "./pages/Home.jsx";
import BookDetails from "./pages/books/BookDetails.jsx";
import Search from "./pages/books/Search.jsx";
import BooksByGenre from "./pages/books/BooksByGenre.jsx";
import BooksByAuthor from "./pages/books/BooksByAuthor.jsx";
import Library from "./pages/Library.jsx";
import Bookshelf from "./pages/books/Bookshelf.jsx";
import BookList from "./pages/books/BookList.jsx";
import Goal from "./pages/Goal.jsx";
import YearRecap from "./pages/YearRecap.jsx";
import Profile from "./pages/users/Profile.jsx";
import SearchUsers from "./pages/users/SearchUsers.jsx";
import UsersList from "./pages/users/UsersList.jsx";
import RequestList from "./pages/admin/RequestList.jsx";
import SuggestionList from "./pages/admin/SuggestionList.jsx";
import AuthorRequest from "./pages/users/AuthorRequest.jsx";
import DeletedBooksList from "./pages/admin/DeletedBooksList.jsx";
import Suggestion from "./pages/books/Suggestion.jsx";
import Authors from "./pages/users/Authors.jsx";
import AdminBookDetails from "./pages/admin/AdminBookDetails.jsx";
import EditBook from "./pages/admin/EditBook.jsx";
import AddBook from "./pages/admin/AddBook.jsx";

const MainLayout = ({children}) => (
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <AppBar/>
        <Box component="main" sx={{flex: 1}}>
            {children}
        </Box>
        <Footer/>
    </Box>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <MainLayout>
                            <Home/>
                        </MainLayout>
                    }/>

                    <Route path="/catalogo" element={
                        <MainLayout>
                            <Catalog/>
                        </MainLayout>
                    }/>

                    <Route path="/inicio-sesion" element={
                        <MainLayout>
                            <Login/>
                        </MainLayout>
                    }/>

                    <Route path="/registro" element={
                        <MainLayout>
                            <Register/>
                        </MainLayout>
                    }/>

                    <Route path="/detalles/:id" element={
                        <MainLayout>
                            <RequireAuth>
                                <BookDetails/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/genero/:idGenero" element={
                        <MainLayout>
                            <RequireAuth>
                                <BooksByGenre/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/buscar" element={
                        <MainLayout>
                            <RequireAuth>
                                <Search/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/autor" element={
                        <MainLayout>
                            <RequireAuth>
                                <BooksByAuthor/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/biblioteca" element={
                        <MainLayout>
                            <RequireAuth>
                                <Library/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/biblioteca/:status" element={
                        <MainLayout>
                            <RequireAuth>
                                <Bookshelf/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/listas/:idList" element={
                        <MainLayout>
                            <RequireAuth>
                                <BookList/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/objetivos-lectura" element={
                        <MainLayout>
                            <RequireAuth>
                                <Goal/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/resumen" element={
                        <MainLayout>
                            <RequireAuth>
                                <YearRecap/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/perfil/:id" element={
                        <MainLayout>
                            <RequireAuth>
                                <Profile/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/buscar/usuarios" element={
                        <MainLayout>
                            <RequireAuth>
                                <SearchUsers/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/perfil/:id/seguidores" element={
                        <MainLayout>
                            <RequireAuth>
                                <UsersList type="seguidores"/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/perfil/:id/seguidos" element={
                        <MainLayout>
                            <RequireAuth>
                                <UsersList type="seguidos"/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/solicitud-autor" element={
                        <MainLayout>
                            <RequireAuth>
                                <AuthorRequest/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/libros/sugerencia" element={
                        <MainLayout>
                            <RequireAuth>
                                <Suggestion/>
                            </RequireAuth>
                        </MainLayout>
                    }/>

                    <Route path="/autores" element={
                        <MainLayout>
                            <RequireAuth>
                                <Authors/>
                            </RequireAuth>
                        </MainLayout>
                    }/>


                    {/* Páginas de Administrador */}

                    <Route path="/admin/verificaciones" element={
                        <MainLayout>
                            <RequireAdmin>
                                <RequestList/>
                            </RequireAdmin>
                        </MainLayout>
                    }/>

                    <Route path="/admin/sugerencias" element={
                        <MainLayout>
                            <RequireAdmin>
                                <SuggestionList/>
                            </RequireAdmin>
                        </MainLayout>
                    }/>

                    <Route path="/libros/eliminados" element={
                        <MainLayout>
                            <RequireAdmin>
                                <DeletedBooksList/>
                            </RequireAdmin>
                        </MainLayout>
                    }/>

                    <Route path="/admin/detalles/:id" element={
                        <MainLayout>
                            <RequireAdmin>
                                <AdminBookDetails/>
                            </RequireAdmin>
                        </MainLayout>
                    }/>

                    <Route path="/admin/:id/editar" element={
                        <MainLayout>
                            <RequireAdmin>
                                <EditBook/>
                            </RequireAdmin>
                        </MainLayout>
                    }/>

                    <Route path="/admin/añadir-libro" element={
                        <MainLayout>
                            <RequireAdmin>
                                <AddBook/>
                            </RequireAdmin>
                        </MainLayout>
                    }/>

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;