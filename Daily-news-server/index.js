const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

const categories = require("./data/categories.json");
const news = require("./data/news.json");

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Add your database password here
  database: "news", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to the database");
});

app.get("/", (req, res) => {
  res.send("News API Running");
});

app.get("/category/:id", (req, res) => {
  const { id } = req.params;
  const categoryNews = news.filter((n) => n.category_id === id);
  res.send(categoryNews);
});

app.get("/news", (req, res) => {
  res.send(news);
});

app.get("/news/:id", (req, res) => {
  const { id } = req.params;
  const singleNews = news.find((n) => n._id === id);
  res.send(singleNews);
});

app.get("/news-categories", (req, res) => {
  res.send(categories);
});

// Route to get all posts from the database
app.get("/posts", (req, res) => {
  const sql = "SELECT * FROM newslist";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});

//get post by id
app.get("/post/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = "SELECT * FROM newslist WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results[0]);
  });
});

// Route to create a new post in the database
app.post("/posts", (req, res) => {
  const { name, content, image, userId } = req.body;
  const getMaxIdSql = "SELECT MAX(id) AS maxId FROM newslist";
  db.query(getMaxIdSql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const maxId = results[0].maxId || 0;
    const newId = maxId + 1;
    const insertSql =
      "INSERT INTO newslist (id, name, content, image, userId, createdAt) VALUES (?, ?, ?, ?, ?, NOW())";
    db.query(
      insertSql,
      [newId, name, content, image, userId],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({
          id: newId,
          name,
          content,
          image,
          userId,
          createdAt: new Date(),
        });
      }
    );
  });
});

// Route to download a PDF file
app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "./report.pdf"); // Path to your PDF file
  res.download(filePath, "report.pdf", (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      if (!res.headersSent) {
        res.status(500).send("Error downloading file");
      }
    }
  });
});

app.listen(port, () => {
  console.log("Daily News Server running on port", port);
});
