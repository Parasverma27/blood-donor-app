import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const stateCityData =  {
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

    const requestData = {
      ...formData,
      latitude,
      longitude
    };

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
        .form-control::placeholder,
        .form-select::placeholder {
          color: white !important;
          opacity: 1;
        }
        .form-select {
          color: white !important;
          background-color: #212529 !important;
          border-color: #6c757d !important;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' class='bi bi-caret-down-fill' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14l-4.796-5.481c-.566-.648-.106-1.659.753-1.659h9.592c.86 0 1.319 1.01.753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
          padding-right: 2rem;
        }
        .form-select option {
          background-color: #212529;
          color: white;
        }
      `}</style>


<div style={{ backgroundColor: '#0f0f0f', color: '#f0f0f0' }}>

     <div className="container mt-0" style={{ maxWidth: 500, padding: '30px 15px', backgroundColor: '#1a1a1a', borderRadius: '12px', boxShadow: '0 0 15px rgba(255,0,0,0.1)' }}>
      <div className="card bg-dark text-light shadow-lg">
        <div className="card-header">
          <h3 className="mb-4 text-center"  style={{ color: '#e63946', textShadow: '0 0 6px rgba(255,0,0,0.2)' }}>🩸 Request Blood</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Your Name</label>
              <input
                name="requesterName"
                className="form-control bg-dark border-secondary text-light"
                placeholder="Enter your name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                className="form-select bg-dark border-secondary text-light"
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
              <label>Contact </label>
              <input
                name="contact"
                className="form-control bg-dark border-secondary text-light"
                placeholder="phone or email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>State</label>
              <select
                name="state"
                className="form-select bg-dark border-secondary text-light"
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
                className="form-select bg-dark border-secondary text-light"
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
            <div className="alert mt-4 alert-info text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>

</div>

</>

    
  );
};

export default BloodRequestForm;
