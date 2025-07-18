# Mentaro

Mentaro is a Learning Management System (LMS) designed to offer an experience similar to Udemy, providing a platform for online courses and learning. This project is divided into a frontend built with **React**, **Vite**, and **TailwindCSS**, and a backend powered by **NodeJS**, **ExpressJS**, and **MongoDB** with **Mongoose**.

---

## Frontend Setup (React + Vite + TailwindCSS)

To get the Mentaro frontend up and running, follow these steps:

### Prerequisites

Before you begin, ensure you have one of the following package managers installed:

- **For Windows:**

  - Install **Bun**:
    ```bash
    winget install bun
    ```
  - Alternatively, install **Node.js and npm**:
    ```bash
    winget install nodejs
    ```

- **For NixOS:**
  - Use **Bun**:
    ```bash
    nix-shell -p bun
    ```
  - Alternatively, use **Node.js**:
    ```bash
    nix-shell -p nodejs
    ```

### To Do

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/SarunMr/Mentaro
    ```

2.  **Navigate to the frontend directory:**

    ```bash
    cd Mentaro/frontend
    ```

3.  **Install dependencies:**

    ```bash
    bun install
    # Or: bun i
    # If you're using npm:
    # npm install
    ```

4.  **Start the development server:**
    ```bash
    bun dev
    # Alternatively:
    # bun run dev
    # Or for npm:
    # npm run dev
    ```

---

## Backend Setup (NodeJS + ExpressJS + MongoDB + Mongoose)

The backend handles API requests and database interactions using MongoDB with Mongoose ODM.

### Prerequisites

- **Node.js:** Ensure Node.js is installed on your system.
- **MongoDB:** You'll need a MongoDB database instance running. You can use:
  - Local MongoDB installation
  - MongoDB Atlas (cloud database)
  - Docker container running MongoDB

### To Do

1.  **Navigate to the backend directory:**

    ```bash
    cd Mentaro/backend
    ```

    _(Assuming you're in the root _`Mentaro`_ directory after cloning)_

2.  **Install dependencies:**

    ```bash
    bun install
    # If you're using npm:
    # npm install
    ```

3.  **Database Configuration:**

    - Create a **`.env`** file in the `backend` directory.
    - Configure your MongoDB connection details in the `.env` file. A typical configuration might look like this:
      ```
      MONGODB_URI=mongodb://localhost:27017/mentaro_db
      # For MongoDB Atlas:
      # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mentaro_db
      PORT=5000
      NODE_ENV=development
      ```
    - **Remember to replace** the connection string with your actual MongoDB credentials and preferred database name.

4.  **Database Setup:**

    - Ensure your MongoDB service is running (if using local installation)
    - The application will automatically connect to MongoDB using Mongoose
    - Database collections will be created automatically when you start adding data

5.  **Start the backend server:**
    ```bash
    bun dev
    # Alternatively:
    # bun run dev
    # Or for npm:
    # npm run dev
    ```

---

## Additional Notes

- Make sure both frontend and backend servers are running simultaneously for full functionality
- The frontend typically runs on `http://localhost:5173` (Vite default)
- The backend typically runs on `http://localhost:5000` or the port specified in your `.env` file
- For production deployment, refer to the respective deployment documentation for React, Node.js, and MongoDB
