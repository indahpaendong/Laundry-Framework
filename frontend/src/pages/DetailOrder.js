import React from 'react';
import { Link } from 'react-router-dom';

const styles = `
    :root {
        --pastel-yellow-light: #FFF9E6; --pastel-yellow: #FFEEB3; --pastel-yellow-medium: #FFE599; --pastel-yellow-dark: #FFD966;
        --text-primary: #5A4A42; --text-secondary: #8B7355; --white-soft: #FFFDF9;
        --shadow-soft: 0 8px 32px rgba(90, 74, 66, 0.08); --radius-lg: 24px; --radius-md: 16px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, var(--pastel-yellow-light), var(--pastel-yellow)); min-height: 100vh; color: var(--text-primary); }
    .navbar { padding: 1rem 0; background: rgba(255,253,249,0.9); backdrop-filter: blur(10px); box-shadow: var(--shadow-soft); }
    .navbar-brand { font-weight: 700; font-size: 1.5rem; color: var(--text-primary) !important; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
    .btn-back { background: var(--white-soft); color: var(--text-primary); border: 2px solid var(--pastel-yellow-dark); padding: 0.5rem 1.25rem; border-radius: 50px; font-weight: 500; text-decoration: none; transition: all 0.3s; display: flex; align-items: center; gap: 0.4rem; }
    .btn-back:hover { background: var(--pastel-yellow-dark); transform: translateY(-2px); }
    .main-content { padding: 3rem 0; }
    .detail-card { background: rgba(255,253,249,0.85); backdrop-filter: blur(20px); border-radius: var(--radius-lg); padding: 2rem; max-width: 600px; margin: 0 auto; box-shadow: var(--shadow-soft); border: 1px solid rgba(255,233,153,0.6); }
    .detail-header { text-align: center; padding-bottom: 1.5rem; border-bottom: 2px dashed var(--pastel-yellow-medium); margin-bottom: 1.5rem; }
    .detail-header h1 { font-weight: 700; font-size: 1.5rem; margin-bottom: 0.5rem; }
    .order-code { background: var(--pastel-yellow); display: inline-block; padding: 0.4rem 1.25rem; border-radius: 50px; font-weight: 600; letter-spacing: 2px; margin-top: 1rem; }
    .detail-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dashed var(--pastel-yellow-medium); }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: var(--text-secondary); font-size: 0.9rem; }
    .detail-value { font-weight: 500; color: var(--text-primary); }
    .detail-total { background: var(--pastel-yellow-light); padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem; display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; }
    .status-badge { padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 500; display: inline-flex; align-items: center; gap: 0.3rem; }
    .status-processing { background: rgba(246,194,62,0.2); color: #b8860b; }
    .timeline { position: relative; padding-left: 2rem; margin-top: 1.5rem; }
    .timeline::before { content: ''; position: absolute; left: 10px; top: 10px; bottom: 10px; width: 3px; background: var(--pastel-yellow-medium); border-radius: 3px; }
    .timeline-item { position: relative; padding-bottom: 1.25rem; opacity: 0.5; }
    .timeline-item.completed { opacity: 1; }
    .timeline-item.active { opacity: 1; }
    .timeline-item::before { content: ''; position: absolute; left: -33px; top: 5px; width: 20px; height: 20px; border-radius: 50%; background: var(--pastel-yellow-medium); border: 4px solid var(--white-soft); }
    .timeline-item.completed::before, .timeline-item.active::before { background: var(--pastel-yellow-dark); box-shadow: 0 0 0 4px rgba(255,217,102,0.3); }
    .timeline-title { font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
    .timeline-time { font-size: 0.75rem; color: var(--text-secondary); font-style: italic; margin-top: 0.25rem; }
    .btn-whatsapp { display: block; width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); color: var(--text-primary); border: none; border-radius: 50px; font-weight: 600; text-align: center; text-decoration: none; margin-top: 1.5rem; transition: all 0.3s; }
    .btn-whatsapp:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(90,74,66,0.12); }
    @media (max-width: 768px) { .detail-card { padding: 1.5rem; margin: 1rem; } .detail-row { flex-direction: column; gap: 0.25rem; } }
`;

function DetailOrder() {
    const orderData = {
        kode: '#ORD-001', tanggalOrder: '15 Januari 2025', layanan: 'Cuci Komplit + Setrika',
        berat: '3.5 Kg', hargaPerKg: 'Rp 10.000', layananTambahan: 'Antar-Jemput (+Rp 5.000)',
        status: 'Diproses', estimasiSelesai: 'Hari Ini, 16:00 WIB', totalBayar: 'Rp 35.000'
    };

    const timelineSteps = [
        { title: 'Order Diterima', time: '15 Jan, 09:30', status: 'completed' },
        { title: 'Proses Pencucian', time: '15 Jan, 11:00', status: 'completed' },
        { title: 'Pengeringan & Setrika', time: 'Sedang berlangsung', status: 'active' },
        { title: 'Siap Diambil', time: '', status: '' },
        { title: 'Selesai', time: '', status: '' }
    ];

    return (
        <>
            <style>{styles}</style>
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="navbar-brand"><i className="bi bi-basket2-fill"></i> LaundryGo</Link>
                    <Link to="/" className="btn-back"><i className="bi bi-arrow-left"></i> Kembali</Link>
                </div>
            </nav>

            <main className="main-content">
                <div className="container">
                    <div className="detail-card">
                        <div className="detail-header">
                            <h1>Detail Pesanan</h1>
                            <div className="order-code">{orderData.kode}</div>
                        </div>

                        <div className="detail-row"><span className="detail-label">Tanggal Order</span><span className="detail-value">{orderData.tanggalOrder}</span></div>
                        <div className="detail-row"><span className="detail-label">Layanan</span><span className="detail-value">{orderData.layanan}</span></div>
                        <div className="detail-row"><span className="detail-label">Berat</span><span className="detail-value">{orderData.berat}</span></div>
                        <div className="detail-row"><span className="detail-label">Harga/Kg</span><span className="detail-value">{orderData.hargaPerKg}</span></div>
                        <div className="detail-row"><span className="detail-label">Layanan Tambahan</span><span className="detail-value">{orderData.layananTambahan}</span></div>
                        <div className="detail-row"><span className="detail-label">Status</span><span className="detail-value"><span className="status-badge status-processing">{orderData.status}</span></span></div>
                        <div className="detail-row"><span className="detail-label">Estimasi Selesai</span><span className="detail-value">{orderData.estimasiSelesai}</span></div>

                        <div className="detail-total"><span>Total Bayar</span><span>{orderData.totalBayar}</span></div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <small style={{ color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: '0.75rem' }}>
                                <i className="bi bi-map"></i> Progress Pesanan:
                            </small>
                            <div className="timeline">
                                {timelineSteps.map((step, index) => (
                                    <div key={index} className={`timeline-item ${step.status}`}>
                                        <div className="timeline-title">{step.title}</div>
                                        {step.time && <div className="timeline-time">{step.time}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <a href="https://wa.me/6281234567890" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-whatsapp"></i> Hubungi Admin via WhatsApp
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}

export default DetailOrder;