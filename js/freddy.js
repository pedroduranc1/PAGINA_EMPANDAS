let clientesList = document.getElementById("clientesList");
let formCliente = document.getElementById('form');
let btnActualizar = document.getElementById('btn-act')

let isUpdate = false
let idUser;

Clientes = []

const RegistrarCliente = (e) => {
    e.preventDefault()

    //FORMA MENOS CODIGO 
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    //CREAR CLIENTE
    fetch('http://localhost:1337/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            clientesList.innerHTML = ""
            GetClientes();
        })
        .catch(err => console.log(err))
    formCliente.reset()
}

formCliente.addEventListener('submit', (e)=>{
    if(isUpdate){
        actualizarCliente(e)
    }else{
        RegistrarCliente(e)
    }
})



const GetClientes = async () => {
    try {
        const respuesta = await fetch('http://localhost:1337/api/clientes')
        const datos = await respuesta.json()
        Clientes= [...datos.data]
        mostrarDatos()
    } catch (error) {
        console.log(error)
    }
}

const mostrarDatos = () => {
    Clientes.forEach(cliente => {
        clientesList.innerHTML += `
        <div class="max-w-xs mr-5">
                <div class="bg-white shadow-xl rounded-lg py-3">
                    <div class="photo-wrapper p-2">
                        <img id="imagenuser" class="w-32 h-32 rounded-full mx-auto"
                            src="https://randomuser.me/api/portraits/men/1.jpg"
                            alt="John Doe">
                    </div>
                    <div class="p-2">
                        <h3 class="text-center text-xl text-gray-900 font-medium leading-8">${cliente.attributes.Nombre} ${cliente.attributes.Apellido}</h3>
                        <div class="text-center text-gray-400 text-xs font-semibold">
                            <p>${cliente.attributes.Correo}</p>
                        </div>

                        <div class="flex justify-between mt-5">
                            <button
                                onclick="obtenerCliente(${cliente.id})"
                                class="bg-white transition-all hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                Actualizar
                            </button>
                            <button
                                onclick="eliminarCliente(${cliente.id})"
                                class="bg-white transition-all hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                Eliminar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `
    });
}

const eliminarCliente = (id) => {

    //ELIMINAR CLIENTE
    fetch(`http://localhost:1337/api/clientes/${id}`, {method: 'DELETE',})
        .then(res => res.json())
        .then(data => {
            clientesList.innerHTML = ""
            GetClientes();
        })
        .catch(err => console.log(err))
}

const obtenerCliente = (id) =>{
    //ACTUALIZAR CLIENTE
    //BUSCAR CLIENTE CON EL ID
    document.getElementById("btn-reg").classList.add('hidden')
    document.getElementById("btn-act").classList.remove('hidden')


    let clienteEncontrado = Clientes.find(cliente => cliente.id === id);
    
    let nombre = document.getElementById("nombre")
    let apellido = document.getElementById("apellido")
    let correo = document.getElementById("correo")
    let idInput = document.getElementById("id")

    nombre.value = clienteEncontrado.attributes.Nombre
    apellido.value = clienteEncontrado.attributes.Apellido
    correo.value = clienteEncontrado.attributes.Correo
    idUser = id

    isUpdate = true;
}

const actualizarCliente = (e) => {
    e.preventDefault()
    
    //FORMA MENOS CODIGO 
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    fetch(`http://localhost:1337/api/clientes/${idUser}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            clientesList.innerHTML = ""
            formCliente.reset()
            document.getElementById("btn-reg").classList.remove('hidden')
            document.getElementById("btn-act").classList.add('hidden')
            GetClientes();
        })
        .catch(err => console.log(err))
}




GetClientes();
