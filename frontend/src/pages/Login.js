import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            {/* Background grid lines */}
            <div style={styles.gridLines}></div>

            {/* Corner decorations */}
            <div style={{ ...styles.corner, top: '20px', left: '20px', borderTop: '2px solid #333', borderLeft: '2px solid #333' }}></div>
            <div style={{ ...styles.corner, top: '20px', right: '20px', borderTop: '2px solid #333', borderRight: '2px solid #333' }}></div>
            <div style={{ ...styles.corner, bottom: '20px', left: '20px', borderBottom: '2px solid #333', borderLeft: '2px solid #333' }}></div>
            <div style={{ ...styles.corner, bottom: '20px', right: '20px', borderBottom: '2px solid #333', borderRight: '2px solid #333' }}></div>

            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoContainer}>
                    <div style={styles.logo}>
                        <span style={styles.logoText}>CL</span>
                        <div style={styles.logoRing}></div>
                    </div>
                </div>

                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>
                    Don't have an account? <Link to="/register" style={styles.linkText}>Sign up</Link>
                </p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputContainer}>
                        <span style={styles.inputIcon}>✉</span>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.inputContainer}>
                        <span style={styles.inputIcon}>🔒</span>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
    },
    gridLines: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
    },
    corner: {
        position: 'absolute',
        width: '40px',
        height: '40px'
    },
    card: {
        backgroundColor: '#111111',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid #222',
        width: '100%',
        maxWidth: '380px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 0 40px rgba(0,0,0,0.5)'
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
    },
    logo: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#1a1a1a',
        border: '2px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    logoText: {
        color: '#4f8ef7',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    logoRing: {
        position: 'absolute',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: '1px solid #222'
    },
    title: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: '22px',
        marginBottom: '8px',
        fontWeight: '600'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        marginBottom: '25px'
    },
    linkText: {
        color: '#4f8ef7',
        textDecoration: 'none',
        fontWeight: '600'
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        marginBottom: '12px',
        padding: '0 12px'
    },
    inputIcon: {
        fontSize: '14px',
        marginRight: '10px',
        opacity: 0.5
    },
    input: {
        width: '100%',
        padding: '13px 0',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#ffffff',
        fontSize: '15px'
    },
    button: {
        width: '100%',
        padding: '13px',
        backgroundColor: '#4f8ef7',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '8px',
        fontWeight: '600'
    },
    error: {
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '14px'
    }
};

export default Login;