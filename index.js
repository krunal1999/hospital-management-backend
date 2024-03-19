
import express from "express";


const app = express()
const port = 3000;

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/login", (req, res) => {
  res.send("hello world login ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
