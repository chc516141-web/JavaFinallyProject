package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // מאפשר לריאקט לתקשר עם השרת
public class UserController {

    @Autowired
    private UserService userService;

    // 1. נתיב הרשמה
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            // אם שם המשתמש תפוס, נחזיר שגיאה מסודרת לריאקט
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 2. נתיב התחברות
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            
            User user = userService.loginUser(username, password);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            // אם הסיסמה שגויה או המשתמש לא קיים
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}