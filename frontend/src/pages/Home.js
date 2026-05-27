import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, [category]);

    const fetchItems = async () => {
        try {
            const url = category
                ? `http://localhost:5000/api/items/all?category=${category}`
                : 'http://localhost:5000/api/items/all';
            const res = await axios.get(url);
            setItems(res.data.items);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>CampusLoop</h1>
                <div style={styles.navLinks}>
                    <Link to="/add-item" style={styles.navBtn}>+ Add Item</Link>
                    <Link to="/profile" style={styles.navLink}>Profile</Link>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            {/* Hero */}
            <div style={styles.hero}>
                <h2 style={styles.heroTitle}>Welcome, {user?.naam}! 👋</h2>
                <p style={styles.heroSubtitle}>Buy, Sell, Rent or Barter within your campus</p>
            </div>

            {/* Category Filter */}
            <div style={styles.filterContainer}>
                {['', 'Books', 'Electronics', 'Clothing', 'Sports', 'Other'].map((cat) => (
                    <button
                        key={cat}
                        style={{
                            ...styles.filterBtn,
                            backgroundColor: category === cat ? '#4f8ef7' : '#1a1a1a',
                            color: category === cat ? '#fff' : '#aaa'
                        }}
                        onClick={() => setCategory(cat)}
                    >
                        {cat === '' ? 'All' : cat}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            {loading ? (
                <p style={styles.loading}>Loading...</p>
            ) : items.length === 0 ? (
                <p style={styles.empty}>No items available. Be the first to add one!</p>
            ) : (
                <div style={styles.grid}>
                    {items.map((item) => (
                        <div key={item._id} style={styles.card}>
                            <div style={styles.cardBadge(item.listingType)}>
                                {item.listingType?.toUpperCase()}
                            </div>
                            <h3 style={styles.cardTitle}>{item.title}</h3>
                            <p style={styles.cardDesc}>{item.description}</p>
                            <p style={styles.cardCategory}>{item.category}</p>
                            {item.listingType === 'rent' && (
                                <p style={styles.cardPrice}>₹{item.pricePerDay}/day</p>
                            )}
                            {item.listingType === 'sell' && (
                                <p style={styles.cardPrice}>₹{item.sellPrice}</p>
                            )}
                            {item.listingType === 'barter' && (
                                <p style={styles.cardPrice}>Want: {item.barterWant}</p>
                            )}
                            <p style={styles.cardOwner}>By: {item.owner?.naam}</p>
                        </div>
                    ))}
                </div>
            )}
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#111',
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    logo: {
        color: '#4f8ef7',
        fontSize: '24px',
        fontWeight: '800'
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    navBtn: {
        backgroundColor: '#4f8ef7',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '14px'
    },
    navLink: {
        color: '#aaa',
        textDecoration: 'none',
        fontSize: '14px'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: '#ff4444',
        border: '1px solid #ff4444',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    hero: {
        padding: '40px 30px 20px',
        textAlign: 'center'
    },
    heroTitle: {
        fontSize: '32px',
        fontWeight: '800',
        marginBottom: '10px'
    },
    heroSubtitle: {
        color: '#666',
        fontSize: '16px'
    },
    filterContainer: {
        display: 'flex',
        gap: '10px',
        padding: '20px 30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    filterBtn: {
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid #333',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '20px 30px'
    },
    card: {
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
    },
    cardBadge: (type) => ({
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        marginBottom: '10px',
        backgroundColor: type === 'rent' ? '#1a3a6b' : type === 'sell' ? '#1a4a1a' : '#4a3a1a',
        color: type === 'rent' ? '#4f8ef7' : type === 'sell' ? '#4fbb4f' : '#f7a94f'
    }),
    cardTitle: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '8px'
    },
    cardDesc: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '8px'
    },
    cardCategory: {
        color: '#555',
        fontSize: '12px',
        marginBottom: '8px'
    },
    cardPrice: {
        color: '#4f8ef7',
        fontWeight: '700',
        fontSize: '16px',
        marginBottom: '8px'
    },
    cardOwner: {
        color: '#555',
        fontSize: '12px'
    },
    loading: {
        textAlign: 'center',
        color: '#666',
        padding: '50px'
    },
    empty: {
        textAlign: 'center',
        color: '#666',
        padding: '50px'
    }
};

export default Home;