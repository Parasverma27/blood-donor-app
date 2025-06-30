package com.example.blooddonor.repository;

import com.example.blooddonor.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    List<Donor> findByCity(String city);

    List<Donor> findByBloodGroup(String bloodGroup);

    List<Donor> findByCityAndBloodGroupIgnoreCase(String city, String bloodGroup);

    @Query("SELECT d FROM Donor d WHERE " +
           "(:state IS NULL OR LOWER(d.state) = LOWER(:state)) AND " +
           "(:city IS NULL OR LOWER(d.city) = LOWER(:city)) AND " +
           "(:bloodGroup IS NULL OR UPPER(d.bloodGroup) = UPPER(:bloodGroup))")
    List<Donor> searchDonors(@Param("state") String state,
                             @Param("city") String city,
                             @Param("bloodGroup") String bloodGroup);

    Optional<Donor> findByContactAndPassword(String contact, String password);

    Optional<Donor> findByContact(String contact);
    
    boolean existsByPassword(String password);
}
