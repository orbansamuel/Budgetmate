package com.budgetmate.backend.controller;

import com.budgetmate.backend.model.Income;
import com.budgetmate.backend.model.User;
import com.budgetmate.backend.repository.IncomeRepository;
import com.budgetmate.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Income> getAll() {
        return incomeRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Income> getByUser(@PathVariable Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    @GetMapping("/{email}")
    public List<Income> getByUserEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(value -> incomeRepository.findByUserId(value.getId())).orElse(List.of());
    }

    @PostMapping
    public Income addIncome(@RequestBody Income income) {
        if (income.getUser() == null && income.getUserEmail() != null) {
            Optional<User> user = userRepository.findByEmail(income.getUserEmail());
            user.ifPresent(income::setUser);
        }
        if (income.getDate() == null) {
            income.setDate(java.time.LocalDateTime.now());
        }
        return incomeRepository.save(income);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id, @RequestBody Income updated) {
        return incomeRepository.findById(id).map(income -> {
            income.setTitle(updated.getTitle());
            income.setAmount(updated.getAmount());
            income.setDate(updated.getDate());
            income.setUser(updated.getUser());
            return incomeRepository.save(income);
        }).orElseThrow();
    }
} 