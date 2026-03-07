import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8000/api';

const OwnerHome = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const [activeTab, setActiveTab] = useState('add');
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Add Property form state
    const [formData, setFormData] = useState({
        PropertyType: 'residential', AdType: 'rent', Location: '',
        OwnerContact: '', RentAmount: 0, Description: ''
    });
    const [images, setImages] = useState(null);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchProperties();
        fetchBookings();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await axios.get(`${API}/owners/properties`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProperties(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API}/owners/bookings`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
            if (images) {
                for (let f of images) fd.append('images', f);
            }

            if (editingId) {
                await axios.put(`${API}/owners/properties/${editingId}`, fd, {
                    headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
                });
                alert('Property updated!');
                setEditingId(null);
            } else {
                await axios.post(`${API}/owners/properties`, fd, {
                    headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
                });
                alert('Property added!');
            }

            setFormData({ PropertyType: 'residential', AdType: 'rent', Location: '', OwnerContact: '', RentAmount: 0, Description: '' });
            setImages(null);
            fetchProperties();
            setActiveTab('properties');
        } catch (err) {
            alert('Failed to save property');
        }
    };

    const handleEdit = (p) => {
        setFormData({
            PropertyType: p.PropertyType || 'residential',
            AdType: p.AdType || 'rent',
            Location: p.Location || '',
            OwnerContact: p.OwnerContact || '',
            RentAmount: p.RentAmount || 0,
            Description: p.Description || ''
        });
        setEditingId(p._id);
        setActiveTab('add');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await axios.delete(`${API}/owners/properties/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchProperties();
        } catch (err) { alert('Failed to delete'); }
    };

    const handleBookingStatus = async (id, status) => {
        try {
            await axios.put(`${API}/owners/bookings/${id}`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchBookings();
            fetchProperties();
        } catch (err) { alert('Failed to update status'); }
    };

    return (
        <div className="dashboard">
            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'add' ? 'active' : ''}`} onClick={() => { setActiveTab('add'); setEditingId(null); setFormData({ PropertyType: 'residential', AdType: 'rent', Location: '', OwnerContact: '', RentAmount: 0, Description: '' }); }}>
                    Add Property
                </button>
                <button className={`tab ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
                    All Properties
                </button>
                <button className={`tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                    All Bookings
                </button>
            </div>

            {/* Add Property Tab */}
            {activeTab === 'add' && (
                <div className="dashboard-card">
                    <h3 className="dashboard-title" style={{ textAlign: 'center' }}>
                        {editingId ? 'Edit Property' : 'Add New Property'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Property Type</label>
                                <select className="form-control" name="PropertyType" value={formData.PropertyType} onChange={handleChange}>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Property Ad Type</label>
                                <select className="form-control" name="AdType" value={formData.AdType} onChange={handleChange}>
                                    <option value="rent">Rent</option>
                                    <option value="sale">Sale</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Property Full Address</label>
                                <input className="form-control" name="Location" placeholder="Address" value={formData.Location} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Property Images</label>
                                <input className="form-control" type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
                            </div>
                            <div className="form-group">
                                <label>Owner Contact No.</label>
                                <input className="form-control" name="OwnerContact" placeholder="Contact number" value={formData.OwnerContact} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Property Amount</label>
                                <input className="form-control" type="number" name="RentAmount" value={formData.RentAmount} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Additional Details for the Property</label>
                            <textarea className="form-control" name="Description" placeholder="Add any details here..." value={formData.Description} onChange={handleChange} rows="4" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 2rem' }}>
                                {editingId ? 'Update Property' : 'Submit Form'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* All Properties Tab */}
            {activeTab === 'properties' && (
                <div className="dashboard-card">
                    <div className="table-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Property ID</th>
                                    <th>Property Type</th>
                                    <th>Ad Type</th>
                                    <th>Address</th>
                                    <th>Owner Contact</th>
                                    <th>Amount</th>
                                    <th>Availability</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((p) => (
                                    <tr key={p._id}>
                                        <td>{p._id}</td>
                                        <td>{p.PropertyType}</td>
                                        <td>{p.AdType || 'rent'}</td>
                                        <td>{p.Location}</td>
                                        <td>{p.OwnerContact || 'N/A'}</td>
                                        <td>₹{p.RentAmount}</td>
                                        <td>
                                            <span className={p.Status === 'Available' ? 'status-available' : 'status-unavailable'}>
                                                {p.Status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline btn-sm" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(p)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {properties.length === 0 && (
                                    <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No properties listed yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Bookings Tab */}
            {activeTab === 'bookings' && (
                <div className="dashboard-card">
                    <div className="table-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Property ID</th>
                                    <th>Tenant Name</th>
                                    <th>Tenant Phone</th>
                                    <th>Booking Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td>{b._id}</td>
                                        <td>{b.PropertyID?._id || 'N/A'}</td>
                                        <td>{b.TenantID?.Name || 'N/A'}</td>
                                        <td>{b.TenantID?.Phone || 'N/A'}</td>
                                        <td>
                                            <span className={
                                                b.Status === 'Confirmed' ? 'status-booked' :
                                                b.Status === 'Pending' ? 'status-pending' :
                                                'status-cancelled'
                                            }>
                                                {b.Status === 'Confirmed' ? 'booked' : b.Status?.toLowerCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {b.Status === 'Pending' && (
                                                <button className="btn btn-success btn-sm" onClick={() => handleBookingStatus(b._id, 'Confirmed')}>
                                                    Mark Booked
                                                </button>
                                            )}
                                            {b.Status === 'Confirmed' && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleBookingStatus(b._id, 'Pending')}>
                                                    Mark Pending
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No bookings yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerHome;
