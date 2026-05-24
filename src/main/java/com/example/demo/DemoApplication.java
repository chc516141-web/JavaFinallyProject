package com.example.demo;

import com.example.demo.entities.Car;
import com.example.demo.repositories.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

@Bean
public CommandLineRunner initData(CarRepository carRepository) {
    return args -> {
        if (carRepository.count() == 0) {
            
            Car car3 = new Car();
            car3.setBrand("Hyundai");
            car3.setModel("I10");
            car3.setProductionYear(2020);
            car3.setPrice(75000.0);
            carRepository.save(car3);

            System.out.println(">> בסיס הנתונים היה ריק. נתוני הרכבים הוכנסו בהצלחה!");
        } else {
            System.out.println(">> בסיס הנתונים כבר מכיל נתונים.");
        }
    };
}
}