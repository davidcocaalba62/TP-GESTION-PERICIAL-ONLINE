<h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '22px', fontWeight: '800' }}>
  ALTA DE NUEVO PERITO (PRUEBA 123)
</h2>

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Importamos tu conexión centralizada a Render

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('perito_junior'); // Nuevo estado para el rol (por defecto Junior)
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      // Usamos 'api.post' directo, que ya conoce la URL de Render gracias a tu variable de entorno
      const respuesta = await api.post('/usuarios', {
        nombre,
        email,
        password,
        rol // Ahora enviamos el rol seleccionado al backend
      });

      setMensaje('¡Usuario registrado con éxito en la base de datos!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('Error al registrar el usuario. Verificá los datos o la conexión.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("/fondo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      margin: '-8px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '40px 40px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#0f172a',
          marginBottom: '20px',
          fontSize: '22px',
          fontWeight: '800',
          letterSpacing: '0.5px'
        }}>
          ALTA DE NUEVO PERITO
        </h2>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {mensaje && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Nombre Completo</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              placeholder="Ej: Lic. David Coca Alba"
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="perito@consultora.com"
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Contraseña Temporal</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
          
          {/* CAMPO DE ROL CORREGIDO */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Rol en el Sistema</label>
            <select 
              value={rol} 
              onChange={(e) => setRol(e.target.value)} 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', backgroundColor: 'white' }}
            >
              <option value="perito_junior">Perito Junior</option>
              <option value="perito_senior">Perito Senior</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          
          <button type="submit" style={{ 
            backgroundColor: '#0f172a', 
            color: 'white', 
            padding: '12px', 
            marginTop: '10px',
            borderRadius: '6px', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '15px',
            cursor: 'pointer'
          }}>
            REGISTRAR PERITO
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <Link to="/login" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;