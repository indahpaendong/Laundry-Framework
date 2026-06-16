import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const styles = `
    :root {
        --pastel-yellow-light: #FFF9E6; --pastel-yellow: #FFEEB3; --pastel-yellow-medium: #FFE599; --pastel-yellow-dark: #FFD966;
        --text-primary: #5A4A42; --text-secondary: #8B7355; --white-soft: #FFFDF9;
        --shadow-soft: 0 8px 32px rgba(90, 74, 66, 0.08); --shadow-hover: 0 12px 40px rgba(90, 74, 66, 0.12);
        --radius-lg: 24px; --radius-md: 16px; --transition: all 0.3s ease;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, var(--pastel-yellow-light) 0%, var(--pastel-yellow) 50%, var(--pastel-yellow-medium) 100%); min-height: 100vh; color: var(--text-primary); position: relative; overflow-x: hidden; line-height: 1.6; }
    body::before, body::after { content: ''; position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255, 217, 102, 0.15) 0%, transparent 70%); z-index: 0; pointer-events: none; }
    body::before { width: 400px; height: 400px; top: -100px; right: -100px; }
    body::after { width: 300px; height: 300px; bottom: -50px; left: -50px; }
    .navbar { padding: 1rem 0; position: relative; z-index: 10; background: rgba(255, 253, 249, 0.7); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 233, 153, 0.4); }
    .navbar-brand { font-weight: 700; font-size: 1.5rem; color: var(--text-primary) !important; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
    .navbar-brand i { font-size: 1.4rem; color: var(--pastel-yellow-dark); }
    .btn-back { background: var(--white-soft); color: var(--text-primary); border: 2px solid var(--pastel-yellow-dark); padding: 0.5rem 1.25rem; border-radius: 50px; font-weight: 500; font-size: 0.9rem; transition: var(--transition); display: flex; align-items: center; gap: 0.4rem; text-decoration: none; }
    .btn-back:hover { background: var(--pastel-yellow-dark); transform: translateY(-2px); }
    .main-content { position: relative; z-index: 10; min-height: calc(100vh - 76px); display: flex; align-items: center; padding: 2rem 0; }
    .login-card { background: rgba(255, 253, 249, 0.9); backdrop-filter: blur(20px); border-radius: var(--radius-lg); padding: 2.5rem; max-width: 440px; width: 100%; margin: 0 auto; box-shadow: var(--shadow-soft); border: 1px solid rgba(255, 233, 153, 0.6); animation: slideUp 0.6s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .login-header { text-align: center; margin-bottom: 2rem; }
    .login-icon { width: 70px; height: 70px; background: linear-gradient(135deg, var(--pastel-yellow), var(--pastel-yellow-dark)); border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
    .login-icon i { font-size: 1.8rem; color: var(--text-primary); }
    .login-form { width: 100%; }
    .form-field { margin-bottom: 1.15rem; }
    .form-label { display: block; margin-bottom: 0.45rem; font-size: 0.92rem; font-weight: 500; color: var(--text-primary); }
    .input-wrapper { position: relative; width: 100%; }
    .input-wrapper i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary); font-size: 1rem; z-index: 2; pointer-events: none; }
    .login-input { width: 100%; height: 54px; border: 1.5px solid var(--pastel-yellow-medium); border-radius: var(--radius-md); background: var(--pastel-yellow-light); padding: 0 1rem 0 2.8rem; font-family: 'Poppins', sans-serif; font-size: 0.95rem; color: var(--text-primary); outline: none; transition: var(--transition); }
    .login-input:focus { border-color: var(--pastel-yellow-dark); background: var(--white-soft); box-shadow: 0 0 0 4px rgba(255, 217, 102, 0.22); }
    .form-options { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin: 0.25rem 0 1.5rem; }
    .remember-option { display: flex; align-items: center; gap: 0.45rem; margin: 0; color: var(--text-secondary); font-size: 0.9rem; cursor: pointer; }
    .remember-option input { width: 16px; height: 16px; accent-color: var(--pastel-yellow-dark); }
    .forgot-link { color: var(--text-primary); font-size: 0.9rem; font-weight: 500; text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }
    .btn-login { background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); border: none; border-radius: 50px; padding: 1rem; width: 100%; cursor: pointer; color: var(--text-primary); font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: var(--transition); box-shadow: 0 8px 20px rgba(255, 217, 102, 0.35); }
    .btn-login:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(255, 217, 102, 0.45); }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
`;

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Email dan password harus diisi!');
            return;
        }
        setLoading(true);
        try {
            const result = await API.login(email, password);
            if (result.success) {
                API.saveAuth(result.data.token, result.data.admin);
                alert('✅ ' + result.message);
                navigate('/admin-dashboard');
            } else {
                alert('❌ ' + result.message);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Gagal terhubung ke server.');
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <i className="bi bi-basket2-fill"></i><span>LaundryGo</span>
                    </Link>
                    <Link to="/" className="btn-back">
                        <i className="bi bi-arrow-left"></i><span>Kembali</span>
                    </Link>
                </div>
            </nav>

            <main className="main-content">
                <div className="container">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="login-icon"><i className="bi bi-shield-lock"></i></div>
                            <h1>Admin Login</h1>
                            <p>Masuk untuk mengelola sistem LaundryGo</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-field">
                                <label className="form-label" htmlFor="email">Email Admin</label>
                                <div className="input-wrapper">
                                    <i className="bi bi-envelope"></i>
                                    <input type="email" id="email" name="email" className="login-input" placeholder="admin@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label" htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <i className="bi bi-lock"></i>
                                    <input type="password" id="password" name="password" className="login-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-option">
                                    <input type="checkbox" name="remember" />
                                    <span>Ingat saya</span>
                                </label>
                                <a href="#" className="forgot-link">Lupa password?</a>
                            </div>

                            <button type="submit" className="btn-login" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm"></span><span>Memproses...</span></>
                                ) : (
                                    <><i className="bi bi-box-arrow-in-right"></i><span>Masuk Sekarang</span></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;