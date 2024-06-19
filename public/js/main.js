const socket = io();
console.log('Conectado al servidor de Socket.io');

socket.on("productDeleted", (productId) => {
    console.log(`Producto eliminado con ID ${productId}`);
    const productItems = document.querySelectorAll("li");
    productItems.forEach(item => {
        if (item.textContent.includes(`codigo: ${productId}`)) {
            item.remove();
        }
    });
});


socket.on("productAdded", (newProduct) => {
    const productItem = document.createElement("li");
    productItem.textContent = `${newProduct.title} - $${newProduct.price} - ${newProduct.description} - codigo: ${newProduct.code}`;
    document.querySelector("ul").appendChild(productItem);
});
