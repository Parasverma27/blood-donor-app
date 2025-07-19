import React, { useEffect, useState } from 'react';

const Home = () => {
  const [donorCount, setDonorCount] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8080/api/donors') // Adjust the URL to your API endpoint
      .then(res => res.json())
      .then(data => setDonorCount(data.length))
      .catch(() => setDonorCount('Error loading data'));
  }, []);

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#f0f0f0' }}>
     

      {/* Hero Section */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ height: '85vh', background: 'linear-gradient(135deg, #1c1c1c, #0f0f0f)' }}>
        <h2 className="display-4 mb-3">Your Blood Can Save Lives</h2>
        <p className="lead text-light mb-4">Join BloodBridge to connect donors with those in urgent need.</p>
        <div>
          <a href="register.html" className="btn btn-danger me-3 px-4 py-2">Become a Donor</a>
          <a href="search.html" className="btn btn-outline-light px-4 py-2">Find Donors</a>
        </div>
      </div>

      {/* Donor Stats Section */}
      <div className="container text-center py-5">
        <h2 className="mb-4">📊 Live Donor Statistics</h2>
        <div className="card bg-dark text-white mx-auto" style={{ maxWidth: '400px' }}>
          <div className="card-body">
            <h5 className="card-title">Total Registered Donors</h5>
            <p className="card-text display-6">{donorCount}</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="container text-center py-5">
        <h2 className="mb-4">Why Donate Blood?</h2>
        <div className="card bg-dark text-white mx-auto" style={{ maxWidth: '800px' }}>
          <div className="card-body">
            <p className="card-text">
              Every 2 seconds, someone in need requires blood. Your donation can save up to 3 lives.
              BloodBridge brings together donors and recipients using technology.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
