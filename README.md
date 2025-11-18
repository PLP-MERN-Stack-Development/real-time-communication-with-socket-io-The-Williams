# Real-Time Chat Application with Socket.io

A full-stack real-time chat application built with **React** and **Node.js/Express**, leveraging **Socket.io** for bidirectional communication. This project demonstrates real-time messaging, user presence, multiple chat rooms, and advanced chat features.

---

## Table of Contents

- [Objective](#objective)  
- [Features](#features)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Advanced Features Implemented](#advanced-features-implemented)  
- [Screenshots / GIFs](#screenshots--gifs)  
- [Expected Outcome](#expected-outcome)  
- [Requirements](#requirements)  
- [Resources](#resources)  
- [Submission Instructions](#submission-instructions)  
- [License](#license)  

---

## Objective

Build a real-time chat application using Socket.io that demonstrates **bidirectional communication** between clients and server. The app implements features like live messaging, notifications, typing indicators, and online status updates.

---

## Features

### Core Chat Features

- Real-time messaging between clients
- Multiple chat rooms support
- Global chat room for all users
- Display messages with sender name and timestamp
- Typing indicators when a user is composing a message
- Online/offline status for users

### Advanced Chat Features

- Private messaging between users
- File or image sharing
- Read receipts for messages
- Message reactions (like, love, etc.)
- Real-time notifications (new messages, user joins/leaves)
- Sound notifications for new messages
- Browser notifications via Web Notifications API
- Message search functionality
- Message pagination for older messages

---

## Project Structure

```

socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── socket/         # Socket.io client setup
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Event handlers and logic
│   ├── models/             # Data models
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server entry point
│   └── package.json        # Server dependencies
└── README.md               # Project documentation

````

---

## Getting Started

1. Accept the GitHub Classroom assignment invitation  
2. Clone your personal repository:  
   ```bash
   git clone <https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-The-Williams/blob/main/Week5-Assignment.md>
   cd socketio-chat
````

3. Install dependencies (server and client):

### Server

```bash
cd server
npm install
```

### Client

```bash
cd client
npm install
```

---

## Usage

### Run the Server

```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000` (or the configured `PORT`).

### Run the Client

```bash
cd client
npm run dev
```

Client runs on `http://localhost:5173` (or the configured port). The front-end automatically connects to the Socket.io server.

---

## Advanced Features Implemented

* **Private messaging** between users
* **Multiple chat rooms** with room-specific message history
* **Typing indicators**
* **Read receipts** for messages
* **Real-time notifications** (join/leave, new messages)
* **Sound notifications**
* **Browser notifications**
* **Message pagination** for older messages
* **Message search functionality**

---

## Screenshots 
Screenshot (Chat Window). png
Screenshot (Real Timee Chat Login). pngs
---

## Expected Outcome

* Fully functional real-time chat application
* Smooth bidirectional communication using Socket.io
* Good user experience with proper error handling and loading states
* Implementation of at least 3 advanced chat features
* Responsive design that works on desktop and mobile devices

---

## Requirements

* Node.js v18 or higher
* npm or yarn
* Modern web browser
* Basic understanding of React and Express

---

## Resources

* [Socket.io Documentation](https://socket.io/docs/)
* [React Documentation](https://react.dev/)
* [Express.js Documentation](https://expressjs.com/)
* [Building a Chat Application with Socket.io](https://socket.io/get-started/chat/)


## License

This project is licensed under the MIT License.

