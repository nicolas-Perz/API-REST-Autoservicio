/* ===============================
    CONTROLADORES DE PRODUCTOS
================================== */

import productsModels from "../models/product.models.js"

// GET ALL PRODUCTS
export const getAllProducts = async (req,res) => {
    // Optimizacion 1
    try{
        const [rows] = await productsModels.selectAllProducts()

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
}



// GET PRODUCT BY ID
export const getProductById = async (req,res) => {
    //const id = req.params.id;
    // Optimizacion: el id se valida en la funcion validateId
    try{
        const [rows] = await productsModels.selectProductById(req.id)

        // Si no encontramos el producto
        if(rows.length === 0){
            return res.status(404).json({message:`No se encontró el producto con id: ${req.id}`})
        }

        res.status(200).json({payload:rows})
    }catch(e){
        console.error(e.message)
        res.status(500).json({message: `Error al obtener producto via id: ${req.id}`})
    }
}



// CREATE PRODUCT
// Clase 15
/*
app.post("/api/products",async (req,res) => {
    //post.html linea 24 a 45 (form-productos)
    // por default recibe los datos en tipo String, para solucionarlo y trabajar en JSON se usa el middleware linea 14
    const {name,image,category,price} = req.body
    await connection.query("INSERT INTO campeonatos_prueba (nombre,imagen,categoria,precio) VALUES (?,?,?,?)",[name,image,category,price])
    res.status(200).json({message:"Producto creado exitosamente"})
})*/
export const createProduct = async (req,res) => {
    try{
        const {name,image,category,price} = req.body
        const [rows] = await productsModels.insertNewProduct(name,image,category,price)

        res.status(200).json({message:"Producto creado exitosamente",productId:rows.insertId})
    }catch(e){
        console.error(e)
        res.status(500).json({message:"Error interno del servidor"})
    }
}


// UPDATE PRODUCT
/*
app.put("/api/products", async (req,res) => {
    const {id,name,image,price,category} = req.body
    await connection.query("UPDATE campeonatos_pruebasss SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?",[name,image,price,category,id])
    return res.status(200).json({message:"Producto actualizado exitosamente"})
})*/
export const modifyProduct = async (req,res) => {
    try{
        const {id,name,image,price,category} = req.body
        if(!name || !image || !price || !category){
            return res.status(400).json({message:"Todos los campos del formulario son requeridos"})
        }

        const [result] = await productsModels.updateProduct(id,name,image,price,category)

        // ATENTI A ESTO
        //console.log(result)

        if(result.affectedRows === 0) return res.status(404).json({message:"No se actualizo ningun campo"})
        


        return res.status(200).json({message:"Producto actualizado correctamente"})
    }catch(e){
        console.error(e)
        res.status(500).json({message:"Error interno del servidor"})
    }
}

// DELETE PRODUCT
export const removeProduct = async (req,res) => {
    //const id = req.params.id
    try{
        const [rows] = await productsModels.deleteProduct(req.id)
        res.status(200).json({message:`Producto ${req.id} eliminado exitosamente`})        
    }catch(e){
        console.error("ERROR EN DELETE", e)
        res.status(500).json({message:"Error interno del servidor"})
    }

}