package com.example.demo.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cars")
public class Car {

    @Id
    private String id;
    private String brand;
    private String model;
    private int productionYear;
    private double price;
    private String imageFile; // השדה החדש לשם קובץ התמונה הידני

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getProductionYear() { return productionYear; }
    public void setProductionYear(int productionYear) { this.productionYear = productionYear; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageFile() { return imageFile; }
    public void setImageFile(String imageFile) { this.imageFile = imageFile; }
}