import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const heroImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1600',
];

const API = 'http://localhost:8000/api';

const Home = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({ location: '', adType: '', propertyType: '' });
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Hero carousel auto-rotate
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Fetch properties
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.location) params.set('location', filters.location);
            if (filters.adType) params.set('adType', filters.adType);
            if (filters.propertyType) params.set('propertyType', filters.propertyType);
            const res = await axios.get(`${API}/users/properties?${params}`);
            setProperties(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    const defaultImg = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                {heroImages.map((img, i) => (
                    <div
                        key={i}
                        className="hero-bg"
                        style={{
                            backgroundImage: `url(${img})`,
                            opacity: i === currentSlide ? 1 : 0,
                        }}
                    />
                ))}
                <div className="hero-overlay" />
                <div className="hero-content">
                    <h1>Find Your Dream Rental Property</h1>
                    <p>Comfort, Convenience &amp; Class — All in One Place</p>
                    <div className="hero-dots">
                        {heroImages.map((_, i) => (
                            <div
                                key={i}
                                className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Properties Section */}
            <section className="section">
                <h2 className="section-heading">Explore Our Premium Properties</h2>
                <div className="section-sub">
                    Looking to post your property?{' '}
                    <Link to="/register" className="btn btn-outline btn-sm" style={{ marginLeft: '0.5rem' }}>
                        Register as Owner
                    </Link>
                </div>

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
                    {properties.length > 0 ? properties.map((p) => (
                        <div key={p._id} className="property-card">
                            <img
                                className="property-card-img"
                                src={p.Images && p.Images[0] ? `http://localhost:8000${p.Images[0]}` : defaultImg}
                                alt={p.Location}
                                onError={(e) => { e.target.src = defaultImg; }}
                            />
                            <div className="property-card-body">
                                <div className="property-card-title">{p.Location}</div>
                                <div className="property-card-type">
                                    {p.PropertyType} – {p.AdType || 'rent'}
                                </div>
                                {p.Status === 'Available' ? (
                                    <span className="property-card-link" onClick={() => user ? navigate('/renter') : navigate('/login')}>
                                        Login to see details
                                    </span>
                                ) : (
                                    <span className="property-card-status unavailable">Not Available</span>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1', padding: '3rem 0' }}>
                            No properties found.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
