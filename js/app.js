//URL del json
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

//CREO UN ARRAY PARA EL CARRITO EL CUAL LUEGO VOY A IR LLENANDO
let productosDelCarrito = [];

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

    if (repeat) {
      productosDelCarrito.map((prod) => {
        if (prod.id === prodEncont.id) {
          prod.cantidad++;
        }
      });
    } else {
      productosDelCarrito.push(prodEncont);
      console.log("productos del carrito");
      console.log(productosDelCarrito);

      localStorage.setItem("carrito", JSON.stringify(productosDelCarrito));
    }
    carritoContador();
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
      <p>Cantidad :${producto.cantidad}</p> 
      <h3>${producto.marca}</h3>
      <p>Importe : ${producto.cantidad * producto.precio}</p>
       `;

    modalContainer.append(carritoContenido);


    let eliminar = document.createElement("span");
    eliminar.innerText = "❌";
    eliminar.className = "eliminar-producto";
    carritoContenido.append(eliminar);

    eliminar.addEventListener("click", eliminarProducto);
  });

  const total = productosDelCarrito.reduce((acc, el) => acc + el.precio * el.cantidad , 0);

  const totalCompra = document.createElement("div");
  totalCompra.className = "total-compra";
  totalCompra.innerHTML = `Total a pagar : ${total} $`;
  modalContainer.append(totalCompra);
};

verCarrito.addEventListener("click", llenarCarrito);

const eliminarProducto = () => {
  const buscarId = productosDelCarrito.find((element) => element.id);

  productosDelCarrito = productosDelCarrito.filter((carritoId) => {
    return carritoId !== buscarId;
  });

  carritoContador();
  llenarCarrito();
};

const carritoContador = () => {
  cantidadCarrito.style.display = "block";
  cantidadCarrito.innerText = productosDelCarrito.length;
}

mostrarProductos();

//  function mostarCarrito() {
//   productosDelCarrito.forEach((producto) => {
//     console.log(productosDelCarrito);
//     let prodAgregadoAlCarrito = document.createElement("div");
//    prodAgregadoAlCarrito.className = "carrito-productos";
//    prodAgregadoAlCarrito.innerHTML = `
//              <div class="info-carrito-productos">
//                <span class="cantidad-productos-carrito">${0}</span>
//                <p class="titulo-productos-carrito">${producto.marca}</p>
//              <span class="precio-productos-carrito">${producto.precio}</span>
//              </div>
//              <svg
//              xmlns="http://www.w3.org/2000/svg"
//              fill="none"
//              viewBox="0 0 24 24"
//              stroke-width="1.5"
//              stroke="currentColor"
//              class="icon-close"
//              >
//              <path
//              stroke-linecap="round"
//              stroke-linejoin="round"
//              d="M6 18L18 6M6 6l12 12"
//              />
//              </svg>
//              `;
//   })

//  }

//ESCONDE O NO EL MODAL DEL CARRITO DE COMPRAS
// const iconoCarrito = document.querySelector(".container-carrito-icono");
// const containerCarritoProductos = document.querySelector(
//   ".container-carrito-productos"
// );
// iconoCarrito.addEventListener("click", () => {
//   containerCarritoProductos.classList.toggle("hidden-carrito");
// });

//  const carritoInfo = document.querySelector(".carrito-productos");
//  const rowProduct = document.querySelector(".row-producto");
//  const productList = document.querySelector(".container-product");

//  const valorTotal = document.querySelector(".total-pagar");
//  const contadorProductos = document.querySelector("#contador-productos");

//   productList.addEventListener("click", (e) => {
//    if (e.target.classList.contains("botonAñadirCarrito")) {
//      const producto = e.target.parentElement;
//      const infoProducto = {
//        cantidad: 1,
//        titulo: producto.querySelector("h2").textContent,
//        precio: producto.querySelector("p").textContent,
//      };
//      const existe = productosDelCarrito.some(
//        (producto) => producto.titulo === infoProducto.titulo
//      );
//      if (existe) {
//        const productos = productosDelCarrito.map((producto) => {
//          if (producto.titulo === infoProducto.titulo) {
//            producto.cantidad++;
//            return producto;
//          } else {
//            return producto;
//          }
//        });
//        productosDelCarrito = [...productos];
//      } else {
//        productosDelCarrito = [...productosDelCarrito, infoProducto];
//      }
//      mostrarHtml();
//    }
//  });
//  rowProduct.addEventListener("click", (e) => {
//    if (e.target.classList.contains("icon-close")) {
//      console.log("Hiciste clic en el ícono de cierre");
//      const producto = e.target.parentElement.parentElement; // Obtén el producto completo
//      const titulo = producto.querySelector(
//        ".titulo-productos-carrito"
//      ).textContent;
//      productosDelCarrito = productosDelCarrito.filter(
//        (producto) => producto.titulo !== titulo
//      );
//       rowProduct.addEventListener('click', (e) => {
//         if(e.target.classList.contains('icon-close')){
//           console.log("Hiciste clic en el ícono de cierre");
//           const producto = e.target.parentElement
//           const titulo = producto.querySelector('p').textContent
//           productosDelCarrito = productosDelCarrito.filter(
//             producto =>producto.titulo !== titulo
//             );
//      mostrarHtml();
//    }
//  });
//  const mostrarHtml = () => {
//    rowProduct.innerHTML = "";
//    let total = 0;
//    let totaldeProductos = 0;
//    productosDelCarrito.forEach((producto) => {
//      const containerProducto = document.createElement("div");
//      containerProducto.classList.add("carrito-productos");
//      containerProducto.innerHTML = `
//          <div class="info-carrito-productos">
//                  <span class="cantidad-productos-carrito">${producto.cantidad}  </span>
//                  <p class="titulo-productos-carrito">${producto.titulo} </p>
//                  <span class="precio-productos-carrito">${producto.precio} </span>
//                </div>
//                <svg
//                  xmlns="http://www.w3.org/2000/svg"
//                  height="1em"
//                  viewBox="0 0 384 512"
//                  class="icon-close"
//                >
//                  <path
//                    d="M342.6 150.6c12.5-12.5 12.5-32.8
//                  0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6
//                  105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8
//                  0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8
//                  12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3
//                  0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
//                  />
//                </svg>
//                `;
//      rowProduct.append(containerProducto);
//      total = total + parseInt(producto.cantidad * producto.precio.slice(1));
//      totaldeProductos = totaldeProductos + producto.cantidad;
//    });
//    valorTotal.innerText = `$${total}`;
//    contadorProductos.innerText = totaldeProductos;
//  } }
