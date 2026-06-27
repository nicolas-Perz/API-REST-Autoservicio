import { join,__dirname } from "../utils/index.js" 
import productModels from "../models/product.models.js"

export const indexView = async (req,res) => {
    try{
        const [rows] = await productModels.selectAllProducts()

        res.render("index",{
            title:"Dashboard",
            about:"Nuestros Productos",
            productsArray: rows
    })
    }catch(e){
        console.error(e)
        res.status(200).json({message:"Error interno"})
    }

} 

export const getProductView = (req,res) => {
    res.render("get",{
        title: "Consultar",
        about: "Buscar producto por su ID"
    })
}

export const createProuctView = (req,res) => {
    res.render("post",{
        title: "Crear",
        about: "Crear producto"
    })
} 

export const updateProductView = (req,res) => {
    res.render("put",{
        title: "Modificar",
        about: "Modificar producto por id:"
    })
}

export const deleteProductView = (req,res) => {
    res.render("delete",{
        title: "Eliminar",
        about: "Eliminar producto por id:"
    })
}