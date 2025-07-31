import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const donor = JSON.parse(localStorage.getItem('loggedInDonor'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!donor) {
      // Optionally replace alert with toast
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
    <div style={styles.body}>
      <h2 style={styles.heading}>
        👋 Welcome, <span>{donor.name || 'Donor'}</span>
      </h2>

      <div style={styles.card}>
  <h3 style={styles.cardTitle}>Your Donor Details</h3>
  <p><strong>Name:</strong> {donor.name || 'N/A'}</p>
  <p><strong>Blood Group:</strong> {donor.bloodGroup || 'N/A'}</p>
  <p><strong>Contact:</strong> {donor.contact || 'N/A'}</p>
  <p><strong>Email:</strong> {donor.email || 'N/A'}</p>
  <p><strong>Address:</strong> {donor.address || 'N/A'}</p>
  <p><strong>City:</strong> {donor.city || 'N/A'}</p>
  <p><strong>State:</strong> {donor.state || 'N/A'}</p>
  <p><strong>Latitude:</strong> {donor.latitude ?? 'Not set'}</p>
  <p><strong>Longitude:</strong> {donor.longitude ?? 'Not set'}</p>
  <p><strong>Available for Donation:</strong> {donor.available ? '✅ Yes' : '❌ No'}</p>
  <p><strong>Badge Level:</strong> {donor.badgeLevel || 'None'}</p>
  <p><strong>Donation Count:</strong> {donor.donationCount ?? 0}</p>
  <p><strong>Last Donation Date:</strong> {donor.lastDonationDate || 'N/A'}</p>
  <p><strong>Reputation Score:</strong> {donor.reputationScore ?? 0}</p>
</div>


      <div style={styles.btnGroup}>
        <button
          style={styles.button}
          onClick={() => navigate('/edit-profile')}
          disabled={loading}
        >
          ✏️ Edit My Profile
        </button>

        <button
          style={{ ...styles.button, backgroundColor: '#d63939' }}
          onClick={deleteAccount}
          disabled={loading}
        >
          {loading ? 'Deleting...' : '🗑️ Delete My Account'}
        </button>

        <button
          style={styles.button}
          onClick={logout}
          disabled={loading}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#0e0e0e',
    color: '#f4f4f4',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    color: '#e63946',
    marginBottom: '30px',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1d1d1d',
    padding: '25px',
    borderRadius: '10px',
    maxWidth: '450px',
    width: '100%',
    border: '1px solid #333',
    boxShadow: '0 0 12px rgba(255, 0, 0, 0.1)',
    marginBottom: '25px',
  },
  cardTitle: {
    color: '#ff4b5c',
    marginTop: 0,
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '450px',
  },
  button: {
    backgroundColor: '#ff4b5c',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    textAlign: 'center',
  },
};

export default DonorDashboard;
