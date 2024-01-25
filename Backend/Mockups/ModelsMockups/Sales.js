const mongoose = require("mongoose"); 
const SaleSchema = require("../SalesMockups");
const routerSale = require("express").Router();
const ObjectId = mongoose.Types.ObjectId;

routerSale.get("/", async (req, res) => {
  try {
    const { page, limit, orderBy } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 6
    };
    let query = {deleted: false};
    let sales = await SaleSchema.paginate(query, options);
    if (orderBy) {
      sales = sales.sort({ [orderBy]: -1 });
    }
    const results = sales;
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerSale.get("/allSales", async (req, res) => {
  try {
    const { orderBy } = req.query;

    let query = {deleted: false};

    let sales = [];

    if (orderBy) {
      sales = await SaleSchema.find(query).sort({ [orderBy]: -1 });
    } else {
      sales = await SaleSchema.find(query);
    }

    const results = sales;
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerSale.get("/search", async (req, res) => {
  try {
    const saleData = req.query.term;
    let filteredSale = [];
    if (ObjectId.isValid(saleData)) {
      filteredSale = await SaleSchema.find({ _id: new ObjectId(saleData) });
    }else{
      throw new Error("Invalid ID");
    }
    res.status(200).json(filteredSale);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerSale.get("/:id", async (req, res) => {
  try {
    let sale = await SaleSchema.findOne({ _id: req.params.id });
    res.json(sale);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerSale.post("/", async (req, res) => {
  try {
    let sale = new SaleSchema(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerSale.patch("/:id", async (req, res) => {
  try {
    const saleId = req.params.id;
    const newData = req.body;
    try {
      const updated = await SaleSchema.findOneAndUpdate({ _id: saleId }, newData, { new: true });
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

routerSale.patch("/:id/deleted", async (req, res) => {
  try {
    const saleId = req.params.id;
  
    try {
      const updated = await SaleSchema.findOneAndUpdate({ _id: saleId }, { deleted: true }, { new: true });
      
      if (!updated) {
        return res.status(404).json({ message: 'Sale not was updated' });
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


module.exports = routerSale;