import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-icon">🔑</div>
                <h2 className="auth-title">Reset Password</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Enter the email associated with your account and we'll send you a link to reset your password.
                </p>
                <form>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="email"
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                        Send Reset Link
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link to="/login" style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
