The Echo Back-End powers the real-time functionality and data persistence for the Echo chat application.
It is built using Node.js, Express, Socket.IO, and MongoDB, and handles authentication, user management, messaging, and presence updates.

This repository represents the server-side architecture of a production-style real-time chat system.

🎯 Backend Responsibilities

The backend is responsible for:

Managing user authentication and registration

Handling user connections and presence (online/offline)

Supporting real-time chat events (messages, typing indicators)

Managing user relationships (friends / contacts)

Persisting chat data using MongoDB

🚀 Tech Stack
Layer	Technology
Runtime	Node.js
Framework	Express
Real-Time	Socket.IO
Database	MongoDB (NoSQL)
ODM	Mongoose
📦 Installation & Setup
git clone https://github.com/nwanoruovictory87-web/Echo-back-end.git
cd Echo-back-end
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string

Start the server:

npm start
🔐 REST API Endpoints (Live)

These endpoints are currently implemented and active.
They form the foundation for user authentication and social interactions in Echo.

👤 User Authentication & Accounts
Method	Endpoint	Description
POST	/user/register	Register a new user
POST	/user/v/login	Verify user credentials and log in

These endpoints handle user creation and authentication logic required before accessing chat features.

🧑‍🤝‍🧑 Friends & Contacts
Method	Endpoint	Description
GET	/user/g/u/friends	Retrieve a user’s friend list
POST	/user/a/contact	Add a new contact / friend

These routes enable social graph functionality, allowing users to connect and chat with one another.

🧪 Additional Endpoints

Additional endpoints are currently in development to support upcoming features such as:

Chat rooms

Message history

Group conversations

Notifications

User presence details

These will be added as the platform evolves.

📡 Real-Time Socket.IO Features

Echo uses Socket.IO to provide instant updates across connected clients.

Supported Real-Time Events

💬 Send & receive messages

✍️ Typing indicators

🟢 User online/offline presence

🔄 Live UI updates across clients

Example event flow:

socket.emit("typing", { userId, chatId });
socket.emit("send_message", messageData);

socket.on("receive_message", handleNewMessage);
socket.on("user_online", updatePresence);
socket.on("user_offline", updatePresence);
🧠 Database Design (MongoDB)

Echo uses a NoSQL database structure optimized for real-time applications.

Core Collections

Users

Authentication data

Online/offline status

Contacts / friends list

Chats

Participants

Chat metadata

Messages

Sender

Chat reference

Message content

Timestamps

This schema supports scalability and efficient real-time updates.

🔮 Planned Backend Features

🔐 Token-based authentication (JWT)

🧑‍🤝‍🧑 Group chats

📦 Message persistence & pagination

🔔 Notifications

📎 Media uploads

✅ Read receipts

📄 License

MIT License
© 2026 Victory Nwanoruo
