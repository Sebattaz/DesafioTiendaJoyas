const express = require("express");
const app = express();

app.listen(3000, console.log("Servidor levantado"));

const {obtenerJoyas} = require("./consultas");

app.get("/joyas", async (req, res)=>{
    try{
        const listJoyas = req.query;
        const joyas = await obtenerJoyas(listJoyas);
        res.json(joyas);
    }catch(err){
        console.log("Error", err);
        res.status(500).json({Error: "al obtener Joyas"});
    }
});