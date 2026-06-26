import express from "express"
import environments from "./src/api/config/environments.js"
import connection from "./src/api/database/db.js"
import cors from "cors"
const app = express()
const PORT = environments.port

//Middlewares
app.use(cors())
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});
//Middleware para parsear los envios en POST y PUT a JSON - Clase 15
app.use(express.json())

app.get("/", (req,res) => {
    res.send("Hello World123")
})

const validateId = (req,res,next) => {
    const id = Number(req.params.id)
    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({error:"El id debe ser un num. entero positivo"})
    }
    req.id = id
    next()
}

const categoriasValidas = ['food','drink']

const validateProduct = (req,res,next) => {
    const {name,price,category} = req.body
    const errores = []

    if(!name || !category || !price){
        errores.push("Datos invalidos, asegurate de incluir todas las categorias")
    }

    //valido name
    if(typeof name !== "string" || name.trim().length < 2){
        errores.push("El nombre debe tener al menos 2 caracteres")
    }
    if(typeof price !== "number" || price <= 0){
        errores.push("El precio debe ser un num. mayor a 0")
    }
    if(!categoriasValidas.includes(category)){
        errores.push("Categoria inválida")
    }

    // Detectamos si existe un error en la lista y lo devolvemos en un 400
    if(errores.length > 0) return res.status(400).json({message:"Datos invalido: " + errores})

    next()
}

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

app.get("/api/products", async (req,res) => {
    // Optimizacion 1
    try{
        // Optimizacion 3
        const sql = "SELECT id,nombre,precio,imagen FROM campeonatos_prueba" 
        const [rows] = await connection.query(sql)

        // Optimizacion 4
        if(rows.length === 0){
            return res.status(404).json({payload:rows}) 
        }

        // Optimizacion 5
        res.status(200).json({payload:rows,total:rows.length})

    }catch(e){
        console.error("Error obteniendo los productos" + e)
        // Optimizacion 2
        res.status(500).json({message:"Error interno al obtener productos"})
    }
})


app.get("/api/products/:id", validateId, async (req,res) => {
    //const id = req.params.id;
    // Optimizacion: el id se valida en la funcion validateId
    try{
        const sql = "SELECT id,nombre,precio,imagen FROM campeonatos_prueba WHERE id = ?"
        const [rows] = await connection.query(sql,[req.id])

        // Si no encontramos el producto
        if(rows.length === 0){
            return res.status(404).json({message:`No se encontró el producto con id: ${req.id}`})
        }

        res.status(200).json({payload:rows})
    }catch(e){
        console.error(e.message)
        res.status(500).json({message: `Error al obtener producto via id: ${req.id}`})
    }
})

// Clase 15
/*
app.post("/api/products",async (req,res) => {
    //post.html linea 24 a 45 (form-productos)
    // por default recibe los datos en tipo String, para solucionarlo y trabajar en JSON se usa el middleware linea 14
    const {name,image,category,price} = req.body
    await connection.query("INSERT INTO campeonatos_prueba (nombre,imagen,categoria,precio) VALUES (?,?,?,?)",[name,image,category,price])
    res.status(200).json({message:"Producto creado exitosamente"})
})*/
app.post("/api/products",validateProduct,async (req,res) => {
    try{
        const {name,image,category,price} = req.body
        const sql = "INSERT INTO campeonatos_prueba (nombre,imagen,categoria,precio) VALUES (?,?,?,?)"
        const [rows] = await connection.query(sql,[name,image,category,price])

        res.status(200).json({message:"Producto creado exitosamente",productId:rows.insertId})
    }catch(e){
        console.error(e)
        res.status(500).json({message:"Error interno del servidor"})
    }
})

app.delete("/api/products/:id",validateId,async (req,res) => {
    //const id = req.params.id
    try{
        const sql = "DELETE FROM campeonatos_prueba WHERE id = ?"
        await connection.query(sql,[req.id])
        res.status(200).json({message:`Producto ${req.id} eliminado exitosamente`})        
    }catch(e){
        console.error("ERROR EN DELETE", e)
        res.status(500).json({message:"Error interno del servidor"})
    }

})

/*
app.put("/api/products", async (req,res) => {
    const {id,name,image,price,category} = req.body
    await connection.query("UPDATE campeonatos_pruebasss SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?",[name,image,price,category,id])
    return res.status(200).json({message:"Producto actualizado exitosamente"})
})*/

app.put("/api/products", async (req,res) => {
    try{
        const {id,name,image,price,category} = req.body
        if(!name || !image || !price || !category){
            return res.status(400).json({message:"Todos los campos del formulario son requeridos"})
        }

        const sql = "UPDATE campeonatos_prueba SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?"
        const [result] = await connection.query(sql,[name,image,price,category,id])

        console.log(result)

        if(result.affectedRows === 0) return res.status(404).json({message:"No se actualizo ningun campo"})
        


        return res.status(200).json({message:"Producto actualizado correctamente"})
    }catch(e){
        console.error(e)
        res.status(500).json({message:"Error interno del servidor"})
    }
})

app.listen(PORT,() => {
    console.log(`Server corriendo es http://localhost:${PORT}`)
})
