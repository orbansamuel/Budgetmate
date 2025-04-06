# BudgetMate – Kiadáskezelő alkalmazás 💸

Ez egy egyszerű kiadáskezelő webalkalmazás Spring Boot (backend) és React + Tailwind CSS (frontend) technológiákkal.

## 📦 Követelmények

- Node.js (>=18)
- Java 17+
- Maven

## 📁 Projekt felépítése

.
├── backend                  # Spring Boot API (Java)

├── budgetmate-frontend      # React + Tailwind CSS frontend

└── README.md

## 🔧 Telepítés

### 1. Backend indítása

cd backend
./mvnw spring-boot:run
# vagy ha nincs wrapper:
mvn spring-boot:run

A backend ezután elérhető: http://localhost:8080

### 2. Frontend indítása

cd budgetmate-frontend
npm install
npm run dev

A frontend ezután elérhető: http://localhost:5173

## 🧪 Teszt felhasználók

Használhatsz saját regisztrációt!

## 🔐 Funkciók

- Regisztráció / Bejelentkezés
- Bejelentkezett felhasználók kiadásainak listázása és hozzáadása
- Token-alapú állapotkezelés localStorage-ben
- Automatikus kijelentkeztetés 15 perc inaktivitás után
- Védett oldalak (csak belépett felhasználóknak)
- Egyszerű hiba- és állapotkezelés

## 🛡️ Technológiák

- Backend: Spring Boot, JPA, Hibernate, Spring Security
- Frontend: React, Tailwind CSS, React Router, Context API
- Adatbázis: H2 (lokális memóriában)

## 🤝 Közreműködők

- Készítette: orbansamuel

