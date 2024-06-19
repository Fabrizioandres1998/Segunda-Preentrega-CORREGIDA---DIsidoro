// public/js/main.js
const socket = io();

socket.on("productAdded", (newProduct) => {
    const productItem = document.createElement("li");
    productItem.textContent = `${newProduct.title} - $${newProduct.price} - ${newProduct.description} - codigo: ${newProduct.code}`;
    document.querySelector("ul").appendChild(productItem);
});

socket.on("productDeleted", (productId) => {
    const productItems = document.querySelectorAll("ul li");
    productItems.forEach(item => {
        if (item.textContent.includes(`codigo: ${productId}`)) {
            item.remove();
        }
    });
});
