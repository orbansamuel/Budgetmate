package com.budgetmate.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class RecurringTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private double amount;
    private String category;
    private String type; // 'income' vagy 'expense'
    @Column(name = "`interval`")
    private String interval; // 'daily', 'weekly', 'monthly', 'yearly'
    private LocalDate startDate;
    private LocalDate lastProcessed;

    @ManyToOne
    @JsonBackReference
    private User user;

    @Transient
    private String userEmail;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getInterval() { return interval; }
    public void setInterval(String interval) { this.interval = interval; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getLastProcessed() { return lastProcessed; }
    public void setLastProcessed(LocalDate lastProcessed) { this.lastProcessed = lastProcessed; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
} 