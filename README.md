# Life Dashboard

A calm, all-in-one control center for managing daily systems such as sleep, fitness, focus, habits, nutrition, and finances.
Life Dashboard helps you track the habits and metrics that matter most so you can build better days through small, consistent actions.

# Overview

Life Dashboard is a full-stack productivity application designed to centralize key personal metrics into a single intuitive dashboard. Instead of using multiple apps for different aspects of life, the dashboard brings everything together — enabling users to track progress, stay accountable, and visualize daily improvement.

The application focuses on **systems over goals**, encouraging consistent habits in areas like sleep, training, focus, nutrition, and budgeting.

---

## Features

### Central Dashboard

* Displays overall **daily progress score**
* Aggregates activity across all tracked systems
* Visual feedback based on completed activities

### Sleep Tracker

* Log nightly sleep duration
* View sleep trends over the past week
* Contributes to overall daily progress

### Gym Tracker

* Weekly training checklist
* Tracks completed workout days
* Updates dashboard progress automatically

### Habit Checklist

* Create and manage daily habits
* Mark habits complete throughout the day
* Supports simple habit stacking workflows

### Financial Tracker

* Track **budget vs expenses**
* Monitor remaining balance in real time

### Calorie Tracker

* Track daily calorie intake
* Calculate consumption relative to personal metrics
* Helps monitor daily nutrition

### Focus Mode

* Built-in **Pomodoro-style focus timer**
* Configurable session lengths (25 / 45 / 60 minutes)
* Completing sessions increases dashboard progress

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Component-based UI architecture

### Backend

* Node.js
* Express.js

### Database
* Drizzle ORM

### Tooling
* PostCSS
* Modern build tooling via Vite


## Project Structure

```
life-dashboard
│
├── client/        # Frontend React application
├── server/        # Backend API
├── shared/        # Shared types and utilities
├── script/        # Project scripts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── drizzle.config.ts
```

---

## Installation

Clone the repository:

```
git clone https://github.com/ApoorvaCodes/Life-Dashboard.git
```

Navigate to the project folder:

```
cd Life-Dashboard
```

Install dependencies:

```
npm install
```

---

## Running the App

Start the development server:

```
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

## Design Philosophy

Life Dashboard is based on the idea that **consistent systems create long-term results**.

Instead of focusing on abstract goals, the application tracks small daily actions:

* Sleep
* Training
* Focus
* Habits
* Nutrition
* Finance

Each completed action contributes to a **daily progress score**, reinforcing positive routines.

---

## Future Improvements

* User authentication
* Persistent cloud database
* Habit analytics and trend visualization
* Mobile-responsive layout
* Dark mode
* Data export and insights

---

## Author

**Apoorva Anand**

GitHub: https://github.com/ApoorvaCodes

---

If you found this project interesting, consider starring the repository ⭐
