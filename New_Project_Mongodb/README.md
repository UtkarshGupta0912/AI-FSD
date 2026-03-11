# New Project MongoDB Setup

This is a simple Node.js application connected to MongoDB.

## Prerequisites

- [Node.js](https://nodejs.org/) installed.
- MongoDB instance (local or Atlas).

## Setup

1.  **Clone the repository** (if not already local).
2.  **Navigate to the project directory**.
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Configure Environment**:
    - Ensure your `.env` file is set up correctly with your MongoDB URI.
    - Example `.env`:
        ```env
        PORT=3000
        MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mydb?retryWrites=true&w=majority
        JWT_SECRET=mysecretkey
        ```

## Running the Application

To start the server, run:

```bash
node server.js
```

Or using `npm`:

```bash
npm start
```

## API Endpoints

### specific API Endpoint

-   **URL**: `http://localhost:3000/api/signup`
-   **Method**: `GET`
-   **Description**: Fetches all users. Returns `404` if no users found.

## Troubleshooting

-   **Port in use**: Check if port 3000 is occupied. Change `PORT` in `.env` if needed.
-   **Database connection**: Ensure your MongoDB cluster is accessible and your IP is whitelisted (if using Atlas).
