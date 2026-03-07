import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ Email: '', Password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/users/login', formData);
            localStorage.setItem('user', JSON.stringify(res.data));
            if (res.data.UserType === 'Admin') navigate('/admin');
            else if (res.data.UserType === 'Landlord') navigate('/owner');
            else navigate('/renter');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-icon">🔒</div>
                <h2 className="auth-title">Sign In</h2>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                        Sign In
                    </button>
                </form>

                <div className="form-links">
                    <Link to="/forgot-password" style={{ color: 'var(--warning)' }}>Forgot Password?</Link>
                    <Link to="/register" className="text-accent">Create an Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
