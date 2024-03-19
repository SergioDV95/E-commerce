const productRouter = require("express").Router();
const Product = require("../Models/Products");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const domain = process.env.DOMAIN || "https://backendprueba.xyz";
const path = require('path');


const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      const dir = "./images/products";
      fs.mkdirSync(dir, { recursive: true });
      callback(null, dir);
   },
   filename: (req, file, callback) => {
      callback(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`);
   }
});

const upload = multer({ storage: storage });

//Rutas GET

productRouter.get("/", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.query) {
         if (req.query[field]) {
            fields[field] = req.query[field];
         }
      }
      const options = {page: parseInt(fields.page) || 1, limit: parseInt(fields.limit) || 6};
      let query = { deleted: false };
      if (fields.search) {
         const search = fields.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         query = {
            ...query,
            $or: [
               { name: { $regex: search, $options: "i" } },
               { category: { $regex: search, $options: "i" } },
               { description: { $regex: search, $options: "i" } }
            ]
         };
      }
      if (fields.id) {
         const ObjectId = new mongoose.Types.ObjectId(fields.id);
         query = { ...query, _id: ObjectId };
       }
   
      const products = await Product.paginate(query, options);
      return res.status(200).json(products);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({name: error.name, message: error.message});
   }
});

productRouter.get("/productsList", async (req, res) => {
   try {
      const products = await Product.find({deleted: false}, {name: 1, imageURL: 1, price: 1, stock: 1});
      return res.status(200).json(products);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({name: error.name, message: error.message});
   }
});

productRouter.get("/:id", async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);
      if (!product) {
         return res.status(404).json({product: "Producto no encontrado"});
      }
      return res.status(200).json(product);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({name: error.name, message: error.message});
   }
});

//Rutas POST

productRouter.post("/", async (req, res) => {
   try {
      let product = new Product(req.body);
      await product.save();
      return res.status(201).json(product);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(500).json({ name: error.name, message: error.message });
   }
});

productRouter.post("/uploadImage", upload.single("image"), async (req, res) => {
   try {
      let product = await Product.findById(req.body.id);
      if (!product) {
         return res.status(404).json({product: "Producto no encontrado"});
      }
      if (req.file) {
         product.imageURL = req.file.path;
         await product.save();
      }
      return res.status(200).json(product);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(500).json({name: error.name, message: error.message});
   }
});

productRouter.post("/cart", async (req, res) => {
   try {
      const product = await Product.find({_id: {$in: req.body}});
      if (product) {
         return res.status(200).json(product);
      } else {
         return res.status(404).json({error: "No se encontraron productos"});
      }
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({name: error.name, message: error.message});
   }
});

//Rutas PATCH

productRouter.patch("/", upload.single("image"), async (req, res) => {
   try {
      let fields = {};
      for (const key in req.body) {
         if (req.body[key]) {
            fields[key] = req.body[key];
         }
      }
      const product = await Product.findById(fields.id);
      if (!product) {
         return res.status(404).json({ error: "Producto no encontrado" });
      }
      //SOFT Delete
      if (fields.deleted) {
         product.deleted = fields.deleted;
         await product.save();
         return res.status(200).json(product);
      }
      if (req.file) {
         fields.imageURL = `${domain}/images/products/${req.file.filename}`;
      }
      for (const value in fields) {
         if (fields[value] === product[value]) {
            delete fields[value];
         }
      }
      Object.assign(product, fields);
      await product.save();
      return res.status(202).json(product);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(500).json({name: error.name, message: error.message});
   }
});

//Rutas DELETE para las pruebas en la base de datos

productRouter.delete("/:id", async (req, res) => {
   try {
      let productDeleted = await Product.deleteOne({_id: req.params.id});
      return res.json(productDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({name: error.name, message: error.message})
   }
});

productRouter.delete("/", async (req, res) => {
   try {
      let productDeleted;
      if (Object.keys(req.query).length > 0) {
         productDeleted = await Product.deleteMany(req.query);
      } else {
         productDeleted = await Product.deleteMany({});
      }
      return res.json(productDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({name: error.name, message: error.message})
   }
});

module.exports = productRouter;