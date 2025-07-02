import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AuthProvider} from './context/AuthContext.jsx';
import {Box} from "@mui/material";
import {lazy, Suspense} from 'react';
import { LoadingFallback } from './components/Loading.jsx';

const RequireAuth = lazy(() => import('./context/RequireAuth'));
const RequireAdmin = lazy(() => import('./context/RequireAdmin'));
const AppBar = lazy(() => import('./components/AppBar.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));
const Catalog = lazy(() => import('./pages/books/Catalog.jsx'));
const Login = lazy(() => import('./pages/users/Login.jsx'));
const Register = lazy(() => import('./pages/users/Register.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const BookDetails = lazy(() => import('./pages/books/BookDetails.jsx'));
const Search = lazy(() => import('./pages/books/Search.jsx'));
const BooksByGenre = lazy(() => import('./pages/books/BooksByGenre.jsx'));
const BooksByAuthor = lazy(() => import('./pages/books/BooksByAuthor.jsx'));
const Library = lazy(() => import('./pages/Library.jsx'));
const Bookshelf = lazy(() => import('./pages/books/Bookshelf.jsx'));
const BookList = lazy(() => import('./pages/books/BookList.jsx'));
const Goal = lazy(() => import('./pages/Goal.jsx'));
const YearRecap = lazy(() => import('./pages/YearRecap.jsx'));
const Profile = lazy(() => import('./pages/users/Profile.jsx'));
const SearchUsers = lazy(() => import('./pages/users/SearchUsers.jsx'));
const UsersList = lazy(() => import('./pages/users/UsersList.jsx'));
const RequestList = lazy(() => import('./pages/admin/RequestList.jsx'));
const SuggestionList = lazy(() => import('./pages/admin/SuggestionList.jsx'));
const AuthorRequest = lazy(() => import('./pages/users/AuthorRequest.jsx'));
const DeletedBooksList = lazy(() => import('./pages/admin/DeletedBooksList.jsx'));
const Suggestion = lazy(() => import('./pages/books/Suggestion.jsx'));
const Authors = lazy(() => import('./pages/users/Authors.jsx'));
const AdminBookDetails = lazy(() => import('./pages/admin/AdminBookDetails.jsx'));
const EditBook = lazy(() => import('./pages/admin/EditBook.jsx'));
const AddBook = lazy(() => import('./pages/admin/AddBook.jsx'));
const Recommendations = lazy(() => import('./pages/Recommendations.jsx'));
const RecommendedBooks = lazy(() => import('./pages/books/RecommendedBooks.jsx'));

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
                <Suspense fallback={<LoadingFallback />}>

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

                        <Route path="/recomendaciones" element={
                            <MainLayout>
                                <RequireAuth>
                                    <Recommendations/>
                                </RequireAuth>
                            </MainLayout>
                        }/>

                        <Route path="/recomendaciones/libros" element={
                            <MainLayout>
                                <RequireAuth>
                                    <RecommendedBooks/>
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
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;