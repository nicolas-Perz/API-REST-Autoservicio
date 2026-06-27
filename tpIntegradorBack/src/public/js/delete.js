
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
            const idProd = event.target.idProd.value.trim()
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
                            <input type="button" id="deleteProduct-button" value="Eliminar Producto">
                        </li>    
                    </ul>
                `;
                contenedorProductos.innerHTML = htmlProd

                    const deleteProductButton = document.getElementById('deleteProduct-button')
                    
                    // Al no pertenecer a un form capturo el evento click del boton en lugar del submit
                    deleteProductButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        const confirmacion = confirm("Eliminar?")
                        if(!confirmacion){
                            alert("Cancelado")
                        }else{
                            eliminarProducto(producto.id)
                        }
                    })
            }catch(e){
                console.error(e)
                mostrarError("Error con el servidor")
            }
        })

        async function eliminarProducto(id){
            try{
                const response = await fetch(`${urlBase}/${id}`,{
                    method:"DELETE"
                })
                const result = await response.json()
                console.log(result)

                // Manejamos un error no ok
                if(!response.ok){
                    mostrarError(result.message)
                    return
                }

                mostrarExito(result.message)

            }catch(e){
                console.error(e)
                mostrarError("Error con el servidor")
            }
        }

        function mostrarError(errorMsg){
            contenedorProductos.innerHTML = `
                <p class="mensaje mensaje-error">${errorMsg}</p>
            `;
        }
        function mostrarExito(errorMsg){
            contenedorProductos.innerHTML = `
                <p class="mensaje mensaje-error">${errorMsg}</p>
            `;
        }
