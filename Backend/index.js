const express = require("express"); 
const app = express();
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

const URI = process.env.MONGODB;

//conexión a la base de datos
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


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