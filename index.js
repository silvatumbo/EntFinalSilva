const URL_JSON = 'productos.json';

let productos = [];
let carrito = []


const divProductos = document.getElementById('divProductos');
const divCarrito = document.getElementById('divCarrito');
const tbody = document.getElementById('tbody');
const total = document.getElementById('total');
const finalizar = document.getElementById('finalizar');

async function cargarProductos() {
  try {
    const respuesta = await fetch(URL_JSON);
    const productosJson = await respuesta.json();
    productos = productosJson;
    renderizarProductos();
  } catch (error) {
  }
}

function renderizarProductos() {
  divProductos.innerHTML = '';
  productos.forEach((producto) => {
    const divProducto = document.createElement('div');
    divProducto.classList.add('col-1', 'mb-3');
    divProducto.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$${producto.precio}</p>
            <button id="btn${producto.id}" class="btn btn-primary btn-agregar">Agregar al carrito</button>
          </div>
        </div>`;
    divProductos.appendChild(divProducto);
    const btnAgregar = document.getElementById(`btn${producto.id}`);
    btnAgregar.addEventListener('click', () => agregarAlCarrito(producto));
    btnAgregar.addEventListener('click', () => Swal.fire({
      position: 'top-end',
      title: 'Tu producto a sido agregado',
      showConfirmButton: false,
      timer: 800,
      customClass: {
        popup: 'green-alert'
      }
    }))
  });
}

function agregarAlCarrito(producto) {
  const productoExistente = carrito.find((item) => item.id === producto.id);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  renderizarCarrito();
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function renderizarCarrito() {
  tbody.innerHTML = '';
  carrito.forEach((producto) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.cantidad}</td>
      <td>$${producto.precio}</td>
      <td>$${producto.cantidad * producto.precio}</td>
      <td>
        <button class="btn btn-danger btn-eliminar" data-id="${producto.id}">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
    const btnEliminar = tr.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', () => eliminarDelCarrito(producto));
  });
  total.textContent = `Total: $${calcularTotal()}`;
}

function eliminarDelCarrito(producto) {
  carrito = carrito.filter((item) => item.id !== producto.id);
  renderizarCarrito();
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function calcularTotal() {
  return carrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0);
}


finalizar.addEventListener('click', () => {
  if (carrito.length === 0) {
    Swal.fire('Error', 'El carrito está vacío');
  } else {
    Swal.fire({
      title: 'Confirmar compra?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Comprar'
    })
    .then((result) => {
      if (result.isConfirmed) {
        return Swal.fire({
          title: 'Ingese su email',
          input: 'email',
          inputPlaceholder: 'alostumbosfc@gmail.com'
        });
      }
    })
    .then((result) => {
      if (result.value) { 
        Swal.fire('Compra realizada con éxito')
        carrito = [];
        renderizarCarrito();
        localStorage.removeItem('carrito');
      }
    });
  }
});

cargarProductos();