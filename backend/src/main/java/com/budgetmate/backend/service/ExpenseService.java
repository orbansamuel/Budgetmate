package com.budgetmate.backend.service;

import com.budgetmate.backend.model.Expense;
import com.budgetmate.backend.model.User;
import com.budgetmate.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense addExpense(Expense expense, User user) {
        expense.setUser(user);
        expense.setDate(LocalDateTime.now());
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByUser(User user) {
        return expenseRepository.findByUser(user);
    }
}
