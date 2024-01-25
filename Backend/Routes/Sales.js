const saleRouter = require("express").Router();
const Sale = require("../Models/Sales");
const Product = require("../Models/Products");
const User = require("../Models/Users");

//Rutas GET

saleRouter.get("/", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.query) {
         if (req.query[field]) {
            fields[field] = req.query[field];
         }
      }
      const options = {page: parseInt(fields.page) || 1, limit: parseInt(fields.limit) || 10, populate: {path: "products", select: "name price"}};
      let query = {deleted: false};
      if (fields.search) {
         const search = fields.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         const dateSearch = new Date(Date.UTC(fields.search));
         query = {
            ...query,
            $or: [
               { client: { $regex: search, $options: "i" } },
               { vendor: { $regex: search, $options: "i" } },
               { createdAt: { $eq: dateSearch } }
            ]
         };
      }
      if (fields.vendor) {
         query = {
            ...query,
            vendor: fields.vendor
         };
         if (fields.search) {
            delete query.$or;
            const search = fields.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const dateSearch = new Date(Date.UTC(search));
            query = {
               ...query,
               vendor: fields.vendor,
               $or: [
                  { client: { $regex: search, $options: "i" } },
                  { createdAt: { $eq: dateSearch } }
               ]
            };
         }
      }
      if (fields.id) {
         query = { ...query, _id: fields.id };
      }
      const sale = await Sale.paginate(query, options);
      return res.status(200).json(sale);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({error: error.name, message: error.message});
   }
});

//Rutas POST

saleRouter.post("/", async (req, res) => {
   try {
      let { client, quantity } = req.body;
      const Client = await User.findOne({email: client}, {email: 1});
      let sale;
      if (Client) {
         sale = new Sale({
            ...req.body, 
            client: Client.email
         });
         for (let id in quantity) {
            await Product.updateOne({_id: id}, {$inc: {stock: -quantity[id]}});
         }
      } else if (!Client) {
         return res.status(404).json({client: "Cliente no encontrado"});
      } else {
         return res.status(404).json({products: "Producto(s) no encontrado(s)"});
      }
      await sale.save();
      return res.status(201).json(sale);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(400).json({ error: error.name, message: error.message });
   }
});

//Rutas PATCH

saleRouter.patch("/", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.body) {
         if (req.body[field]) {
            fields[field] = req.body[field];
         }
      }
      const sale = await Sale.findById(fields.id);
      if (!sale) {
         return res.status(404).json({error: "Venta no encontrada"});
      }
      if (fields.client) {
         const Client = await User.findOne({email: fields.client});
         if (!Client) {
            return res.status(404).json({client: "Cliente no encontrado"});
         }
      }
      //SOFT Delete
      if (fields.deleted) {
         sale.deleted = fields.deleted;
         await sale.save();
         return res.status(200).json(sale);
      }
      for (const value in fields) {
         if (fields[value] === sale[value]) {
            delete fields[value];
         }
      }
      if (fields.quantity) {
         let operation;
         for (let id in fields.quantity) {
            if(fields.quantity[id] > sale.quantity[id]) {
               operation = fields.quantity[id] - sale.quantity[id];
               await Product.updateOne({_id: id}, {$inc: {stock: -operation}});
            } else if (fields.quantity[id] < sale.quantity[id]) {
               operation = sale.quantity[id] - fields.quantity[id];
               await Product.updateOne({_id: id}, {$inc: {stock: operation}});
            }
         }
      }
      Object.assign(sale, fields);
      await sale.save();
      return res.status(202).json(sale);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({error: error.name, message: error.message});
   }
});

//Rutas DELETE para las pruebas en la base de datos

saleRouter.delete("/:id", async (req, res) => {
   try {
      let saleDeleted = await Sale.deleteOne({_id: req.params.id});
      return res.json(saleDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({error: error.name, message: error.message})
   }
});

saleRouter.delete("/", async (req, res) => {
   try {
      let saleDeleted;
      if (Object.keys(req.query).length > 0) {
         saleDeleted = await Sale.deleteMany(req.query);
      } else {
         saleDeleted = await Sale.deleteMany({});
      }
      return res.json(saleDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({error: error.name, message: error.message})
   }
});

module.exports = saleRouter;
//cambio x