const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "/static")))

app.use("/api", authRoutes)

app.use("/api/users", userRoutes)

app.use("/api/posts", postRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "client", "build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`.yellow.bold)
    })
  })
  .catch((err) => {
    console.log(`Error: ${err.message}`.red.underline.bold)
    process.exit(1)
  })
