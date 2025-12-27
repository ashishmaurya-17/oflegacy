// =========================================
// 1. PRODUCT DATABASE & CONFIGURATION
// =========================================
const products = [
    { id: 1, name: "Mechanical RC Racing Bike V1", price: 1299, oldPrice: 3999, image: "assets/toy1.jpg" },
    { id: 2, name: "V8 Engine Assembly Model Car", price: 2499, oldPrice: 5999, image: "assets/toy2.jpg" },
    { id: 3, name: "Hydraulic Heavy Excavator", price: 1899, oldPrice: 4500, image: "assets/toy3.jpg" },
    { id: 4, name: "Mechanical Gearbox Kit", price: 899, oldPrice: 2200, image: "assets/toy4.jpg" },
    { id: 5, name: "Steampunk Metal Spider", price: 1599, oldPrice: 3200, image: "assets/toy5.jpg" },
    { id: 6, name: "AI Mechanical Robot Dog", price: 2100, oldPrice: 5500, image: "assets/toy6.jpg" }
];

// Razorpay Test Keys
const RAZORPAY_KEY_ID = "rzp_test_RwX8zJuRVHIA4h"; 

// Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = "7dc0699b-84d6-4067-9f3e-676ef999740b";


// =========================================
// 2. PAGE INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    
    // Initialize Forms using your custom logic
    attachFormLogic('newsletter-form');          // Home Page Newsletter
    attachFormLogic('contact-form');             // Home Page Contact
    attachFormLogic('newsletter-form-product');  // Product Page Newsletter

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            document.querySelector('.desktop-nav').classList.toggle('active');
        });
    }
});


// =========================================
// 3. YOUR CUSTOM FORM LOGIC (Web3Forms)
// =========================================
function attachFormLogic(formId) {
    const form = document.getElementById(formId);
    if (!form) return; // Agar form page par nahi hai to skip karo

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        // Access Key append kar rahe hain
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);

        const originalText = submitBtn.textContent;

        // Button state change (User Feedback)
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Success! Your message has been sent.");
                form.reset();
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            // Button restore logic
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}


// =========================================
// 4. RAZORPAY PAYMENT INTEGRATION
// =========================================
function initiatePayment(amount, description, isCartCheckout = false) {
    var options = {
        "key": RAZORPAY_KEY_ID, 
        "amount": amount * 100, // Paise conversion
        "currency": "INR",
        "name": "OfLegacy Store",
        "description": description,
        "image": "assets/logo.png",
        "handler": function (response){
            // Payment Success Handler
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            
            if(isCartCheckout) {
                localStorage.removeItem('oflegacy_cart');
                updateCartCount();
                renderCart();
                toggleCart();
            }
        },
        "prefill": {
            "name": "", // Auto-fill ke liye chhod diya
            "email": "",
            "contact": ""
        },
        "theme": {
            "color": "#000000"
        }
    };
    
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
    });
    rzp1.open();
}


// =========================================
// 5. BUY & CHECKOUT FUNCTIONS
// =========================================
function buyNow() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id == productId);

    if (product) {
        initiatePayment(product.price, `Purchase: ${product.name}`, false);
    }
}

function checkoutCart() {
    const cart = getCart();
    if(cart.length === 0) return alert("Cart is empty!");

    let total = 0;
    cart.forEach(item => total += item.price);
    
    initiatePayment(total, `Bulk Order (${cart.length} items)`, true);
}


// =========================================
// 6. STANDARD SHOP FUNCTIONS (Cart, Search, etc.)
// =========================================

// Load Products to Grid
function loadProducts() {
    const list = document.getElementById('product-list');
    if(list) {
        list.innerHTML = products.map(p => `
            <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
                <div class="card-image-wrapper"><img src="${p.image}" alt="${p.name}"></div>
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <div class="price-tag">Rs. ${p.price} <del>Rs. ${p.oldPrice}</del></div>
                    <button class="card-btn">View Details</button>
                </div>
            </div>`).join('');
    }
}

// Cart Logic (Local Storage)
function getCart() { return JSON.parse(localStorage.getItem('oflegacy_cart')) || []; }
function saveCart(cart) { localStorage.setItem('oflegacy_cart', JSON.stringify(cart)); updateCartCount(); }

function addToCart() {
    const id = new URLSearchParams(window.location.search).get('id');
    const product = products.find(p => p.id == id);
    if(product) {
        const cart = getCart();
        cart.push(product);
        saveCart(cart);
        alert("Added to Cart!");
        toggleCart();
    }
}

function updateCartCount() {
    const count = getCart().length;
    document.querySelectorAll('.cart-count').forEach(el => el.innerText = count);
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('active');
    if(modal.classList.contains('active')) renderCart();
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    let total = 0;
    
    if(cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById('cart-total').innerText = "Rs. 0";
    } else {
        container.innerHTML = cart.map((item, index) => {
            total += item.price;
            return `<div class="cart-item">
                <div><b>${item.name}</b><br>Rs. ${item.price}</div>
                <span onclick="removeFromCart(${index})" style="color:red;cursor:pointer;"><i class="fas fa-trash"></i></span>
            </div>`;
        }).join('');
        document.getElementById('cart-total').innerText = "Rs. " + total;
    }
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// Search Logic
function openSearch(e) { 
    if(e) e.preventDefault(); 
    document.getElementById('search-overlay').style.display = 'flex'; 
}
function closeSearch() { document.getElementById('search-overlay').style.display = 'none'; }

const sInput = document.getElementById('search-input');
if(sInput) {
    sInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const res = products.filter(p => p.name.toLowerCase().includes(term));
        document.getElementById('search-results').innerHTML = res.map(p => 
            `<div class="search-item" onclick="window.location.href='product.html?id=${p.id}'">
                <span>${p.name}</span><span>Rs. ${p.price}</span>
            </div>`).join('');
    });
}

// Product Page Details Loader
const pid = new URLSearchParams(window.location.search).get('id');
if(pid) {
    const p = products.find(x => x.id == pid);
    if(p) {
        if(document.getElementById('p-img')) document.getElementById('p-img').src = p.image;
        if(document.getElementById('p-name')) document.getElementById('p-name').innerText = p.name;
        if(document.getElementById('p-price')) document.getElementById('p-price').innerText = "Rs. " + p.price;
        if(document.getElementById('p-old-price')) document.getElementById('p-old-price').innerText = "Rs. " + p.oldPrice;
        
        // Inject Buttons
        const buyBtn = document.querySelector('.buy-btn');
        if(buyBtn) {
            buyBtn.onclick = buyNow;
            
            // Add Cart Button dynamically below Buy Now
            const cartBtn = document.createElement('button');
            cartBtn.innerText = "ADD TO CART";
            cartBtn.className = "buy-btn";
            cartBtn.style.background = "white"; 
            cartBtn.style.color = "black"; 
            cartBtn.style.border = "1px solid black"; 
            cartBtn.style.marginTop = "10px";
            cartBtn.onclick = addToCart;
            buyBtn.parentNode.insertBefore(cartBtn, buyBtn.nextSibling);
        }
    }
}
