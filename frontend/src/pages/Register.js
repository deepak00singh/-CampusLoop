import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        naam: '',
        email: '',
        password: '',
        collegeName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>CampusLoop</h1>
                <h2 style={styles.subtitle}>Register</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        name="naam"
                        placeholder="Full Name"
                        value={formData.naam}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="College Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="text"
                        name="collegeName"
                        placeholder="College Name"
                        value={formData.collegeName}
                        onChange={handleChange}
                        required
                    />
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p style={styles.link}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
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
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
    },
    card: {
        backgroundColor: '#111111',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid #222',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 0 40px rgba(0,0,0,0.5)'
    },
    title: {
        textAlign: 'center',
        color: '#4f8ef7',
        marginBottom: '5px'
    },
    subtitle: {
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '13px',
        marginBottom: '12px',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box'
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
        fontWeight: '600',
        marginTop: '8px'
    },
    error: {
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '14px'
    },
    link: {
        textAlign: 'center',
        marginTop: '15px',
        color: '#666'
    }
};

export default Register;