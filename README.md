# Mentaro

Mentaro is a Learning Management System (LMS) designed to offer an experience similar to Udemy, providing a platform for online courses and learning. This project is divided into a frontend built with **React**, **Vite**, and **TailwindCSS**, and a backend powered by **NodeJS**, **ExpressJS**, and **PostgreSQL**.

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
    git clone [https://github.com/SarunMr/Mentaro](https://github.com/SarunMr/Mentaro)
    ```
2.  **Navigate to the frontend directory:**
    ```bash
    cd Mentaro/frontend
    ```
3.  **Install dependencies:**
    ```bash
    bun install| bun i
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

## Backend Setup (NodeJS + ExpressJS + PostgreSQL)

The backend handles API requests and database interactions.

### Prerequisites

- **Node.js:** Ensure Node.js is installed on your system.
- **PostgreSQL:** You'll need a PostgreSQL database instance running.

### To Do

1.  **Navigate to the backend directory:**
    ```bash
    cd Mentaro/backend
    ```
    _(Assuming you're in the root `Mentaro` directory after cloning)_
2.  **Install dependencies:**
    ```bash
    bun install
    # If you're using npm:
    # npm install
    ```
3.  **Database Configuration:**
    - Create a **`.env`** file in the `backend` directory.
    - Configure your PostgreSQL connection details in the `.env` file. A typical configuration might look like this:
      ```
      DB_USER=your_username
      DB_HOST=localhost
      DB_DATABASE=mentaro_db
      DB_PASSWORD=your_password
      DB_PORT=5432
      ```
    - **Remember to replace** `your_username`, `your_password`, and `mentaro_db` with your actual PostgreSQL credentials and preferred database name.
4.  **Run Database Migrations (if applicable):**
    - If your project uses database migrations (e.g., with tools like Knex.js or Sequelize), you'll need to run them to set up your database schema. Check the `backend` folder for specific migration commands, which are often similar to:
      ```bash
      bun run migrate
      # Or for npm:
      # npm run migrate
      ```
5.  **Start the backend server:**
    ```bash
    bun dev
    # Alternatively:
    # bun run dev
    # Or for npm:
    # npm run dev
    ```
