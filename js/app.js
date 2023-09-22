// document.getElementById("loginForm").addEventListener("submit", function(event) {
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     if (!username || !password) {
//         alert("Por favor, completa ambos campos.");
//         event.preventDefault(); // Evita que el formulario se envíe
//     }
// });

// document.getElementById("loginForm").addEventListener("submit", function(e) {
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     if (!username || !password) {
//         alert("Por favor, completa ambos campos.");
//         e.preventDefault();
//     } else {
//         // Crear un objeto para representar al usuario
//         const user = {
//             username: username,
//         };

//         // Guardar el usuario en el localStorage
//         localStorage.setItem("user", JSON.stringify(user));

//         // Redirigir al usuario a la página "carrito.html"
//         window.location.href = "carrito.html";
//     }
// });
const botonCarrito = document.querySelector(".container-carrito-icono");
const containerCarritoProductos = document.querySelector(
  ".container-carrito-productos"
);
botonCarrito.addEventListener("click", () => {
  containerCarritoProductos.classList.toggle("hidden-carrito");
});

const carritoInfo = document.querySelector(".carrito-productos");
const rowProduct = document.querySelector(".row-producto");

const productList = document.querySelector(".container-product");

let productosDelCarrito = [];

const valorTotal = document.querySelector('.total-pagar')
const contadorProductos = document.querySelector('#contador-productos')


productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("botonAñadirCarrito")) {
    const producto = e.target.parentElement;

    const infoProducto = {
      cantidad: 1,
      titulo: producto.querySelector("h2").textContent,
      precio: producto.querySelector("p").textContent,
    };

    const existe = productosDelCarrito.some(
      (producto) => producto.titulo === infoProducto.titulo
    );

    if (existe) {
      const productos = productosDelCarrito.map((producto) => {
        if (producto.titulo === infoProducto.titulo) {
          producto.cantidad++;
          return producto;
        } else {
          return producto;
        }
      });
      productosDelCarrito = [...productos];
    } else {
      productosDelCarrito = [...productosDelCarrito, infoProducto];
    }

    mostrarHtml();
  }
});

rowProduct.addEventListener('click', (e) => {
  if(e.target.classList.contains('icon-close')){
    console.log("Hiciste clic en el ícono de cierre");
    const producto = e.target.parentElement
    const titulo = producto.querySelector('p').textContent

    productosDelCarrito = productosDelCarrito.filter(
      producto =>producto.titulo !== titulo
      );

      mostrarHtml();
  }

})


const mostrarHtml = () => {
  rowProduct.innerHTML = "";


  let total = 0 ;
  let totaldeProductos = 0;

  productosDelCarrito.forEach((producto) => {
    const containerProducto = document.createElement("div");
    containerProducto.classList.add("carrito-productos");

    containerProducto.innerHTML = `
        <div class="info-carrito-productos">
                <span class="cantidad-productos-carrito">${producto.cantidad}  </span>
                <p class="titulo-productos-carrito">${producto.titulo} </p>
                <span class="precio-productos-carrito">${producto.precio} </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
                class="icon-close"
              >
                <path
                  d="M342.6 150.6c12.5-12.5 12.5-32.8 
                0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 
                105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 
                0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 
                12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 
                0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                />
              </svg>
              `;

    rowProduct.append(containerProducto);

    total = total + parseInt(producto.cantidad * producto.precio.slice(1));
    totaldeProductos = totaldeProductos + producto.cantidad;

  });

  valorTotal.innerText = `$${total}`;
  contadorProductos.innerText = totaldeProductos ;
};
