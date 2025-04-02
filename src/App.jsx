import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Catalogo from "./pages/Catalogo";
import AppBar from "./components/AppBar.jsx";

function App() {
    return (
        <div className="App">
            <Router>
                <AppBar></AppBar>
                <Routes>
                    <Route path="/" element={<h1>Página principal</h1>} />
                    <Route path="/catalogo" element={<Catalogo />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;