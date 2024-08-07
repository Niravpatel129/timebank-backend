# TimeBank Backend API

This repository contains the backend API for the TimeBank application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/timebank-backend.git
   ```

2. Navigate to the project directory:

   ```
   cd timebank-backend
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Start the server:
   ```
   npm run dev
   ```

The server will start running on `http://localhost:8004`.

## API Endpoints

- `GET /`: Welcome message
- `GET /api/version`: Get API version
- `GET /api/update/:platform`: Get update information for a specific platform
- `PUT /api/update/:id`: Update a specific resource
- `PATCH /api/update/:id`: Partially update a specific resource

## Built With

- [Express.js](https://expressjs.com/) - The web framework used
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [CORS](https://github.com/expressjs/cors) - CORS middleware

## Authors

- Nirav Patel

## License

This project is licensed under the ISC License.
