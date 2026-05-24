package com.example.demo.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    private String customerName;
    private String customerPhone;
    private String carBrandAndModel; // למשל: "Tesla Model 3"
    private double finalPrice;
    private LocalDateTime orderDate = LocalDateTime.now();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCarBrandAndModel() { return carBrandAndModel; }
    public void setCarBrandAndModel(String carBrandAndModel) { this.carBrandAndModel = carBrandAndModel; }

    public double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(double finalPrice) { this.finalPrice = finalPrice; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}