//Venta de tickets para parking

const precioTicket = 5;
let cantidadTickets = 10;

function venderTicket() {
  if (cantidadTickets > 0) {
    alert(
      `¡Bienvenido a nuestro Parking! Tienes ${cantidadTickets} tickets disponibles.`
    );
  } else {
    alert("Lo siento, no quedan más tickets disponibles.");
    return;
  }

  const valorIngresado = prompt("¿Cuántos tickets deseas comprar?");
  if (valorIngresado === null) {
    alert("Operación cancelada por el usuario.");
    return;
  }

  const cantidadCompra = parseInt(valorIngresado);
  if (isNaN(cantidadCompra) || cantidadCompra <= 0) {
    alert("Ingresa una cantidad válida.");
    return;
  }

  if (cantidadCompra <= cantidadTickets) {
    const totalVenta = cantidadCompra * precioTicket;
    alert(`Tickets vendidos: ${cantidadCompra}\nTotal: $${totalVenta}`);
    cantidadTickets -= cantidadCompra;
  } else {
    alert("No hay suficientes tickets disponibles.");
  }
}

while ((cantidadTickets) => 0) {
  venderTicket();
}
