# 🔐 ChatHub — Private, Secure & Real-Time Communication Platform

Welcome to **ChatHub** – a sleek, private, and secure chat application built for seamless one-on-one and group communication. Whether you're messaging a friend or collaborating with a team, ChatHub ensures fast, encrypted, and delightful conversations — anytime, anywhere.

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Made%20with-💖%20by%20Amit-blueviolet?style=flat-square" />
</p>

---

## ✨ Features

### 💬 Core Messaging
- **One-on-One & Group Chats** – Communicate freely and securely.
- **Real-Time Updates** – Powered by WebSockets for blazing-fast interactions.
- **Message Preview** – See new messages without opening the chat.
- **Read & Delivery Receipts** – Know when your messages are seen.

### 🔐 Privacy & Security
- **End-to-End Encryption** – Hybrid AES + RSA encryption keeps your conversations fully private.
- **Zero-Access Policy** – Only you and your chat partner can read your messages.

### 🛠️ Functional Goodies
- **Friend Requests & Group Invitations** – Manage your network with ease.
- **Online/Offline Status Indicators** – Know who’s available to chat.
- **Optimistic UI Updates** – Instant feedback for a smoother experience.
- **Dark & Light Modes** – Customize your look and feel.

### 🌍 Cross-Platform & PWA Ready
- **Progressive Web App (PWA)** – Install like a native app on desktop or mobile.
- **Responsive Design** – Built for flawless experiences on phones, tablets, and desktops.
- **Web Push Notifications** – Stay notified even when offline.

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Code-By-Amit/Chat-Hub.git
```

2. Navigate to Frontend and Backend Folder and Install dependencies:
```
# Frontend
cd Frontend 
npm install

# Backend
cd Backend
npm install
```

3. Set up environment variables
   - in `Backend/.env`:
```javascript
PORT=
JWT_SECRET=
MonogDb_URL=

NODE_ENV=development
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

FrontEnd_Url=
```

- in `Frontend/.env`
```javascript
VITE_BACKEND_URL=
VITE_WEB-PUSH_PUBLICKEY=
``` 

4. Start the development servers:
- Backend 
``` bash
    cd Backend
    npm run dev
```
- Frontend
```bash
   cd Frontend
   npm run dev
```

## Contributing 🤝
Contributions are welcome! 🎉
Fork the repo, create a new branch, and submit a pull request with your awesome improvements.

 💡 New features, bug fixes, documentation improvements — we welcome them all!

 ## 📣 Stay Connected
 Be a part of the ChatHub community. Feel free to share feedback, report bugs, or request features.

## 💖 Thank You!
Thank you for checking out ChatHub.

I hope you enjoy using it as much as i enjoyed building it.
Happy chatting! 🚀
