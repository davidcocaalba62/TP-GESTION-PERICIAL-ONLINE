import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos listos para enviar al backend:', email, password);
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="perito@consultora.com"
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
            marginTop: '15px',
            borderRadius: '6px', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            INGRESAR AL SISTEMA
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;