const express = require("express");
const AuthRouter = require('./Auth/Route')
const cookieParser = require('cookie-parser')


const app = express();
const PORT = 5500;

//middleware
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', AuthRouter)

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
