import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">RentEase</Link>
            <div className="navbar-links">
                {!user ? (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn btn-outline">Register</Link>
                    </>
                ) : (
                    <>
                        <span className="navbar-user">Hi, {user.Name}</span>
                        <button className="btn btn-danger btn-sm" onClick={handleLogout}>Log Out</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
