# SlotSwapper

A peer-to-peer time-slot swapping platform that allows users to exchange their calendar events seamlessly.  
Built as part of a full-stack technical challenge to demonstrate skills in backend logic, data modeling, and frontend state management.

---

##  Live Demo

- **Frontend (Vercel):** [https://swap-the-slot-8qcg.vercel.app]
- **Backend (Render):** [https://swap-backend-w3ro.onrender.com](https://swap-backend-w3ro.onrender.com)  
  *(Note: The backend is hosted on Render’s free tier and may take 30–60 seconds to wake up if idle.)*

---

##  Project Overview

SlotSwapper enables users to mark their calendar events as **swappable**.  
Other users can view these available slots and request to exchange one of their own swappable slots for them.  

Once a swap request is accepted, the ownership of the slots is exchanged between the two users, and the system automatically updates both of their calendars.

---

##  Core Features

- **User Authentication:** Secure user registration and login using JSON Web Tokens (JWT).  
- **Event Management:** Full CRUD (Create, Read, Update, Delete) functionality for calendar events.  
- **Event Status:** Users can mark events as **BUSY** (default) or **SWAPPABLE** (available for trade).  
- **Swapping Marketplace:** View all available `SWAPPABLE` slots from other users.  
- **Swap Logic:**
  - **Request:** Users can request a swap by offering one of their own `SWAPPABLE` slots.  
  - **Respond:** Users receive incoming requests and can **Accept** or **Reject** them.  
  - **Atomic Exchange:** On acceptance, the backend atomically exchanges ownership of the two events, ensuring a secure and complete transaction.  
- **Dynamic UI:** Frontend state updates dynamically after swap actions — no manual refresh required.  
- **Protected Routes:** JWT middleware secures all user-specific API endpoints and frontend routes.  

---

##  Tech Stack

- **Frontend:** Typescript, Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JSON Web Tokens (JWT)  
- **Deployment:** Vercel (Frontend), Render (Backend)

---

##  Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/GeekPrathamesh/Swap-the-Slot.git
cd SlotSwapper

2. Backend Setup
cd backend
npm install

3. Create a .env file inside the backend directory and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:8080

4. Run the backend:

npm run dev

5. Frontend Setup
cd ../frontend
npm install
npm run dev

6. Create a .env file inside the frontend directory and add:

VITE_API_URL=http://localhost:5000/api   
    

##  API Endpoints

All authenticated endpoints require the following header:  
`Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/api/signup` | Register a new user `{ name, email, password }` |
| **POST** | `/api/login` | Authenticate user and receive JWT `{ email, password }` |
| **GET** | `/api/events` | Get all events for the logged-in user |
| **POST** | `/api/events` | Create a new event `{ title, startTime, endTime, status }` |
| **PUT** | `/api/events/:id` | Update event (e.g., mark as SWAPPABLE) |
| **DELETE** | `/api/events/:id` | Delete an event |
| **GET** | `/api/swappable-slots` | Get all SWAPPABLE slots from other users |
| **POST** | `/api/swap-request` | Request a swap `{ mySlotId, theirSlotId }` |
| **GET** | `/api/swap-requests` | Get all swap requests related to the user (both incoming & outgoing combined) |
| **GET** | `/api/swap-requests/incoming` | Get **incoming** swap requests (requests received by the logged-in user) |
| **GET** | `/api/swap-requests/outgoing` | Get **outgoing** swap requests (requests sent by the logged-in user) |
| **POST** | `/api/swap-response/:id` | Accept or reject a swap request `{ accept: true/false }` |

##  Important Backend Behavior

### `POST /api/swap-request`

- Verifies both slots exist and are **SWAPPABLE**.  
- Creates a new `SwapRequest` document with status **PENDING**.  
- Updates both events’ statuses to **SWAP_PENDING** to prevent duplicate offers.

### `POST /api/swap-response/:id`

- Must be processed **atomically** to ensure data integrity:
  - If `accept: false` → sets request to **REJECTED** and both events back to **SWAPPABLE**.  
  - If `accept: true` → swaps event owners, sets both events to **BUSY**, and updates request status to **ACCEPTED**.

---

##  Postman Collection

A ready-to-import Postman collection is included in the project root folder.

##  Notes

- Only events marked as **SWAPPABLE** are shown in the public marketplace.  
- The backend uses **atomic update logic** to ensure both events update together during swaps.  
- All protected routes require valid **JWT authentication**.  
- Code is modular and ready for future extensions like **real-time notifications**.

---

##  Future Improvements

- Real-time notifications using **WebSockets (Socket.io)**.  
- **Google Calendar integration** for importing/exporting events.  
- Enhanced **calendar UI** with drag-and-drop support.  
- **Unit and integration testing** for backend logic.  
- **Docker setup** for one-command local deployment.

---

###  Challenges Faced
- **Designing atomic swap transactions:**  
  Ensuring both events update simultaneously without data inconsistency required implementing careful logic and Mongoose transaction patterns.  
- **State synchronization:**  
  Keeping the frontend in sync with backend changes (swap acceptance, rejections, status updates) without page reloads was challenging.  
- **Cross-Origin setup:**  
  Handling CORS issues between Vercel (frontend) and Render (backend) during deployment.  
- **Authentication flow:**  
  Maintaining JWT session validity across protected routes and frontend route guards.  
- **UI consistency:**  
  Managing real-time UI feedback after swap actions while keeping the user experience smooth.

##  Author

**Prathamesh Teli**  
Full stack web Developer 

- **GitHub:** [https://github.com/GeekPrathamesh](https://github.com/GeekPrathamesh)  
- **LinkedIn:** [https://www.linkedin.com/in/geekprathamesh/](https://www.linkedin.com/in/geekprathamesh/)



