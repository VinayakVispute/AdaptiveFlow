<div align="center">

# AdaptiveFlow 🎥

![AdaptiveFlow Banner](./client/public/assets/header-workflow.svg)

**Your go-to solution for adaptive video streaming and seamless playback across devices.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with ❤️ by Vinayak Vispute](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20by-Vinayak%20Vispute-red)](https://github.com/VinayakVispute)

[![Live Version](https://img.shields.io/badge/Live%20Version-%2300C853.svg?style=for-the-badge&logo=firefox)]([https://adaptiveflow.example.com](https://adaptiveflow.visputevinayak.co/))
[![Workflow Design](https://img.shields.io/badge/Workflow%20Design-%23FF4081.svg?style=for-the-badge&logo=draw.io)](./client/public/assets/header-workflow.svg)

</div>

---

## 🚀 Key Features

- 📡 **Adaptive Bitrate Streaming**: HLS-based streaming adjusts video quality based on network speed and device.
- 🛠️ **Scalable Video Processing**: Efficient, scalable transcoding powered by Docker and Azure.
- ☁️ **Cloud Storage**: Secure and reliable storage with Azure Blob Storage.
- 🌐 **Global Delivery**: Fast video delivery worldwide with Azure CDN.
- 🔒 **Enhanced Security**: Robust protection for video assets and user data.

---

## 🛠 Tech Stack

| Category         | Technologies                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frontend         | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| Backend          | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)     |
| Cloud Services   | ![Azure](https://img.shields.io/badge/Azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white)                                                                                                                                                                                                                         |
| Database         | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)                                                                                                                                                                                                                    |
| Video Processing | ![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)                                                                                                                          |

---

## 🔍 Architecture Overview

1. **Frontend (Next.js Client)** 🖥️

   - Intuitive and responsive UI/UX
   - Video metadata management with PostgreSQL

2. **Azure Blob Storage** 📦

   - Secure and scalable video file storage

3. **Azure Queue** 📊

   - Efficient task management for video processing

4. **TypeScript Worker** 🔧

   - Listens to Azure Queue and initiates processing

5. **Azure Container Instances** 🐳

   - Manages Docker containers for video transcoding

6. **FFmpeg Transcoding Engine** 🎞️

   - Transcodes videos into multiple resolutions for HLS streaming

7. **Database & Webhooks** 📡
   - Stores processed video data and provides real-time updates

---

## 🐳 Docker Setup

Our Docker configuration ensures consistent and isolated video processing:

- **Base Image**: Lightweight Node.js on Alpine Linux
- **Dependencies**: Includes FFmpeg for seamless video processing
- **Workflow**: Compiles TypeScript and runs the Node.js app
- **Scalability**: Supports concurrent container execution

---

## 🗃 Service Layer

The service layer handles video processing with Azure integration:

- 🔐 **Secure Configurations**: Loads Azure credentials for flexible deployment
- 🔄 **Queue Processing**: Reliable job management with Azure Queue
- 🖥️ **Container Control**: Scalable, on-demand video transcoding

---

## 🌐 Client Application

Built for an exceptional user experience:

- 🎨 **Modern UI**: Crafted with Next.js, React, and Tailwind CSS
- 🔔 **Real-time Updates**: WebSocket notifications for processing status
- 🎥 **Adaptive Playback**: HLS streaming for optimal viewing experience

---

## 🔑 Key Highlights

- ⚡ **Real-time Adaptive Streaming**: On-the-fly quality adjustment
- ☁️ **Cloud-based Scalability**: Reliable, expandable infrastructure
- 🚀 **Efficient Transcoding**: Rapid, consistent video processing
- 📢 **Instant Notifications**: Real-time updates on processing status

---

## 📜 Conclusion

AdaptiveFlow offers a robust, scalable solution for adaptive video streaming and processing. Its modular design, powered by Docker and Azure, ensures a reliable, high-quality streaming experience for all users.

---

## License

AdaptiveFlow is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

---

<div align="center">
  <p>Made with ❤️ by Vinayak Vispute</p>
</div>
