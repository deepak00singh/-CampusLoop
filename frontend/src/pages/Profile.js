import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [myItems, setMyItems] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('items');
    const [loading, setLoading] = useState(true);
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [itemsRes, requestsRes, incomingRes] = await Promise.all([
                axios.get('http://localhost:5000/api/items/my/items', { headers }),
                axios.get('http://localhost:5000/api/rent/my', { headers }),
                axios.get('http://localhost:5000/api/rent/incoming', { headers })
            ]);
            setMyItems(itemsRes.data.items);
            setMyRequests(requestsRes.data.requests);
            setIncomingRequests(incomingRes.data.requests);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleAccept = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/rent/accept/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleConfirm = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/rent/confirm/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/rent/cancel/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const statusColor = (status) => {
        const colors = {
            pending: '#f7a94f',
            accepted: '#4f8ef7',
            confirmed: '#4fbb4f',
            declined: '#ff4444',
            cancelled: '#888'
        };
        return colors[status] || '#888';
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <Link to="/" style={styles.logo}>CampusLoop</Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </nav>

            {/* Profile Header */}
            <div style={styles.profileHeader}>
                <div style={styles.avatar}>
                    {user?.naam?.charAt(0).toUpperCase()}
                </div>
                <h2 style={styles.userName}>{user?.naam}</h2>
                <p style={styles.userEmail}>{user?.email}</p>
                <p style={styles.userCollege}>{user?.collegeName}</p>
                <span style={styles.verifiedBadge}>
                    {user?.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                </span>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                {['items', 'sent', 'incoming'].map((tab) => (
                    <button
                        key={tab}
                        style={{
                            ...styles.tab,
                            borderBottom: activeTab === tab ? '2px solid #4f8ef7' : '2px solid transparent',
                            color: activeTab === tab ? '#4f8ef7' : '#666'
                        }}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'items' ? 'My Items' : tab === 'sent' ? 'Sent Requests' : 'Incoming Requests'}
                    </button>
                ))}
            </div>

            {loading ? (
                <p style={styles.loading}>Loading...</p>
            ) : (
                <div style={styles.content}>
                    {/* My Items */}
                    {activeTab === 'items' && (
                        <div style={styles.grid}>
                            {myItems.length === 0 ? (
                                <p style={styles.empty}>No items added yet.</p>
                            ) : myItems.map((item) => (
                                <div key={item._id} style={styles.card}>
                                    <h3 style={styles.cardTitle}>{item.title}</h3>
                                    <p style={styles.cardDesc}>{item.description}</p>
                                    <span style={{ color: item.isAvailable ? '#4fbb4f' : '#ff4444' }}>
                                        {item.isAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Sent Requests */}
                    {activeTab === 'sent' && (
                        <div style={styles.grid}>
                            {myRequests.length === 0 ? (
                                <p style={styles.empty}>No requests sent yet.</p>
                            ) : myRequests.map((req) => (
                                <div key={req._id} style={styles.card}>
                                    <h3 style={styles.cardTitle}>{req.item?.title}</h3>
                                    <p style={styles.cardDesc}>To: {req.owner?.naam}</p>
                                    <p style={styles.cardDesc}>Message: {req.message}</p>
                                    <span style={{ color: statusColor(req.status), fontWeight: '700' }}>
                                        {req.status?.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Incoming Requests */}
                    {activeTab === 'incoming' && (
                        <div style={styles.grid}>
                            {incomingRequests.length === 0 ? (
                                <p style={styles.empty}>No incoming requests.</p>
                            ) : incomingRequests.map((req) => (
                                <div key={req._id} style={styles.card}>
                                    <h3 style={styles.cardTitle}>{req.item?.title}</h3>
                                    <p style={styles.cardDesc}>From: {req.requester?.naam}</p>
                                    <p style={styles.cardDesc}>Message: {req.message}</p>
                                    <span style={{ color: statusColor(req.status), fontWeight: '700' }}>
                                        {req.status?.toUpperCase()}
                                    </span>
                                    <div style={styles.btnGroup}>
                                        {req.status === 'pending' && (
                                            <button style={styles.acceptBtn} onClick={() => handleAccept(req._id)}>
                                                Accept
                                            </button>
                                        )}
                                        {req.status === 'accepted' && (
                                            <>
                                                <button style={styles.confirmBtn} onClick={() => handleConfirm(req._id)}>
                                                    Confirm Deal
                                                </button>
                                                <button style={styles.cancelBtn} onClick={() => handleCancel(req._id)}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
        borderBottom: '1px solid #222'
    },
    logo: {
        color: '#4f8ef7',
        fontSize: '24px',
        fontWeight: '800',
        textDecoration: 'none'
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
    profileHeader: {
        textAlign: 'center',
        padding: '40px 20px 20px'
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#4f8ef7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: '800',
        margin: '0 auto 15px'
    },
    userName: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '5px'
    },
    userEmail: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '5px'
    },
    userCollege: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '10px'
    },
    verifiedBadge: {
        fontSize: '13px',
        color: '#888'
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        padding: '20px',
        borderBottom: '1px solid #222'
    },
    tab: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '15px',
        padding: '10px 0',
        transition: 'all 0.2s'
    },
    content: {
        padding: '20px 30px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '20px'
    },
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
    btnGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '12px'
    },
    acceptBtn: {
        padding: '8px 16px',
        backgroundColor: '#4f8ef7',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    confirmBtn: {
        padding: '8px 16px',
        backgroundColor: '#4fbb4f',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    cancelBtn: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        color: '#ff4444',
        border: '1px solid #ff4444',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    loading: {
        textAlign: 'center',
        color: '#666',
        padding: '50px'
    },
    empty: {
        color: '#666',
        textAlign: 'center',
        padding: '30px'
    }
};

export default Profile;