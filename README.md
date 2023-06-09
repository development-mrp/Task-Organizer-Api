# Task Organizer API

The Task Organizer API is a feature-rich task management application built using Node.js and MongoDB. 
It provides an intuitive and efficient way to organize your tasks, set priorities, and keep track of your progress. 
This app is designed to streamline your workflow and enhance your productivity.

## Features

- **Task Management**: Create, update, and delete tasks effortlessly. The app offers a user-friendly interface for managing tasks efficiently.

- **Prioritization**: Assign priorities to tasks to stay focused on what matters most. Prioritize tasks based on urgency, importance, or custom criteria.

- **Task Categories**: Categorize tasks into different categories or tags for better organization. Create custom categories to suit your specific needs.

- **Due Dates and Reminders**: Set due dates for tasks to stay on top of deadlines. Receive reminders and notifications to ensure you never miss an important task.

- **Task Filtering and Sorting**: Easily search and filter tasks based on various criteria, such as priority, due date, category, or keywords. Sort tasks by different parameters for better organization.

- **User Accounts**: Register an account to securely store your tasks and access them from anywhere. User authentication and authorization features ensure data privacy and security.

- **Data Persistence with MongoDB**: Utilizes MongoDB, a robust and scalable NoSQL database, to store and manage tasks. Ensure seamless data storage and retrieval.

## Installation

1. Clone the repository:
    git clone https://github.com/your-repo.git
2. Navigate to the project directory:
    cd your-repo
3. Install dependencies:
    npm install

4. Set up MongoDB connection: Update the MongoDB connection details in the `config.js` file.

5. Start the application:
    npm start
6. Open your browser and visit:
    http://localhost:3000
    
## Technologies Used

- Node.js
- Express.js
- MongoDB
- HTML/CSS
- JavaScript

## Authentication

All endpoints require authentication via a valid JWT token.

## Base URL

```
https://api.example.com
```

## Endpoints

### 1. Create a task

```
POST /tasks
```

Create a new task.

#### Request Body

| Field    | Type   | Description        |
|----------|--------|--------------------|
| title    | string | Title of the task  |
| priority | string | Priority of the task (e.g., high, medium, low) |

#### Response

```json
{
  "id": "task_id",
  "title": "Task Title",
  "priority": "high",
  "createdAt": "2023-06-10T12:00:00Z"
}
```

### 2. Get all tasks

```
GET /tasks
```

Retrieve all tasks.

#### Response

```json
[
  {
    "id": "task_id1",
    "title": "Task 1",
    "priority": "high",
    "createdAt": "2023-06-10T12:00:00Z"
  },
  {
    "id": "task_id2",
    "title": "Task 2",
    "priority": "medium",
    "createdAt": "2023-06-10T13:00:00Z"
  }
]
```

### 3. Get a specific task

```
GET /tasks/{taskId}
```

Retrieve a specific task by its ID.

#### Response

```json
{
  "id": "task_id",
  "title": "Task Title",
  "priority": "high",
  "createdAt": "2023-06-10T12:00:00Z"
}
```

### 4. Update a task

```
PUT /tasks/{taskId}
```

Update a specific task by its ID.

#### Request Body

```
| Field    | Type   | Description        |
|----------|--------|--------------------|
| title    | string | New title of the task  |
```

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request. For major changes, please discuss them first by opening an issue.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
