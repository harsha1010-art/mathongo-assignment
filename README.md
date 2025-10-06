# 🧮 Mathongo Frontend Developer Assignment

This repository contains the source code for the **Mathongo Frontend Developer Assignment**, built according to the official task guidelines.  
The project replicates the provided **Leaderboard UI** using **React.js**, **Tailwind CSS**, and **shadcn/ui**, ensuring design accuracy, responsiveness, and smooth functionality.

🌐 **Live Demo:** [https://mathongo-assgnmnt.netlify.app/](https://mathongo-assgnmnt.netlify.app/)

---



## 🧭 Overview

This project was developed as part of the **Frontend Developer Assignment** by Mathongo.  
It recreates the **Leaderboard screen** from the given Figma design, showcasing component-driven development, dynamic data rendering, and precise styling implementation.

---

## 🎯 Objective

Build the provided UI screens using **React.js**, **Tailwind CSS**, and **shadcn/ui**, ensuring:

- 🎨 Pixel-perfect match with the provided Figma design  
- 📱 Fully responsive layout for multiple screen sizes  
- ♿ Accessibility compliance  
- 🌗 Theme toggle (light/dark)  
- ⚡ Dynamic icon rendering using Phosphor  
- 🎯 Consistent design tokens and color variables

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **React.js** | Component-based UI development |
| **Tailwind CSS** | Styling and responsive layout |
| **shadcn/ui** | Accessible and reusable components |
| **Phosphor Icons** | Dynamic icon rendering |
| **Netlify** | Deployment and hosting |

---

## 🚀 Features Implemented

### 🏆 Leaderboard View
- Recreated leaderboard design from Figma with **pixel perfection**
- Integrated with **official leaderboard API**:  
  `https://api.quizrr.in/api/hiring/leaderboard?page=1&limit=100`
- Dynamic data population for ranks, scores, and subjects

### 🌗 Theme Toggle
- Light/Dark mode implemented using Tailwind's `dark` class  
- Smooth toggle transitions and persistent state handling

### 📊 Table Functionality
- Fixed height scrollable table section  
- **Synced horizontal scrolling** between table and fixed bottom row  
- **Dynamic columns** supporting PCM or other subject combinations  
- **Pagination** for handling large datasets  
- Responsive across devices (desktop, tablet, mobile)

---

## ⚙️ Behavioral Requirements Covered

| Requirement | Status |
|--------------|---------|
| Fixed height table scroll | ✅ Implemented |
| Synced horizontal scroll | ✅ Implemented |
| Dynamic column support | ✅ Implemented |
| Pagination | ✅ Implemented |
| Responsive UI | ✅ Fully responsive |
| Pixel-perfect match | ✅ Verified against Figma |
| Dark mode | ✅ Implemented |

---

## 🧩 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/harsha1010-art/mathongo-assignment.git
cd mathongo-assignment
