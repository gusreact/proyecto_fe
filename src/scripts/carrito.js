function showLoader() {
    const l = document.getElementById('loader');
    if (l) l.classList.add('show');
    console.log(l);
}

function hideLoader() {
    const l = document.getElementById('loader');
    if (l) l.classList.remove('show');
}
function obtenerProductos(){
    showLoader();
    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const contenedor = document.getElementById("productos-container");
            let html = '';
            data.forEach(producto => {
                html += `
                    <article class="producto">
                        <img src="${producto.image}" alt="${escapeHtml(producto.title)}" width="150" height="150">
                        <h4 class="nombre-producto"data-bs-toggle="tooltip" data-bs-placement="top" title="${escapeHtml(producto.title)}">${escapeHtml(producto.title.substring(0,15))}${producto.description.length > 15 ? "..." : "" }</h4>
                        <p data-bs-toggle="tooltip" data-bs-placement="top" title="${escapeHtml(producto.description)}">${escapeHtml(producto.description.substring(0,100))}${producto.description.length > 100 ? "..." : "" }</p>
                        <p class="precio">$${producto.price}</p>
                        <button class="agregar-carrito" data-id="${producto.id}" data-nombre="${producto.title}" data-precio="${producto.price}"><i class="fa fa-shopping-cart"></i> Agregar al carrito</button>
                    </article>
                `;
            });
            contenedor.innerHTML += html;
            initTooltips();

            var botonesAgregar = document.getElementsByClassName('agregar-carrito');

            for (var i = 0; i < botonesAgregar.length; i++) {
                botonesAgregar[i].addEventListener('click', agregarProducto);
            }
        })
        .catch(error => {
            console.error('Error en la comunicación con la API:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        })
        .finally(() => {
            hideLoader(); // <-- hide loader always when finished
        });;
}

function agregarProducto(event) {
    console.log('Producto agregado al carrito');
    var producto = {
        id: event.target.getAttribute('data-id'),
        nombre: event.target.getAttribute('data-nombre'),
        precio: event.target.getAttribute('data-precio')
    };

    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function mostrarCarrito() {
    const div = document.createElement('div');
    div.classList.add('modal');
    div.classList.add('fade');
    div.id = 'cartModal';
    div.tabIndex = -1;
    div.setAttribute('aria-labelledby', 'cartModalLabel');
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = `<div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div id="modal-header" class="modal-header">
                    <h5 class="modal-title" id="cartModalLabel">Mi Carrito</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="cart-items-container"></div>
                    <p id="empty-cart" class="text-muted">El carrito está vacío</p>
                </div>
                <div id="modal-footer" class="modal-footer">
                    <p id="cart-total"><strong>Total: $0.00</strong></p>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary">Pagar</button>
                </div>
            </div>
        </div>`;
    
    document.body.insertBefore(div, document.body.firstChild);
}

function actualizarCarrito() {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    var container = document.getElementById('cart-items-container');
    var emptyMsg = document.getElementById('empty-cart');
    var totalEl = document.getElementById('cart-total');
    var countBadge = document.querySelector('.carrito-count');

    countBadge.textContent = carrito.length;

    if (carrito.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        totalEl.innerHTML = '<strong>Total: $0.00</strong>';
        return;
    }

    emptyMsg.style.display = 'none';
    let html = '<table class="table"><thead><tr><th>Producto</th><th>Precio</th><th>Acción</th></tr></thead><tbody>';
    let total = 0;

    carrito.forEach((producto, index) => {
        let precio = parseFloat(producto.precio);
        total += precio;
        html += `
            <tr>
                <td>${escapeHtml(producto.nombre)}</td>
                <td>$${precio.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
    totalEl.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

function eliminarDelCarrito(index) {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function initTooltips() {
    if (window.bootstrap && bootstrap.Tooltip) {
        const triggers = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        triggers.forEach(el => {
            // avoid re-initializing
            if (!el._bootstrapTooltip) {
                el._bootstrapTooltip = new bootstrap.Tooltip(el);
            }
        });
    }
}