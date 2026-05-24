package com.example.demo.controllers;

import com.example.demo.dto.CarDTO;
import com.example.demo.services.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // מאפשר לריאקט לגשת לנתונים בהצלחה ומנוע שגיאות CORS
@RestController
@RequestMapping("/api/cars") 
public class CarController {

    @Autowired
    private CarService carService;

    // פונקציה לקבלת כל הרכבים (GET)
    @GetMapping
    public List<CarDTO> getAllCars() {
        return carService.getAllCars();
    }

    // פונקציה להוספת רכב חדש (POST)
    @PostMapping
    public CarDTO addCar(@RequestBody CarDTO carDTO) {
        return carService.addCar(carDTO);
    }

    // פונקציה 1: חיפוש רכבים לפי טווח מחירים
    // כתובת לבדיקה: http://localhost:8080/api/cars/search?min=80000&max=130000
    @GetMapping("/search")
    public List<CarDTO> getCarsByPrice(@RequestParam double min, @RequestParam double max) {
        return carService.getCarsByPriceRange(min, max);
    }

    // פונקציה 2: קבלת 3 הרכבים הכי חדישים
    // כתובת לבדיקה: http://localhost:8080/api/cars/newest
    @GetMapping("/newest")
    public List<CarDTO> getTop3NewestCars() {
        return carService.getTop3NewestCars();
    }

    // פונקציה 3: החלת הנחה קבוצתית לפי יצרן (PUT)
    // כתובת להפעלה: http://localhost:8080/api/cars/discount?brand=Toyota&percentage=10
    @PutMapping("/discount")
    public String applyDiscount(@RequestParam String brand, @RequestParam double percentage) {
        carService.applyDiscountByBrand(brand, percentage);
        return "הנחה של " + percentage + "% הוחלה בהצלחה על כל רכבי " + brand + "!";
    }
}