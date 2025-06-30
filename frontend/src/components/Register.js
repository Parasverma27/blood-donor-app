import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    state: '',
    city: '',
    bloodGroup: '',
    latitude: '',
    longitude: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({ ...prev, latitude, longitude }));
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const city = res.data.address.city || res.data.address.town || res.data.address.village || '';
          const state = res.data.address.state || '';
          setFormData(prev => ({ ...prev, city, state }));
        } catch {
          console.warn("Reverse geocoding failed");
        }
      },
      () => {
        console.warn("Location permission denied");
      }
    );
  }, []);

  useEffect(() => {
    const { city, state } = formData;
    if (city && state) {
      axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${city}, ${state}`)}`)
        .then(response => {
          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
          }
        });
    }
  }, [formData.city, formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: "" } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setErrors({});

    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 3) newErrors.name = 'Minimum 3 characters required';

    if (!/^[6-9]\d{9}$/.test(formData.contact)) newErrors.contact = 'Invalid mobile number';

    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password))
      newErrors.password = 'Password must include letters and numbers';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/donors/register', formData);
      setMessage('✅ Registered successfully!');
      setFormData({
        name: '',
        contact: '',
        address: '',
        state: '',
        city: '',
        bloodGroup: '',
        latitude: '',
        longitude: '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, padding: '30px 15px', backgroundColor: '#1a1a1a', borderRadius: '12px', boxShadow: '0 0 15px rgba(255,0,0,0.1)', color: '#f0f0f0' }}>
      <h2 className="text-center mb-4" style={{ color: '#e63946', textShadow: '0 0 6px rgba(255,0,0,0.2)' }}>🩸 Blood Donor Registration</h2>
      <form onSubmit={handleSubmit}>
        {/* Input field */}
        <div className="mb-3">
          <input type="text" className={`form-control bg-dark border-secondary text-light ${errors.name && 'is-invalid'}`} placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <select name="bloodGroup" className="form-select bg-dark border-secondary text-light" value={formData.bloodGroup} onChange={handleChange} required>
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <input type="text" className={`form-control bg-dark border-secondary text-light ${errors.contact && 'is-invalid'}`} placeholder="Contact Number" name="contact" value={formData.contact} onChange={handleChange} />
          {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
        </div>

        <div className="mb-3">
          <input type="text" className="form-control bg-dark border-secondary text-light" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <select name="state" className="form-select bg-dark border-secondary text-light" value={formData.state} onChange={handleChange} required>
            <option value="">Select State</option>
            {Object.keys(stateCityData).map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <select name="city" className="form-select bg-dark border-secondary text-light" value={formData.city} onChange={handleChange} required>
            <option value="">Select City</option>
            {(stateCityData[formData.state] || []).map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <input type="password" className={`form-control bg-dark border-secondary text-light ${errors.password && 'is-invalid'}`} placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn w-100" style={{ backgroundColor: '#e63946', color: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(255,0,0,0.2)' }}>
          Register
        </button>
      </form>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default Register;
