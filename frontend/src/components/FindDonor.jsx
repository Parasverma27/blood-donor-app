import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const stateCityMap = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Manipur": ["Imphal", "Bishnupur", "Thoubal"],
  "Meghalaya": ["Shillong", "Tura", "Jowai"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe"]
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const FindDonor = () => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const leafletMap = L.map('map').setView([20.59, 78.96], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);
    setMap(leafletMap);

    return () => {
      leafletMap.remove(); // Cleanup
    };
  }, []);

  const clearMarkers = () => {
    markers.forEach(marker => map && map.removeLayer(marker));
    setMarkers([]);
  };

  const handleSearch = async () => {
    if (!state && !city && !bloodGroup) {
      alert("Please select at least one filter: state, city, or blood group.");
      return;
    }

    if (!map) return;

    try {
      const res = await fetch(`http://localhost:8080/api/donors/search?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&bloodGroup=${encodeURIComponent(bloodGroup)}`);
      const data = await res.json();
      setDonors(data);
      clearMarkers();

      const newMarkers = [];
      data.forEach(d => {
        if (d.latitude && d.longitude) {
          const marker = L.marker([d.latitude, d.longitude])
            .addTo(map)
            .bindPopup(`<b>${d.name}</b><br>${d.bloodGroup}<br>${d.contact}`);
          newMarkers.push(marker);
        }
      });

      setMarkers(newMarkers);

      if (data.length > 0 && data[0].latitude && data[0].longitude) {
        map.setView([data[0].latitude, data[0].longitude], 12);
      }

    } catch (err) {
      alert("Error fetching donors.");
    }
  };

  const detectAndLoadNearby = () => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);

        const userMarker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("📍 You are here")
          .openPopup();
        clearMarkers();
        setMarkers([userMarker]);

        try {
          const res = await fetch(`http://localhost:8080/api/donors/nearby?lat=${latitude}&lon=${longitude}&radiusKm=10`);
          const data = await res.json();
          setDonors(data);

          const newMarkers = [userMarker];
          data.forEach(donor => {
            if (donor.latitude && donor.longitude) {
              const marker = L.marker([donor.latitude, donor.longitude])
                .addTo(map)
                .bindPopup(`<b>${donor.name}</b><br>${donor.bloodGroup}<br>${donor.contact}`);
              newMarkers.push(marker);
            }
          });

          setMarkers(newMarkers);
        } catch {
          alert("Failed to fetch nearby donors.");
        }
      });
    } else {
      alert("Geolocation not supported.");
    }
  };

  return (
    <div className="bg-dark text-light p-4" style={{ minHeight: '100vh' }}>
      <h2 className="text-center text-danger mb-4">🩸 Search Blood Donors</h2>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        <select className="form-select w-auto" value={state} onChange={e => setState(e.target.value)}>
          <option value="">Select State</option>
          {Object.keys(stateCityMap).map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <select className="form-select w-auto" value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Select City</option>
          {(stateCityMap[state] || []).map(ct => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>

        <select className="form-select w-auto" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
          <option value="">Select Blood Group</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <button className="btn btn-danger" onClick={handleSearch}>Search</button>
        <button className="btn btn-outline-light" onClick={detectAndLoadNearby}>📍 Auto Detect Nearby</button>
      </div>

      <div className="container mb-4">
        {donors.length === 0 ? (
          <p className="text-center text-muted">No donors found.</p>
        ) : donors.map((d, idx) => (
          <div key={idx} className="bg-secondary bg-opacity-10 border border-secondary p-3 rounded mb-2">
            <strong>{d.name}</strong> ({d.bloodGroup})<br />
            📞 {d.contact} <br />
            📍 {d.address}, {d.city}, {d.state}
          </div>
        ))}
      </div>

      <div id="map" style={{ height: '400px', borderRadius: '12px' }}></div>
    </div>
  );
};

export default FindDonor;
