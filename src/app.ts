interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    quantity: number;
}

let products: Product[] = [];
let editingProductId: number | null = null;

const productForm = document.getElementById("productForm") as HTMLFormElement;
const productNameInput = document.getElementById("productName") as HTMLInputElement;
const brandInput = document.getElementById("brand") as HTMLInputElement;
const categoryInput = document.getElementById("category") as HTMLSelectElement;
const priceInput = document.getElementById("price") as HTMLInputElement;
const quantityInput = document.getElementById("quantity") as HTMLInputElement;
const tableBody = document.getElementById("productTableBody") as HTMLTableSectionElement;
const productCount = document.getElementById("productCount") as HTMLSpanElement;
const submitButton = productForm.querySelector(".add-btn") as HTMLButtonElement;


// Display products in inventory
function displayProducts(): void {

    tableBody.innerHTML = "";

    products.forEach(function(product: Product): void {

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
productForm.addEventListener("submit", function(event: SubmitEvent): void {

    event.preventDefault();

    const name: string = productNameInput.value.trim();
    const brand: string = brandInput.value.trim();
    const category: string = categoryInput.value;
    const price: number = Number(priceInput.value);
    const quantity: number = Number(quantityInput.value);

    if (
        name === "" ||
        brand === "" ||
        category === "" ||
        price <= 0 ||
        quantity < 0
    ) {
        alert("Please enter valid product details.");
        return;
    }

    if (editingProductId === null) {

        const newProduct: Product = {
            id: Date.now(),
            name: name,
            brand: brand,
            category: category,
            price: price,
            quantity: quantity
        };

        products.push(newProduct);

    } else {

        const productToUpdate = products.find(
            (product: Product): boolean =>
                product.id === editingProductId
        );

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
tableBody.addEventListener("click", function(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    const id: number = Number(target.getAttribute("data-id"));

    // EDIT
    if (target.classList.contains("edit-btn")) {

        const product = products.find(
            (item: Product): boolean => item.id === id
        );

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

        const confirmDelete: boolean =
            confirm("Are you sure you want to delete this product?");

        if (confirmDelete) {

            products = products.filter(
                (product: Product): boolean =>
                    product.id !== id
            );

            displayProducts();
        }
    }
});


// Initial display
displayProducts();