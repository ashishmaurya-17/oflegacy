// 1. Product Database (Tumhari 6 toys ki list)
const products = [
    {
        id: 1,
        name: "Mechanical RC Racing Bike V1",
        price: 1299,
        oldPrice: 3999,
        image: "assets/toy1.jpg"
    },
    {
        id: 2,
        name: "V8 Engine Assembly Model Car",
        price: 2499,
        oldPrice: 5999,
        image: "assets/toy2.jpg"
    },
    {
        id: 3,
        name: "Hydraulic Heavy Excavator",
        price: 1899,
        oldPrice: 4500,
        image: "assets/toy3.jpg"
    },
    {
        id: 4,
        name: "Mechanical Gearbox Transmission Kit",
        price: 899,
        oldPrice: 2200,
        image: "assets/toy4.jpg"
    },
    {
        id: 5,
        name: "Steampunk Metal Spider Model",
        price: 1599,
        oldPrice: 3200,
        image: "assets/toy5.jpg"
    },
    {
        id: 6,
        name: "AI Mechanical Robot Dog",
        price: 2100,
        oldPrice: 5500,
        image: "assets/toy6.jpg"
    }
];

// 2. Detect Page (Kaunse page par hain hum?)
const path = window.location.pathname;
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// 3. Agar HOME PAGE hai -> Grid Render karo
const productList = document.getElementById('product-list');
if (productList) {
    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="${product.image}" alt="${product.name}">
                <div class="card-info">
                    <h3>${product.name}</h3>
                    <p><strong>Rs. ${product.price}</strong> <del style="color:#999">Rs. ${product.oldPrice}</del></p>
                    <button class="card-btn">View Details</button>
                </div>
            </div>
        `;
    });
}

// 4. Agar PRODUCT PAGE hai -> Details Render karo
if (productId) {
    const product = products.find(p => p.id == productId);
    
    if (product) {
        document.getElementById('p-img').src = product.image;
        document.getElementById('p-name').innerText = product.name;
        document.getElementById('p-price').innerText = "Rs. " + product.price;
        document.getElementById('p-old-price').innerText = "Rs. " + product.oldPrice;
    }
}

// 5. WhatsApp Order Function
function buyNow() {
    // Yahan product data wapas fetch kar rahe hain
    const currentId = new URLSearchParams(window.location.search).get('id');
    const product = products.find(p => p.id == currentId);
    
    // Apna Number Yahan Daalein (Country Code ke saath)
    const myNumber = "919999999999"; 

    if (product) {
        const text = `Hi, I want to order *${product.name}* for Price: Rs.${product.price}. Please take my address.`;
        const url = `https://wa.me/${myNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}
