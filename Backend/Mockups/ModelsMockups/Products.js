const mongoose = require("mongoose"); 
const ProductSchema = require("../ProductsMockup");
const routerProducts = require("express").Router();
const ObjectId = mongoose.Types.ObjectId;
const multer = require("multer");
const domain = process.env.DOMAIN || "http://localhost:3000";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
     callback(null, "./images/users");
  },
  filename: (req, file, callback) => {
     callback(null, `${Date.now()} - ${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

routerProducts.get("/", async (req, res) => {
  try {
    const { page, limit, orderBy } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 6
    };
    let query = {deleted: false};

    let products = await ProductSchema.paginate(query, options);
    if (orderBy) {
      products = products.sort({ [orderBy]: -1 });
    }
    const results = products;
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerProducts.get("/allProducts", async (req, res) => {
  try {
    const { orderBy } = req.query;

    let query = {deleted: false};


    let products = [];

    if (orderBy) {
      products = await ProductSchema.find(query).sort({ [orderBy]: -1 });
    } else {
      products = await ProductSchema.find(query);
    }

    const results = products;
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerProducts.get("/search", async (req, res) => {
  try {
    const productData = req.query.term;
    let filteredProduct = [];
    if (ObjectId.isValid(userData)) {
      filteredUser = await ProductSchema.find({ _id: new ObjectId(productData) });
    } else {
      filteredUser = await ProductSchema.find({
        $or: [
          { name: userData.toLocaleLowerCase() },
        ]
      });
    }
    res.status(200).json(filteredProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerProducts.get("/:id", async (req, res) => {
  try {
    let product = await ProductSchema.findOne({ _id: req.params.id });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerProducts.post("/", upload.single("img"), async (req, res) => {
  try {
    let product = new ProductSchema(req.body);
    if (req.file) {
      product.img = `${domain}/images/users/${req.file.filename}`;
    }
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerProducts.patch("/:id", upload.single("img"), async (req, res) => {
  try {
    const productID = req.params.id;
    const newData = req.body;
    try {
      const updated = await ProductSchema.findOneAndUpdate({ _id: productID }, newData, { new: true });
      res.json(updated);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerProducts.patch("/:id/deleted", upload.single("avatar"), async (req, res) => {
  try {
    const productID = req.params.id;
  
    try {
      const updated = await ProductSchema.findOneAndUpdate({ _id: productID }, { deleted: true }, { new: true });
      
      if (!updated) {
        return res.status(404).json({ message: 'User not was updated' });
      }
      
      res.json(updated);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = routerProducts;