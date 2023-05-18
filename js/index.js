let clienteslist = document.getElementById("clienteslist")
let empanadaslist = document.getElementById("empandaslist")
let empandalist = document.getElementById("empandalist")
let titleEmpanda = document.getElementById("titleEmpanda")
let btnAction = document.getElementById("btnAction")

let empanadasClient = document.getElementById("empanadasClient")

let formStatus = false

Clientes = []
Empandas = []
let EmpanadasCliente = []

const obtenerEmpanada = (e) => {
    e.preventDefault()

    //FORMA MENOS CODIGO 
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    const {GUISO,Precio,CANTIDAD} = data

    let pasoValidacion = false

    let guisoInput = document.getElementById("guiso")
    let cantidadInput = document.getElementById("cantidad")
    let precioInput = document.getElementById("precio")

    if(GUISO == ""){
        guisoInput.classList.add('bg-red-200','border-red-400')
    }else{
        guisoInput.classList.remove('bg-red-200','border-red-400')
    }

    if(Precio == ""){
        precioInput.classList.add('bg-red-200','border-red-400')
    }else{
        precioInput.classList.remove('bg-red-200','border-red-400')
    }

    if(CANTIDAD == ""){
        cantidadInput.classList.add('bg-red-200','border-red-400')
    }else{
        cantidadInput.classList.remove('bg-red-200','border-red-400')
    }


    if(GUISO != "" && Precio != "" && CANTIDAD !== ""){
        pasoValidacion = true
        if(formStatus){
            ActualizarEmpanada(data)
        }else{
            agregarEmpanada(data)
        }
    }else{
        pasoValidacion = false
    }
}

let formAgregarEmpanada = document.getElementById("formAgregarEmpanada")
formAgregarEmpanada.addEventListener("submit",obtenerEmpanada)

const generarCompra = (e) => {
    e.preventDefault()

    let ID_EMPANADA = EmpanadasCliente.map(empanada=> {return empanada.id })

    let CLIENTE_COMPRA = {
        data:{
            EMPANDAS_COMPRADAS: Number(e.target["CANTIDAD"].value),
            cliente: Number(clienteslist.value),
            empandas: ID_EMPANADA
        }
    }

    //SUBIR LA INFO A LA BD
    registrarCompra(CLIENTE_COMPRA)
}

let formCrearCompra = document.getElementById("formCrearCompra")
formCrearCompra.addEventListener("submit",generarCompra)

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

const GetEmpanadas = async () => {
    try {
        const respuesta = await fetch('http://localhost:1337/api/empandas')
        const datos = await respuesta.json()
        Empandas = [...datos.data]
        empanadaslist.innerHTML = ""
        empandalist.innerHTML = ""
        mostrarEmpanadas()
    } catch (error) {
        console.log(error)
    }
}

const mostrarDatos = () => {
    
    Clientes.forEach(cliente => {
        clienteslist.innerHTML += 
        `
            <Option value="${cliente.id}">${cliente.attributes.Nombre} ${cliente.attributes.Apellido}</Option>
        `
    });
}

const mostrarEmpanadas = () => {
    Empandas.forEach(empanada => {
        empanadaslist.innerHTML += 
        `
            <Option value="${empanada.id}">${empanada.attributes.GUISO}</Option>
        `
    });

    Empandas.forEach(empanda=>{
        empandalist.innerHTML +=
        `
            <Option value="${empanda.id}">${empanda.attributes.GUISO}</Option>
        `
    })
}

const agregarEmpanada = (data) => {
    //CREAR CLIENTE
    fetch('http://localhost:1337/api/empandas', {
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
            GetEmpanadas()
        })
        .catch(err => console.log(err))
        formAgregarEmpanada.reset()
}

const AgregarEmpanada = () => {
    formStatus = false
}

const ActualizarEmpanada = (data) => {

    fetch(`http://localhost:1337/api/empandas/${empanadaslist.value}`,{
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
            GetEmpanadas();
        })
        .catch(err => console.log(err))
}

const hazActualizacion = () => {
    formStatus = true
    titleEmpanda.innerHTML = 'ACTUALIZAR EMPANADA'
    btnAction.innerHTML = 'ACTUALIZAR EMPANADA'

    const empanda = Empandas.find(empanda => empanda.id == empanadaslist.value)

    // INPUTS
    let guisoInput = document.getElementById("guiso")
    let cantidadInput = document.getElementById("cantidad")
    let precioInput = document.getElementById("precio")

    //INFORMACION
    const {GUISO,Precio,CANTIDAD} = empanda.attributes

    //LE COLOCAMOS LA INFORMACION
    guisoInput.value = GUISO
    cantidadInput.value = CANTIDAD
    precioInput.value = Precio
}

const hazAgregar = () => {
    formStatus = false

    titleEmpanda.innerHTML = 'AGREGAR EMPANADA'
    btnAction.innerHTML = 'AGREGAR EMPANADA'

    formAgregarEmpanada.reset()
}

const listarEmpanda = () => {
    let id = empandalist.value
    let EMPANADA_ENCONTRADA = Empandas.find(empanda => empanda.id === Number(id))
    let EMPANADA_INFO = {
        id: EMPANADA_ENCONTRADA.id,
        ...EMPANADA_ENCONTRADA.attributes
    }

    let isListed = EmpanadasCliente.find(empanada => empanada.id === EMPANADA_INFO.id)
    if(isListed === undefined){
        EmpanadasCliente.push(EMPANADA_INFO)
        empanadasClient.innerHTML = ""
        mostrarEmpandasCliente()
    }
    
}

const mostrarEmpandasCliente = () => {
    EmpanadasCliente.forEach(empanada=> {
        empanadasClient.innerHTML+= 
        `
        <div class="w-full bg-white place-content-center py-4 px2 cursor-pointer rounded"
        onclick="eliminarSeleccion()"
        ><h1 class="text-center font-bold">${empanada.GUISO}</h1></div>
        `
    })
    
}

const registrarCompra = (data) => {
    fetch('http://localhost:1337/api/compras', {
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
            console.log("COMPRAR REALIZADA")
        })
        .catch(err => console.log(err))
}

GetClientes()
GetEmpanadas()