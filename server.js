require("dotenv").config();
const express = require("express");
const connectToDb=require("./database/db");
const authRoutes=require("./routes/auth-route");
const homeRoutes=require("./routes/home-route");
const adminRoutes=require("./routes/admin-route");
const uploadImageRoutes=require("./routes/image-route");

const app = express();
const port = process.env.PORT;

//connect to database
connectToDb();

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/home",homeRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/image",uploadImageRoutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
