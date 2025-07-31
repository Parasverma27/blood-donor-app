import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    contact: '',
    email: '',
    address: '',
    state: '',
    city: '',
    latitude: '',
    longitude: ''
  });
  const [cities, setCities] = useState([]);
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const donor = JSON.parse(localStorage.getItem('loggedInDonor'));
    if (!donor) {
      alert('Please log in first.');
      navigate('/login');
    } else {
      setFormData({
        name: donor.name || '',
        bloodGroup: donor.bloodGroup || '',
        contact: donor.contact || '',
        email: donor.email || '',
        address: donor.address || '',
        state: donor.state || '',
        city: donor.city || '',
        latitude: donor.latitude || '',
        longitude: donor.longitude || ''
      });

      if (donor.state && stateCityData[donor.state]) {
        setCities(stateCityData[donor.state]);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'state') {
      setCities(stateCityData[value] || []);
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: ''
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getCoordinates = async (state, city) => {
    const query = `${city}, ${state}, India`;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data?.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.error('Geolocation error:', error);
    }

    const donor = JSON.parse(localStorage.getItem('loggedInDonor'));
    return {
      latitude: donor?.latitude || '',
      longitude: donor?.longitude || ''
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donor = JSON.parse(localStorage.getItem('loggedInDonor'));
    const coords = await getCoordinates(formData.state, formData.city);

    const updatedDonor = {
      ...formData,
      bloodGroup: formData.bloodGroup.toUpperCase(),
      latitude: coords.latitude,
      longitude: coords.longitude
    };

    if (newPassword.trim()) {
      updatedDonor.password = newPassword;
    }

    const res = await fetch(`http://localhost:8080/api/donors/update/${donor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDonor)
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('loggedInDonor', JSON.stringify(data));
      alert('✅ Donor Updated successfully!');
      navigate('/dashboard');
    } else {
      setMsg('❌ Failed to update profile. Try changing password or check contact number.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>✏️ Edit My Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />


        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select State</option>
          {Object.keys(stateCityData).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <div style={{ position: 'relative' }}>
          <input
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password (leave blank to keep current)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ ...styles.input, paddingRight: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#e63946',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button type="submit" style={styles.button}>Update Profile</button>
        {msg && <p id="msg" style={{ textAlign: 'center', marginTop: '10px' }}>{msg}</p>}
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#0e0e0e',
    color: '#f4f4f4',
    minHeight: '100vh',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heading: {
    color: '#e63946',
    marginBottom: 20
  },
  form: {
    backgroundColor: '#1d1d1d',
    padding: 25,
    borderRadius: 10,
    boxShadow: '0 0 12px rgba(255,0,0,0.1)',
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    margin: '10px 0',
    padding: '12px',
    border: '1px solid #444',
    borderRadius: 6,
    backgroundColor: '#2b2b2b',
    color: '#f4f4f4',
    fontSize: 16
  },
  button: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#ff4b5c',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer'
  }
};

export default EditProfile;
