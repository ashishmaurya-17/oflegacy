// Data for Products
const products = [
    { id: 1, name: "Mechanical RC Racing Bike V1", price: 1299, oldPrice: 3999, image: "assets/toy1.jpg" },
    { id: 2, name: "V8 Engine Assembly Model Car", price: 2499, oldPrice: 5999, image: "assets/toy2.jpg" },
    { id: 3, name: "Hydraulic Heavy Excavator", price: 1899, oldPrice: 4500, image: "assets/toy3.jpg" },
    { id: 4, name: "Mechanical Gearbox Kit", price: 899, oldPrice: 2200, image: "assets/toy4.jpg" },
    { id: 5, name: "Steampunk Metal Spider", price: 1599, oldPrice: 3200, image: "assets/toy5.jpg" },
    { id: 6, name: "AI Mechanical Robot Dog", price: 2100, oldPrice: 5500, image: "assets/toy6.jpg" }
];

// Populate Grid
const productList = document.getElementById('product-list');

if (productList) {
    productList.innerHTML = ""; // Clear loading message
    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <div class="card-image-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="card-info">
                    <h3>${product.name}</h3>
                    <div class="price-tag">
                        Rs. ${product.price} <del>Rs. ${product.oldPrice}</del>
                    </div>
                    <button class="card-btn">View Details</button>
                </div>
            </div>
        `;
    });
}

// Product Page Logic (Same as before, keep it)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        // Elements check karke value daalna taaki error na aaye
        if(document.getElementById('p-img')) document.getElementById('p-img').src = product.image;
        if(document.getElementById('p-name')) document.getElementById('p-name').innerText = product.name;
        if(document.getElementById('p-price')) document.getElementById('p-price').innerText = "Rs. " + product.price;
        if(document.getElementById('p-old-price')) document.getElementById('p-old-price').innerText = "Rs. " + product.oldPrice;
    }
}

function buyNow() {
    const currentId = new URLSearchParams(window.location.search).get('id');
    const product = products.find(p => p.id == currentId);
    const myNumber = "919999999999"; 
    if (product) {
        const text = `Hi, I want to order *${product.name}* for Price: Rs.${product.price}.`;
        const url = `https://wa.me/${myNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}

// Mobile Menu Toggle (New Feature)
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.desktop-nav');

if(menuBtn) {
    menuBtn.addEventListener('click', () => {
        // Simple toggle for mobile (CSS mein display:block karna padega active class par)
        alert("Mobile menu clicked! (Isse CSS se connect karna baki hai)");
    });
}
