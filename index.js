import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors";
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js"
import multer from "multer";
const app = express();
dotenv.config();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "https://socialmediabackend-0e8a.onrender.com",
  })
);
app.use(cookieParser())
app.use(express.json())

const connect = () => {
      mongoose
        .connect(
          process.env.MONGO_URL,        
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("DB connected");
      })
      .catch((err) => {
        throw err;
      });
  };
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});


app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

app.use((err,req,res,next)=>{
    const status=err.status || 500
    const message=err.message || "Something went wrong"
    return res.status(status).json({
        success:false,
        status,message
    })
})

app.listen(process.env.PORT || 8800,()=>{
    connect()
    console.log("connected" );
})