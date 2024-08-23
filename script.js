class Parking {
  constructor() {
    // Propiedades para almacenar información sobre tickets y lugares
    this.tiposTickets = [];
    this.cantidadTickets = {};
    this.precioTickets = {};
    this.lugaresDisponibles = [];
    this.lugaresVendidos = [];

    // Elementos del DOM que actualizan la interfaz de usuario
    this.ticketsDisponiblesEl = document.getElementById("ticketsDisponibles");
    this.cardContainer = document.getElementById("cardContainer");

    // Lugares disponibles y carga datos de tickets
    this.inicializarLugaresDisponibles();
    this.cargarDatosTickets().then(() => this.actualizarTicketsDisponibles());

    document
      .getElementById("comprarTicket")
      .addEventListener("click", () => this.mostrarFormularioCompra());
  }

  inicializarLugaresDisponibles() {
    const filas = ["A", "B"];
    const columnas = 11;
    this.lugaresDisponibles = filas.flatMap((fila) =>
      Array.from({ length: columnas }, (_, i) => `${fila}${i + 1}`)
    );
  }

  // Carga de datos de tickets desde el localStorage o un archivo JSON
  cargarDatosTickets() {
    return new Promise((resolve, reject) => {
      const datosGuardados =
        JSON.parse(localStorage.getItem("datosParking")) || null;

      if (datosGuardados) {
        // Si hay datos guardados, los carga en las propiedades del objeto
        const {
          tiposTickets,
          cantidadTickets,
          precioTickets,
          lugaresDisponibles = [],
          lugaresVendidos = [],
        } = datosGuardados;
        Object.assign(this, {
          tiposTickets,
          cantidadTickets,
          precioTickets,
          lugaresDisponibles,
          lugaresVendidos,
        });
        resolve();
      } else {
        // Si no hay datos guardados, los carga desde el archivo JSON
        fetch("data.json")
          .then((response) => response.json())
          .then((data) => {
            const { tiposTickets, cantidadTickets, precioTickets } = data;
            Object.assign(this, {
              tiposTickets,
              cantidadTickets,
              precioTickets,
            });
            resolve();
          })
          .catch((error) =>
            reject(
              console.error("Error al cargar los datos de los tickets:", error)
            )
          );
      }
    });
  }

  // Actualiza la cantidad de tickets disponibles en la interfaz
  actualizarTicketsDisponibles(tipoSeleccionado = null) {
    if (!this.ticketsDisponiblesEl) return;

    const totalTickets = tipoSeleccionado
      ? this.cantidadTickets[tipoSeleccionado] || 0
      : Object.values(this.cantidadTickets).reduce(
          (total, cantidad) => total + cantidad,
          0
        );

    this.ticketsDisponiblesEl.textContent = tipoSeleccionado
      ? `DISPONIBLES: ${totalTickets}`
      : `TICKETS TOTALES DISPONIBLES: ${totalTickets}`;

    this.guardarDatosEnLocalStorage();
  }

  // Formulario de compra de tickets
  mostrarFormularioCompra() {
    this.cardContainer.innerHTML = "";
    const formCard = document.createElement("div");
    formCard.className = "card";
    formCard.innerHTML = `
      <h4>Compra de Tickets</h4>
      <div class="formulario-tickets">
        <select id="tipoTicket">
          <option value="">Selecciona un tipo de ticket</option>
          ${this.tiposTickets
            .map((tipo) => `<option value="${tipo}">${tipo}</option>`)
            .join("")}
        </select>
        <div id="cantidadContainer" style="display: none;">
          <label for="cantidadTickets">¿Cuántos tickets deseas comprar?</label>
          <input type="number" id="cantidadTickets" min="1" />
        </div>
        <div id="formularioDatos" style="display: none;">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" required />
          <label for="email">Email:</label>
          <input type="email" id="email" required />
          <label for="fechaInicio">Fecha de Inicio:</label>
          <input type="date" id="fechaInicio" required min="${
            new Date().toISOString().split("T")[0]
          }" />
        </div>
        <div id="botonesContainer" style="display: none;">
          <button id="confirmarCompra">Confirmar</button>
          <button id="cancelarCompra">Cancelar</button>
        </div>
      </div>
    `;

    this.cardContainer.appendChild(formCard);

    const cantidadContainer = document.getElementById("cantidadContainer");
    const formularioDatos = document.getElementById("formularioDatos");
    const botonesContainer = document.getElementById("botonesContainer");

    // Muestra la cantidad de tickets y botones según el tipo seleccionado
    document
      .getElementById("tipoTicket")
      .addEventListener("change", (event) => {
        const tipoTicketSeleccionado = event.target.value;

        cantidadContainer.style.display = tipoTicketSeleccionado
          ? "block"
          : "none";
        botonesContainer.style.display = tipoTicketSeleccionado
          ? "block"
          : "none";

        this.actualizarTicketsDisponibles(tipoTicketSeleccionado);
      });

    // Muestra el formulario de datos SOLO si la cantidad de tickets es mayor a 0
    document
      .getElementById("cantidadTickets")
      .addEventListener("input", (event) => {
        const cantidad = parseInt(event.target.value, 10);

        // Mostrar o esconder el formulario de datos dependiendo de la cantidad
        formularioDatos.style.display = cantidad > 0 ? "block" : "none";
      });

    // Configura la fecha de fin según la fecha de inicio seleccionada
    document
      .getElementById("fechaInicio")
      .addEventListener("change", (event) =>
        this.configurarFechaFin(event.target.value)
      );

    // Evento para confirmar la compra y condición de que si no es mayor a 0 muestra una alerta.
    document.getElementById("confirmarCompra").addEventListener("click", () => {
      const cantidadTickets = parseInt(
        document.getElementById("cantidadTickets").value,
        10
      );

      if (cantidadTickets === 0) {
        Toastify({
          text: "Debes seleccionar al menos 1 ticket.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      } else {
        this.confirmarCompra();
      }
    });

    // Cancela la compra y muestra los tickets totales disponibles nuevamente
    document.getElementById("cancelarCompra").addEventListener("click", () => {
      this.cardContainer.innerHTML = "";
      this.actualizarTicketsDisponibles();
    });
  }

  configurarFechaFin(fechaInicio) {
    let fechaFinInput = document.getElementById("fechaFin");

    if (!fechaFinInput) {
      const fechaFinLabel = document.createElement("label");
      fechaFinLabel.id = "fechaFinLabel";
      fechaFinLabel.setAttribute("for", "fechaFin");
      fechaFinLabel.innerText = "Fecha de Fin:";
      this.cardContainer
        .querySelector("#formularioDatos")
        .appendChild(fechaFinLabel);

      fechaFinInput = document.createElement("input");
      fechaFinInput.id = "fechaFin";
      fechaFinInput.setAttribute("type", "date");
      fechaFinInput.setAttribute("required", "true");
      this.cardContainer
        .querySelector("#formularioDatos")
        .appendChild(fechaFinInput);
    }

    fechaFinInput.setAttribute("min", fechaInicio);
    fechaFinInput.value = "";
  }

  // Confirmacion de la compra y validación
  confirmarCompra() {
    const tipoTicket = document.getElementById("tipoTicket").value;
    const cantidadTickets = parseInt(
      document.getElementById("cantidadTickets").value,
      10
    );
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    this.validarCompra(tipoTicket, cantidadTickets, fechaInicio, fechaFin)
      .then(() => {
        const totalVenta = cantidadTickets * this.precioTickets[tipoTicket];
        const lugaresVendidos = this.mostrarLugaresVendidos(cantidadTickets);

        // Actualiza la cantidad de tickets disponibles y registra los lugares vendidos
        this.cantidadTickets[tipoTicket] -= cantidadTickets;
        this.lugaresVendidos.push({
          lugar: lugaresVendidos,
          cantidad: cantidadTickets,
          tipo: tipoTicket,
          fechaInicio,
          fechaFin,
        });

        // Guarda los datos actualizados en el localStorage y muestra la información de la venta
        return this.guardarDatosEnLocalStorage().then(() => ({
          totalVenta,
          lugaresVendidos,
        }));
      })
      .then(({ totalVenta, lugaresVendidos }) => {
        document.getElementById("spinnerContainer").style.display = "block";
        this.cardContainer.style.display = "none";

        setTimeout(() => {
          document.getElementById("spinnerContainer").style.display = "none";
          this.cardContainer.style.display = "block";

          this.actualizarTicketsDisponibles();
          this.mostrarInformacionVenta(
            `Tickets vendidos: ${cantidadTickets}<br><b>Tipo:</b> ${tipoTicket}<br>Lugares asignados:<b><br><br>${lugaresVendidos.join(
              "<br>"
            )}</b><br><br><b>TOTAL:</b> $${totalVenta}`,
            tipoTicket
          );
        }, 3000);
      })
      .catch((error) =>
        Swal.fire({ icon: "error", title: "¡Lo siento!", text: error.message })
      );
  }

  // Método para validar la compra, incluyendo la verificación de campos requeridos
  validarCompra(tipoTicket, cantidadTickets, fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const fechaActual = new Date().toISOString().split("T")[0];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nombre) return reject(new Error("Debes ingresar un nombre válido."));
      if (!email || !emailRegex.test(email))
        return reject(new Error("Debes ingresar un Email válido."));
      if (!fechaInicio || !fechaFin)
        return reject(
          new Error("Debes seleccionar un rango de fechas válido.")
        );
      if (fechaInicio < fechaActual)
        return reject(
          new Error(
            "La fecha de inicio no puede ser anterior a la fecha actual."
          )
        );
      if (new Date(fechaFin) <= new Date(fechaInicio))
        return reject(
          new Error("La fecha de fin debe ser posterior a la fecha de inicio.")
        );
      if (!tipoTicket)
        return reject(new Error("Debes seleccionar un tipo de ticket."));
      if (isNaN(cantidadTickets) || cantidadTickets < 1)
        return reject(
          new Error("Debes ingresar una cantidad válida de tickets.")
        );
      if (cantidadTickets > this.cantidadTickets[tipoTicket])
        return reject(
          new Error(
            `La cantidad solicitada excede la cantidad disponible de ${this.cantidadTickets[tipoTicket]} tickets.`
          )
        );

      resolve();
    });
  }

  mostrarInformacionVenta(mensaje, tipoTicket) {
    const resumenCard = document.createElement("div");
    resumenCard.className = `card resumen ${tipoTicket}`;
    resumenCard.innerHTML = `
      <h4>Resumen de la Compra</h4>
      <p>${mensaje}</p>
    `;
    this.cardContainer.innerHTML = "";
    this.cardContainer.appendChild(resumenCard);

    Toastify({
      text: "Compra exitosa",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#008000",
    }).showToast();
  }

  mostrarLugaresVendidos(cantidadTickets) {
    return this.lugaresDisponibles.splice(0, cantidadTickets);
  }

  guardarDatosEnLocalStorage() {
    return new Promise((resolve, reject) => {
      const data = {
        tiposTickets: this.tiposTickets,
        cantidadTickets: this.cantidadTickets,
        precioTickets: this.precioTickets,
        lugaresDisponibles: this.lugaresDisponibles,
        lugaresVendidos: this.lugaresVendidos,
      };
      localStorage.setItem("datosParking", JSON.stringify(data));
      resolve();
    });
  }
}

const parking = new Parking();
