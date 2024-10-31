const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({
  user: "postgres",
  hots: "localhost",
  password: "123456",
  database: "joyas",
  port: 5432,
  allowExitOnIdle: true,
});

const obtenerJoyas = async ({ limits = null, order_by = "", page = 1 }) => {
  try {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    const consulta = format(
      "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    );
    const { rows: joyas } = await pool.query(consulta);
    return joyas;
  } catch (err) {
    console.log("Error en obtener inventario", err);
    throw err;
  }
};

const obtenerJoyasFiltro = async ({precio_min, precio_max, categoria, metal}) => {
    try {
        const filtros = [];

        const agregarFiltro=(campo, comparador, valor) =>{
            filtros.push(`${campo} ${comparador} ${valor}`)
        }

        if(precio_min) agregarFiltro('precio', '>=' , precio_min);
        if(precio_max) agregarFiltro('precio', '<=',precio_max);
        if(categoria)  agregarFiltro('categoria', '=',`'${categoria}'`);
        if(metal) agregarFiltro('metal', '=',`'${metal}'`);

        let consulta = "SELECT * FROM inventario";
        if(filtros.length > 0){
            const filtrosSTR = filtros.join(" AND ");
            consulta += ` WHERE ${filtrosSTR}`;
        }
        
        const {rows : joyas} = await pool.query(consulta);
        return joyas;

    } catch (err) {
        console.log("Error en filtos", err);
        throw err;
    }
  };

module.exports = { obtenerJoyas, obtenerJoyasFiltro };
