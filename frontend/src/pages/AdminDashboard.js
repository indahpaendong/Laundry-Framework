import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const styles = `
    :root {
        --pastel-yellow-light: #FFF9E6; --pastel-yellow: #FFEEB3; --pastel-yellow-medium: #FFE599; --pastel-yellow-dark: #FFD966;
        --text-primary: #5A4A42; --text-secondary: #8B7355; --text-muted: #A8907A; --white-soft: #FFFDF9;
        --success-green: #7FD99B; --success-light: #E8F8EE; --warning-orange: #FFB347; --warning-light: #FFF3E0;
        --info-blue: #7EC8E3; --info-light: #E8F6FB; --danger-red: #FF8A80; --danger-light: #FFEBE9;
        --shadow-soft: 0 8px 32px rgba(90, 74, 66, 0.08); --shadow-hover: 0 12px 40px rgba(90, 74, 66, 0.14);
        --shadow-card: 0 4px 20px rgba(90, 74, 66, 0.07); --radius-lg: 24px; --radius-md: 16px; --radius-sm: 10px; --radius-xs: 6px;
        --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); --sidebar-width: 260px; --topbar-height: 68px;
        --spacing-md: 1rem; --spacing-lg: 1.5rem; --spacing-xl: 2rem;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, var(--pastel-yellow-light) 0%, var(--pastel-yellow) 50%, var(--pastel-yellow-medium) 100%); min-height: 100vh; color: var(--text-primary); overflow-x: hidden; line-height: 1.6; }
    .sidebar { position: fixed; top: 0; left: 0; width: var(--sidebar-width); height: 100vh; background: rgba(255, 253, 249, 0.92); backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 233, 153, 0.6); box-shadow: 4px 0 24px rgba(90, 74, 66, 0.07); display: flex; flex-direction: column; z-index: 200; transition: var(--transition); }
    .sidebar-brand { display: flex; align-items: center; gap: 0.75rem; padding: 1.4rem var(--spacing-lg); border-bottom: 1px solid rgba(255, 233, 153, 0.5); text-decoration: none; min-height: var(--topbar-height); }
    .brand-icon { width: 38px; height: 38px; background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .brand-icon i { font-size: 1.1rem; color: var(--text-primary); }
    .brand-text { font-weight: 700; font-size: 1.15rem; color: var(--text-primary); }
    .brand-text span { font-weight: 400; font-size: 0.72rem; color: var(--text-muted); display: block; }
    .sidebar-admin { display: flex; align-items: center; gap: 0.75rem; padding: 1rem var(--spacing-lg); margin: 0.5rem var(--spacing-md); background: linear-gradient(135deg, var(--pastel-yellow), var(--pastel-yellow-medium)); border-radius: var(--radius-md); }
    .admin-avatar { width: 36px; height: 36px; background: var(--pastel-yellow-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
    .admin-name { font-weight: 600; font-size: 0.88rem; color: var(--text-primary); }
    .admin-role { font-size: 0.72rem; color: var(--text-secondary); }
    .sidebar-nav { flex: 1; padding: 0.5rem var(--spacing-md); overflow-y: auto; }
    .nav-label { font-size: 0.68rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; padding: 0.75rem 0.75rem 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem var(--spacing-md); border-radius: var(--radius-sm); color: var(--text-secondary); text-decoration: none; font-size: 0.92rem; font-weight: 500; transition: var(--transition); margin-bottom: 2px; white-space: nowrap; }
    .nav-item i { font-size: 1.1rem; width: 22px; text-align: center; }
    .nav-item:hover { background: var(--pastel-yellow); color: var(--text-primary); }
    .nav-item.active { background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); color: var(--text-primary); font-weight: 600; }
    .nav-badge { margin-left: auto; background: var(--pastel-yellow-dark); color: var(--text-primary); font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 999px; }
    .sidebar-footer { padding: var(--spacing-md); border-top: 1px solid rgba(255, 233, 153, 0.5); }
    .btn-logout { display: flex; align-items: center; justify-content: center; gap: 0.75rem; width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); background: var(--danger-light); color: var(--danger-red); border: 1.5px solid rgba(255, 138, 128, 0.3); font-size: 0.88rem; font-weight: 600; text-decoration: none; transition: var(--transition); }
    .btn-logout:hover { background: var(--danger-red); color: white; }
    .main-wrapper { margin-left: var(--sidebar-width); min-height: 100vh; display: flex; flex-direction: column; }
    .topbar { position: sticky; top: 0; height: var(--topbar-height); background: rgba(255, 253, 249, 0.88); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 233, 153, 0.5); display: flex; align-items: center; justify-content: space-between; padding: 0 var(--spacing-xl); z-index: 100; gap: var(--spacing-md); }
    .topbar-left { display: flex; align-items: center; gap: var(--spacing-md); }
    .btn-menu-toggle { display: none; width: 38px; height: 38px; background: var(--pastel-yellow); border: none; border-radius: var(--radius-sm); color: var(--text-primary); font-size: 1.2rem; cursor: pointer; }
    .page-title { font-weight: 700; font-size: 1.1rem; color: var(--text-primary); }
    .page-title span { font-weight: 400; font-size: 0.82rem; color: var(--text-muted); display: block; }
    .topbar-right { display: flex; align-items: center; gap: 0.75rem; }
    .topbar-date { font-size: 0.82rem; color: var(--text-muted); background: var(--pastel-yellow-light); padding: 0.3rem 0.9rem; border-radius: 999px; border: 1px solid var(--pastel-yellow-medium); }
    .topbar-notif { width: 38px; height: 38px; background: var(--pastel-yellow); border: none; border-radius: var(--radius-sm); color: var(--text-primary); font-size: 1.1rem; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
    .notif-dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--danger-red); border-radius: 50%; border: 1.5px solid var(--white-soft); }
    .page-content { flex: 1; padding: var(--spacing-xl); }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
    .stat-card { background: rgba(255, 253, 249, 0.9); backdrop-filter: blur(12px); border-radius: var(--radius-lg); padding: var(--spacing-lg); border: 1px solid rgba(255, 233, 153, 0.5); box-shadow: var(--shadow-card); transition: var(--transition); position: relative; overflow: hidden; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .stat-icon { width: 44px; height: 44px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: var(--spacing-md); }
    .stat-card.yellow .stat-icon { background: var(--pastel-yellow); color: var(--text-primary); }
    .stat-card.green .stat-icon { background: var(--success-light); color: #3aad6a; }
    .stat-card.orange .stat-icon { background: var(--warning-light); color: var(--warning-orange); }
    .stat-card.blue .stat-icon { background: var(--info-light); color: #3aa0c0; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
    .stat-label { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; }
    .stat-change { font-size: 0.75rem; font-weight: 600; margin-top: 4px; }
    .stat-change.up { color: #3aad6a; }
    .main-card { background: rgba(255, 253, 249, 0.9); backdrop-filter: blur(12px); border-radius: var(--radius-lg); border: 1px solid rgba(255, 233, 153, 0.5); box-shadow: var(--shadow-card); overflow: hidden; }
    .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-lg) var(--spacing-xl); border-bottom: 1px solid rgba(255, 233, 153, 0.5); gap: var(--spacing-md); flex-wrap: wrap; }
    .card-title { font-weight: 700; font-size: 1.05rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; }
    .card-title i { color: var(--pastel-yellow-dark); }
    .card-subtitle { font-size: 0.8rem; color: var(--text-muted); }
    .card-actions { display: flex; align-items: center; gap: var(--spacing-sm); flex-wrap: wrap; }
    .btn-tambah { display: flex; align-items: center; gap: 0.4rem; background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); color: var(--text-primary); border: none; border-radius: 50px; padding: 0.6rem 1.2rem; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.88rem; text-decoration: none; transition: var(--transition); cursor: pointer; }
    .btn-tambah:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
    .table-responsive { overflow-x: auto; }
    .table-order { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .table-order thead tr { background: linear-gradient(135deg, var(--pastel-yellow-light), var(--pastel-yellow)); border-bottom: 2px solid rgba(255, 217, 102, 0.4); }
    .table-order thead th { padding: var(--spacing-md) var(--spacing-lg); font-weight: 600; font-size: 0.78rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.6px; white-space: nowrap; }
    .table-order tbody tr { border-bottom: 1px solid rgba(255, 233, 153, 0.35); transition: var(--transition); }
    .table-order tbody tr:hover { background: rgba(255, 233, 153, 0.2); }
    .table-order tbody td { padding: var(--spacing-md) var(--spacing-lg); vertical-align: middle; color: var(--text-primary); }
    .order-code { font-weight: 700; font-size: 0.82rem; color: var(--text-secondary); background: var(--pastel-yellow); padding: 3px 8px; border-radius: var(--radius-xs); }
    .customer-cell { display: flex; align-items: center; gap: 0.5rem; }
    .customer-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.78rem; color: var(--text-primary); }
    .customer-name { font-weight: 600; font-size: 0.9rem; }
    .customer-phone { font-size: 0.76rem; color: var(--text-muted); }
    .weight-badge { display: inline-flex; align-items: center; gap: 4px; font-weight: 600; font-size: 0.85rem; }
    .price-cell { font-weight: 700; font-size: 0.88rem; }
    .date-cell { font-size: 0.82rem; color: var(--text-secondary); }
    .status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 999px; font-size: 0.76rem; font-weight: 600; }
    .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-diproses { background: var(--info-light); color: #3aa0c0; }
    .status-diproses .dot { background: #3aa0c0; }
    .status-dicuci { background: #EEF2FF; color: #6366f1; }
    .status-dicuci .dot { background: #6366f1; }
    .status-disetrika { background: var(--warning-light); color: var(--warning-orange); }
    .status-disetrika .dot { background: var(--warning-orange); }
    .status-selesai { background: var(--success-light); color: #3aad6a; }
    .status-selesai .dot { background: #3aad6a; }
    .status-diantar { background: #F3F0FF; color: #7c3aed; }
    .status-diantar .dot { background: #7c3aed; }
    .action-group { display: flex; align-items: center; justify-content: center; gap: 6px; }
    .btn-action { width: 32px; height: 32px; border: none; border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: center; font-size: 0.88rem; text-decoration: none; transition: var(--transition); cursor: pointer; }
    .btn-action i { pointer-events: none; }
    .btn-edit { background: var(--pastel-yellow); color: var(--text-primary); }
    .btn-edit:hover { background: var(--pastel-yellow-dark); }
    .btn-delete { background: var(--danger-light); color: var(--danger-red); }
    .btn-delete:hover { background: var(--danger-red); color: white; }
    .table-footer { display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-md) var(--spacing-xl); border-top: 1px solid rgba(255, 233, 153, 0.4); }
    .table-info { font-size: 0.82rem; color: var(--text-muted); }
    .pagination-custom { display: flex; align-items: center; gap: 5px; }
    .page-btn { width: 32px; height: 32px; border: 1.5px solid var(--pastel-yellow-medium); background: var(--white-soft); border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: center; font-size: 0.82rem; color: var(--text-secondary); text-decoration: none; cursor: pointer; }
    .page-btn:hover, .page-btn.active { background: var(--pastel-yellow-dark); border-color: var(--pastel-yellow-dark); color: var(--text-primary); font-weight: 700; }
    .modal-content { border-radius: var(--radius-lg) !important; border: 1px solid rgba(255, 233, 153, 0.6) !important; }
    .modal-header { background: linear-gradient(135deg, var(--pastel-yellow-light), var(--pastel-yellow)) !important; border-bottom: 1px solid rgba(255, 233, 153, 0.5) !important; }
    .modal-title { font-weight: 700; color: var(--text-primary); }
    .modal-body { padding: var(--spacing-xl); }
    .form-label { font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary); font-size: 0.9rem; }
    .form-control { padding: 0.75rem 1rem; border: 2px solid var(--pastel-yellow-medium); border-radius: var(--radius-md); font-size: 0.95rem; font-family: 'Poppins', sans-serif; background: var(--pastel-yellow-light); transition: var(--transition); color: var(--text-primary); width: 100%; }
    .form-control:focus { outline: none; border-color: var(--pastel-yellow-dark); background: var(--white-soft); box-shadow: 0 0 0 4px rgba(255, 217, 102, 0.15); }
    .form-control[readonly] { background: var(--pastel-yellow); cursor: not-allowed; }
    .modal-footer { border-top: 1px solid rgba(255, 233, 153, 0.5) !important; padding: var(--spacing-md) var(--spacing-xl) !important; }
    .loading-row td { text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic; }
    .empty-row td { text-align: center; padding: 3rem 2rem; color: var(--text-muted); }
    .empty-row i { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
    @media (max-width: 1199px) { :root { --sidebar-width: 220px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .topbar-date { display: none; } }
    @media (max-width: 991px) { .sidebar { transform: translateX(-100%); } .sidebar.open { transform: translateX(0); } .main-wrapper { margin-left: 0; } .btn-menu-toggle { display: flex; } }
    @media (max-width: 767px) { .page-content { padding: var(--spacing-md); } .stats-grid { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); } .stat-value { font-size: 1.5rem; } .card-header-custom { padding: var(--spacing-md); flex-direction: column; align-items: flex-start; } .card-actions { width: 100%; } .btn-tambah { width: 100%; justify-content: center; } .col-hide-sm { display: none; } }
    @media (max-width: 575px) { .stats-grid { grid-template-columns: 1fr 1fr; } .stat-card { padding: var(--spacing-md); } .stat-value { font-size: 1.35rem; } }
`;

const statusClassMap = { 'Diproses': 'status-diproses', 'Dicuci': 'status-dicuci', 'Disetrika': 'status-disetrika', 'Selesai': 'status-selesai', 'Diantar': 'status-diantar' };
const getInitials = (name) => String(name || '').split(' ').map(w => w.charAt(0)).join('').substring(0, 2).toUpperCase();
const formatRupiah = (angka) => 'Rp ' + Number(angka || 0).toLocaleString('id-ID');
const formatTanggal = (dateString) => { if (!dateString) return '-'; const d = new Date(dateString); if (isNaN(d.getTime())) return dateString; return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); };

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id: '', kode: '', nama_customer: '', no_hp: '', berat: '', harga: '', tanggal: '', status: 'Diproses' });

    const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

    useEffect(() => { loadDashboardOrders(); }, []);

    const loadDashboardOrders = async () => {
        setLoading(true); setError(null);
        try {
            const result = await API.get('/orders');
            if (!result.success) throw new Error(result.message || 'Gagal mengambil data');
            setOrders(result.data || []);
        } catch (error) { console.error('❌ Fetch error:', error); setError(error.message); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id, kode) => {
        if (!window.confirm(`Yakin hapus order ${kode}?`)) return;
        try {
            const result = await API.delete(`/orders/${id}`);
            if (result.success) { alert('✅ Order dihapus'); loadDashboardOrders(); }
            else alert('❌ ' + (result.message || 'Gagal'));
        } catch (e) { alert('❌ Gagal terhubung ke backend'); }
    };

    const openEditModal = (id) => {
        const order = orders.find(o => o.id == id);
        if (!order) return alert('Data tidak ditemukan');
        setEditData({ id: order.id, kode: order.kode || '', nama_customer: order.nama_customer || '', no_hp: order.no_hp || '', berat: order.berat || '', harga: order.harga || '', tanggal: order.tanggal ? order.tanggal.split('T')[0] : '', status: order.status || 'Diproses' });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        let newEditData = { ...editData, [name]: value };
        if (name === 'berat') newEditData.harga = Math.round((parseFloat(value) || 0) * 7000);
        setEditData(newEditData);
    };

    const handleSaveEdit = async () => {
        const berat = parseFloat(editData.berat) || 0;
        const payload = { nama_customer: editData.nama_customer.trim(), no_hp: editData.no_hp.trim(), berat: berat, harga: Math.round(berat * 7000), tanggal: editData.tanggal, status: editData.status };
        try {
            const result = await API.put(`/orders/${editData.id}`, payload);
            if (result.success) { alert('✅ Order diperbarui'); setShowEditModal(false); loadDashboardOrders(); }
            else alert('❌ ' + (result.message || 'Gagal'));
        } catch (e) { alert('❌ Gagal terhubung ke backend'); }
    };

    const stats = {
        total: orders.length,
        selesai: orders.filter(o => o.status === 'Selesai').length,
        diproses: orders.filter(o => o.status !== 'Selesai').length,
    pendapatan: orders.reduce((t, o) => t + Number(o.harga || 0), 0)
};

    const latestOrders = orders.slice(0, 5);

    return (
        <>
            <style>{styles}</style>
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <Link to="/admin-dashboard" className="sidebar-brand">
                    <div className="brand-icon"><i className="bi bi-basket2-fill"></i></div>
                    <div className="brand-text">LaundryGo<span>Admin Panel</span></div>
                </Link>
                <div className="sidebar-admin">
                    <div className="admin-avatar">A</div>
                    <div><div className="admin-name">Admin Utama</div><div className="admin-role">Administrator</div></div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-label">Menu Utama</div>
                    <Link to="/admin-dashboard" className="nav-item active"><i className="bi bi-grid-1x2-fill"></i><span>Dashboard</span></Link>
                    <Link to="/data-order" className="nav-item"><i className="bi bi-list-check"></i><span>Data Order</span><span className="nav-badge">{orders.length}</span></Link>
                    <Link to="/tambah-order" className="nav-item"><i className="bi bi-plus-circle-fill"></i><span>Tambah Order</span></Link>
                </nav>
                <div className="sidebar-footer">
                    <Link to="/login" className="btn-logout"><i className="bi bi-box-arrow-left"></i><span>Keluar</span></Link>
                </div>
            </aside>

            <div className="main-wrapper">
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="btn-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><i className="bi bi-list"></i></button>
                        <div className="page-title">Dashboard Admin<span>Selamat datang kembali, Admin 👋</span></div>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-date">{todayDate}</div>
                        <button className="topbar-notif"><i className="bi bi-bell-fill"></i><span className="notif-dot"></span></button>
                    </div>
                </header>

                <main className="page-content">
                    <div className="stats-grid">
                        <div className="stat-card yellow"><div className="stat-icon"><i className="bi bi-bag-fill"></i></div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Order</div><div className="stat-change up"><i className="bi bi-arrow-up-short"></i> Hari ini</div></div>
                        <div className="stat-card green"><div className="stat-icon"><i className="bi bi-check-circle-fill"></i></div><div className="stat-value">{stats.selesai}</div><div className="stat-label">Selesai</div><div className="stat-change up"><i className="bi bi-arrow-up-short"></i> +2 order</div></div>
                        <div className="stat-card orange"><div className="stat-icon"><i className="bi bi-hourglass-split"></i></div><div className="stat-value">{stats.diproses}</div><div className="stat-label">Diproses</div><div className="stat-change neutral">Sedang berjalan</div></div>
                        <div className="stat-card blue"><div className="stat-icon"><i className="bi bi-cash-coin"></i></div><div className="stat-value">{Math.round(stats.pendapatan / 1000)}k</div><div className="stat-label">Pendapatan</div><div className="stat-change up"><i className="bi bi-arrow-up-short"></i> Hari ini</div></div>
                    </div>

                    <div className="main-card">
                        <div className="card-header-custom">
                            <div>
                                <div className="card-title"><i className="bi bi-clock-history"></i>Order Terbaru</div>
                                <div className="card-subtitle">{loading ? 'Memuat data...' : `${orders.length} pesanan ditemukan`} • <Link to="/data-order" style={{ color: 'var(--pastel-yellow-dark)', textDecoration: 'none', fontWeight: 600 }}>Lihat Semua →</Link></div>
                            </div>
                            <div className="card-actions">
                                <Link to="/tambah-order" className="btn-tambah"><i className="bi bi-plus-lg"></i>Tambah Order</Link>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table-order">
                                <thead><tr><th>Kode</th><th>Customer</th><th>Berat</th><th className="col-hide-sm">Harga</th><th className="col-hide-sm">Tanggal</th><th>Status</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    {loading ? (
                                        <tr className="loading-row"><td colSpan="7">Memuat data order...</td></tr>
                                    ) : error ? (
                                        <tr className="empty-row"><td colSpan="7"><i className="bi bi-wifi-off"></i><br/>Gagal memuat data.</td></tr>
                                    ) : latestOrders.length === 0 ? (
                                        <tr className="empty-row"><td colSpan="7"><i className="bi bi-inbox"></i><br/>Belum ada order.</td></tr>
                                    ) : (
                                        latestOrders.map(order => {
                                            const cls = statusClassMap[order.status] || 'status-diproses';
                                            return (
                                                <tr key={order.id}>
                                                    <td><span className="order-code">{order.kode || '-'}</span></td>
                                                    <td><div className="customer-cell"><div className="customer-avatar">{getInitials(order.nama_customer)}</div><div><div className="customer-name">{order.nama_customer || '-'}</div><div className="customer-phone">{order.no_hp || '-'}</div></div></div></td>
                                                    <td><span className="weight-badge"><i className="bi bi-speedometer2"></i>{Number(order.berat || 0).toFixed(1)} kg</span></td>
                                                    <td className="price-cell col-hide-sm">{formatRupiah(order.harga)}</td>
                                                    <td className="date-cell col-hide-sm">{formatTanggal(order.tanggal)}</td>
                                                    <td><span className={`status-badge ${cls}`}><span className="dot"></span>{order.status || '-'}</span></td>
                                                    <td><div className="action-group">
                                                        <button className="btn-action btn-edit" title="Edit" onClick={() => openEditModal(order.id)}><i className="bi bi-pencil-fill"></i></button>
                                                        <button className="btn-action btn-delete" title="Hapus" onClick={() => handleDelete(order.id, order.kode)}><i className="bi bi-trash3-fill"></i></button>
                                                    </div></td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer">
                            <div className="table-info">{loading ? '-' : `Menampilkan ${latestOrders.length} dari ${orders.length} order`}</div>
                            <div className="pagination-custom"><Link to="/data-order" className="page-btn">Lihat Semua <i className="bi bi-arrow-right"></i></Link></div>
                        </div>
                    </div>
                </main>
            </div>

            {showEditModal && (
                <>
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Order</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="mb-3"><label className="form-label">Kode Order</label><input type="text" value={editData.kode} className="form-control" readOnly /></div>
                                        <div className="mb-3"><label className="form-label">Nama Customer</label><input type="text" name="nama_customer" value={editData.nama_customer} onChange={handleEditChange} className="form-control" /></div>
                                        <div className="mb-3"><label className="form-label">No HP</label><input type="text" name="no_hp" value={editData.no_hp} onChange={handleEditChange} className="form-control" /></div>
                                        <div className="mb-3"><label className="form-label">Berat</label><input type="number" step="0.1" name="berat" value={editData.berat} onChange={handleEditChange} className="form-control" /></div>
                                        <div className="mb-3"><label className="form-label">Harga</label><input type="number" name="harga" value={editData.harga} className="form-control" readOnly style={{ background: 'var(--pastel-yellow)', cursor: 'not-allowed' }} /></div>
                                        <div className="mb-3"><label className="form-label">Tanggal</label><input type="text" name="tanggal" value={editData.tanggal} onChange={handleEditChange} className="form-control" placeholder="YYYY-MM-DD" /></div>
                                        <div className="mb-3"><label className="form-label">Status</label>
                                            <select name="status" value={editData.status} onChange={handleEditChange} className="form-control">
                                                <option value="Diproses">Diproses</option><option value="Dicuci">Dicuci</option>
                                                <option value="Disetrika">Disetrika</option><option value="Selesai">Selesai</option><option value="Diantar">Diantar</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setShowEditModal(false)}>Batal</button>
                                    <button type="button" className="btn" onClick={handleSaveEdit} style={{ background: 'var(--pastel-yellow-dark)', color: 'var(--text-primary)', fontWeight: 600 }}>Simpan Perubahan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
}

export default AdminDashboard;