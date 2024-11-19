# Real Chat App

## Overview

Real Chat App is a modern chat application that allows users to communicate in real-time. It is built using React for the client-side and Node.js with Express for the server-side.

## Features

- User authentication and registration
- Real-time messaging
- Group chats
- User profiles
- Message history

## Technologies Used

- **Front-end**: React, Redux, Socket.IO
- **Back-end**: Node.js, Express
- **Database**: MongoDB

## Installation

To get a local copy up and running, follow these steps:

### Front-end

Navigate to the front-end directory:

```bash
cd front-end
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

### Back-end

Navigate to the back-end directory:

```bash
cd back-end
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

## Usage

Once both the front-end and back-end are running, open your browser and go to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please follow these steps:

- Fork the repository
- Create a new branch (`git checkout -b feature/YourFeature`)
- Commit your changes (`git commit -m 'Add your feature'`)
- Push to the branch (`git push origin feature/YourFeature`)
- Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Socket.IO for real-time communication
- React Router for navigation

  ## .env-File
  
  1-Create a .env file in the root directory of the project.

  2-Copy the content from the .env.example file provided in the repository.

  3-Fill in the required values for the environment variables:

      API_KEY: Your API key for external services.
      SESSIONS_SECRET_KEY: The secret key used for managing user sessions.
      DB_URL: The connection string for your database.
      email: The email address used for system-related communications.
      password: The password for the email account above.
      forget_name: A default name used in the forget-password flow (or any other relevant feature).

  -Save the .env file.
