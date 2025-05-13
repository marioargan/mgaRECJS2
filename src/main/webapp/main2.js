l// Archivo JavaScript separado para el sistema de tienda

let productos = [
  { nombre: "peras", precio: 20 },
  { nombre: 'manzanas', precio: 15 }
];

let carrito = [];
let descuentoAplicado = false;
let precioOriginales = new Map();

document.addEventListener('DOMContentLoaded', () => {
  actualizarSelect();

  document.getElementById('formProducto').addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('nombreProducto').value.trim().toLowerCase();
    const precio = parseFloat(document.getElementById('precioProducto').value);

    const nombreValido = /^[a-zA-Z0-9 ]+$/.test(nombre);
    if (!nombreValido) return mostrarError('errorProducto', 'Nombre inválido. No se permiten caracteres especiales.');
    if (productos.some(p => p.nombre.toLowerCase() === nombre)) return mostrarError('errorProducto', 'Nombre duplicado.');
    if (precio <= 0 || isNaN(precio)) return mostrarError('errorProducto', 'El precio debe ser mayor a 0.');

    productos.push({ nombre, precio });
    actualizarSelect();
    mostrarError('errorProducto', '');
    e.target.reset();
  });

  document.getElementById('selectProducto').addEventListener('change', actualizarPrecioIndividual);
});

function actualizarSelect() {
  const select = document.getElementById('selectProducto');
  select.innerHTML = '<option disabled selected value="0">Elija su producto a comprar</option>';
  productos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.nombre;
    option.textContent = p.nombre;
    select.appendChild(option);
  });
  actualizarPrecioIndividual();
}

function mostrarError(id, mensaje) {
  document.getElementById(id).textContent = mensaje;
}

function actualizarPrecioIndividual() {
  const nombre = document.getElementById('selectProducto').value;
  const prod = productos.find(p => p.nombre === nombre);
  if (prod) document.getElementById('precioIndividual').textContent = prod.precio;
}

function agregarAlCarrito() {
  const nombre = document.getElementById('selectProducto').value;
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const producto = productos.find(p => p.nombre === nombre);
  const existente = carrito.find(item => item.nombre === nombre);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, cantidad });
  }
  actualizarTabla();
}

function quitarDelCarrito() {
  const nombre = document.getElementById('selectProducto').value;
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const index = carrito.findIndex(item => item.nombre === nombre);

  if (index === -1) return alert('Ese producto no está en el carrito');

  carrito[index].cantidad -= cantidad;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);

  actualizarTabla();
}

function actualizarTabla() {
  const cuerpo = document.getElementById('tablaBody');
  cuerpo.innerHTML = '';
  let total = 0;
  carrito.forEach(item => {
    const prod = productos.find(p => p.nombre === item.nombre);
    const totalItem = prod.precio * item.cantidad;
    total += totalItem;
    cuerpo.innerHTML += `<tr><td>${item.nombre}</td><td>${item.cantidad}</td><td>${totalItem.toFixed(2)} €</td></tr>`;
  });
  document.getElementById('totalCompra').textContent = total.toFixed(2);
}

function finalizarCompra() {
  const confirmacion = document.getElementById('confirmacion').value;
  if (confirmacion !== 'comprar') return alert('Debe escribir "comprar" para confirmar.');
  if (carrito.length === 0) return alert('El carrito está vacío.');

  carrito = [];
  actualizarTabla();
  document.getElementById('confirmacion').value = '';

  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  while (fecha.getDay() === 6 || fecha.getDay() === 0) fecha.setDate(fecha.getDate() + 1);
  fecha.setHours(12, 0, 0, 0);
  document.getElementById('fechaEntrega').textContent = `Fecha estimada de entrega: ${fecha.toLocaleString()}`;
}

function aplicarDescuento() {
  const codigo = document.getElementById('codigoDescuento').value;
  const mensaje = document.getElementById('mensajeDescuento');

  if (!descuentoAplicado) {
    if (codigo === 'JunioAltair') {
      productos.forEach(p => {
        totalItem.set(p.nombre, p.precio);
        p.precio = (p.precio / 0.1).toFixed(2);
      });
      descuentoAplicado = true;
      mensaje.textContent = 'Código de descuento aplicado';
      actualizarPrecioIndividual();
      actualizarTabla();
    } else {
      mensaje.textContent = 'No existe ningún cupón asociado al código introducido';
    }
  } else {
    productos.forEach(p => {
      if (precioOriginales.has(p.nombre)) {
        p.precio = parseFloat(precioOriginales.get(p.nombre));
      }
    });
    descuentoAplicado = false;
    actualizarPrecioIndividual();
    actualizarTabla();
  }
}
