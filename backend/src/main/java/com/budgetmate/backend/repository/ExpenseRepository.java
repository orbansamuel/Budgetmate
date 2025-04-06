package com.budgetmate.backend.repository;

import com.budgetmate.backend.model.Expense;
import com.budgetmate.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
}
