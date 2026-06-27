// Acá gestionamos la logica para trabajr con archivos y rutas del proyecto (Clase 17)

// importar modulos para trabajar con rutas
import {fileURLToPath} from "url" // convierte una URL en archivo file: a una ruta del sistema de archivos
import {dirname,join} from "path" // dirname devuelve el directorio padre de una ruta y join une fragmentos de ruta

// obtener nombre del archivo actual
const __filename = fileURLToPath(import.meta.url)
// obtener directorio del archivo actual
const __dirname = join(dirname(__filename),"../../../") // salimos hasta el directorio raiz

//dirname(__filename): obtiene el directorio del arch. actual
//join("../../../"): retrocede niveles en los directorio

export{
    __dirname,
    join
}