package com.budgetmate.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Income {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private double amount;
    private LocalDateTime date;

    @ManyToOne
    @JsonBackReference
    private User user;

    @Transient
    private String userEmail;

    // Getters and setters
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String email) { this.userEmail = email; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public double getAmount() { return amount; }
    public LocalDateTime getDate() { return date; }
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setDate(LocalDateTime date) { this.date = date; }
} 