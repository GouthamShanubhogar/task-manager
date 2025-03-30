# Task Manager

Task Manager is a full-stack web application designed to help users manage their tasks efficiently. It features user authentication, task categorization, and filtering, all wrapped in a modern and responsive UI.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Assumptions](#assumptions)
- [Challenges Faced](#challenges-faced)
- [Screenshots](#screenshots)

---

## Features

- **User Authentication**: Secure login and signup functionality with JWT-based authentication.
- **Task Management**: Add, edit, delete, and mark tasks as complete or incomplete.
- **Task Categorization**: Categorize tasks into predefined categories like Work, Personal, Shopping, etc.
- **Search and Filter**: Search tasks by title and filter them by status or category.
- **Responsive Design**: Fully responsive UI for both desktop and mobile devices.

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **React Router**: For client-side routing.
- **Tailwind CSS**: For styling the application.
- **Axios**: For making HTTP requests.
- **Material UI Icons**: For icons used in the UI.

### Backend
- **Node.js**: For the server-side runtime.
- **Express.js**: For building the REST API.
- **PostgreSQL**: For the database.
- **pg**: PostgreSQL client for Node.js.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: For JWT-based authentication.
- **dotenv**: For managing environment variables.

### Development Tools
- **Vite**: For fast frontend development.
- **TypeScript**: For type safety.
- **ESLint**: For linting and code quality.
- **Tailwind CSS**: For utility-first styling.

---

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- A modern web browser

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/GouthamShanubhogar/task-manager.git
   cd task-manager/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Set up the database:
   - Create a PostgreSQL database.
   - Run the SQL schema file to create the necessary tables:
     ```bash
     psql -U your_database_user -d your_database_name -f schema.sql
     ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser:
   ```
   http://localhost:5173
   ```

---

## Assumptions

- Users will have unique email addresses for authentication.
- Tasks are associated with a single user and cannot be shared.
- Categories are predefined and cannot be customized by users.
- The application is designed for modern browsers with JavaScript enabled.

---

## Challenges Faced

### 1. **Authentication**
   - **Challenge**: Implementing secure JWT-based authentication.
   - **Solution**: Used `jsonwebtoken` for token generation and validation. Tokens are stored in `localStorage` for persistence.

### 2. **Database Design**
   - **Challenge**: Designing a schema that supports user-specific tasks with categories.
   - **Solution**: Created a normalized schema with foreign key relationships between `users` and `tasks`.

### 3. **Error Handling**
   - **Challenge**: Handling errors gracefully in both frontend and backend.
   - **Solution**: Added try-catch blocks in API calls and displayed user-friendly error messages.

### 4. **Responsive Design**
   - **Challenge**: Ensuring the UI looks good on all screen sizes.
   - **Solution**: Used Tailwind CSS for utility-first responsive design.

### 5. **State Management**
   - **Challenge**: Managing authentication and task states across the application.
   - **Solution**: Used React Context API to manage global states for authentication and tasks.

---


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

## Contact

For any questions or feedback, feel free to reach out at [gouthamgouthu173@gmail.com](mailto:gouthamgouthu173@gmail.com).
