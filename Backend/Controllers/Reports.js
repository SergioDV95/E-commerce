const Sale = require("./../Models/Sales");
const Product = require("./../Models/Products");
const reportsRouter = require("express").Router();

reportsRouter.get("/generalDataReportPerMonth", async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const yearValue =
      typeof year !== "undefined" ? parseInt(year) : currentYear;
    const monthValue =
      typeof month !== "undefined" ? parseInt(month) : currentMonth;

    const generalDataReportPerMonth = await Sale.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: { $toDate: "$createdAt" } }, yearValue] },
              { $eq: [{ $month: { $toDate: "$createdAt" } }, monthValue] },
            ],
          },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
          bestSeller: {
            $max: {
              name: "$vendor",
              salesCount: { $sum: 1 },
            },
          },
          bestCustomer: {
            $max: {
              name: "$client",
              purchasesCount: { $sum: 1 },
            },
          },
          bestSellingProduct: {
            $max: {
              name: "$products",
              purchasesCount: { $sum: 1 },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          bestSeller: 1,
          bestCustomer: 1,
          bestSellingProduct: 1,
        },
      },
    ]);

    if (generalDataReportPerMonth.length === 0) {
      return res
        .status(404)
        .json({ error: "No sales found for the specified month and year" });
    }

    const report = generalDataReportPerMonth[0];
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred on the server" });
  }
});

reportsRouter.get("/sellersReportMonthly", async (req, res) => {
  try {
    const { page, year, month, limit } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 6,
      sort: { createdAt: -1 },
      customLabels: { docs: "users", totalDocs: "count" },
    };
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const yearValue =
      typeof year !== "undefined" ? parseInt(year) : currentYear;
    const monthValue =
      typeof month !== "undefined" ? parseInt(month) : currentMonth;

    const totalSalesVendors = Sale.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: { $toDate: "$createdAt" } }, yearValue] },
              { $eq: [{ $month: { $toDate: "$createdAt" } }, monthValue] },
            ],
          },
          vendor: { $ne: "--" },
        },
      },
      {
        $group: {
          _id: "$vendor",
          totalSales: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          vendor: "$_id",
          totalSales: 1,
        },
      },
    ]);
    let result = await Sale.aggregatePaginate(totalSalesVendors, options);

    res.status(200).json(result);
  } catch (error) {
    throw new Error(error);
  }
});

reportsRouter.get("/salesPerCategory", async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const yearValue =
      typeof year !== "undefined" ? parseInt(year) : currentYear;
    const monthValue =
      typeof month !== "undefined" ? parseInt(month) : currentMonth;

    const salesPerCategory = await Sale.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: { $toDate: "$createdAt" } }, yearValue] },
              { $eq: [{ $month: { $toDate: "$createdAt" } }, monthValue] },
            ],
          },
        },
      },
      {
        $unwind: {
          path: "$products",
          includeArrayIndex: "productIndex",
        },
      },
      {
        $addFields: {
          convertedProductId: {
            $toObjectId: "$products",
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "convertedProductId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $group: {
          _id: "$productData.category",
          totalSales: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSales: 1,
        },
      },
    ]);

    const allCategories = await Product.distinct("category");
    const totalSalesPerCategory = {};

    allCategories.forEach((category) => {
      totalSalesPerCategory[category] = 0;
    });

    salesPerCategory.forEach((categorySales) => {
      totalSalesPerCategory[categorySales.category] = categorySales.totalSales;
    });

    const results = [];
    allCategories.forEach((category) => {
      results.push({
        category: category,
        totalSales: totalSalesPerCategory[category],
      });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

reportsRouter.get("/salesPerDay", async (req, res) => {
  try {
    let fields = {};
    for (const key in req.query) {
      if (req.query[key]) {
        fields[key] = req.query[key];
      }
    }
    const { year, month, day } = fields;
    const options = {
      page: parseInt(fields.page) || 1,
      limit: parseInt(fields.limit) || 6,
    };
    let newAggregate = Sale.aggregate();
    if (day && month && year) {
      newAggregate
        .match({
          createdAt: {
            $gte: new Date(year, month - 1, day - 1, 20),
            $lt: new Date(year, month - 1, day, 20),
          },
        })
        .group({
          _id: {
            day: { $dayOfMonth: "$createdAt" },
          },
          totalSales: { $sum: 1 },
          totalSold: { $sum: "$total" },
        });
    }
    let result = await Sale.aggregatePaginate(newAggregate, options);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
    return res.status(405).json({ error: error.name, message: error.message });
  }
});

reportsRouter.get("/salesPerClients", async (req, res) => {
  try {
    let fields = {};
    for (const key in req.query) {
      if (req.query[key]) {
        fields[key] = req.query[key];
      }
    }
    const { year, month } = fields;
    const options = {
      page: parseInt(fields.page) || 1,
      limit: parseInt(fields.limit) || 10,
    };

    let newAggregate = Sale.aggregate();
    if (month && year) {
      newAggregate
        .match({
          createdAt: {
            $gte: new Date(Date.UTC(year, month - 1)),
            $lt: new Date(Date.UTC(year, month)),
          },
        })
        .group({
          _id: "$client",
          totalSales: { $sum: 1 },
          totalSold: { $sum: "$total" },
        })
        .sort({
          totalSales: -1,
        });
    } else if (year) {
      newAggregate
        .match({
          createdAt: {
            $gte: new Date(Date.UTC(year, 0)),
            $lt: new Date(Date.UTC(year + 1, 0)),
          },
        })
        .group({
          _id: "$client",
          totalSales: { $sum: 1 },
          totalSold: { $sum: "$total" },
        })
        .sort({
          totalSales: -1,
        });
    }
    let result = await Sale.aggregatePaginate(newAggregate, options);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
    return res.status(405).json({ error: error.name, message: error.message });
  }
});

reportsRouter.get("/salesPerProducts", async (req, res) => {
  try {
    let fields = {};
    for (const key in req.query) {
      if (req.query[key]) {
        fields[key] = req.query[key];
      }
    }
    const { year, month } = fields;
    const options = {
      page: parseInt(fields.page) || 1,
      limit: parseInt(fields.limit) || 10,
    };

    let newAggregate = Sale.aggregate();
    if (month && year) {
      newAggregate
        .match({
          createdAt: {
            $gte: new Date(Date.UTC(year, month - 1)),
            $lt: new Date(Date.UTC(year, month)),
          },
        })
        .unwind("$products")
        .group({
          _id: "$products",
          totalSales: { $sum: 1 },
          totalSold: { $sum: "$total" },
        })
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        })
        .unwind("$productDetails")
        .project({
          _id: 1,
          name: "$productDetails.name",
          totalSales: 1,
          totalSold: 1,
        })
        .sort({
          totalSales: -1,
        });
    } else if (year) {
      newAggregate
        .match({
          createdAt: {
            $gte: new Date(Date.UTC(year, 0)),
            $lt: new Date(Date.UTC(year + 1, 0)),
          },
        })
        .unwind("$products")
        .group({
          _id: "$products",
          totalSales: { $sum: 1 },
          totalSold: { $sum: "$total" },
        })
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        })
        .unwind("$productDetails")
        .project({
          _id: 1,
          name: "$productDetails.name",
          totalSales: 1,
          totalSold: 1,
        })
        .sort({
          totalSales: -1,
        });
    }
    let result = await Sale.aggregatePaginate(newAggregate, options);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
    return res.status(405).json({ error: error.name, message: error.message });
  }
});

module.exports = reportsRouter;
