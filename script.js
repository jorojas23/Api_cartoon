const apiUrl = "http://127.0.0.1:8000";
const botonEL = document.getElementById("boton");
let datosSerie = []
const buscarEl = document.getElementById("buscar");
const detalleEL = document.getElementById("serie-container")
const botonAggEL = document.getElementById("guardar")
const boton = document.getElementById('boton');
const dialog = document.getElementById('dialog');
const dialogEliminar = document.getElementById('dialog-eliminar');
const dialogañadir = document.getElementById("anadir")
const overlay = document.getElementById('overlay');
const cerarDialogo = document.getElementById('cerrar-dialogo');
const confirmarEliminar = document.getElementById('confirmar-eliminar');
const anadir = document.getElementById('agregar-datos'); 
const sugEL = document.getElementById('sugerencia')

addEventListener("DOMContentLoaded",async ()=>{
    await cargarSeries()
    mostrarDetallesSerie(datosSerie.filter(titulo => titulo.titulo))
})

class Serie {
    constructor(lista) {
        this.titulo = lista.elements["titulo"].value;
        this.creador = lista.elements["creador"].value;
        this.cantidad_de_temporadas = lista.elements["cantidad_de_temporadas"].value;
        this.personajes_principales = lista.elements["personajes_principales"].value;
        this.valoracion = lista.elements["valoracion"].value;
        this.ano_de_transmision = lista.elements["ano_de_transmision"].value;
        this.ano_de_finalizacion = lista.elements["ano_de_finalizacion"].value;
        this.foto = lista.elements["foto"].value;
    }
}
function cargarDatosEnFormulario(serie) {
    const serieContainer = document.getElementById("serie-container");
    const titulo = serieContainer.querySelector("h1").innerText;
    const imagen = serieContainer.querySelector(".image img").src;
    const descripcion = serieContainer.querySelector(".decribcion");
    const creador = descripcion.querySelector("p:nth-child(1)").innerText.replace("Creador: ", "");
    const temporadas = descripcion.querySelector("p:nth-child(2)").innerText.replace("Cantidad de temporadas: ", "");
    const personajes = descripcion.querySelector("p:nth-child(3)").innerText.split(":");
    const valoracion = descripcion.querySelector("p:nth-child(4)").innerText.replace("Valoración: ", "");
    const anoTransmision = descripcion.querySelector("p:nth-child(5)").innerText.split(":");
    console.log(descripcion.querySelector("p:nth-child(6)").innerText);
    const anoFinalizacion = descripcion.querySelector("p:nth-child(6)").innerText.split(":");


    const formulario = document.getElementById("formulario-editar");

    
    formulario.elements["titulo"].value = titulo;
    formulario.elements["foto"].value = imagen;
    formulario.elements["creador"].value = creador;
    formulario.elements["cantidad_de_temporadas"].value = temporadas;
    formulario.elements["personajes_principales"].value = personajes[1];
    formulario.elements["valoracion"].value = valoracion;
    formulario.elements["ano_de_transmision"].value = anoTransmision[1];
    formulario.elements["ano_de_finalizacion"].value = anoFinalizacion[1];
}

async function actualizarDetalleSerie(id, datosActualizados) {
    try {
      const respuesta = await fetch(`${apiUrl}/personajes/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      });
  
      if (!respuesta.ok) {
        throw new Error(`Error al actualizar el elemento: ${respuesta.status}`);
      }
  
      const elementoActualizado = await respuesta.json();
      return elementoActualizado; 
  
    } catch (error) {
      console.error("Error al actualizar el elemento:", error);
      return null;
    }
  }

async function aggDetalleSerie(serie) {
    try {
        console.log(serie)
        const respuesta = await fetch(`${apiUrl}/personajes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serie),
        });
        if (!respuesta.ok) {
            throw new Error(`Error al agregar la serie: ${respuesta.status}`);
        }
        await cargarSeries()
        const serieAgregada = await respuesta.json();
    } catch (error) {
        console.error("Error al agregar la serie:", error);
    }
}

async function eliminarElementoAPI(id) {
    try {
            const respuesta = await fetch(`${apiUrl}/personajes/${id}`, {
            method: "DELETE",
            });

            if (!respuesta.ok) {
            throw new Error(`Error al eliminar el elemento: ${respuesta.status}`);
            }
            await cargarSeries()
            
            
            return true;
    } catch (error) {
        console.error("Error al eliminar el elemento:", error);
        return false;
    }
}


async function cargarSeries() {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/`);
        console.log(respuesta)
        const series = await respuesta.json();
        
        datosSerie = series

    } catch (error) {
        console.error("Error al cargar las series:", error);
        listaSeries.innerHTML = "<li>Error al cargar las series.</li>";
    }
}

async function actualizarSerie(id, datosActualizados) {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosActualizados),
        });

        if (!respuesta.ok) {
            throw new Error(`Error al actualizar la serie: ${respuesta.status}`);
        }

        const resultado = await respuesta.json();
        console.log("Serie actualizada:", resultado);

        
        await cargarSeries();

       
        dialog.style.display = 'none';
        overlay.style.display = 'none';
    } catch (error) {
        console.error("Error al actualizar la serie:", error);
    }
}




async function mostrarDetallesSerie(titulo) {
    try {
        const respuesta = await fetch(`${apiUrl}/personajes/${titulo[0].id}`);
        const serie = await respuesta.json();
        console.log(serie)
        detalleEL.innerHTML = `
            <h1>${serie.titulo}</h1>
            <div class="container-second">
                <div class="image">
                    <img src="${serie.foto}" alt="${serie.titulo}" width="200px">
                </div>
                <div class="decribcion">
                    <p><strong>Creador:</strong> ${serie.creador}</p>
                    <p><strong>Temporadas:</strong> ${serie.cantidad_de_temporadas}</p>
                    <p><strong>Personajes Principales:</strong> ${serie.personajes_principales}</p>
                    <p><strong>Valoración:</strong> ${serie.valoracion}</p>
                    <p><strong>Año de Transmisión:</strong> ${serie.ano_de_transmision}</p>
                    <p><strong>Año de Finalización:</strong> ${serie.ano_de_finalizacion}</p>
                    <button id="editar-datos" data-id="${serie.id}">Editar</button>
                    <button id="eliminar-datos" data-id="${serie.id}">Eliminar</button>
                </div>
        `;
        const eliminar = document.getElementById('eliminar-datos');
        const editar = document.getElementById('editar-datos');
        eliminar.addEventListener('click', () => {
            dialogEliminar.style.display = 'block';
            overlay.style.display = 'block';
        });
        confirmarEliminar.addEventListener("click", () => {
            const id = eliminar.dataset.id;
            eliminarElementoAPI(id);
        });
        editar.addEventListener('click', () => {
            const h3 = document.querySelector('#dialog h3');
            h3.innerHTML = 'editar datos';
            
            console.log("hola")
            cargarDatosEnFormulario()
            botonAggEL.dataset.id = editar.dataset.id
            dialog.style.display = 'block';
            overlay.style.display = 'block';
        });
    } catch (error) {
        console.error("Error al cargar los detalles de la serie:", error);
        detalleEL.innerHTML = "<p>Error al cargar los detalles de la serie.</p>";
    }
}
botonEL.addEventListener("click",()=>{
    const text = buscarEl.value
    console.log(datosSerie)
    const peliculasFiltradas=datosSerie.filter(titulo=>titulo.titulo.toLowerCase().includes(text))
    console.log(peliculasFiltradas)
    
    mostrarDetallesSerie(peliculasFiltradas);
  
})

botonAggEL.addEventListener("click", (e) => {
    const formulario = document.getElementById("formulario-editar");
    const serie = new Serie(formulario);
   
    
    if (e.currentTarget.dataset.id == 0) {
        aggDetalleSerie(serie);
        alert("Se agrego correctamente");
    }else{
        actualizarSerie(e.currentTarget.dataset.id, serie);
        alert("Se actualizo correctamente");
    }
    dialog.style.display = 'none';
    overlay.style.display = 'none';
});


dialogañadir.addEventListener('click', () => {
    const h3 = document.querySelector('#dialog h3');
    h3.innerHTML = 'añadir datos';
    const formulario = document.getElementById("formulario-editar");

    formulario.elements["titulo"].value = ""
    formulario.elements["foto"].value = ""
    formulario.elements["creador"].value ="" 
    formulario.elements["cantidad_de_temporadas"].value = "" 
    formulario.elements["personajes_principales"].value = ""
    formulario.elements["valoracion"].value = ""
    formulario.elements["ano_de_transmision"].value = "" 
    formulario.elements["ano_de_finalizacion"].value = ""
    botonAggEL.dataset.id = 0
    dialog.style.display = 'block';
    overlay.style.display = 'block';
});

/*
cerrarDialogo.addEventListener('click', () => {

    dialog.style.display = 'none';
    overlay.style.display = 'none';
});*/

document.getElementById('cancelar-eliminar').addEventListener('click', () => {
    dialogEliminar.style.display = 'none';
    overlay.style.display = 'none';
});

document.getElementById('confirmar-eliminar').addEventListener('click', () => {
    alert("Elemento eliminado.");
    dialogEliminar.style.display = 'none';
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    dialog.style.display = 'none';
    dialogEliminar.style.display = 'none';
    overlay.style.display = 'none';
});
buscarEl.addEventListener("keyup",()=>{
    const text = buscarEl.value
    const peliculasFiltradas=datosSerie.filter(titulo=>titulo.titulo.toLowerCase().includes(text))
    let serie = ""
    peliculasFiltradas.forEach(element => {
        serie += 
        `
        <li onclick="agg(this)"><strong>${element.titulo}</strong></li>
        `
    });
    document.querySelector('.search-box').classList.add('active');
    sugEL.innerHTML=serie
})
function agg(element) {
    let selectUserData = element.textContent;
	buscarEl.value = selectUserData;
}
