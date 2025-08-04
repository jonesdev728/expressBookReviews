const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios');


// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = require('./auth_users.js').users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  require('./auth_users.js').users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the list of books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details by author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get book details by title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

// Get book reviews
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// TASK 10: Get list of books using async/await
regd_users.get("/books-async", async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books", details: err.message });
  }
});

// TASK 11: Get book by ISBN using Promises
regd_users.get("/books/isbn/:isbn-promise", (req, res) => {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.status(500).json({ error: "Failed to fetch book by ISBN", details: err.message });
    });
});

// TASK 12: Get book by Author using async/await
regd_users.get("/books/author/:author-async", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books by author", details: err.message });
  }
});

// TASK 13: Get book by Title using Promises
regd_users.get("/books/title/:title-promise", (req, res) => {
  const title = req.params.title;

  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.status(500).json({ error: "Failed to fetch books by title", details: err.message });
    });
});

module.exports.general = public_users;
