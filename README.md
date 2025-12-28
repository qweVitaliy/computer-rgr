# Computer RGR – Spring Boot + Docker Compose

An educational RESTful web application developed in Java using Spring Boot.  
The project demonstrates database integration with PostgreSQL, containerization with Docker, and deployment using Docker Compose.

---

## 📌 Project Description

The application implements a basic information system for managing:
- computers
- firms
- countries
- users

The system includes:
- PostgreSQL database integration
- CRUD operations
- server-side logic with Spring Boot
- a simple static web interface (HTML, CSS, JavaScript)

This project is created for educational purposes and is used as a course / RGR (calculation and graphic work) project.

---

## 🛠️ Technology Stack

**Backend:**
- Java 21
- Spring Boot 4
- Spring Data JPA
- Hibernate
- Maven

**Database:**
- PostgreSQL 16

**DevOps / Infrastructure:**
- Docker
- Docker Compose
- Multi-stage Dockerfile

**Frontend:**
- HTML
- CSS
- JavaScript

---

## 📂 Project Structure
computer-rgr/
├── Dockerfile
├── compose.yaml
├── pom.xml
├── mvnw
├── src/
│ ├── main/
│ │ ├── java/
│ │ └── resources/
│ │ ├── static/
│ │ └── application.properties
│ └── test/
└── README.md

---

## ▶️ How to Run the Project

### 1️⃣ Requirements
Make sure the following tools are installed:
- Docker
- Docker Compose

Check installation:

docker --version
docker compose version
2️⃣ Run with Docker Compose

From the project root directory, run:

docker compose up --build


For subsequent runs (when images are already built):

docker compose up

3️⃣ Access the Application

After a successful startup, the application will be available at:

http://localhost:8080

🗄️ Database Configuration

PostgreSQL runs in a separate Docker container.

Connection parameters:

Host: postgres

Port: 5432

Database: computersDB

Username: postgres

Password: postgres

The application connects to the database using the Docker internal network and service name.
