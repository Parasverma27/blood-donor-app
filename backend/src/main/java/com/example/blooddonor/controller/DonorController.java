package com.example.blooddonor.controller;

import com.example.blooddonor.model.Donor;
import com.example.blooddonor.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")  // Allows frontend to access API
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;

    // Register a new donor
    @PostMapping("/register")
    public ResponseEntity<?> registerDonor(@RequestBody Donor donor) {
        if (donorRepository.existsByPassword(donor.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Password already in use. Please choose a different password.");
        }

        Donor savedDonor = donorRepository.save(donor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDonor);
    }

    // Get all donors
    @GetMapping
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    // Get donors by city
    @GetMapping("/city/{city}")
    public List<Donor> getDonorsByCity(@PathVariable String city) {
        return donorRepository.findByCity(city);
    }
    
    @GetMapping("/search")
    public List<Donor> getDonorsByFilters(
        @RequestParam(required = false) String state,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) String bloodGroup) {

        // Convert empty strings to null
        if (state != null && state.trim().isEmpty()) {
            state = null;
        }
        if (city != null && city.trim().isEmpty()) {
            city = null;
        }
        if (bloodGroup != null && bloodGroup.trim().isEmpty()) {
            bloodGroup = null;
        }

        // Return all if no filters are selected
        if (state == null && city == null && bloodGroup == null) {
            return donorRepository.findAll();
        }

        return donorRepository.searchDonors(state, city, bloodGroup);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String contact = loginData.get("contact");
        String password = loginData.get("password");

        Optional<Donor> donor = donorRepository.findByContactAndPassword(contact, password);
        if (donor.isPresent()) {
            return ResponseEntity.ok(donor.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    
    @GetMapping("/contact/{contact}")
    public ResponseEntity<?> getDonorByContact(@PathVariable String contact) {
        return donorRepository.findByContact(contact)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }


    
    @GetMapping("/nearby")
    public List<Donor> getNearbyDonors(@RequestParam double lat, @RequestParam double lon, @RequestParam double radiusKm) {
        List<Donor> all = donorRepository.findAll();
        return all.stream()
            .filter(d -> d.getLatitude() != null && d.getLongitude() != null)
            .filter(d -> haversine(lat, lon, d.getLatitude(), d.getLongitude()) <= radiusKm)
            .toList();
    }
    
 // Update donor details
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDonor(@PathVariable Long id, @RequestBody Donor updatedDonor) {
        return donorRepository.findById(id)
                .map(existing -> {
                    // ✅ Check if password is being changed to one already in use by another donor
                    String newPassword = updatedDonor.getPassword();
                    if (newPassword != null && !newPassword.equals(existing.getPassword()) 
                        && donorRepository.existsByPassword(newPassword)) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Password already in use. Please choose a different password.");
                    }

                    // ✅ Proceed with update
                    existing.setName(updatedDonor.getName());
                    existing.setBloodGroup(updatedDonor.getBloodGroup());
                    existing.setContact(updatedDonor.getContact());
                    existing.setAddress(updatedDonor.getAddress());
                    existing.setState(updatedDonor.getState());
                    existing.setCity(updatedDonor.getCity());
                    existing.setLatitude(updatedDonor.getLatitude());
                    existing.setLongitude(updatedDonor.getLongitude());
                    existing.setPassword(newPassword);

                    Donor saved = donorRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDonor(@PathVariable Long id) {
        if (donorRepository.existsById(id)) {
            donorRepository.deleteById(id);
            return ResponseEntity.ok("Donor deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of earth in KM
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }



}
