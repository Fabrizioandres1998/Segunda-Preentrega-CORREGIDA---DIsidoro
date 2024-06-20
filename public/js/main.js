const socket = io();
console.log('Conectado al servidor de Socket.io');

socket.on("productDeleted", (productId) => {
    try {
        console.log(`Producto eliminado from socket con ID ${productId}`);

        const productItem = document.getElementById(`${productId}`);
        if (productItem) {
            productItem.remove(); // Eliminar el elemento del DOM
        } else {
            console.log(`No se encontró el producto con ID ${productId} en el DOM`);
        }
    } catch (error) {
        console.log(error)
    }
});

socket.on("productAdded", (newProduct) => {
    try {
        const productItem = document.createElement("li");
        productItem.id = `${newProduct.id}`; // Asignar un ID único al elemento <li> basado en el ID del producto
        productItem.textContent = `${newProduct.title} - $${newProduct.price} - ${newProduct.description} - Código: ${newProduct.code}`;
        document.querySelector("ul").appendChild(productItem);
    } catch (error) {
        console.log(error)
    }
});