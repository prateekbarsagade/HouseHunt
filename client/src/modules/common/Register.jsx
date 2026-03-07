import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ Name: '', Email: '', Password: '', UserType: 'Tenant' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/users/register', formData);
            localStorage.setItem('user', JSON.stringify(res.data));
            if (res.data.UserType === 'Admin') navigate('/admin');
            else if (res.data.UserType === 'Landlord') navigate('/owner');
            else navigate('/renter');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-icon">📝</div>
                <h2 className="auth-title">Sign Up</h2>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            name="Name"
                            placeholder="Renter Full Name / Owner Name"
                            value={formData.Name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="email"
                            name="Email"
                            placeholder="Email Address"
                            value={formData.Email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="password"
                            name="Password"
                            placeholder="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <select
                            className="form-control"
                            name="UserType"
                            value={formData.UserType}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select User Type</option>
                            <option value="Tenant">Renter</option>
                            <option value="Landlord">Owner</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                        Sign Up
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--warning)' }}>Have an account?</span>{' '}
                    <Link to="/login" style={{ color: 'var(--accent)' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
