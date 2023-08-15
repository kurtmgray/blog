# Blog API

This is the API for the Blog App built with Node, Express and MongoDB.

## Features

- RESTful API endpoints for posts and comments
- JWT authentication
- MongoDB data storage
- Deployed on Heroku

## Endpoints

### Posts

- GET /posts - Get all posts
- GET /posts/:id - Get a single post
- POST /posts - Create a new post
- PUT /posts/:id - Update a post
- DELETE /posts/:id - Delete a post

### Comments

- GET /comments/:postId - Get all comments for a post
- POST /comments - Create a new comment for a post
- DELETE /comments/:id - Delete a comment

### Auth

- POST /login - Authenticate and get a JWT token
- GET /verify - Verify a JWT token
## Usage 

### Install Dependencies

`npm install`

### Run

`npm start`

## Technologies
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- Bcryptjs

Contact for protected keys.
