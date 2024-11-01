const express = require("express");
const fs = require("fs");
const app = express();

app.listen(3000, console.log("Servidor levantado"));

const { obtenerJoyas, obtenerJoyasFiltro } = require("./consultas");

const logEventos = (req, res, next) => {
  const fecha = new Date().toISOString();
  const log = `[${fecha}] ${req.method} ${req.url}\n`;

  console.log(log);

  fs.appendFile("registro_eventos.log", log, (err) => {
    if (err) console.error("Error al registrar evento en log", err);
  });
  next();
};

app.use(logEventos);

app.get("/joyas", async (req, res) => {
  try {
    const listJoyas = req.query;
    const joyas = await obtenerJoyas(listJoyas);
    res.json(joyas);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ Error: "al obtener Joyas" });
  }
});

app.get("/joyas/filtros", async (req, res) => {
  try {
    const listFiltro = req.query;
    const joyas = await obtenerJoyasFiltro(listFiltro);
    res.json(joyas);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ Error: "al filtrar" });
  }
});
