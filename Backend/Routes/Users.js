const mongoose = require("mongoose");
const User = require("../Models/Users");
const routerUsers = require("express").Router();
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const domain = process.env.DOMAIN || "http://localhost:3001";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./images/users";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`);
  },
});

const upload = multer({
  storage: storage,
});

routerUsers.get("/", async (req, res) => {
  try {
    const { page, limit, role } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 6,
      sort: { createdAt: -1 },
      customLabels: { docs: "users", totalDocs: "count" }
    };
    let query = { deleted: false };
    if (role === "vendor") {
      query = { ...query, role: "vendor" };
    } else if (role === "client") {
      query = { ...query, role: "client" };
    }
    let users = await User.paginate(query, options);

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerUsers.get("/allUsers/:role?", async (req, res) => {
  try {
    const { orderBy } = req.query;
    const { role } = req.params;

    let query = { deleted: false };

    if (role === 'vendors') {
      query = { ...query, role: 'vendor' };
    } else if (role === 'clients') {
      query = { ...query, role: 'client' };
    }

    let users = [];

    if (orderBy) {
      users = await User.find(query).sort({ [orderBy]: -1 });
    } else {
      users = await User.find(query);
    }

    const results = users;
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerUsers.get("/search", async (req, res) => {
  try {
    const userData = req.query.term;
    let filteredUser = [];
    if (ObjectId.isValid(userData)) {
      filteredUser = await User.find({ _id: new ObjectId(userData) });
    } else {
      filteredUser = await User.find({
        $or: [
          { name: userData.toLocaleLowerCase() },
          { lastName: userData.toLocaleLowerCase() },
          { email: userData.toLocaleLowerCase() },
          { phone: userData }
        ]
      });
    }
    res.status(200).json(filteredUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerUsers.get("/:email", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerUsers.post("/newUser", upload.single("avatar"), async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    let user = new User({ ...req.body, password: hash });
    if (req.file) {
      user.avatar = `${domain}/images/users/${req.file.filename}`;
    }
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const checkEmail = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.status(409).json({ email: "Correo ya registrado" });
      }
      else {
        next();
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Error al verificar el correo electrónico" });
    });
};

routerUsers.post("/signup", checkEmail, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    let newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
    return res.status(500).json({ name: error.name, message: error.message });
  }
});

routerUsers.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    let user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).json({ user: "Usuario no encontrado" });
    }
    if (req.file) {
      user.avatar = `${domain}/images/users/${req.file.filename}`;
      await user.save();
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
    return res.status(500).json({ name: error.name, message: error.message });
  }
});

routerUsers.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.status(200).json(user);
      } else {
        return res.status(406).json({ password: "La contraseña es incorrecta" });
      }
    } else {
      return res.status(404).json({ email: "Correo no registrado" });
    }
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
    return res.status(500).json({ name: error.name, message: error.message });
  }
});

routerUsers.patch("/:email", upload.single("avatar"), async (req, res) => {
  try {
    const usEmail = req.params.email;
    const newData = req.body;
    const user = await User.findOne({ email: usEmail });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No se encontró un usuario con ese correo" });
    }
    const imagePath = req.file ? req.file.path : undefined;

    let update = { $set: {} };

    if (imagePath) {
      update.$set.avatar = `${domain}/${imagePath}`;
      const startIndex = user.avatar.indexOf("images");
      const avatarFilePathPrev = user.avatar.substring(startIndex);
      const filePath = avatarFilePathPrev
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Archivo eliminado:", filePath);
      } else {
        console.log("El archivo no existe:", filePath);
      }
    }
    if (newData.name) {
      update.$set.name = newData.name;
    }
    if (newData.email) {
      update.$set.email = newData.email;
    }
    if (newData.password) {
      const match = await bcrypt.compare(newData.password, user.password);
      if (!match) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newData.password, salt);
        update.$set.password = hash;
      } else {
        return res.status(406).json({ password: "La nueva contraseña debe ser diferente de la última" });
      }
    }
    if (newData.lastName) {
      update.$set.lastName = newData.lastName;
    }
    if (newData.phone) {
      update.$set.phone = newData.phone;
    }
    if (newData.address) {
      update.$set.address = newData.address;
    }
    if (newData.role) {
      update.$set.role = newData.role;
    }
    const updated = await User.findOneAndUpdate({ email: usEmail }, update, {
      new: true,
    });
    res.status(201).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

routerUsers.patch("/:email/deleted", upload.single("avatar"), async (req, res) => {
  try {
    const usEmail = req.params.email;

    try {
      const updated = await User.findOneAndUpdate({ email: usEmail }, { deleted: true }, { new: true });

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


module.exports = routerUsers;