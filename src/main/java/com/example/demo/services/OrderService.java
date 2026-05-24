package com.example.demo.services;

import com.example.demo.entities.Order;
import com.example.demo.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // 1. הבאת כל ההזמנות
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 2. יצירת הזמנה חדשה
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    // 3. מחיקת הזמנה לפי ID
    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }

    // 4. עדכון הזמנה קיימת
    public Order updateOrder(String id, Order updatedOrder) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (existingOrderOpt.isPresent()) {
            Order order = existingOrderOpt.get();
            order.setCustomerName(updatedOrder.getCustomerName());
            order.setCustomerPhone(updatedOrder.getCustomerPhone());
            order.setCarBrandAndModel(updatedOrder.getCarBrandAndModel());
            order.setFinalPrice(updatedOrder.getFinalPrice());
            return orderRepository.save(order);
        }
        return null; // אם ההזמנה לא נמצאה
    }
}