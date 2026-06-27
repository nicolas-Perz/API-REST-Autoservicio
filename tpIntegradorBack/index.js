import express from "express"
import environments from "./src/api/config/environments.js"
import connection from "./src/api/database/db.js"
import cors from "cors"
import { loggerURL} from "./src/api/middlewares/middlewares.js"
import { productRoutes } from "./src/api/routes/index.js"
import { join,__dirname } from "./src/api/utils/index.js"


const app = express()
const PORT = environments.port


//Middleware para parsear los envios en POST y PUT a JSON - Clase 15
app.use(express.json())

//Middlewares
app.use(cors())

// Importacion de middlewares
app.use(loggerURL)

app.use(express.static(join(__dirname,"src/plubic"))) // middleware para servir archivos estaticos

// Optimizaciones en endpoints (Clase 16)
// 1. Implementar manejo try/catch
// 2. Devolver un código de estado 500
// 3. Emprolijar consultas SQL haciendo SELECT unicamente en los campos necesarios y encasillando la consulta en una variable
// 4. En caso de no haber productos devolvemos un 404
// 5. Indicar la cantidad de productos totales usando la longitud de [rows]

/*
/ ------------ ANTES DE LA OPTIMIZACION ------------- /

app.get("/api/products", async (req,res) => {
    const [rows] = await connection.query("SELECT * FROM campeonatos_prueba")
    res.status(200).json({payload:rows})
})
*/

app.get("/", (req,res) => {
    res.send("Hello World123")
})

// Rutas
// app.use("/api/products", product.views.js)
app.use("/api/products", productRoutes)

app.listen(PORT,() => {
    console.log(`Server corriendo es http://localhost:${PORT}`)
})
