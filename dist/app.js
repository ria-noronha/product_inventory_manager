"use strict";
let products = [];
let editingProductId = null;
const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const brandInput = document.getElementById("brand");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const tableBody = document.getElementById("productTableBody");
const productCount = document.getElementById("productCount");
const submitButton = productForm.querySelector(".add-btn");
// Display products in inventory
function displayProducts() {
    tableBody.innerHTML = "";
    products.forEach(function (product) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.category}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td class="${product.quantity <= 5 ? "low-stock" : ""}">
                ${product.quantity}
            </td>
            <td>
                <button class="edit-btn" data-id="${product.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${product.id}">
                    Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    productCount.textContent = products.length.toString();
}
// Add or update a product
productForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = productNameInput.value.trim();
    const brand = brandInput.value.trim();
    const category = categoryInput.value;
    const price = Number(priceInput.value);
    const quantity = Number(quantityInput.value);
    if (name === "" ||
        brand === "" ||
        category === "" ||
        price <= 0 ||
        quantity < 0) {
        alert("Please enter valid product details.");
        return;
    }
    if (editingProductId === null) {
        const newProduct = {
            id: Date.now(),
            name: name,
            brand: brand,
            category: category,
            price: price,
            quantity: quantity
        };
        products.push(newProduct);
    }
    else {
        const productToUpdate = products.find((product) => product.id === editingProductId);
        if (productToUpdate) {
            productToUpdate.name = name;
            productToUpdate.brand = brand;
            productToUpdate.category = category;
            productToUpdate.price = price;
            productToUpdate.quantity = quantity;
        }
        editingProductId = null;
        submitButton.textContent = "Add Product";
    }
    productForm.reset();
    displayProducts();
});
// Handle Edit and Delete buttons
tableBody.addEventListener("click", function (event) {
    const target = event.target;
    const id = Number(target.getAttribute("data-id"));
    // EDIT
    if (target.classList.contains("edit-btn")) {
        const product = products.find((item) => item.id === id);
        if (product) {
            productNameInput.value = product.name;
            brandInput.value = product.brand;
            categoryInput.value = product.category;
            priceInput.value = product.price.toString();
            quantityInput.value = product.quantity.toString();
            editingProductId = product.id;
            submitButton.textContent = "Update Product";
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }
    // DELETE
    if (target.classList.contains("delete-btn")) {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            products = products.filter((product) => product.id !== id);
            displayProducts();
        }
    }
});
// Initial display
displayProducts();
