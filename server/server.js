const express = require ('express');

const app = express();
var expressLayouts = require("express-ejs-layouts");
const PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts); 
//app.use(express.static("public"));

//app.get("/", (req, res) => {
//  res.send("Hello World!");
//});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

app.get("/contact-us", (req, res) => {
  res.render("contactus");
});

app.get("/", (req, res) => {
  res.render("homepage");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});