import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddItem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electronics',
        listingType: 'rent',
        pricePerDay: '',
        sellPrice: '',
        barterWant: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/items/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <Link to="/" style={styles.logo}>CampusLoop</Link>
            </nav>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Add New Item</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        name="title"
                        placeholder="Item Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        style={styles.textarea}
                        name="description"
                        placeholder="Item Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <select style={styles.input} name="category" value={formData.category} onChange={handleChange}>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Sports">Sports</option>
                        <option value="Other">Other</option>
                    </select>
                    <select style={styles.input} name="listingType" value={formData.listingType} onChange={handleChange}>
                        <option value="rent">Rent</option>
                        <option value="sell">Sell</option>
                        <option value="barter">Barter</option>
                    </select>
                    {formData.listingType === 'rent' && (
                        <input
                            style={styles.input}
                            type="number"
                            name="pricePerDay"
                            placeholder="Price per day (₹)"
                            value={formData.pricePerDay}
                            onChange={handleChange}
                            required
                        />
                    )}
                    {formData.listingType === 'sell' && (
                        <input
                            style={styles.input}
                            type="number"
                            name="sellPrice"
                            placeholder="Selling Price (₹)"
                            value={formData.sellPrice}
                            onChange={handleChange}
                            required
                        />
                    )}
                    {formData.listingType === 'barter' && (
                        <input
                            style={styles.input}
                            type="text"
                            name="barterWant"
                            placeholder="What do you want in exchange?"
                            value={formData.barterWant}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
    },
    navbar: {
        padding: '15px 30px',
        backgroundColor: '#111',
        borderBottom: '1px solid #222'
    },
    logo: {
        color: '#4f8ef7',
        fontSize: '24px',
        fontWeight: '800',
        textDecoration: 'none'
    },
    formContainer: {
        maxWidth: '500px',
        margin: '40px auto',
        backgroundColor: '#111',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid #222'
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '25px',
        textAlign: 'center'
    },
    input: {
        width: '100%',
        padding: '13px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '13px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        minHeight: '100px',
        resize: 'vertical'
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
        fontWeight: '600'
    },
    error: {
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '14px'
    }
};

export default AddItem;