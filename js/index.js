let clienteslist = document.getElementById("clienteslist")
let empanadaslist = document.getElementById("empandaslist")
let titleEmpanda = document.getElementById("titleEmpanda")
let btnAction = document.getElementById("btnAction")

let formStatus = false

Clientes = []
Empandas = []

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


GetClientes()
GetEmpanadas()