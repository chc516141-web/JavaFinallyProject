package com.example.demo.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String username; // שם משתמש או אימייל
    private String password; // סיסמה (שתהיה מוצפנת)
    private String fullName; // שם מלא של הלקוח
    private String role = "USER"; // הרשאה: USER או ADMIN (כדי שתוכלי להגביל פעולות בהמשך)

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}