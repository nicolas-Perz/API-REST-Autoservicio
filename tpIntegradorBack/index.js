import express from "express"
import environments from "./src/api/config/environments.js"
import connection from "./src/api/database/db.js"
import cors from "cors"
import { loggerURL} from "./src/api/middlewares/middlewares.js"
import { productRoutes, viewRoutes } from "./src/api/routes/index.js"
import { join,__dirname } from "./src/api/utils/index.js"


const app = express()
const PORT = environments.port


//Middleware para parsear los envios en POST y PUT a JSON - Clase 15
app.use(express.json())

//Middlewares
app.use(cors())

// Importacion de middlewares
app.use(loggerURL)

app.use(express.static(join(__dirname,"src/public/"))) // middleware para servir archivos estaticos

// Configuramos EJS como motor de plantillas
app.set("view engine", "ejs")
app.set("views", join(__dirname,"src/views"))

// Optimizaciones en endpoints (Clase 16)
// 1. Implementar manejo try/catch
// 2. Devolver un código de estado 500
// 3. Emprolijar consultas SQL haciendo SELECT unicamente en los campos necesarios y encasillando la consulta en una variable
// 4. En caso de no haber productos devolvemos un 404
// 5. Indicar la cantidad de productos totales usando la longitud de [rows]

app.get("/", (req,res) => {
    res.send("Hello World123")
})

// Rutas
// app.use("/api/products", product.views.js)
app.use("/api/products", productRoutes)
app.use("/dashboard", viewRoutes) // rutas de vistas

app.listen(PORT,() => {
    console.log(`Server corriendo es http://localhost:${PORT}`)
})
