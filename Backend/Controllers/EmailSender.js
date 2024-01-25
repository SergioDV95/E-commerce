const nodemailer = require("nodemailer");
const emailRouter = require("express").Router();

const contraseñaparanodemailer = "bvzf otiz jnbo zybt"


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "proyectopolar2024@gmail.com",
    pass: "jlzg aqmj mmce zbvu"
  }
});

function randomNumber() {
  return Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
}

let keys = {};
let newKeys = {};
let timeout = {};

const checkKeys = (req, _, next) => {
  const { email } = req.body;
  if (!keys[email]) {
    keys[email] = randomNumber();
    newKeys[email] = keys[email]
  } else if (newKeys[email] === keys[email]) {
    keys[email] = randomNumber();
    newKeys[email] = keys[email]
  }
  next();
}

emailRouter.post("/", checkKeys, async (req, res) => {
  const { email } = req.body;
  const mail = {
    from: "proyectopolar2024@gmail.com",
    to: email,
    subject: "Recuperar contraseña",
    text: keys[email],
  };

  transporter.sendMail(mail, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Ha ocurrido un error: " + error);
    } else {
      if (timeout[email]) {
        clearTimeout(timeout[email]);
      }
      timeout[email] = setTimeout(() => {
        keys[email] = randomNumber();
      }, 60000 * 5);
      res.status(200).send("Email enviado: " + info.response);
    }
  });
})

emailRouter.post("/keyValidation", async (req, res) => {
  const { userKey, email } = req.body
  if (userKey === keys[email]) {
    clearTimeout(timeout[email]);
    delete timeout[email];
    delete keys[email];
    delete newKeys[email];
    return res.status(200).send("Clave correcta")
  } else {
    return res.status(400).json({userKey: "Clave de recuperación incorrecta"})
  }
})

module.exports = emailRouter;

