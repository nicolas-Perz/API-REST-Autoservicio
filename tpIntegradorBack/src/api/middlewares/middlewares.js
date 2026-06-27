
//Middleware de aplicacion
const loggerURL = (req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
};

const validateId = (req,res,next) => {
    const id = Number(req.params.id)
    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({error:"El id debe ser un num. entero positivo"})
    }
    req.id = id
    next()
}


//Middlewares de rutas
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

export {
    loggerURL,
    validateId,
    validateProduct
}