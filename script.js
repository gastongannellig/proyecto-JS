//Venta de tickets para parking

class Parking {
  constructor(precioTicket, cantidadTickets) {
    this.precioTicket = precioTicket;
    this.cantidadTickets = cantidadTickets;
    this.lugaresDisponibles = Array.from({ length: 22 }, (_, i) => {
      const letra = String.fromCharCode(65 + i); // A = 65, B = 66, ...
      return letra + (i + 1); // Ejemplo: A1, B2, ...
    });
    this.lugaresVendidos = [];
  }

  obtenerLugarAleatorio() {
    // Método para obtener un lugar aleatorio
    if (this.lugaresDisponibles.length === 0) {
      return null; // Si no hay lugares disponibles, retorna null
    }
    const indiceAleatorio = Math.floor(
      Math.random() * this.lugaresDisponibles.length
    ); // Genera un índice aleatorio
    return this.lugaresDisponibles.splice(indiceAleatorio, 1)[0]; // Elimina y devuelve el lugar aleatorio
  }

  venderTicket() {
    // Método para vender un ticket
    const lugarDisponible = this.obtenerLugarAleatorio(); // Obtiene un lugar disponible
    if (!lugarDisponible) {
      alert("Lo siento, no quedan más lugares disponibles."); // Si no hay lugar, muestra un mensaje
      return;
    }

    const valorIngresado = prompt("¿Cuántos tickets deseas comprar?");
    if (valorIngresado === null) {
      alert("Operación cancelada por el usuario."); // Si el usuario cancela, muestra un mensaje
      return;
    }

    const cantidadCompra = parseInt(valorIngresado);
    if (isNaN(cantidadCompra) || cantidadCompra <= 0) {
      alert("Ingresa una cantidad válida."); // Si la cantidad ingresada no es válida, muestra un mensaje
      return;
    }

    if (cantidadCompra <= this.cantidadTickets) {
      const totalVenta = cantidadCompra * this.precioTicket; // Calcula el total de la venta
      alert(
        `Tickets vendidos: ${cantidadCompra}\nLugar(es): ${this.mostrarLugaresVendidos(
          cantidadCompra
        )}\nPrecio individual: $${this.precioTicket}\nTotal: $${totalVenta}`
      ); // Muestra un resumen de la venta
      this.cantidadTickets -= cantidadCompra; // Actualiza la cantidad de tickets disponibles
      this.lugaresVendidos.push({
        lugar: lugarDisponible,
        cantidad: cantidadCompra,
      }); // Agrega el lugar vendido al array de lugares vendidos
    } else {
      alert("No hay suficientes tickets disponibles."); // Si no hay suficientes tickets, muestra un mensaje
    }
  }

  mostrarLugaresVendidos(cantidadTickets) {
    // Método para mostrar los lugares vendidos
    const lugaresTexto = [];
    for (let i = 0; i < cantidadTickets; i++) {
      const lugar = this.obtenerLugarAleatorio();
      if (lugar !== null) {
        lugaresTexto.push(lugar);
      }
    }
    return lugaresTexto.join(","); // Devuelve los lugares vendidos como texto separado por comas
  }
}

const miParking = new Parking(5, 10); // Crea una instancia de Parking con un precio de 5 c/u y 10 tickets totales.

// Evento click al botón
const comprarTicket = document.querySelector("#comprarTicket");
comprarTicket.addEventListener("click", () => miParking.venderTicket()); // Asigna el método venderTicket al botón
