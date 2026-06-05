package com.example.demo.repositories;

import com.example.demo.entities.Car;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarRepository extends MongoRepository<Car, String> {
    
    // פונקציה 1: שאילתה לסינון לפי טווח מחירים
    List<Car> findByPriceBetween(double minPrice, double maxPrice);

    // פונקציה 2: שאילתה שממיינת לפי שנה בסדר יורד ומביאה רק את ה-3 הראשונים
    List<Car> findTop3ByOrderByProductionYearDesc();

    // פונקציה 3: שאילתה למציאת כל הרכבים של יצרן מסוים
    List<Car> findByBrand(String brand);
}