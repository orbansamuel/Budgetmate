package com.budgetmate.backend.controller;

import com.budgetmate.backend.model.RecurringTransaction;
import com.budgetmate.backend.model.User;
import com.budgetmate.backend.repository.RecurringTransactionRepository;
import com.budgetmate.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recurring")
public class RecurringTransactionController {
    @Autowired
    private RecurringTransactionRepository recurringRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<RecurringTransaction> getAll() {
        return recurringRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<RecurringTransaction> getByUser(@PathVariable Long userId) {
        return recurringRepository.findByUserId(userId);
    }

    @GetMapping("/{email}")
    public List<RecurringTransaction> getByUserEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(value -> recurringRepository.findByUserId(value.getId())).orElse(List.of());
    }

    @PostMapping
    public RecurringTransaction addRecurring(@RequestBody RecurringTransaction recurring) {
        if (recurring.getUser() == null && recurring.getUserEmail() != null) {
            Optional<User> user = userRepository.findByEmail(recurring.getUserEmail());
            user.ifPresent(recurring::setUser);
        }
        return recurringRepository.save(recurring);
    }

    @DeleteMapping("/{id}")
    public void deleteRecurring(@PathVariable Long id) {
        recurringRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public RecurringTransaction updateRecurring(@PathVariable Long id, @RequestBody RecurringTransaction updated) {
        return recurringRepository.findById(id).map(rec -> {
            rec.setTitle(updated.getTitle());
            rec.setAmount(updated.getAmount());
            rec.setCategory(updated.getCategory());
            rec.setType(updated.getType());
            rec.setInterval(updated.getInterval());
            rec.setStartDate(updated.getStartDate());
            rec.setLastProcessed(updated.getLastProcessed());
            rec.setUser(updated.getUser());
            return recurringRepository.save(rec);
        }).orElseThrow();
    }
} 