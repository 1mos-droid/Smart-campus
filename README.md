# Smart Campus - Smart Attendance System

## Project Overview

The Smart Campus application is a modern web-based solution designed to streamline the attendance tracking process for educational institutions. It provides distinct functionalities for students and lecturers, leveraging QR code scanning and geolocation to ensure accurate and efficient attendance marking.

The system features a React-based frontend for a responsive user interface and a Node.js (Express) backend for robust API services and data management with MongoDB.

## Features

### Student Features:
*   **User Authentication:** Secure registration and login for students.
*   **Personal Timetable:** View scheduled courses, including time, day, venue, and lecturer information.
*   **Smart Attendance:** Scan unique QR codes provided by lecturers to mark attendance for a specific class session, with geolocation verification.

### Lecturer Features:
*   **User Authentication:** Secure registration and login for lecturers.
*   **Course Dashboard:** View a list of courses assigned to the lecturer.
*   **QR Code Generation:** Generate unique, time-sensitive QR codes for specific course sessions, enabling students to mark attendance.

## Technologies Used

### Frontend:
*   **React:** A JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in React applications.
*   **Axios:** Promise-based HTTP client for the browser and Node.js.
*   **Framer Motion:** A production-ready motion library for React.
*   **html5-qrcode:** A JavaScript library for QR code scanning using webcams.
*   **qrcode.react:** A React component for generating QR codes.
*   **Vite:** A fast build tool for modern web projects.
*   **CSS:** For styling and responsive design.

### Backend:
*   **Node.js:** JavaScript runtime for server-side logic.
*   **Express.js:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database for storing application data.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **JSON Web Tokens (JWT):** For secure user authentication.
*   **Bcrypt.js:** For password hashing.
*   **Geolocation (server-side logic):** For verifying student location during attendance marking.

## Setup Instructions

Follow these steps to get the Smart Campus application up and running on your local machine.

### Prerequisites

*   **Node.js & npm:** Ensure you have Node.js (LTS version recommended) and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
*   **MongoDB:** Install MongoDB Community Server. You can download it from [mongodb.com](https://www.mongodb.com/try/download/community). Ensure it's running (typically on `mongodb://localhost:27017`).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-campus.git
cd smart-campus
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and configure environment variables.

```bash
cd backend
npm install
```

#### Environment Variables (`backend/.env`)

Create a `.env` file in the `backend` directory and add the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartcampus # Or your MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_key
QR_SECRET=your_qr_secret_key # A secret key for signing QR codes
LOCATION_TOLERANCE_METERS=50 # Max distance for attendance (e.g., 50 meters)
```

Replace `your_jwt_secret_key` and `your_qr_secret_key` with strong, random strings.

#### Run the Backend Server

```bash
npm start
# Or for development with nodemon:
# npm run dev
```
The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, install dependencies, and configure environment variables.

```bash
cd ../frontend
npm install
```

#### Environment Variables (`frontend/.env`)

Create a `.env` file in the `frontend` directory and add the following:

```
VITE_API_URL=http://localhost:5000/api
```

#### Run the Frontend Development Server

```bash
npm run dev
```

The frontend application will typically open in your browser at `http://localhost:5173/`.

## Usage

1.  **Register:**
    *   New users (both students and lecturers) need to register first.
    *   Use an ID format like `109xxxxx` for students and `L-xxxxx` for lecturers to help distinguish roles.
    *   Provide your name, email, and password.
2.  **Login:**
    *   Log in with your registered ID and password.
    *   The system will redirect you based on your role:
        *   **Students:** Redirected to their Timetable.
        *   **Lecturers:** Redirected to their Dashboard.
3.  **Student Flow:**
    *   **Timetable:** View your scheduled classes.
    *   **Scan QR:** Navigate to the "Scan QR" page. Allow camera and location permissions. Point your camera at the lecturer's generated QR code to mark attendance.
4.  **Lecturer Flow:**
    *   **Dashboard:** View your assigned courses.
    *   **Generate QR Code:** For a specific course, click "Generate QR Code". A modal will display a unique QR code for that session.
    *   **Share QR Code:** Students can scan this QR code within a specified timeframe and location to mark their attendance.

## Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
