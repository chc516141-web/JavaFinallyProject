package com.example.demo.repositories;

import com.example.demo.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // פונקציה מיוחדת שתאפשר לנו לחפש משתמש לפי שם המשתמש שלו (מעולה להתחברות ובדיקת כפילויות)
    Optional<User> findByUsername(String username);
}