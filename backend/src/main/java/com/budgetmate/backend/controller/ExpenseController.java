package com.budgetmate.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.budgetmate.backend.model.Expense;
import com.budgetmate.backend.model.User;
import com.budgetmate.backend.repository.ExpenseRepository;
import com.budgetmate.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        Optional<User> user = userRepository.findByEmail(expense.getUserEmail());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        expense.setUser(user.get());
        expense.setDate(LocalDateTime.now());
        Expense savedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(savedExpense);
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<Expense>> getExpensesByUser(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Expense> expenses = expenseRepository.findByUser(user.get());
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense updated) {
        return expenseRepository.findById(id).map(expense -> {
            expense.setTitle(updated.getTitle());
            expense.setAmount(updated.getAmount());
            expense.setCategory(updated.getCategory());
            expense.setDate(updated.getDate());
            expense.setUser(updated.getUser());
            return ResponseEntity.ok(expenseRepository.save(expense));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        expenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
