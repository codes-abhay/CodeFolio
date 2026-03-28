# CodeFolio 

**CodeFolio** is a comprehensive professional networking platform designed specifically for developers. It enables users to build standout portfolios, showcase their GitHub repositories, share insights through posts, and connect with a global community of elite engineers.

![CodeFolio Banner](https://via.placeholder.com/1000x300?text=CodeFolio+Developer+Network)

##  Key Features

-   **Professional Developer Portfolios**: Create a detailed profile including skills, experience, and education.
-   **Smart Developer Search**: Advanced search functionality to filter developers by tech stack, name, or location.
-   **Image Upload System**: Full-featured profile picture management powered by **Multer**, with automated propagation across all posts.
-   **GitHub Integration**: Dynamically fetch and display your latest repositories using the GitHub API.
-   **Engagement Platform**: Post updates, like, and comment on other developers' work to build your network.
-   **Secure Authentication**: Robust session management using JSON Web Tokens (JWT) and encrypted passwords.

##  Tech Stack

-   **Frontend**: React.js, Redux (State Management), Axios, CSS3
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose ODM)
-   **Security**: JWT (JSON Web Tokens), Bcrypt.js
-   **File Handling**: Multer (Local storage implementation)

##  Getting Started

### Prerequisites

-   Node.js installed
-   MongoDB Atlas account or local MongoDB instance

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/codefolio.git
    cd codefolio
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GITHUB_TOKEN=your_github_personal_access_token
    ```

3.  **Install Dependencies**
    ```bash
    # Install server dependencies
    npm install

    # Install client dependencies
    npm install --prefix client
    ```

4.  **Run the Application**
    ```bash
    npm run dev
    ```
    The app will start on [http://localhost:3000](http://localhost:3000).

##  Technical Highlights (For Interviewers)

This project showcases several advanced full-stack concepts:

-   **Data Consistency**: Implemented a cascade update logic where updating a user's avatar automatically propagates changes to the `Post` and `Comment` collections using MongoDB's `updateMany` with `arrayFilters`.
-   **System Design**: Built a custom file upload pipeline with Multer, handling multipart form data and providing real-time UI feedback.
-   **API Optimization**: Structured the Search API with Regex-based filtering to allow flexible discovery of talent within the platform.

##  License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by Abhay Sachdeva
