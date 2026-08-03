# 🏨 Maison Lumière — Hotel Management & Booking Platform

**Maison Lumière** (*EST. 2026*) is a modern, elegant web application for luxury hotel browsing, room reservations, and stay management. Designed with a sleek aesthetic and powered by React 19, Vite, React Router 7, and Supabase.

---

## 🌟 Key Features

- 🛋️ **Room Catalog & Exploration**: Browse curated luxury suites, view pricing, amenities, and room availability.
- 📅 **Interactive Room Reservation**: Real-time room booking with instant date validation and total cost calculation.
- 🔐 **User Authentication**: Secure user login and registration powered by Supabase Auth with state persistence (`AuthContext`).
- 🧳 **My Stays Dashboard**: Track, review, and manage active reservations and booking history.
- 📱 **Fully Responsive UI**: Mobile-first responsive drawer sidebar, overlay navigation, and smooth transitions.
- ⚡ **High Performance & Fast HMR**: Built with Vite 8 and React 19 for instantaneous page loads and lightning-fast developer feedback.

---

## 🛠️ Tech Stack

### Frontend & Architecture
- **Framework**: [React 19](https://react.dev/)
- **Build Tool / Bundler**: [Vite 8](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: Vanilla CSS (Custom tokens, flexbox/grid, glassmorphism, responsive navigation overlay)

### Backend & Services
- **Database & Authentication**: [Supabase JS Client (`@supabase/supabase-js`)](https://supabase.com/)

### Tooling & Deployment
- **Linter**: [Oxlint](https://oxc.rs/)
- **Hosting / Deployment**: [GitHub Pages (`gh-pages`)](https://eljmadila.github.io/maisonLumiere)

---

## 📂 Project Structure

```text
hotelmanagement/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── About.jsx       # About hotel section
│   │   ├── Aboutcard.jsx   # Feature highlights cards
│   │   ├── Form.jsx        # Booking / Reservation form
│   │   ├── Hero.jsx        # Homepage hero section
│   │   ├── Login.jsx       # Login form component
│   │   ├── Roomscard.jsx   # Room preview card
│   │   └── Signup.jsx      # Signup form component
│   ├── context/
│   │   └── AuthContext.jsx # Global authentication context & state
│   ├── pages/              # Application views / routes
│   │   ├── Auth.jsx        # Login/Signup authentication page
│   │   ├── Confirmed.jsx   # Booking confirmation view
│   │   ├── Home.jsx        # Landing page
│   │   ├── Roominfo.jsx    # Room details & booking page
│   │   ├── Rooms.jsx       # Full room catalog
│   │   └── Stays.jsx       # User reservations & stays page
│   ├── utils/
│   │   └── dateUtils.js    # Date formatting & booking calculations helper
│   ├── App.jsx             # Main layout, router setup & responsive navigation
│   ├── App.css             # Main stylesheet & design system
│   ├── main.jsx            # Application entry point
│   └── supabaseClient.js   # Supabase client configuration
├── .env                    # Environment variables (Supabase keys)
├── package.json            # Project dependencies & scripts
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/eljmadila/maisonLumiere.git
   cd maisonLumiere/hotelmanagement
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory of `hotelmanagement` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with HMR. |
| `npm run build` | Builds the app for production to the `dist` folder. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs [Oxlint](https://oxc.rs/) to inspect code quality. |
| `npm run deploy` | Builds the app and deploys it to GitHub Pages. |

---

## 🌐 Live Demo & Deployment

The application is deployed on GitHub Pages and can be accessed at:
👉 **[Maison Lumière Live Demo](https://eljmadila.github.io/maisonLumiere)**

To deploy your own updates:
```bash
npm run deploy
```

---

## 📄 License

This project is created for personal and portfolio use. All rights reserved by **Maison Lumière**.