```markdown
# Express.js GraphQL Application

This is a Node.js application built with Express.js and GraphQL, designed to be scalable and deployable 
using Docker. PM2 is used for efficient process management in both development and production environments.

## Features

- Hybrid Restful & GraphQL API with a modular schema and resolver structure
- PM2 for process management and clustering
- Dockerized for easy deployment
- MongoDB database

---

## Folder Structure

```plaintext
root/
├── cache/              # Cache scripts
├── constants/          # Constant variables
├── controllers/        # REST API controllers
├── cron_jobs/          # REST API cron jobs
├── middlewares/        # JWT authentication check middleware
├── models/             # Database models
├── resolvers/          # GraphQL resolvers
├── routes/             # REST API routes (optional)
├── schema/             # GraphQL schema definitions
├── tests/              # Test functions
├── utils/              # Utility functions
├── Dockerfile          # Docker configuration
├── .dockerignore       # Files to ignore in Docker builds
├── ecosystem.config.js # PM2 process configuration
├── index.js            # Application entry point
├── package.json        # Node.js dependencies
└── README.md           # Project documentation
```

---

## Requirements

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/)
- [PM2](https://pm2.keymetrics.io/) (installed globally if running locally)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/wits-server.git
cd wits-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

#### Without PM2:
```bash
node index.js
```

#### With PM2:
```bash
pm2 start ecosystem.config.js
```

---

## Using Docker

### Build the Docker Image

```bash
docker build -t express-graphql-app .
```

### Run the Docker Container

```bash
docker run -p 4000:4000 express-graphql-app
```

### Using Docker Compose

If you are using Docker Compose, run:

```bash
docker-compose up --build
```

---

## GraphQL API

### URL:
Access the GraphQL API at:
```
http://localhost:4000/graphql
```

### Example Query:

```graphql
query {
  getUserById
}
```

---

## PM2 Process Management

The app is configured to use PM2 for process management. The `ecosystem.config.js` file defines the PM2 setup.

### Run with PM2 on Dev mode
```bash
pm2-dev index.js
```

### Run with PM2 on Prod
```bash
pm2-runtime start ecosystem.config.js --env production
```

### Monitor Logs
```bash
pm2 logs
```

### Restart Application
```bash
pm2 restart graphql-app
```

---

## Environment Variables

Set the following environment variables in your `.env` file:

```plaintext
AWS_ACCESS_KEY = 
AWS_BUCKET = 
AWS_SECRET_KEY = 
AWS_REGION = 
JWT_SECRET = 
AFRICAS_TALKING_SENDER_NAME =
AFRICAS_TALKING_API_KEY =
AFRICAS_TALKING_USERNAME =
MONGODB_LOCAL_URI = 
MONGODB_PROD_URI =
SENDGRID_API_KEY = 
PM2_MACHINE_NAME = 
PM2_PUBLIC_KEY = 
PM2_SECRET_KEY = 
REGION = 
SECRETKEY = 
SENDGRID_API_KEY = 
PORT = 4000
```

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

Developed by David Kitavi(https://github.com/kitavidavis).