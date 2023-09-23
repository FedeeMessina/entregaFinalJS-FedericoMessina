//URL DEL JSON
const url = "../JSON/productos.json";

//TRAYENDO EL JSON CON LOS PORDUCTOS
async function obtenerProductos(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

//ONSTANTES PARA IR AGREGANDOI EL HTML
const contenedorTarjetas = document.querySelector("#container-product");
const verCarrito = document.querySelector(".ver-carrito");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");

//RECUPERO SI ES QUE HAY ALGO EN EL LOCAL STORAGE Y SINO CREO UN ARRAY PARA EL CARRITO EL CUAL LUEGO VOY A IR LLENANDO
let productosDelCarrito =  JSON.parse(localStorage.getItem("carrito")) || [];

//FUNCION QUE ME MUESTRA TODOS LOS PRODFUCTOS EN PANTALLA Y ME CREA LAS CARDS
function mostrarProductos() {
  obtenerProductos("../JSON/productos.json")
    .then((productos) => {
      productos.forEach((prod) => {
        //creo las cards para que se me rendericen los productos en el html luego
        let tarjetas = document.createElement("div");
        tarjetas.className = "product";

        tarjetas.innerHTML = `<figure>
      <img src="${prod.imagen}"  />
    </figure>
    <div class="info-product">
      <h2>${prod.marca}</h2>
      <p class="precio">$${prod.precio}</p>
      <button class="boton-añadir-carrito" id=${prod.id}>Añadir al carrito</button>
    </div>
    `;
        contenedorTarjetas.appendChild(tarjetas);

        const botonAlCarrito = document.getElementById(`${prod.id}`);
        botonAlCarrito.addEventListener("click", agregarAlCarrito);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los datos de productos:", error);
    });
}

//FUNCION QUE ME AGREGA LOS PRODUCTOS AL CARRITO
function agregarAlCarrito(e) {
  const id = e.target.id;

  obtenerProductos("../JSON/productos.json").then((productos) => {
    const prodEncont = productos.find((p) => p.id === parseInt(id));

    const repeat = productosDelCarrito.some(
      (repeatProduct) => repeatProduct.id === prodEncont.id
    );
    console.log(repeat);

    repeat ? productosDelCarrito.forEach((prod) => {
          if (prod.id === prodEncont.id) {
            prod.cantidad++;
          }
        })
      : (productosDelCarrito.push(prodEncont),
        console.log("productos del carrito"),
        console.log(productosDelCarrito));
    
    carritoContador();
    saveLocal();
    Toastify({
      text: "Has agregado productos al carrito!",
      duration: 1500,
      position: "left"
      }).showToast();
  });
}

//FUNCION QUE ME MUESTRA EL MODAL DEL CARRITO CON SUS PRODUCTOS
const llenarCarrito = () => {
  //vacio el contenedor para que no se repita cada vez que clickeo
  modalContainer.innerHTML = "";

  modalContainer.style.display = "flex";
  //voy creando el modal y agregandole su info
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <h1 class = "modal-header-title">Carrito</h1>
       `;

  modalContainer.append(modalHeader);

  const modalButton = document.createElement("h3");
  modalButton.innerText = "X";
  modalButton.className = "modal-header-button";

  modalButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalHeader.append(modalButton);

  productosDelCarrito.forEach((producto) => {
    let carritoContenido = document.createElement("div");
    carritoContenido.className = "modal-content";
    carritoContenido.innerHTML = `
      <h3>${producto.marca}</h3>
      <p>Cantidad :${producto.cantidad}</p> 
      <p>Importe : ${producto.cantidad * producto.precio}</p>
      <span class="eliminar-producto">❌</span>
       `;

    modalContainer.append(carritoContenido);

    let eliminar = carritoContenido.querySelector(".eliminar-producto");
    eliminar.addEventListener("click", () => {
      eliminarProducto(producto.id);
    })

    
  });

  const total = productosDelCarrito.reduce(
    (acc, el) => acc + el.precio * el.cantidad,
    0
  );

  const totalCompra = document.createElement("div");
  totalCompra.className = "total-compra";
  totalCompra.innerHTML = `Total a pagar : ${total} $`;
  modalContainer.append(totalCompra);
};

verCarrito.addEventListener("click", llenarCarrito);


//FUNCION QUE ELIMINA EL PRODUCTO
const eliminarProducto = (id) => {
  const buscarId = productosDelCarrito.find((element) => element.id === id);

  productosDelCarrito = productosDelCarrito.filter((carritoId) => {
    return carritoId !== buscarId;
  });

  carritoContador();
  saveLocal();
  llenarCarrito();
};

const carritoContador = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = productosDelCarrito.length;

  localStorage.setItem('carritoLength', JSON.stringify(carritoLength));

  cantidadCarrito.innerText = JSON.parse(localStorage.getItem('carritoLength'));
};

const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(productosDelCarrito));
};



mostrarProductos();
carritoContador();


