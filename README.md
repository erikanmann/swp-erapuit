# swp-erapuit

A custom web application developed for the university course “Software Project”. The platform helps a small sawmill digitize its entire workflow — from log intake and production to packing, logistics, and future full automation.

## Team

* Ruud Tammel
* Erik Anmann
* Tõnis Tõnissoo
* Jüri Tsõmbaljuk

## Key Features

* Record, track, and analyze all production and logistics data in one place
* Integrate with existing tools such as SharePoint and veoseleht.ee
* Prepare the factory for future sensor and camera integrations

## Technology Stack

* **Backend**: Java 17+, Spring Boot, Gradle
* **Frontend**: React, CSS (optimized for desktop, tablet, and smartphone)
* **Database**: PostgreSQL with Hibernate (JPA) and Flyway migrations

## Getting Started

1.  **Clone the Repository**
    ```bash
    git clone [https://gitlab.ut.ee/tonis.tonissoo/swp-erapuit.git](https://gitlab.ut.ee/tonis.tonissoo/swp-erapuit.git)
    cd swp-erapuit
    ```

2.  **Set Up the Database**
    * Install PostgreSQL 17 or newer.
    * Create a new database, for example:
        ```sql
        CREATE DATABASE erapuit_dev;
        ```
    * Update connection details in `backend/src/main/resources/application.properties`:
        ```properties
        spring.datasource.url=jdbc:postgresql://localhost:5432/erapuit_dev?currentSchema=app
        spring.datasource.username=postgres
        spring.datasource.password=your_password
        spring.jpa.hibernate.ddl-auto=validate
        spring.flyway.enabled=true
        spring.flyway.locations=classpath:db/migration
        ```
    Flyway will automatically run the migration scripts on first startup and create all required tables and views.

3.  **Run the Backend**
    Make sure you are inside the `backend` directory:
    ```bash
    cd backend
    ./gradlew bootRun
    ```
    Once the backend starts successfully, it will be available at:
    `http://localhost:8080`

    You can check the deliveries API endpoint:
    `http://localhost:8080/api/deliveries`

4.  **Run the Frontend**
    Open a new terminal window and run:
    ```bash
    cd frontend
    npm install
    npm start
    ```
    The application will open automatically in your browser at:
    `http://localhost:3000`

5.  **Using the Application**
    * Open the frontend in a browser.
    * Use the “Register Incoming Delivery” page to add new timber deliveries.
    * Each delivery record is saved to the PostgreSQL database through the backend API.
    * You can also delete existing deliveries from the interface.

## Folder Structure

```text
swp-erapuit/
│
├── backend/                     # Spring Boot application
│   ├── src/main/java/com/erapuit/backend/
│   │   ├── controller/          # REST API controllers
│   │   ├── service/             # Business logic
│   │   ├── model/               # Entity models
│   │   ├── repository/          # JPA repositories
│   │   └── config/              # App configuration (CORS, etc.)
│   └── src/main/resources/db/migration/   # Flyway migration scripts
│
├── frontend/                    # React application
│   ├── src/components/          # UI components
│   ├── src/pages/               # Page-level components
│   ├── src/api/                 # API communication
│   └── src/styles/              # CSS files
│
└── README.md                    # This file
```


## Documentation

Full technical and functional documentation is available in the Project Wiki:
[https://gitlab.ut.ee/tonis.tonissoo/swp-erapuit/-/wikis/home](https://gitlab.ut.ee/tonis.tonissoo/swp-erapuit/-/wikis/home)