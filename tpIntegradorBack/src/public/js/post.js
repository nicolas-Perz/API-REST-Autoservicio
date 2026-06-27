// Clase 15
        const contenedorProductos = document.getElementById('contenedor-productos')
        const postProductForm = document.getElementById('postProduct-form')

        function validarFormulario(data){
            const errores = []
            if(!data.name || data.name.trim().length < 2){
                errores.push("El nombre debe tener al menos 2 caracteres\n")
            }
            if(!data.price || isNaN(data.price) || Number(data.price) < 0){
                errores.push("El precio debe ser un num. mayor a 0\n")
            }
            if(!data.category){
                errores.push("Debe seleccionar una categoria\n")
            }
            return errores
        }

        function mostrarMensaje(tipo,mensaje){
            contenedorProductos.innerHTML = `<p class="mensaje mensaje-${tipo}">${mensaje}</p>`;
        }

        postProductForm.addEventListener('submit', async (event) => {
            const formularioAlta = event.target
            event.preventDefault()
            const formData = new FormData(event.target)
            const data = Object.fromEntries(formData.entries())
            console.log(data)

            // Parseamos price antes de enviarl, formData deveulve todo como string y el back espera que price sea numero
            data.price = Number(data.price)

            const errores = validarFormulario(data)
            if(errores.length > 0) mostrarMensaje("error",errores)

            try{
                const response = await fetch("http://localhost:3000/api/products/", {
                    method: "POST",
                    headers: { //cabecera del http
                        "Content-Type": "application/json"
                    },
                    //le mando al cuerpo de la pagina los datos del form en formato json
                    body: JSON.stringify(data)
                })

                console.log(response)
                const result = await response.json()

                if(!response.ok){
                    mostrarMensaje("error", result.message)
                    return
                }

                const infoProducto = `${result.message} con id ${result.productId}`
                mostrarMensaje("exito",infoProducto)
                console.log(infoProducto)

                // Limpiamos formulario
                formularioAlta.reset()

            }catch(e){
                console.error(e)
            }
        })