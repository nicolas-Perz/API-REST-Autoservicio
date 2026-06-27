
        // Clase 15
        const contenedorProductos = document.getElementById('contenedor-productos')
        const getProductForm = document.getElementById('getProduct-form')
        const urlBase = "http://localhost:3000/api/products"

        getProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            /*
            const formData = new FormData(event.target)
            // Parseo a {Objects}
            const data = Object.fromEntries(formData.entries())
            // Guardo el id del producto accediendo a data
            const idProd = data.idProd
            */
            // Otra optimizacion -> me salteo lo de parsean a {Object} y después a JSON manualmente
            const idProd = event.target.idProd.value.trim()
            // Una capa más de seguridad por si el required es salteado
            if(!idProd){
                mostrarError("Ingresá un id válido")
                return
            }
            
            try{
                const response = await fetch(`${urlBase}/${idProd}`);
                const data = await response.json()

                if(!response.ok){
                    mostrarError(data.message)
                    return
                }

                const producto = data.payload[0]

                const htmlProd = `
                    <ul>
                        <li class="lista-producto">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>${producto.precio}</strong></p>
                        </li>    
                    </ul>
                `;
                contenedorProductos.innerHTML = htmlProd
            }catch(e){
                console.error(e)
                // Mostramos errores de red (en el try/catch del fetch no capturamos errores 400 o 500)
                mostrarError("Error de conexion con el servidor")
            }
        })

        function mostrarError(errorMsg){
            contenedorProductos.innerHTML = `
                <p class="mensaje mensaje-error">${errorMsg}</p>
            `;
        }