import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const donor = JSON.parse(localStorage.getItem('loggedInDonor'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!donor) {
      alert('You are not logged in!');
      navigate('/login');
    }
  }, [donor, navigate]);

  const deleteAccount = async () => {
    if (!donor?.id) {
      alert('Login required or donor ID missing.');
      return;
    }
    if (!window.confirm('⚠️ Are you sure you want to delete your account? This cannot be undone.')) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/donors/delete/${donor.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('✅ Account deleted successfully.');
        localStorage.removeItem('loggedInDonor');
        navigate('/home');
      } else {
        alert('❌ Failed to delete your account.');
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('loggedInDonor');
    alert('👋 You have been logged out.');
    navigate('/home');
  };

  if (!donor) return null;

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🩸 BloodLink</div>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => navigate('/edit-profile')}>✏️ Edit Profile</button>
          <button style={styles.navButton} onClick={logout}>🚪 Logout</button>
          <button style={{ ...styles.navButton, color: '#ff4b5c' }} onClick={deleteAccount}>
            {loading ? 'Deleting...' : '🗑️ Delete Account'}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Welcome back, <span style={styles.highlight}>{donor.name}</span></h1>
          <p style={styles.subText}>Here’s a quick overview of your donor profile.</p>
        </header>

        <section style={styles.grid}>
          <InfoCard label="Blood Group" value={donor.bloodGroup} icon="🩸" />
          <InfoCard label="Contact" value={donor.contact} icon="📞" />
          <InfoCard label="Email" value={donor.email} icon="📧" />
          <InfoCard label="City" value={donor.city} icon="🏙️" />
          <InfoCard label="State" value={donor.state} icon="🗺️" />
          <InfoCard label="Address" value={donor.address} icon="📍" />
          <InfoCard label="Available" value={donor.available ? '✅ Yes' : '❌ No'} icon="🔄" />
          <InfoCard label="Badge Level" value={donor.badgeLevel || 'None'} icon="🎖️" />
          <InfoCard label="Donations" value={donor.donationCount ?? 0} icon="📦" />
          <InfoCard label="Reputation" value={donor.reputationScore ?? 0} icon="⭐" />
          <InfoCard label="Last Donation" value={donor.lastDonationDate || 'N/A'} icon="🕓" />
          <InfoCard label="Location" value={`${donor.latitude ?? '-'}, ${donor.longitude ?? '-'}`} icon="🧭" />
        </section>
      </main>
    </div>
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div style={styles.card}>
    <div style={styles.cardIcon}>{icon}</div>
    <div>
      <div style={styles.cardLabel}>{label}</div>
      <div style={styles.cardValue}>{value || 'N/A'}</div>
    </div>
  </div>
);

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: '#f0f0f0',
    fontFamily: "'Segoe UI', sans-serif",
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#1c1c1c',
    padding: '20px',
    borderRight: '1px solid #2c2c2c',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ff4b5c',
    marginBottom: '40px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#f0f0f0',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '10px 0',
    transition: 'color 0.3s ease',
  },
  main: {
    flexGrow: 1,
    padding: '40px',
  },
  header: {
    marginBottom: '30px',
  },
  pageTitle: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  highlight: {
    color: '#ffd166',
  },
  subText: {
    fontSize: '1rem',
    color: '#aaa',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#1e1e1e',
    border: '1px solid #2e2e2e',
    padding: '20px',
    borderRadius: '8px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: '1.5rem',
  },
  cardLabel: {
    fontSize: '0.9rem',
    color: '#bbb',
  },
  cardValue: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginTop: '2px',
  },
};

export default DonorDashboard;
