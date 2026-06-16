import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    .btn-admin { background: var(--white-soft); color: var(--text-primary); border: 2px solid var(--pastel-yellow-dark); padding: 0.5rem 1.25rem; border-radius: 50px; font-weight: 500; font-size: 0.9rem; transition: var(--transition); display: flex; align-items: center; gap: 0.4rem; text-decoration: none; }
    .btn-admin:hover { background: var(--pastel-yellow-dark); transform: translateY(-2px); box-shadow: var(--shadow-hover); }
    .main-content { position: relative; z-index: 10; min-height: calc(100vh - 76px); display: flex; align-items: center; padding: 2rem 0; }
    .tracking-card { background: rgba(255, 253, 249, 0.9); backdrop-filter: blur(20px); border-radius: var(--radius-lg); padding: 2.5rem; max-width: 480px; width: 100%; margin: 0 auto; box-shadow: var(--shadow-soft); border: 1px solid rgba(255, 233, 153, 0.6); animation: slideUp 0.6s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .tracking-header { margin-bottom: 2rem; text-align: center; }
    .tracking-icon { width: 80px; height: 80px; background: linear-gradient(135deg, var(--pastel-yellow), var(--pastel-yellow-dark)); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: 0 8px 24px rgba(255, 217, 102, 0.3); }
    .tracking-icon i { font-size: 2rem; color: var(--text-primary); }
    .tracking-header h1 { font-weight: 700; font-size: 1.75rem; color: var(--text-primary); margin-bottom: 0.5rem; }
    .tracking-header p { color: var(--text-secondary); font-size: 0.95rem; margin: 0; }
    .form-control { background: var(--white-soft); border: 2px solid var(--pastel-yellow-medium); border-radius: var(--radius-md); padding: 1rem 1.25rem; font-size: 1rem; color: var(--text-primary); transition: var(--transition); text-align: center; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; width: 100%; }
    .form-control::placeholder { color: var(--text-secondary); opacity: 0.7; letter-spacing: 1px; text-transform: none; }
    .form-control:focus { background: var(--white-soft); border-color: var(--pastel-yellow-dark); box-shadow: 0 0 0 4px rgba(255, 217, 102, 0.15); outline: none; }
    .btn-track { background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); color: var(--text-primary); border: none; border-radius: 50px; padding: 1rem; font-weight: 600; font-size: 1rem; transition: var(--transition); display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; box-shadow: 0 4px 16px rgba(255, 217, 102, 0.25); cursor: pointer; }
    .btn-track:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }
    .helper-text { text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed var(--pastel-yellow-medium); }
    .helper-text small { color: var(--text-secondary); font-size: 0.85rem; }
    @media (max-width: 767px) { .tracking-card { padding: 2rem 1.5rem; margin: 1rem; } }
`;

function TrackingPage() {
    const [kodeOrder, setKodeOrder] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/^[A-Za-z0-9]+$/.test(kodeOrder)) {
            alert('Kode order hanya boleh berisi huruf dan angka!');
            return;
        }
        navigate(`/hasil-tracking?kode=${kodeOrder.toUpperCase()}`);
    };

    return (
        <>
            <style>{styles}</style>
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <i className="bi bi-basket2-fill"></i><span>LaundryGo</span>
                    </Link>
                    <Link to="/login" className="btn-admin">
                        <i className="bi bi-person-lock"></i><span>Admin</span>
                    </Link>
                </div>
            </nav>

            <main className="main-content">
                <div className="container">
                    <div className="tracking-card">
                        <div className="tracking-icon"><i className="bi bi-search-heart"></i></div>
                        <div className="tracking-header">
                            <h1>Cek Status Laundry</h1>
                            <p>Masukkan kode unik yang diberikan oleh admin</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input type="text" value={kodeOrder} onChange={(e) => setKodeOrder(e.target.value)} className="form-control" placeholder="LDY001" pattern="[A-Za-z0-9]+" maxLength="10" autoComplete="off" required autoFocus style={{ textTransform: 'uppercase' }} />
                            </div>
                            <button type="submit" className="btn-track">
                                <i className="bi bi-search"></i><span>Cek Status Sekarang</span>
                            </button>
                        </form>

                        <div className="helper-text">
                            <small>Cek nota atau WhatsApp dari admin</small>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default TrackingPage;