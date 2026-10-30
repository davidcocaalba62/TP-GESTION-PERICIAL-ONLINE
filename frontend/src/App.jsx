import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Importamos TU archivo Register.jsx
import Casos from './pages/Casos';
import DetalleCaso from './pages/DetalleCaso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <-- Ruta enlazada */}
        <Route path="/casos" element={<Casos />} />
        <Route path="/casos/:id" element={<DetalleCaso />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;