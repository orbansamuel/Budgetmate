package com.budgetmate.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;

    private LocalDateTime registeredAt = LocalDateTime.now();

    // Getters és Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }

    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}
