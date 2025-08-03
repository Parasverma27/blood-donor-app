import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const stateCityData = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  "Assam": ["Guwahati", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya"],
  "Chhattisgarh": ["Raipur", "Bilaspur"],
  "Goa": ["Panaji", "Margao"],
  "Gujarat": ["Ahmedabad", "Surat"],
  "Haryana": ["Gurgaon", "Faridabad"],
  "Himachal Pradesh": ["Shimla", "Dharamshala"],
  "Jharkhand": ["Ranchi", "Jamshedpur"],
  "Karnataka": ["Bengaluru", "Mysuru"],
  "Kerala": ["Kochi", "Thiruvananthapuram"],
  "Madhya Pradesh": ["Bhopal", "Indore"],
  "Maharashtra": ["Mumbai", "Pune"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack"],
  "Punjab": ["Ludhiana", "Amritsar"],
  "Rajasthan": ["Jaipur", "Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Varanasi"],
  "Uttarakhand": ["Dehradun", "Haridwar"],
  "West Bengal": ["Kolkata", "Howrah"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman"],
  "Delhi": ["New Delhi", "South Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry"]
};

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    requesterName: '',
    bloodGroup: '',
    contact: '',
    state: '',
    city: '',
    latitude: '',
    longitude: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCoordinates = async (state, city) => {
    const query = `${city}, ${state}, India`;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return { latitude: '', longitude: '' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { latitude, longitude } = await getCoordinates(formData.state, formData.city);
    const requestData = { ...formData, latitude, longitude };

    try {
      const response = await fetch('http://localhost:8080/api/requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      const result = await response.text();
      setMessage(response.ok ? `✅ ${result}` : `❌ Error: ${result}`);
    } catch (error) {
      console.error('Request error:', error);
      setMessage('❌ Network or server error.');
    }
  };

  return (
    <>
      <style>{`
        .form-control::placeholder, .form-select::placeholder {
          color: #ccc !important;
        }
        .form-select {
          background-color: #1e1e1e !important;
          color: #fff !important;
          border-color: #444;
        }
        .form-select option {
          background-color: #1e1e1e;
          color: #fff;
        }
        .dashboard-card {
          background-color: #1a1a1a;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(255, 75, 92, 0.1);
          padding: 25px;
        }
        .dashboard-title {
          color: #e63946;
          text-align: center;
          margin-bottom: 25px;
          font-weight: 600;
        }
        .btn-danger {
          background-color: #ff4b5c;
          border: none;
        }
        .btn-danger:hover {
          background-color: #e63946;
        }
      `}</style>

      <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', padding: '40px 0', color: '#f4f4f4' }}>
        <div className="container">
          <div className="dashboard-card mx-auto" style={{ maxWidth: 600 }}>
            <h3 className="dashboard-title">🩸 Request Blood</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Your Name</label>
                <input
                  name="requesterName"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Contact Info</label>
                <input
                  name="contact"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Phone or email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>State</label>
                <select
                  name="state"
                  className="form-select"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  {Object.keys(stateCityData).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>City</label>
                <select
                  name="city"
                  className="form-select"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select City</option>
                  {(stateCityData[formData.state] || []).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-danger w-100">
                🚨 Submit Blood Request
              </button>
            </form>

            {message && (
              <div className="alert alert-info text-center mt-4">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodRequestForm;
