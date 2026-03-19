// ------------  STATE  ------------

const state = {
    gastos: JSON.parse(localStorage.getItem("gastos")) || [],
    filtro: localStorage.getItem("filtro") || "todos"

};

//------------  DOM  ----------------

const DOM = {
    input: document.getElementById("nuevoGasto"),
    btnGasto: document.getElementById("btnGasto"),
    btnMarcarTodos: document.getElementById("btnMarcarTodos"),
    lista: document.getElementById("listaGastos"),
    filtro: document.querySelectorAll("[data-filtro]")
};

//------------  Storage  ------------

function guardarEstado(){
    localStorage.setItem("gastos", JSON.stringify(state.gastos));
    localStorage.setItem("filtro", state.filtro);
}

//------------  Acciones  -------------

function agregarGasto(texto){
    if(!texto.trim()) return;

    const existe = state.gastos.some(g => g.texto === texto);

    if(existe){
        alert("Gasto duplicado");
        return;
    }

    state.gastos.push({
        id: crypto.randomUUID(),
        texto,
        completada: false
    });
    render();
}

function eliminarGasto(id){
    state.gastos = state.gastos.filter(g => g.id !== id);
    render();
}

function toggleGasto(id){
    const gasto = state.gastos.find(g => g.id === id);
    gasto.completada = !gasto.completada;
    render();
}

function toggleTodos(){
    const todosMarcados = state.gastos.every(g => g.completada);
    state.gastos.forEach(g => {
        g.completada = !todosMarcados;
    });
    render();
}

function cambiarFiltro(filtro){
    state.filtro = filtro;
    render();
}

//---------  Selectores  ----------------

function gastosFiltrados(){
    switch(state.filtro){
        case "pendientes":
            return state.gastos.filter(g => !g.completada);
        
        case "completados":
            return state.gastos.filter(g => g.completada);

        default:
            return state.gastos;
    }
}


//-----------  RENDER  ---------------


function render() {

    guardarEstado();

    DOM.lista.innerHTML = "";

    const gastos = gastosFiltrados();

    gastos.forEach(g => {

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = g.completada;

        checkbox.addEventListener("change", () => {
            toggleGasto(g.id);
        });

        const span = document.createElement("span");
        span.textContent = g.texto;

        if(g.completada){
            li.classList.add("completado");
        }

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";

        btnEliminar.addEventListener("click", () => {

            li.classList.add("eliminar");

            setTimeout(()=>{
                eliminarGasto(g.id);
            },300);

        });

        li.append(checkbox, span, btnEliminar);

        DOM.lista.appendChild(li);

    });

}



//----------  Eventos  -------------

DOM.btnGasto.addEventListener("click", ()=>{
    agregarGasto(DOM.input.value);
    DOM.input.value = "";
});

DOM.input.addEventListener("keydown", e =>{
    if(e.key === "Enter") {
        agregarGasto(DOM.input.value);
        DOM.input.value = "";
    }
});

DOM.btnMarcarTodos.addEventListener("click", toggleTodos);

DOM.filtro.forEach(btn => {
    btn.addEventListener("click", () =>{
        cambiarFiltro(btn.dataset.filtro);
    });
});

//-------  INIT  -----------

render();