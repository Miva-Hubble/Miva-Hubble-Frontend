# 🎓 Miva Hubble

**A unified, mobile-first social collaboration platform for Miva University students.**

---

## 📖 Table of Contents
- [Executive Summary](#-executive-summary)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Getting Started](#-getting-started)
- [Project Roadmap](#-project-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📋 Executive Summary
**Miva Connect** solves the fragmentation of student communication. Currently, students are siloed in cohort-specific Telegram groups, limiting their ability to network, share resources, or seek help across the university.

This platform serves as a **"Town Square"** for the entire student body. It combines social networking, academic resource sharing (Libraries), and real-time updates into a single, trusted environment. [cite_start]It uniquely balances **verified institutional identity** with a **safe anonymous mode** to encourage open questions and peer support[cite: 7, 17, 24].

---

## 🚀 Key Features

### 🔐 Identity & Privacy
* [cite_start]**Dual-Profile System:** Users can switch seamlessly between a **Verified Profile** (Real Name, Major) and an **Anonymous Profile** (Pseudonym)[cite: 61].
* [cite_start]**Institutional Verification:** Access is restricted to users with a valid `@miva.edu.ng` email address[cite: 24].

### 📚 Academic Libraries
* [cite_start]**Crowdsourced Resources:** Upload and organize PDFs, DOCX, and PPTX files by Department, Course, and Topic[cite: 76, 88].
* [cite_start]**Quality Control:** Upvote/downvote system and "Helpfulness" ranking for all materials[cite: 102].


### 🤝 Networking (Phase 2)
* [cite_start]**Alumni Connection:** A dedicated space for alumni mentorship and career advice[cite: 168].

---

## 🛠 Tech Stack & Architecture
This project is built by a team of 6, utilizing a microservices-ready architecture to ensure scalability and developer velocity.

### **Frontend (Client)**
* **Web:** (React) - *Server-Side Rendering for performance.*
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) - *Unified university theme.*

### **Backend (Server)**
* **Core API:** [NodeJS] 

### **Data & Infrastructure**
* **Database:** [PostgreSQL](https://www.postgresql.org/) - *Relational data for Users, Courses, and Connections.*
* **Caching:** Redis - *Powering the real-time Campus Feed.*
* **Storage:** Cloudflare - *Storing Library files and Voice Notes.*
* **Auth:** JWT with Institutional Email Verification.

---

## ⚡ Getting Started

### Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18+)

### Local Development Setup

**1. Clone the repository**
```bash

``` 

Link to Figma Design

https://www.figma.com/design/cdr0HeEpjgJDKrjQiMsWpV/Miva-Hubble?node-id=0-1&p=f&t=FHDpdj9CxnQxFOGg-0
