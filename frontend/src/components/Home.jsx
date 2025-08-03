import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Home = () => {
  const [donorCount, setDonorCount] = useState('Loading...');
  const [bloodGroupCounts, setBloodGroupCounts] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/api/donors')
      .then(res => res.json())
      .then(data => {
        setDonorCount(data.length);

        const counts = {};
        bloodGroups.forEach(bg => (counts[bg] = 0));
        data.forEach(d => {
          if (d.available && counts.hasOwnProperty(d.bloodGroup)) {
            counts[d.bloodGroup]++;
          }
        });
        setBloodGroupCounts(counts);
      })
      .catch(() => {
        setDonorCount('Error loading data');
        setBloodGroupCounts({});
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#f0f0f0', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Hero Section */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ height: '90vh', background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)' }}>
        <h1 className="display-4 fw-bold text-danger mb-3">BloodBridge</h1>
        <p className="lead text-light mb-4">Your Blood Can Save Lives. Join a life-saving network today.</p>
        <div>
          <Link to="/register" className="btn btn-danger me-3 px-4 py-2">🩸 Become a Donor</Link>
          <Link to="/find-donor" className="btn btn-outline-light px-4 py-2">🔍 Find Donors</Link>
        </div>
      </div>

      {/* Donor Stats */}
      <div className="container text-center py-5">
        <h2 className="mb-4">📊 Live Donor Statistics</h2>
        <div className="card bg-dark text-white mx-auto shadow-sm" style={{ maxWidth: '400px' }}>
          <div className="card-body">
            <h5 className="card-title">Total Registered Donors</h5>
            <p className="card-text display-5 fw-bold text-success">{donorCount}</p>
          </div>
        </div>
      </div>

      {/* Live Blood Group Availability */}
<div className="container py-5">
  <h2 className="text-center mb-4">🧬 Blood Group Availability</h2>
  <div className="row text-center">
    {bloodGroups.map((group, i) => {
      const count = bloodGroupCounts[group] || 0;
      const hasDonors = count > 0;
      const bgColor = hasDonors ? '#d4edda' : '#f8d7da'; // light green / light red
      const textColor = hasDonors ? '#155724' : '#721c24';

      return (
        <div key={i} className="col-6 col-md-3 mb-3">
          <div
            className="border rounded py-3 shadow-sm"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              transition: 'background-color 0.3s ease',
            }}
          >
            <h4 className="fw-bold">{group}</h4>
            <p className="mb-0">
              {hasDonors
                ? `🩸 ${count} Donor${count > 1 ? 's' : ''}`
                : '❌ No donors'}
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>


      {/* How It Works */}
      <div className="container py-5">
        <h2 className="text-center mb-4">🧭 How It Works</h2>
        <div className="row text-center text-light">
          <div className="col-md-4 mb-4">
            <div className="bg-dark p-4 border rounded h-100">
              <h4>1. Register</h4>
              <p>Create a donor profile and share your availability and location.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="bg-dark p-4 border rounded h-100">
              <h4>2. Search</h4>
              <p>Recipients search using filters like blood group, location, and proximity.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="bg-dark p-4 border rounded h-100">
              <h4>3. Connect</h4>
              <p>Contact is made via phone or email. Help is just a call away.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5" style={{ background: '#1a1a1a' }}>
        <h2 className="mb-4">Ready to Make a Difference?</h2>
        <Link to="/register" className="btn btn-lg btn-danger px-5 py-2">Register as Donor</Link>
        <p className="mt-3 text-secondary">You could save up to 3 lives with one donation.</p>
      </div>


    </div>
  );
};

export default Home;
