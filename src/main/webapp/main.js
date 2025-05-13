/**
 * 
 */
let productos = [{ nombre: 'pera', precio: 20 }, { nombre: 'manzana', precio: 15 }];
let carrito = [];

function actualizarSelect() {
	let select = document.getElementById('selectProducto');
	select.innerHTML = '<option disabled selected value="0">Elija un producto</option>';
	for (let i = 0; i < productos.length; i++) {
		let option = document.createElement('option');
		option.value = productos[i].nombre;
		option.textContent = productos[i].nombre;
		select.appendChild(option);
	}
}

document.getElementById('formProducto').addEventListener('submit', function(e) {
	e.preventDefault();
	let nombre = document.getElementById('nombreProducto').value.trim().toLowerCase();
	let precio = parseFloat(document.getElementById('precioProducto').value);

	if (nombre === '' || !/^[a-z0-9 ]+$/i.test(nombre)) {
		document.getElementById('errorProducto').textContent = 'Nombre no válido';
		return;
	}
	if (productos.some(p => p.nombre === nombre)) {
		document.getElementById('errorProducto').textContent = 'Ya existe';
		return;
	}
	if (isNaN(precio) || precio <= 0) {
		document.getElementById('errorProducto').textContent = 'Precio incorrecto';
		return;
	}

	productos.push({ nombre: nombre, precio: precio });
	actualizarSelect();
	document.getElementById('formProducto').reset();
	document.getElementById('errorProducto').textContent = '';
});

document.getElementById('selectProducto').addEventListener('change', function() {
	let nombre = this.value;
	let prod = productos.find(p => p.nombre === nombre);
	if (prod) {
		document.getElementById('precioProductoMostrar').textContent = prod.precio;
	}
});

function agregarAlCarrito() {
	let nombre = document.getElementById('selectProducto').value;
	let cantidad = parseInt(document.getElementById('cantidad').value);
	let prod = productos.find(p => p.nombre === nombre);
	if (!prod) return;

	let objetoCarro = carrito.find(p => p.nombre === nombre);
	if (objetoCarro) {
		objetoCarro.cantidad += cantidad;
	} else {
		carrito.push({ nombre: nombre, cantidad: cantidad });
	}
	actualizarTabla();
}

function quitarDelCarrito() {
	let nombre = document.getElementById('selectProducto').value;
	let cantidad = parseInt(document.getElementById('cantidad').value);
	let objetoCarro = carrito.find(p => p.nombre === nombre);
	if (!objetoCarro) {
		alert('No está en el carrito');
		return;
	}
	objetoCarro.cantidad -= cantidad;
	if (objetoCarro.cantidad <= 0) {
		carrito = carrito.filter(p => p.nombre !== nombre);
	}
	actualizarTabla();
}
function descuento() {
	let codigo = document.getElementById('codigo')
	for (let i = 0; i < 1; i++) {
		if (codigo == "JunioAltair") {
			subtotal * 0.9;
		} else {
			alert('El codigo no se ha añadido correctamente')
		}
	}

}
function finalizarCompra() {
	alert('La compra ha finalizado')

	actualizarSelect();
}

function actualizarTabla() {
	let tabla = document.getElementById('tablaCarrito');
	tabla.innerHTML = '';
	let total = 0;
	for (let i = 0; i < carrito.length; i++) {
		let prod = productos.find(p => p.nombre === carrito[i].nombre);
		let subtotal = prod.precio * carrito[i].cantidad;
		total += subtotal;
		tabla.innerHTML += '<tr><td>' + carrito[i].nombre + '</td><td>' + carrito[i].cantidad + '</td><td>' + subtotal.toFixed(2) + ' €</td></tr>';

	}

	document.getElementById('total').textContent = total.toFixed(2);


}

actualizarSelect();