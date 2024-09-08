# Library-Management-System-Flask-Vue
Based on your file structure and the description of your application, here's a draft for your `README.md` file:

## Overview

The Library Management System is a web application designed for managing books and user requests. It supports two types of users: librarians and regular users. This application is built using Flask for the backend and Vue.js for the frontend.

### Features

- **For Librarians**:
  - Add and manage books.
  - Approve or reject user requests for books.
  - View and generate reports.
  - Access various statistics and charts.

- **For Regular Users**:
  - Request books.
  - View their current book requests and status.
  - Access and download reports and statistics.

## File Structure

### Backend

- **`app.py`**: Entry point for the Flask application.
- **`celerybeat-schedule`**: File used by Celery for scheduling tasks.
- **`worker_celery.sh`**: Shell script to start the Celery worker.
- **`beat_celery.sh`**: Shell script to start the Celery beat scheduler.
- **`requirements.txt`**: List of Python dependencies.
- **`database.sqlite3`**: SQLite database file.

**Library Application Structure**:
- **`library_app/`**:
  - **`common/`**: Common functionalities used across different modules.
  - **`librarian/`**: Features and functionalities specific to librarians.
  - **`main/`**: Main features and views of the application.
  - **`user/`**: Features and functionalities specific to regular users.
  - **`templates/`**: HTML templates used for rendering pages.

**Static Files**:
- **`static/`**: Contains static assets like images, CSS, and JavaScript files used by the frontend.

### Frontend

- **`src/`**:
  - **`App.vue`**: Main Vue.js component that initializes the application.
  - **`assets/`**: Contains static assets such as favicon and logos.
  - **`components/`**: Vue.js components categorized by functionality (e.g., `common/`, `librarian/`, `user/`).

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/T-Naveen-2308/Library-Management-System-Flask-Vue.git
   ```

2. **Set Up the Backend**:
   - Navigate to the `backend` directory.
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install the dependencies:
     ```bash
     pip install -r requirements.txt
     ```

3. **Set Up the Frontend**:
   - Navigate to the `frontend` directory.
   - Install the required Node.js dependencies:
     ```bash
     npm install
     ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     python app.py
     ```
   - Start the Celery worker and beat scheduler:
     ```bash
     sh worker_celery.sh
     sh beat_celery.sh
     ```
   - Start the frontend server:
     ```bash
     npm run serve
     ```
