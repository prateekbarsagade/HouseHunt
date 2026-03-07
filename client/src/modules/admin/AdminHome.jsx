import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8000/api';

const AdminHome = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchUsers();
        fetchProperties();
        fetchBookings();
    }, []);

    const headers = { Authorization: `Bearer ${user?.token}` };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API}/admin/users`, { headers });
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchProperties = async () => {
        try {
            const res = await axios.get(`${API}/admin/properties`, { headers });
            setProperties(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API}/admin/bookings`, { headers });
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleGrantToggle = async (userId, currentType) => {
        try {
            const newType = currentType === 'Landlord' ? 'Tenant' : 'Landlord';
            await axios.put(`${API}/admin/users/${userId}/makeowner`, { UserType: newType }, { headers });
            fetchUsers();
        } catch (err) { alert('Failed to update user role'); }
    };

    return (
        <div className="dashboard">
            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    All Users
                </button>
                <button className={`tab ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
                    All Properties
                </button>
                <button className={`tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                    All Bookings
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="dashboard-card">
                    <div className="table-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Granted (Owners Only)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u._id}</td>
                                        <td>{u.Name}</td>
                                        <td>{u.Email}</td>
                                        <td style={{ color: u.UserType === 'Admin' ? 'var(--accent)' : u.UserType === 'Landlord' ? 'var(--info)' : 'var(--text-secondary)' }}>
                                            {u.UserType === 'Landlord' ? 'Owner' : u.UserType}
                                        </td>
                                        <td>
                                            {u.UserType === 'Landlord' && <span className="status-granted">granted</span>}
                                        </td>
                                        <td>
                                            {u.UserType === 'Landlord' && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleGrantToggle(u._id, u.UserType)}>
                                                    Ungrant
                                                </button>
                                            )}
                                            {u.UserType === 'Tenant' && (
                                                <button className="btn btn-success btn-sm" onClick={() => handleGrantToggle(u._id, u.UserType)}>
                                                    Grant
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
                <div className="dashboard-card">
                    <div className="table-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Property ID</th>
                                    <th>Owner ID</th>
                                    <th>Property Type</th>
                                    <th>Property Ad Type</th>
                                    <th>Property Address</th>
                                    <th>Owner Contact</th>
                                    <th>Property Amt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((p) => (
                                    <tr key={p._id}>
                                        <td>{p._id}</td>
                                        <td>{p.OwnerID?._id || p.OwnerID}</td>
                                        <td style={{ color: 'var(--accent)' }}>{p.PropertyType}</td>
                                        <td>{p.AdType || 'rent'}</td>
                                        <td>{p.Location}</td>
                                        <td>{p.OwnerContact || p.OwnerID?.Phone || 'N/A'}</td>
                                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{p.RentAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
                <div className="dashboard-card">
                    <div className="table-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Owner ID</th>
                                    <th>Property ID</th>
                                    <th>Tenant ID</th>
                                    <th>Tenant Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td>{b._id}</td>
                                        <td>{b.PropertyID?.OwnerID || 'N/A'}</td>
                                        <td style={{ color: 'var(--accent)' }}>{b.PropertyID?._id || 'N/A'}</td>
                                        <td>{b.TenantID?._id || 'N/A'}</td>
                                        <td>{b.TenantID?.Name || 'N/A'}</td>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHome;
