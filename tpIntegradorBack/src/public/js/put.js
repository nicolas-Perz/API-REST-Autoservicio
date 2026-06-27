        // Clase 15
        const contenedorProductos = document.getElementById('contenedor-productos')
        const getProductForm = document.getElementById('getProduct-form')
        const contenedorForm = document.getElementById('contenedor-form')
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
            const idProd = event.target.idProd.value.trim()
            if(!idProd){
                mostrarMensaje("error","Ingresá un id válido")
                return
            }
            
            try{
                const response = await fetch(`${urlBase}/${idProd}`);
                const data = await response.json()

                if(!response.ok){
                    mostrarMensaje("error",data.message)
                    return
                }

                const producto = data.payload[0]

                const htmlProd = `
                    <ul>
                        <li class="lista-producto">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                            <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>${producto.precio}</strong></p>
                            <input type="button" id="updateProduct-button" value="Actualizar Producto">
                        </li>    
                    </ul>
                `;
                contenedorProductos.innerHTML = htmlProd

                    const updateProductButton = document.getElementById('updateProduct-button')
                    
                    // Al no pertenecer a un form capturo el evento click del boton en lugar del submit
                    updateProductButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        const confirmacion = confirm("Actualizar?")
                        if(!confirmacion){
                            alert("Cancelado")
                        }else{
                            formularioPutProducto(event,producto)
                        }
                    })
            }catch(e){
                console.error(e)
                mostrarMensaje("error","Error de conexion con el servidor")
            }
        })

        async function formularioPutProducto(event,producto){
            event.stopPropagation()
            console.table(producto)

            const htmlForm = `
                <form id="updateProduct-form">
                    <input type="hidden" name="id" value="${producto.id}">

                    <label for="nameProd">Nombre</label>
                    <input type="text" name="name" id="nameProd" value="${producto.nombre}" required>

                    <label for="imageProd">Imagen</label>
                    <input type="text" name="image" id="imageProd" value="${producto.imagen}" required>

                    <label for="categoryProd">Categoria</label>
                    <select name="category" id="categoryProd" required>
                        <option value="food">comida</option>
                        <option value="drink">bebida</option>
                    </select>

                    <label for="priceProd">Precio</label>
                    <input type="number" name="price" id="priceProd" value="${producto.precio}" required>

                    <label for="activeProd">Activo</label>
                    <select name="active" id="activeProd">
                        <option value="1">activo</option>
                        <option value="0">inactivo</option>
                    </select>

                    <div class="">
                        <input type="submit" value="Actualizar producto">
                    </div>
                </form>
            `
            contenedorForm.innerHTML = htmlForm
            // selecciono el formulario de actualizacion
            const updateProductForm = document.getElementById("updateProduct-form")
            updateProductForm.addEventListener('submit', (event) => {
                actualizarProducto(event)
            })
        }

        //Enviamos los datos del formulario al server
        async function actualizarProducto(event){
            event.preventDefault()
            const formData = new FormData(event.target) //tipo formData ->
            const data = Object.fromEntries(formData.entries())//parseo formData a {Object}
            try{
                const response = await fetch(urlBase,{
                    method:"PUT",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data) //parseo {Object} a JSON
                })
                console.log(response)
                const result = await response.json()

                if(!response.ok){
                    mostrarMensaje("error",result.message)
                    return
                }
                mostrarMensaje("exito",result.message)

                console.log(result.message)
                alert(result.message)

                //Limpieza de pantalla
                contenedorProductos.innerHTML = ""
                contenedorForm.innerHTML = ""
            }catch(e){
                console.error(e)
                mostrarMensaje("error",e)
            }
        }

        function mostrarMensaje(tipo,mensaje){
            contenedorForm.innerHTML = ""
            contenedorProductos.innerHTML = `<p class="mensaje mensaje-${tipo}">${mensaje}</p>`;
        }
