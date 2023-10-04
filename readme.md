# Simple Task RESTful API

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Database](#database)
- [Error Handling](#error-handling)
- [Testing](#testing)

## Overview

This RESTful API is a simple task management system that allows users to register, log in, log out, and perform CRUD operations on tasks. It's built with Node.js, Express.js, and PostgreSQL to provide a robust and scalable backend.

## Features

- User API:
  - User registration
  - User login
  - User logout
- Task API:
  - Create a new task
  - Get tasks
  - Update task details
  - Delete a task

## Requirements

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- PostgreSQL database server

## Usage

The API is now running locally on `http://localhost:5000`. You can use tools like Postman or curl to make HTTP requests to the available endpoints.

## Endpoints

### User API

- POST `/api/users/register`: Register a new user.
- POST `/api/users/login`: Log in a user.
- POST `/api/users/logout`: Log out the currently authenticated user.

### Task API

- POST `/api/tasks`: Create a new task.
- GET `/api/tasks`: Get all tasks.
- GET `/api/tasks/:taskId`: Get details of a specific task.
- PUT `/api/tasks/:taskId`: Update a task.
- DELETE `/api/tasks/:taskId`: Delete a task.

## Authentication

To access protected routes (e.g., creating tasks), you must include a valid token in the `token` header.

## Database

This API uses PostgreSQL as the database. You can find the database schema in the `db` file.

for creating table in the **begining** use this:

```sql
CREATE TABLE users (
  id_user SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  token VARCHAR(255)
);
```

```sql
CREATE TABLE tasks (
  id_task SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  status VARCHAR(255),
  due_date date,
  user_id VARCHAR(255)
);
```

## Error Handling

The API provides detailed error messages in JSON format to help you identify and resolve any issues.

## Testing

For testing poupose is update after this with postman
