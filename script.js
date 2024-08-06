class Parking {
  constructor(precioTicket, cantidadTickets) {
    this.precioTicket = precioTicket;
    this.cantidadTickets = cantidadTickets;

    // Genera una lista de lugares disponibles (A1, A2, ..., V22)
    this.lugaresDisponibles = Array.from(
      { length: 22 },
      (_, i) => `${String.fromCharCode(65 + i)}${i + 1}`
    );
    this.lugaresVendidos = [];

    // Carga los datos almacenados en localStorage si existen
    const datosGuardados = localStorage.getItem("datosParking");
    if (datosGuardados) {
      Object.assign(this, JSON.parse(datosGuardados)); // Asigna los datos cargados directamente
    }

    // Obtiene los elementos del DOM que se usarán
    this.ticketsDisponiblesEl = document.getElementById("ticketsDisponibles");
    this.cardContainer = document.getElementById("cardContainer");

    this.actualizarTicketsDisponibles();

    // Asigna el evento click al botón de comprar ticket
    document.getElementById("comprarTicket").addEventListener("click", () => {
      this.mostrarFormularioCompra(); // Muestra el formulario para comprar tickets
    });
  }

  // Actualiza el h3 que muestra los tickets disponibles
  actualizarTicketsDisponibles() {
    this.ticketsDisponiblesEl.textContent = `TICKETS DISPONIBLES: ${this.cantidadTickets}`;
  }

  // Obtiene un lugar aleatorio y lo elimina de los disponibles
  obtenerLugarAleatorio() {
    if (!this.lugaresDisponibles.length) {
      return null; // No hay lugares disponibles
    }
    const indiceAleatorio = Math.floor(
      Math.random() * this.lugaresDisponibles.length
    );
    return this.lugaresDisponibles.splice(indiceAleatorio, 1)[0]; // Elimina el lugar de la lista y lo retorna
  }

  // Muestra el formulario para que el usuario ingrese la cantidad de tickets a comprar
  mostrarFormularioCompra() {
    // Limpia el contenedor si ya hay una card
    this.cardContainer.innerHTML = "";

    // Crea una card con el formulario para ingresar la cantidad de tickets
    const formCard = document.createElement("div");
    formCard.className = "card";
    formCard.innerHTML = `
      <h4>Compra de Tickets</h4>
      <label for="cantidadTickets">¿Cuántos tickets deseas comprar?</label>
      <input type="number" id="cantidadTickets" min="1" />
      <button id="confirmarCompra">Confirmar</button>
      <button id="cancelarCompra">Cancelar</button>
    `;

    this.cardContainer.appendChild(formCard);

    // Agrega eventos a los botones de la card
    document
      .getElementById("confirmarCompra")
      .addEventListener("click", () => this.confirmarCompra());
    document
      .getElementById("cancelarCompra")
      .addEventListener("click", () => (this.cardContainer.innerHTML = ""));
  }

  // Procesa la compra de tickets
  confirmarCompra() {
    const cantidadTicketsInput = document.getElementById("cantidadTickets");
    const valorIngresado = cantidadTicketsInput.value;

    // Verifica si el valor ingresado es válido usando operadores lógicos
    if (!valorIngresado || isNaN(valorIngresado) || valorIngresado <= 0) {
      return this.mostrarInformacionVenta("Ingresa una cantidad válida.");
    }

    const cantidadCompra = parseInt(valorIngresado);
    if (cantidadCompra > this.cantidadTickets) {
      return this.mostrarInformacionVenta(
        "No hay suficientes tickets disponibles."
      );
    }

    const totalVenta = cantidadCompra * this.precioTicket;
    const lugaresVendidos = this.mostrarLugaresVendidos(cantidadCompra);

    // Actualiza los tickets disponibles y guarda la venta
    this.cantidadTickets -= cantidadCompra;
    this.lugaresVendidos.push({
      lugar: lugaresVendidos,
      cantidad: cantidadCompra,
    });
    this.actualizarTicketsDisponibles();
    this.guardarDatosEnLocalStorage();

    // Muestra la card con el resumen de la venta
    this.mostrarInformacionVenta(
      `Tickets vendidos: ${cantidadCompra}<br>Lugar(es): ${lugaresVendidos}<br>Precio individual: $${this.precioTicket}<b><br>Total: $${totalVenta}</b>`
    );
  }

  // Muestra los lugares vendidos en formato de texto
  mostrarLugaresVendidos(cantidadTickets) {
    return Array.from({ length: cantidadTickets }, () =>
      this.obtenerLugarAleatorio()
    )
      .filter(Boolean) // Filtra los lugares nulos
      .join(","); // Une los lugares de parking separados por comas
  }

  // Guarda los datos actuales en localStorage
  guardarDatosEnLocalStorage() {
    localStorage.setItem("datosParking", JSON.stringify(this));
  }

  // Muestra una card con la información de la venta
  mostrarInformacionVenta(mensaje) {
    const infoCard = document.createElement("div");
    infoCard.className = "card info-card";
    infoCard.innerHTML = `<h4>Resumen de la Venta</h4><p>${mensaje}</p>`;
    this.cardContainer.appendChild(infoCard); // Agrega la card al contenedor
  }
}

// Crear una instancia de la clase Parking con el precio y cantidad de tickets iniciales
const miParking = new Parking(5, 10);
