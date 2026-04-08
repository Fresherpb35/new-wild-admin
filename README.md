# 🐯 Wildlife Rose Safari Resort — Admin Panel

A **fully responsive**, **fully dynamic** luxury jungle-themed admin dashboard built with **React 18** and **Tailwind CSS 3**.

---

## ✨ Features

### Responsive
- **Mobile** (< 640px) — hamburger drawer sidebar, stacked cards, touch-friendly buttons
- **Tablet** (640–1024px) — 2-column grids, condensed tables
- **Desktop** (> 1024px) — fixed sidebar, full table layout

### Dynamic (all data lives in React Context — no hardcoding)
| Feature | Details |
|---|---|
| **Bookings CRUD** | Add, Edit, Delete single or bulk; live search + status filter |
| **CSV Export** | Downloads filtered bookings as a proper CSV file |
| **Blog CRUD** | Add, Edit, Delete, Publish/Unpublish with live status badges |
| **Gallery CRUD** | Add with emoji picker + category; hover-to-delete |
| **Hotel & Site Info** | All fields editable and saved back to global context |
| **Toast Notifications** | Success / error toasts on every action |
| **Confirm Modals** | Destructive actions gated behind confirmation dialogs |
| **Dashboard stats** | Revenue, confirmed, pending — all computed live from booking data |
| **Password toggle** | Show/hide password on login |
| **Form Validation** | Required fields, email format, date range checks |

---

## 📁 Project Structure

```
wildlife-safari-admin/
├── public/
│   └── index.html                         ← Google Fonts loaded here
├── src/
│   ├── context/
│   │   └── AppContext.jsx                 ← 🔑 All dynamic data + CRUD actions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx        ← Responsive layout + mobile hamburger
│   │   │   └── Sidebar.jsx               ← Nav sidebar (desktop sticky + mobile drawer)
│   │   └── ui/
│   │       ├── Badge.jsx                 ← Status pill (Confirmed/Pending/Cancelled)
│   │       ├── Button.jsx                ← 6 variants: gold, green, ghost-*, danger
│   │       ├── Card.jsx                  ← Jungle card wrapper
│   │       ├── FormField.jsx             ← FInput / FTextarea / FSelect + labels
│   │       ├── Input.jsx                 ← Gold-focus text input
│   │       ├── Modal.jsx                 ← Keyboard-dismissible modal (Escape key)
│   │       ├── StatCard.jsx              ← Dashboard metric card
│   │       └── Toast.jsx                 ← Fixed-position toast notifications
│   ├── hooks/
│   │   └── useAuth.js                    ← Login validation + loading state
│   ├── pages/
│   │   ├── LoginPage.jsx                 ← Full-screen glassmorphism + show/hide password
│   │   ├── DashboardHome.jsx             ← Live stats computed from booking data
│   │   ├── BookingManagement.jsx         ← Full CRUD table + bulk delete + CSV export
│   │   └── ContentManagement.jsx         ← Blog, Hotel, Gallery, Website CMS
│   ├── utils/
│   │   └── csv.js                        ← CSV blob download utility
│   ├── App.jsx                           ← Root auth + AppProvider wrapper
│   ├── index.css                         ← Tailwind + animations + glass + scrollbar
│   └── index.js                          ← React entry point
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

```bash
cd wildlife-safari-admin
npm install
npm start
```

Opens at **http://localhost:3000**

### Build for production
```bash
npm run build
```

---

## 🔑 Login Credentials (Demo)

Any **valid email** + **password ≥ 6 characters**

| Field    | Example                      |
|----------|------------------------------|
| Email    | `admin@wildliferose.com`     |
| Password | `safari123`                  |

---

## 🎨 Color Palette

| Token          | Hex       | Usage                      |
|----------------|-----------|----------------------------|
| `jungle-dark`  | `#0d2117` | Page background            |
| `jungle-light` | `#2d6e45` | Accent surfaces            |
| `gold`         | `#c9a84c` | Primary accent, borders    |
| `gold-light`   | `#e2c87a` | Headings, active nav       |
| `beige`        | `#f5ede0` | Body text                  |

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.x | UI library |
| Tailwind CSS | 3.x | Utility styling |
| React Context | built-in | Global dynamic state |
| DM Sans | Google Fonts | Body font |
| Playfair Display | Google Fonts | Display/heading font |

---

*Wildlife Rose Safari Resort · Ranthambore, Rajasthan · Protected Admin Area*
