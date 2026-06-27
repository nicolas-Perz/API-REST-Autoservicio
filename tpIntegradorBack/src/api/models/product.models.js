/* ===============================
    MODELOS DE PRODUCTOS
================================== */

import connection from "../database/db.js";

// TRAER TODOS LOS PRODUCTOS -> es una callback
const selectAllProducts = () => {
    const sql = "SELECT id,nombre,precio,imagen FROM campeonatos_prueba" 
    return connection.query(sql)
}

const selectProductById = (id) => {
    const sql = "SELECT id,nombre,precio,imagen FROM campeonatos_prueba WHERE id = ?"
    return connection.query(sql,[id])
}

const insertNewProduct = (name,image,category,price) => {
    const sql = "INSERT INTO campeonatos_prueba (nombre,imagen,categoria,precio) VALUES (?,?,?,?)"
    return connection.query(sql,[name,image,category,price])
}

const updateProduct = (id,name,image,price,category) => {
    const sql = "UPDATE campeonatos_prueba SET nombre = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?"
    return connection.query(sql,[name,image,price,category,id])
}

const deleteProduct = (id) => {
    const sql = "DELETE FROM campeonatos_prueba WHERE id = ?"
    return connection.query(sql,[id])
}

export default{
    selectAllProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct
}