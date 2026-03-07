import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8000/api';
const defaultImg = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

const RenterHome = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const [activeTab, setActiveTab] = useState('properties');
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [filters, setFilters] = useState({ location: '', adType: '', propertyType: '' });

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchProperties();
        fetchBookings();
    }, []);

    const fetchProperties = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.location) params.set('location', filters.location);
            if (filters.adType) params.set('adType', filters.adType);
            if (filters.propertyType) params.set('propertyType', filters.propertyType);
            const res = await axios.get(`${API}/users/properties?${params}`);
            setProperties(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${API}/users/mybookings`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleBook = async (property) => {
        if (!user) { navigate('/login'); return; }
        try {
            await axios.post(`${API}/users/book`,
                { propertyId: property._id, startDate: new Date() },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert('Booking requested successfully!');
            fetchBookings();
            fetchProperties();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to book property');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    return (
        <div className="dashboard">
            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
                    All Properties
                </button>
                <button className={`tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                    Booking History
                </button>
            </div>

            {activeTab === 'properties' && (
                <>
                    {/* Filter Bar */}
                    <form className="filter-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by Address"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                        <select value={filters.adType} onChange={(e) => setFilters({ ...filters, adType: e.target.value })}>
                            <option value="">All Ad Types</option>
                            <option value="rent">Rent</option>
                            <option value="sale">Sale</option>
                        </select>
                        <select value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}>
                            <option value="">All Types</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                        </select>
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>

                    {/* Property Cards */}
                    <div className="card-grid">
                        {properties.map((p) => (
                            <div key={p._id} className="property-card">
                                <img
                                    className="property-card-img"
                                    src={p.Images && p.Images[0] ? `http://localhost:8000${p.Images[0]}` : defaultImg}
                                    alt={p.Location}
                                    onError={(e) => { e.target.src = defaultImg; }}
                                />
                                <div className="property-card-body">
                                    <div className="property-card-title">{p.Location}</div>
                                    <div className="property-card-type">{p.PropertyType} – {p.AdType || 'rent'}</div>
                                    <div className="property-card-info"><strong>Owner:</strong> {p.OwnerID?.Phone || p.OwnerContact || 'N/A'}</div>
                                    <div className="property-card-info"><strong>Availability:</strong>{' '}
                                        <span className={p.Status === 'Available' ? 'status-available' : 'status-unavailable'}>
                                            {p.Status}
                                        </span>
                                    </div>
                                    <div className="property-card-info"><strong>Price:</strong> ₹{p.RentAmount}</div>
                                    {p.Status === 'Available' ? (
                                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}
                                            onClick={() => handleBook(p)}>
                                            Get Info / Book
                                        </button>
                                    ) : (
                                        <span className="property-card-status unavailable" style={{ display: 'block', marginTop: '0.75rem' }}>
                                            Not Available
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {properties.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1', padding: '3rem 0' }}>
                                No properties found.
                            </p>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'bookings' && (
                <div className="dashboard-card">
                    <h3 className="dashboard-title">All My Bookings</h3>
                    <div className="table-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Property ID</th>
                                    <th>Tenant Name</th>
                                    <th>Phone</th>
                                    <th>Booking Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td>{b._id}</td>
                                        <td>{b.PropertyID?._id || 'N/A'}</td>
                                        <td>{user?.Name || 'N/A'}</td>
                                        <td>{b.PropertyID?.OwnerID?.Phone || 'N/A'}</td>
                                        <td>
                                            <span className={
                                                b.Status === 'Confirmed' ? 'status-booked' :
                                                b.Status === 'Pending' ? 'status-pending' :
                                                'status-cancelled'
                                            }>
                                                {b.Status === 'Confirmed' ? 'booked' : b.Status?.toLowerCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No bookings found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RenterHome;
