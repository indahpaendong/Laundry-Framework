import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const styles = `
    :root {
        --pastel-yellow-light: #FFF9E6; --pastel-yellow: #FFEEB3; --pastel-yellow-medium: #FFE599; --pastel-yellow-dark: #FFD966;
        --text-primary: #5A4A42; --text-secondary: #8B7355; --white-soft: #FFFDF9;
        --shadow-soft: 0 8px 32px rgba(90, 74, 66, 0.08); --shadow-hover: 0 12px 40px rgba(90, 74, 66, 0.12);
        --radius-lg: 24px; --radius-md: 16px; --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, var(--pastel-yellow-light) 0%, var(--pastel-yellow) 50%, var(--pastel-yellow-medium) 100%); min-height: 100vh; color: var(--text-primary); position: relative; overflow-x: hidden; }
    body::before, body::after { content: ''; position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255, 217, 102, 0.15) 0%, transparent 70%); z-index: 0; pointer-events: none; }
    body::before { width: 400px; height: 400px; top: -100px; right: -100px; }
    body::after { width: 300px; height: 300px; bottom: -50px; left: -50px; }
    .navbar { padding: 1rem 0; position: relative; z-index: 10; background: rgba(255, 253, 249, 0.7); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 233, 153, 0.4); }
    .navbar-brand { font-weight: 700; font-size: 1.5rem; color: var(--text-primary) !important; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
    .navbar-brand i { font-size: 1.4rem; color: var(--pastel-yellow-dark); }
    .btn-home { background: var(--white-soft); color: var(--text-primary); border: 2px solid var(--pastel-yellow-dark); padding: 0.5rem 1.25rem; border-radius: 50px; font-weight: 500; font-size: 0.9rem; transition: var(--transition); display: flex; align-items: center; gap: 0.4rem; text-decoration: none; }
    .btn-home:hover { background: var(--pastel-yellow-dark); transform: translateY(-2px); box-shadow: var(--shadow-hover); }
    .main-content { position: relative; z-index: 10; min-height: calc(100vh - 76px); padding: 3rem 0; }
    .result-card { background: rgba(255, 253, 249, 0.85); backdrop-filter: blur(20px); border-radius: var(--radius-lg); padding: 2.5rem; max-width: 700px; width: 100%; margin: 0 auto; box-shadow: var(--shadow-soft); border: 1px solid rgba(255, 233, 153, 0.6); animation: slideUp 0.6s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .status-header { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px dashed var(--pastel-yellow-medium); }
    .status-icon { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 3rem; animation: bounce 2s infinite; }
    @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
    .status-icon.processing { background: linear-gradient(135deg, #f6c23e, #f39c12); box-shadow: 0 8px 24px rgba(246, 194, 62, 0.4); }
    .status-icon.completed { background: linear-gradient(135deg, #1cc88a, #17a673); box-shadow: 0 8px 24px rgba(28, 200, 138, 0.4); }
    .status-icon.pending { background: linear-gradient(135deg, #4e73df, #3a5eca); box-shadow: 0 8px 24px rgba(78, 115, 223, 0.4); }
    .status-icon i { color: white; }
    .status-header h1 { font-weight: 700; font-size: 1.75rem; color: var(--text-primary); margin-bottom: 0.5rem; }
    .status-header p { color: var(--text-secondary); font-size: 1rem; margin: 0; }
    .order-code { background: var(--pastel-yellow); display: inline-block; padding: 0.5rem 1.5rem; border-radius: 50px; font-weight: 600; font-size: 1.1rem; color: var(--text-primary); margin-top: 1rem; letter-spacing: 2px; }
    .order-details { margin-bottom: 2rem; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section-title { font-weight: 600; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .detail-item { background: var(--white-soft); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--pastel-yellow-medium); }
    .detail-label { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.3rem; }
    .detail-value { font-weight: 600; color: var(--text-primary); font-size: 1rem; }
    .timeline-container { background: var(--white-soft); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--pastel-yellow-medium); }
    .timeline { position: relative; padding-left: 2.5rem; }
    .timeline::before { content: ''; position: absolute; left: 10px; top: 10px; bottom: 10px; width: 3px; background: var(--pastel-yellow-medium); border-radius: 3px; }
    .timeline-item { position: relative; padding-bottom: 1.5rem; opacity: 0.5; transition: var(--transition); }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-item.completed { opacity: 1; }
    .timeline-item.active { opacity: 1; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
    .timeline-item::before { content: ''; position: absolute; left: -33px; top: 5px; width: 20px; height: 20px; border-radius: 50%; background: var(--pastel-yellow-medium); border: 4px solid var(--white-soft); transition: var(--transition); }
    .timeline-item.completed::before { background: var(--pastel-yellow-dark); box-shadow: 0 0 0 4px rgba(255, 217, 102, 0.3); }
    .timeline-item.active::before { background: var(--pastel-yellow-dark); box-shadow: 0 0 0 4px rgba(255, 217, 102, 0.5); }
    .timeline-item::after { content: '✓'; position: absolute; left: -26px; top: 5px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; color: white; opacity: 0; transition: var(--transition); }
    .timeline-item.completed::after { opacity: 1; }
    .timeline-item.active::after { content: '●'; opacity: 1; font-size: 0.5rem; }
    .timeline-title { font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
    .timeline-desc { font-size: 0.85rem; color: var(--text-secondary); }
    .timeline-time { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; font-style: italic; }
    .action-buttons { display: flex; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 2px dashed var(--pastel-yellow-medium); }
    .btn-action { flex: 1; padding: 1rem; border-radius: 50px; font-weight: 600; font-size: 1rem; transition: var(--transition); display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; }
    .btn-primary-action { background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); color: var(--text-primary); border: none; box-shadow: 0 4px 16px rgba(255, 217, 102, 0.25); }
    .btn-primary-action:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); color: var(--text-primary); }
    .btn-secondary-action { background: var(--white-soft); color: var(--text-primary); border: 2px solid var(--pastel-yellow-dark); }
    .btn-secondary-action:hover { background: var(--pastel-yellow); color: var(--text-primary); transform: translateY(-3px); }
    .footer { text-align: center; padding: 2rem; color: var(--text-secondary); font-size: 0.85rem; position: relative; z-index: 10; }
    .footer a { color: var(--text-primary); text-decoration: none; font-weight: 500; }
    .footer a:hover { text-decoration: underline; }
    @media (max-width: 768px) { .result-card { padding: 2rem 1.5rem; margin: 1rem; } .detail-grid { grid-template-columns: 1fr; } .action-buttons { flex-direction: column; } .timeline { padding-left: 2rem; } }
`;

// ✅ PERBAIKAN: Format datetime dengan benar (tanpa konversi timezone yang salah)
const formatRupiah = (angka) => 'Rp ' + Number(angka || 0).toLocaleString('id-ID');

const formatTanggal = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatJam = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB';
};

const formatEstimasi = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    return `${tanggal}, ${jam} WIB`;
};

const getStatusText = (status) => { 
    if (status === 'Selesai') return 'Selesai'; 
    if (status === 'Dicuci') return 'Sedang Dicuci'; 
    if (status === 'Disetrika') return 'Sedang Disetrika'; 
    if (status === 'Diantar') return 'Sedang Diantar'; 
    return 'Sedang Diproses'; 
};

const getStatusDesc = (status) => { 
    if (status === 'Selesai') return 'Laundry Anda sudah selesai'; 
    if (status === 'Dicuci') return 'Laundry Anda sedang dalam proses pencucian'; 
    if (status === 'Disetrika') return 'Laundry Anda sedang disetrika'; 
    if (status === 'Diantar') return 'Laundry Anda sedang dalam proses pengantaran'; 
    return 'Laundry Anda sedang dalam proses pengerjaan'; 
};

const getStatusIcon = (status) => { 
    if (status === 'Selesai') return { icon: 'bi-check-circle-fill', class: 'completed' }; 
    if (status === 'Diantar') return { icon: 'bi-truck', class: 'completed' }; 
    if (status === 'Dicuci' || status === 'Disetrika') return { icon: 'bi-droplet-fill', class: 'processing' }; 
    return { icon: 'bi-hourglass-split', class: 'processing' }; 
};

function HasilTracking() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const kode = searchParams.get('kode');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!kode) { 
            alert('Kode order tidak ditemukan di URL.'); 
            navigate('/'); 
            return; 
        }
        loadTrackingResult();
    }, [kode]);

    const loadTrackingResult = async () => {
        setLoading(true);
        try {
            const result = await API.get(`/track?kode=${encodeURIComponent(kode)}`);
            if (!result.success) { 
                alert(result.message || 'Data order tidak ditemukan'); 
                navigate('/'); 
                return; 
            }
            setOrder(result.data);
        } catch (error) { 
            console.error(error); 
            alert('Gagal terhubung ke backend.'); 
        } finally { 
            setLoading(false); 
        }
    };

    const timelineSteps = [
        { title: 'Pesanan Diterima', desc: 'Laundry telah diterima oleh admin' },
        { title: 'Proses Pencucian', desc: 'Pakaian sedang dicuci' },
        { title: 'Pengeringan & Setrika', desc: 'Pakaian sedang dikeringkan dan disetrika' },
        { title: 'Siap Diambil', desc: 'Laundry sudah selesai dan siap diambil' },
        { title: 'Selesai', desc: 'Laundry telah diambil oleh customer' }
    ];

    const getActiveTimelineIndex = (status) => {
        if (status === 'Diproses') return 1; 
        if (status === 'Dicuci') return 1;
        if (status === 'Disetrika') return 2; 
        if (status === 'Diantar') return 3;
        if (status === 'Selesai') return 4; 
        return 0;
    };

    if (loading) return (
        <div className="main-content" style={{ textAlign: 'center', padding: '5rem' }}>
            <h2>Memuat data tracking...</h2>
        </div>
    );
    
    if (!order) return null;

    const statusInfo = getStatusIcon(order.status);
    const activeIndex = getActiveTimelineIndex(order.status);

    return (
        <>
            <style>{styles}</style>
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <i className="bi bi-basket2-fill"></i>LaundryGo
                    </Link>
                    <Link to="/" className="btn-home">
                        <i className="bi bi-house-door"></i>Cek Lagi
                    </Link>
                </div>
            </nav>

            <main className="main-content">
                <div className="container">
                    <div className="result-card">
                        <div className="status-header">
                            <div className={`status-icon ${statusInfo.class}`}>
                                <i className={`bi ${statusInfo.icon}`}></i>
                            </div>
                            <h1>{getStatusText(order.status)}</h1>
                            <p>{getStatusDesc(order.status)}</p>
                            <div className="order-code">{order.kode}</div>
                        </div>

                        <div className="order-details">
                            <div className="detail-section">
                                <div className="detail-section-title">
                                    <i className="bi bi-receipt"></i>Detail Pesanan
                                </div>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <i className="bi bi-calendar"></i> Tanggal Masuk
                                        </div>
                                        <div className="detail-value">
                                            {formatTanggal(order.tanggal)}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <i className="bi bi-clock"></i> Jam Masuk
                                        </div>
                                        <div className="detail-value">
                                            {formatJam(order.tanggal)}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <i className="bi bi-basket"></i> Layanan
                                        </div>
                                        <div className="detail-value">
                                            {order.layanan || 'Cuci Komplit'}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <i className="bi bi-speedometer2"></i> Berat
                                        </div>
                                        <div className="detail-value">
                                            {Number(order.berat || 0).toFixed(1)} Kg
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <i className="bi bi-cash-coin"></i> Total Harga
                                        </div>
                                        <div className="detail-value">
                                            {formatRupiah(order.harga)}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <i className="bi bi-clock-history"></i> Estimasi Selesai
                                        </div>
                                        <div className="detail-value">
                                            {formatEstimasi(order.estimasi_selesai)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <div className="detail-section-title">
                                    <i className="bi bi-map"></i>Tracking Progress
                                </div>
                                <div className="timeline-container">
                                    <div className="timeline">
                                        {timelineSteps.map((step, index) => {
                                            let statusClass = '';
                                            if (index < activeIndex) statusClass = 'completed';
                                            else if (index === activeIndex) statusClass = 'active';
                                            return (
                                                <div key={index} className={`timeline-item ${statusClass}`}>
                                                    <div className="timeline-title">{step.title}</div>
                                                    <div className="timeline-desc">{step.desc}</div>
                                                    {statusClass === 'completed' && (
                                                        <div className="timeline-time">Selesai</div>
                                                    )}
                                                    {statusClass === 'active' && (
                                                        <div className="timeline-time">Sedang berlangsung</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <a 
                                href="https://wa.me/6281234567890" 
                                className="btn-action btn-secondary-action" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-whatsapp"></i>Hubungi Admin
                            </a>
                            <Link to="/" className="btn-action btn-primary-action">
                                <i className="bi bi-arrow-clockwise"></i>Cek Pesanan Lain
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>
                    <a href="#">Butuh bantuan?</a> | <a href="#">Hubungi Kami</a>
                </p>
            </footer>
        </>
    );
}

export default HasilTracking;