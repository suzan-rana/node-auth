const express = require("express");
const AuthRouter = require('./Auth/Route')
const cookieParser = require('cookie-parser')


const app = express();
const PORT = 5500;

const { adminAuth, userAuth } = require('./middleware/Auth') //for protecting the routes; we have basicuser route and admin route

//middleware
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', AuthRouter)

app.get('/admin', adminAuth, (req, res) => res.send('Admin Route.'))
app.get('/basic', adminAuth, (req, res) => res.send('User Route.'))


app.get("/", (req, res) => res.render("home"))
app.get("/register", (req, res) => res.render("register"))
app.get("/login", (req, res) => res.render("login"))
app.get("/admin", adminAuth, (req, res) => res.render("admin"))
app.get("/basic", userAuth, (req, res) => res.render("user"))


app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.redirect("/")
})

const connectDB = require("./db");
connectDB(); //connect to database

app.listen(PORT, () => {
  console.log("App listening at port: 5500");
});

// Handling Error
process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
