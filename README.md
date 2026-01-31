# 🎓 Million Platform

**The Ultimate Educational Management System.**

Million Platform is a comprehensive solution for modern education, tailored for the Egyptian high school system (Thanaweya Amma) but scalable globally. It features AI-powered tutoring, live virtual classrooms, gamified exams, and a cross-platform mobile app.

---

## 🌐 Live Demo & Repository

- **GitHub Repository**: [https://github.com/your-username/million-platform](https://github.com/your-username/million-platform)
- **Live Platform**: [https://million-platform-web.vercel.app](https://million-platform-web.vercel.app)
- **API Documentation**: [https://api-million-platform.railway.app/docs](https://api-million-platform.railway.app/docs)

---

## 🚀 Key Features

### 🧑‍🎓 For Students
-   **🤖 AI Personal Tutor**: 24/7 homework help and study planning powered by GPT-4.
-   **📺 Live Classes**: Interactive video sessions with low-latency Jitsi integration.
-   **🎮 Gamified Exams**: Competitive testing with leaderboards and instant feedback.
-   **📱 Mobile App**: Study on the go with our sleek React Native application.

### 👨‍🏫 For Teachers & Admins
-   **📊 Analytics Dashboard**: Real-time insights into student performance and enrollment.
-   **📝 Content Management**: Effortlessly upload lessons and create interactive quizzes.
-   **💳 Secure Payments**: Full Stripe integration for seamless subscriptions and course purchases.

---

## 🛠️ Tech Stack

### Monorepo Architecture (`Turborepo`)

| Component | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), [ShadcnUI](https://ui.shadcn.com/) |
| **Backend** | [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), [Redis](https://redis.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Mobile** | [React Native](https://reactnative.dev/) ([Expo](https://expo.dev/)) |
| **Real-time** | [Socket.io](https://socket.io/) |
| **Hosting** | [Vercel](https://vercel.com/) (Frontend), [Railway](https://railway.app/) (Backend) |

---

## 🏃‍♂️ Getting Started (Development)

### Prerequisites
-   **Node.js** 18 or higher
-   **PostgreSQL** & **Redis** (running locally or via Docker)
-   API Keys for **OpenAI** & **Stripe** (optional for local testing)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/million-platform.git
    cd million-platform
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    ```bash
    cp .env.example .env
    # Edit the .env file with your specific configuration
    ```

4.  **Database Initialization**
    ```bash
    # Start database services if using Docker
    docker-compose up -d postgres redis

    # Run Prisma migrations
    cd apps/api
    npx prisma migrate dev
    ```

5.  **Launch the Platform**
    ```bash
    # From the root directory
    npm run dev
    ```
    -   **Web**: `http://localhost:3000`
    -   **API**: `http://localhost:4000`
    -   **Mobile**: `cd apps/mobile && npx expo start`

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with ❤️ by the **Million Platform Team**
