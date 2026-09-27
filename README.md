# GreenSpace Frontend

The official React frontend for **GreenSpace**, an interactive urban gardening platform. It provides a seamless user interface for discovering shared gardens, purchasing or bartering market products, making reservations, and chatting with other users in real-time.

## 🚀 Technologies Used

- **Framework**: React 19 powered by [Vite](https://vitejs.dev/)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4) with utility-class animations
- **UI Components**: Shadcn UI & Base UI, ensuring accessible and beautiful elements
- **Forms & Validation**: React Hook Form combined with Yup schema validation
- **Maps & Geolocation**: React-Leaflet + Leaflet + Nominatim OpenStreetMap (completely open-source geocoding)
- **Icons**: Lucide React
- **Typography**: Geist Font Variable
- **Networking**: Axios (REST)
- **Real-Time Communication**: SockJS + STOMP (WebSockets for live chat)

## 📁 Project Structure

```
src/
 ├── api/          # Axios configuration and API service methods
 ├── assets/       # Static assets like images and global CSS
 ├── components/   # Reusable UI elements (Buttons, Cards, Chat Bubbles, Maps)
 ├── context/      # React Context (e.g., AuthContext for authentication state)
 ├── lib/          # Utilities commonly used by Shadcn UI (e.g., `cn` class merger)
 ├── pages/        # Route components (Dashboard, Explore, Market, Home, LandDetails, etc.)
 └── utils/        # General helper functions and formatters
```

## 🛠️ Prerequisites

To run this project locally, ensure you have:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

> **Note**: The frontend requires the [GreenSpace Backend](https://github.com/your-repo/GreenSpace-Backend) to be running concurrently for full functionality (Auth, DB, WebSockets).

## ⚙️ Setup & Installation

### 1. Install Dependencies
Navigate into the frontend directory and install the necessary packages:
```bash
npm install
```

### 2. Configure Environment (Optional)
The project is pre-configured to proxy API and WebSocket requests (`/api` and `/ws`) directly to a backend running on `http://localhost:8080` via `vite.config.js`. 
If you need to change configurations or add environment-specific keys, use an `.env` file (see `.env.example` as a template).

### 3. Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```
Access the application by navigating to `http://localhost:5173` in your browser.

## 🐳 Docker Deployment

The frontend comes with a `Dockerfile` and `nginx.conf` designed for a production-ready build.

To build and run the frontend as a standalone container:
```bash
docker build -t greenspace-frontend .
docker run -p 5173:80 greenspace-frontend
```

*Alternatively, use the `docker-compose.yml` located in the backend repository to spin up the entire application stack at once.*

## ✨ Core Workflows

- **Role-based Dashboards:** Dedicated views depending on whether the user is an `ADMIN`, `OWNER`, or standard `GARDENER`.
- **Garden Map Exploration:** Discover nearby plots visually on a Leaflet map.
- **Product Market:** Explore a digital farmer's market supporting both fixed-price purchases and direct bartering.
- **Real-Time Chat Inbox:** Engage directly with plot owners or buyers smoothly without leaving the application.

## 🤝 Contributing

When contributing to this UI:
1. Try to reuse components found in `src/components/ui`.
2. Follow standard React Hooks conventions.
3. Form validations should always be wired up to Yup schemas for unified error handling.

## 📄 License

This project is proprietary and intended for the GreenSpace platform. See the `LICENSE` file for further details.
