import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/usuarios/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/casos');
    } catch (err) {
      console.error('Error de login:', err);
      setError('Credenciales incorrectas. Verificá los datos.');
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
        padding: '50px 40px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#0f172a',
          marginBottom: '35px',
          fontSize: '24px',
          fontWeight: '800',
          letterSpacing: '0.5px'
        }}>
          CONSULTORA INTEGRAL FORENSE
        </h2>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '15px', fontWeight: 'bold', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="correo@ejemplo.com"
              style={{ 
                width: '100%', padding: '12px', marginTop: '8px', 
                borderRadius: '6px', border: '1px solid #cbd5e1', 
                boxSizing: 'border-box', outline: 'none'
              }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              style={{ 
                width: '100%', padding: '12px', marginTop: '8px', 
                borderRadius: '6px', border: '1px solid #cbd5e1', 
                boxSizing: 'border-box', outline: 'none' 
              }}
            />
          </div>
          <button type="submit" style={{ 
            backgroundColor: '#0f172a', 
            color: 'white', 
            padding: '14px', 
            marginTop: '5px',
            borderRadius: '6px', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            INGRESAR AL SISTEMA
          </button>
          
          {/* NUEVO: ENLACE A REGISTRO */}
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#475569' }}>
            ¿No tenés cuenta en el sistema?{' '}
            <span 
              onClick={() => navigate('/register')} 
              style={{ color: '#0284c7', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Registrate acá
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;