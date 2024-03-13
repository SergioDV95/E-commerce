const express = require("express"); 
const app = express();
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb'); 
const cors = require("cors");
const userRouter = require("./Routes/Users");
const productRouter = require("./Routes/Products");
const saleRouter = require("./Routes/Sales");
const reportRouter = require("./Controllers/Reports");
const mailRouter = require("./Controllers/EmailSender"); 
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "GET,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
};
require("dotenv").config();

const URI = process.env.LOCAL;

mongoose.connect(URI).then(() => {
  console.log("DB Connected");
}).catch(err => console.log(err));


//ajustes
app.set('port', process.env.PORT || 3001);


//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static("images"));
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/sales", saleRouter);
app.use("/reports", reportRouter);
app.use("/mailsender", mailRouter);


//puerto
app.listen(app.get('port'), '0.0.0.0', () => {
  console.log('server on port', app.get('port'));
})