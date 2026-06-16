import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const styles = `
    :root {
        --pastel-yellow-light: #FFF9E6; --pastel-yellow: #FFEEB3; --pastel-yellow-medium: #FFE599; --pastel-yellow-dark: #FFD966;
        --text-primary: #5A4A42; --text-secondary: #8B7355; --text-muted: #A8907A; --white-soft: #FFFDF9;
        --danger-red: #FF8A80; --danger-light: #FFEBE9;
        --shadow-soft: 0 8px 32px rgba(90, 74, 66, 0.08); --shadow-hover: 0 12px 40px rgba(90, 74, 66, 0.14);
        --shadow-card: 0 4px 20px rgba(90, 74, 66, 0.07); --radius-lg: 24px; --radius-md: 16px; --radius-sm: 10px;
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
    .form-card { background: rgba(255, 253, 249, 0.9); backdrop-filter: blur(12px); border-radius: var(--radius-lg); padding: var(--spacing-xl); max-width: 900px; margin: 0 auto; border: 1px solid rgba(255, 233, 153, 0.5); box-shadow: var(--shadow-card); }
    .form-header { margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-lg); border-bottom: 2px dashed var(--pastel-yellow-medium); text-align: center; }
    .form-header h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary); display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
    .form-header p { color: var(--text-secondary); margin: 0; font-size: 0.95rem; }
    .form-section { margin-bottom: var(--spacing-xl); }
    .section-title { font-size: 1.1rem; font-weight: 600; margin-bottom: var(--spacing-md); color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; }
    .section-title i { color: var(--pastel-yellow-dark); }
    .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-lg); margin-bottom: var(--spacing-md); }
    .form-group { display: flex; flex-direction: column; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-label { font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary); font-size: 0.9rem; }
    .form-label .required { color: var(--danger-red); }
    .form-control { padding: 0.875rem 1rem; border: 2px solid var(--pastel-yellow-medium); border-radius: var(--radius-md); font-size: 0.95rem; font-family: 'Poppins', sans-serif; background: var(--pastel-yellow-light); transition: var(--transition); color: var(--text-primary); width: 100%; }
    .form-control:focus { outline: none; border-color: var(--pastel-yellow-dark); background: var(--white-soft); box-shadow: 0 0 0 4px rgba(255, 217, 102, 0.15); }
    select.form-control { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3E%3Cpath fill='%238B7355' d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem; }
    textarea.form-control { resize: vertical; min-height: 100px; }
    .form-hint { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem; }
    .form-actions { display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); border-top: 2px dashed var(--pastel-yellow-medium); }
    .btn-cancel { padding: 0.875rem 2rem; border: 2px solid var(--pastel-yellow-medium); background: var(--white-soft); color: var(--text-primary); border-radius: 50px; font-weight: 600; text-decoration: none; transition: var(--transition); display: flex; align-items: center; gap: 0.5rem; font-family: 'Poppins', sans-serif; font-size: 0.95rem; }
    .btn-cancel:hover { background: var(--pastel-yellow); transform: translateY(-2px); }
    .btn-submit { padding: 0.875rem 2.5rem; background: linear-gradient(135deg, var(--pastel-yellow-dark), var(--pastel-yellow-medium)); color: var(--text-primary); border: none; border-radius: 50px; font-weight: 600; cursor: pointer; transition: var(--transition); display: flex; align-items: center; gap: 0.5rem; text-decoration: none; font-family: 'Poppins', sans-serif; font-size: 0.95rem; }
    .btn-submit:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
    @media (max-width: 1199px) { :root { --sidebar-width: 220px; } }
    @media (max-width: 991px) { .sidebar { transform: translateX(-100%); } .sidebar.open { transform: translateX(0); } .main-wrapper { margin-left: 0; } .btn-menu-toggle { display: flex; } }
    @media (max-width: 767px) { .page-content { padding: var(--spacing-md); } .form-card { padding: var(--spacing-lg); } .form-row { grid-template-columns: 1fr; } .form-actions { flex-direction: column; } .btn-cancel, .btn-submit { width: 100%; justify-content: center; } }
    @media (max-width: 575px) { .form-card { padding: var(--spacing-md); } }
`;

function TambahOrder() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // ✅ PERBAIKAN: Tambah field baru di state
    const [formData, setFormData] = useState({
        nama_customer: '', 
        no_hp: '', 
        alamat: '', 
        layanan: '',
        berat: '', 
        harga: 0, 
        status: 'Diproses',
        tanggal_masuk: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
        estimasi_selesai: '', // ✅ BARU
        catatan: '', 
        layanan_antar: 'tidak', 
        kode_promo: ''
    });

    const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };
        if (name === 'berat') {
            const berat = parseFloat(value) || 0;
            newFormData.harga = Math.round(berat * 7000);
        }
        setFormData(newFormData);
    };

    // ✅ PERBAIKAN: Kirim semua field baru ke backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.nama_customer || !formData.no_hp || !formData.berat || !formData.layanan) {
            alert('Mohon lengkapi semua field yang wajib diisi!');
            setLoading(false);
            return;
        }

        // ✅ PERBAIKAN: Payload lengkap dengan semua field
        const payload = {
            nama_customer: formData.nama_customer.trim(),
            no_hp: formData.no_hp.trim(),
            berat: formData.berat,
            harga: formData.harga,
            tanggal: formData.tanggal_masuk, // Sudah format datetime
            estimasi_selesai: formData.estimasi_selesai || null, // ✅ BARU
            layanan: formData.layanan, // ✅ BARU
            catatan: formData.catatan, // ✅ BARU
            status: formData.status
        };

        try {
            const result = await API.post('/orders', payload);
            if (result.success) {
                alert('✅ Order berhasil ditambahkan');
                navigate('/data-order');
            } else {
                alert('❌ ' + (result.message || 'Gagal menambahkan order'));
            }
        } catch (error) {
            console.error(error);
            alert('❌ Gagal terhubung ke backend.');
        } finally {
            setLoading(false);
        }
    };

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
                    <Link to="/admin-dashboard" className="nav-item"><i className="bi bi-grid-1x2-fill"></i><span>Dashboard</span></Link>
                    <Link to="/data-order" className="nav-item"><i className="bi bi-list-check"></i><span>Data Order</span><span className="nav-badge">6</span></Link>
                    <Link to="/tambah-order" className="nav-item active"><i className="bi bi-plus-circle-fill"></i><span>Tambah Order</span></Link>
                </nav>
                <div className="sidebar-footer">
                    <Link to="/login" className="btn-logout"><i className="bi bi-box-arrow-left"></i><span>Keluar</span></Link>
                </div>
            </aside>

            <div className="main-wrapper">
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="btn-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><i className="bi bi-list"></i></button>
                        <div className="page-title">Tambah Order Baru<span>Input pesanan laundry customer</span></div>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-date">{todayDate}</div>
                        <button className="topbar-notif"><i className="bi bi-bell-fill"></i><span className="notif-dot"></span></button>
                    </div>
                </header>

                <main className="page-content">
                    <div className="form-card">
                        <div className="form-header">
                            <h2><i className="bi bi-file-earmark-plus"></i> Informasi Pesanan</h2>
                            <p>Lengkapi data di bawah untuk membuat order baru</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-section">
                                <div className="section-title"><i className="bi bi-person-fill"></i>Data Customer</div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Nama Customer <span className="required">*</span></label>
                                        <input type="text" name="nama_customer" value={formData.nama_customer} onChange={handleInputChange} className="form-control" placeholder="Masukkan nama lengkap" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nomor Telepon <span className="required">*</span></label>
                                        <input type="tel" name="no_hp" value={formData.no_hp} onChange={handleInputChange} className="form-control" placeholder="08xxxxxxxxxx" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label className="form-label">Alamat</label>
                                        <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} className="form-control" placeholder="Masukkan alamat lengkap"></textarea>
                                        <span className="form-hint">Opsional - untuk layanan antar-jemput</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="section-title"><i className="bi bi-bag-fill"></i>Detail Pesanan</div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Layanan <span className="required">*</span></label>
                                        <select name="layanan" value={formData.layanan} onChange={handleInputChange} className="form-control" required>
                                            <option value="">Pilih Layanan</option>
                                            <option value="Cuci Komplit">Cuci Komplit (Cuci + Setrika)</option>
                                            <option value="Cuci Kering">Cuci Kering</option>
                                            <option value="Setrika Saja">Setrika Saja</option>
                                            <option value="Cuci Lipat">Cuci Lipat</option>
                                            <option value="Express">Express (Same Day)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Berat (kg) <span className="required">*</span></label>
                                        <input type="number" step="0.1" name="berat" value={formData.berat} onChange={handleInputChange} className="form-control" placeholder="0.0" required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Harga per Kg (Rp)</label>
                                        <input type="number" name="harga" value={formData.harga} className="form-control" placeholder="0" readOnly style={{ background: 'var(--pastel-yellow)', cursor: 'not-allowed' }} />
                                        <span className="form-hint">Harga otomatis: berat × Rp 7.000</span>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Status <span className="required">*</span></label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="form-control" required>
                                            <option value="Diproses">Diproses</option>
                                            <option value="Dicuci">Dicuci</option>
                                            <option value="Disetrika">Disetrika</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Tanggal & Jam Masuk <span className="required">*</span></label>
                                        <input type="datetime-local" name="tanggal_masuk" value={formData.tanggal_masuk} onChange={handleInputChange} className="form-control" required />
                                        <span className="form-hint">Pilih tanggal dan jam saat order diterima</span>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Estimasi Selesai</label>
                                        <input type="datetime-local" name="estimasi_selesai" value={formData.estimasi_selesai} onChange={handleInputChange} className="form-control" />
                                        <span className="form-hint">Perkiraan waktu laundry selesai</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="section-title"><i className="bi bi-info-circle-fill"></i>Informasi Tambahan</div>
                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label className="form-label">Catatan</label>
                                        <textarea name="catatan" value={formData.catatan} onChange={handleInputChange} className="form-control" placeholder="Catatan khusus dari customer (noda, permintaan khusus, dll)"></textarea>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Layanan Antar-Jemput</label>
                                        <select name="layanan_antar" value={formData.layanan_antar} onChange={handleInputChange} className="form-control">
                                            <option value="tidak">Tidak</option>
                                            <option value="antar">Antar Saja</option>
                                            <option value="jemput">Jemput Saja</option>
                                            <option value="both">Antar & Jemput</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Kode Promo</label>
                                        <input type="text" name="kode_promo" value={formData.kode_promo} onChange={handleInputChange} className="form-control" placeholder="Masukkan kode promo (jika ada)" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <Link to="/data-order" className="btn-cancel"><i className="bi bi-x-lg"></i>Batal</Link>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm"></span><span>Menyimpan...</span></>
                                    ) : (
                                        <><i className="bi bi-check-lg"></i><span>Simpan Order</span></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}

export default TambahOrder;