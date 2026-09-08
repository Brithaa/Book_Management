const mysql = require("mysql2");

const express = require("express");

const cors = require("cors");

const bcrypt = require("bcrypt");

const app = express();

app.use(cors());

app.use(express.json());

const db = mysql.createConnection({

  host: "localhost",

  user: "root",

  password: "Brithaa13@",

  database: "book_management"

});

db.connect((err) => {

  if (err) {

    console.error("MySQL connection failed:", err);

    return;

  }

  console.log("MySQL connected successfully");

});

// Test route

app.get("/", (req, res) => {

  res.send("Book Management Backend is working.");

});

// Get all books

app.get("/books", (req, res) => {

  const sql = "SELECT * FROM books";

  db.query(sql, (err, results) => {

    if (err) {

      console.error(err);

      return res.status(500).json({ error: "Database error" });

    }

    res.json(results);

  });

});

// Add book

app.post("/books", (req, res) => {

  const { title, author } = req.body;

  const sql = "INSERT INTO books (title, author) VALUES (?, ?)";

  db.query(sql, [title, author], (err, result) => {

    if (err) {

      console.error(err);

      return res.status(500).json({ error: "Database error" });

    }

    res.json({

      message: "Book added successfully",

      id: result.insertId

    });

  });

});

// Update book

app.put("/books/:id", (req, res) => {

  const { id } = req.params;

  const { title, author } = req.body;

  const sql = "UPDATE books SET title = ?, author = ? WHERE id = ?";

  db.query(sql, [title, author, id], (err, result) => {

    if (err) {

      console.error(err);

      return res.status(500).json({ error: "Database error" });

    }

    res.json({

      message: "Book updated successfully"

    });

  });

});

// Delete book

app.delete("/books/:id", (req, res) => {

  const { id } = req.params;

  const sql = "DELETE FROM books WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.error(err);

      return res.status(500).json({ error: "Database error" });

    }

    res.json({

      message: "Book deleted successfully"

    });

  });

});

// Register user

app.post("/register", async (req, res) => {

  try {

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =

      "INSERT INTO users (email, password_hash) VALUES (?, ?)";

    db.query(sql, [email, hashedPassword], (err, result) => {

      if (err) {

        console.error(err);

        return res.status(500).json({

          error: "Database error"

        });

      }

      res.json({

        message: "User registered successfully"

      });

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Registration failed"

    });

  }

});

// Login user

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

      if (err) {

        console.error(err);

        return res.status(500).json({

          error: "Database error"

        });

      }

      if (results.length === 0) {

        return res.status(401).json({

          error: "Invalid email or password"

        });

      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(

        password,

        user.password_hash

      );

      if (!passwordMatch) {

        return res.status(401).json({

          error: "Invalid email or password"

        });

      }

      res.json({

        message: "Login successful",

        user: {

          id: user.id,

          email: user.email

        }

      });

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Login failed"

    });

  }

});

app.listen(5000, () => {

  console.log("Server is running on port 5000.");

});