package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 1. לוגיקת הרשמה
    public User registerUser(User user) {
        // בדיקה אם שם המשתמש כבר קיים במערכת
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new RuntimeException("שם המשתמש כבר תפוס!");
        }
        // שמירת המשתמש החדש ב-MongoDB
        return userRepository.save(user);
    }

    // 2. לוגיקת התחברות
    public User loginUser(String username, String password) {
        // מחפשים את המשתמש לפי ה-username
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // בודקים אם הסיסמה שהוקלדה תואמת לסיסמה שבבסיס הנתונים
            if (user.getPassword().equals(password)) {
                return user; // התחברות הצליחה! מחזירים את פרטי המשתמש
            }
        }
        
        // אם המשתמש לא נמצא או שהסיסמה שגויה
        throw new RuntimeException("שם משתמש או סיסמה שגויים!");
    }
}