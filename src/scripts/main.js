function createHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    const gridContainer = document.getElementById('grid-container');
    header.innerHTML = `
        <div class="header-content">
            <h1>Cabecera</h1>
            <button class="carrito-btn" data-bs-toggle="modal" data-bs-target="#cartModal">
                <i class="fa fa-shopping-cart"></i>
                <span class="carrito-count">0</span>
            </button>
        </div>
    `;
    gridContainer.insertBefore(header, gridContainer.firstChild);
}

function crearLoader(){
    const gridContainer = document.getElementById('grid-container');
    const productosContainer = document.getElementById('productos-container');
    const div = document.createElement('div');
    div.classList.add('loader');
    div.id = 'loader';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = `<div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>`;
    
    gridContainer.insertBefore(div, productosContainer);
}