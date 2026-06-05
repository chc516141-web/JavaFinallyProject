package com.example.demo.repositories;

import com.example.demo.entities.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    // מונגו ייצר לנו כאן אוטומטית את כל פעולות ה-CRUD (הוספה, מחיקה, עדכון, שליפה)
}