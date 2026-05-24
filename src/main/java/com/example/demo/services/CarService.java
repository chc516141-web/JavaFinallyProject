package com.example.demo.services;

import com.example.demo.dto.CarDTO;
import com.example.demo.entities.Car;
import com.example.demo.repositories.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    // הוספת רכב - כולל שמירת שם קובץ התמונה
    public CarDTO addCar(CarDTO carDTO) {
        Car car = new Car();
        car.setBrand(carDTO.getBrand());
        car.setModel(carDTO.getModel());
        car.setProductionYear(carDTO.getProductionYear());
        car.setPrice(carDTO.getPrice());
        car.setImageFile(carDTO.getImageFile()); // העתקת שדה התמונה ל-Entity

        Car savedCar = carRepository.save(car);
        return convertToDTO(savedCar);
    }

    public List<CarDTO> getAllCars() {
        return carRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CarDTO> getCarsByPriceRange(double min, double max) {
        return carRepository.findByPriceBetween(min, max)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CarDTO> getTop3NewestCars() {
        return carRepository.findTop3ByOrderByProductionYearDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void applyDiscountByBrand(String brand, double discountPercentage) {
        List<Car> cars = carRepository.findByBrand(brand);
        for (Car car : cars) {
            double oldPrice = car.getPrice();
            double newPrice = oldPrice * (1 - (discountPercentage / 100));
            car.setPrice(newPrice);
            carRepository.save(car);
        }
    }

    // פונקציית עזר למיפוי - כולל העברת שם קובץ התמונה ל-DTO
    private CarDTO convertToDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setBrand(car.getBrand());
        dto.setModel(car.getModel());
        dto.setProductionYear(car.getProductionYear());
        dto.setPrice(car.getPrice());
        dto.setImageFile(car.getImageFile()); // העברת שדה התמונה ל-DTO
        return dto;
    }
}