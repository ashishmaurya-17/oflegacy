// Function to redirect to WhatsApp
function buyNow() {
    // Apne phone number se replace karein (Country code ke saath, bina + ke)
    const phoneNumber = "919999999999"; 
    
    const product = "Bumblebee H1 Headphones";
    const price = "179";
    
    // Message create karna
    const message = `Hi, I want to buy *${product}* for Rs.${price}. Please confirm my order.`;
    
    // WhatsApp URL encode karna
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // New tab mein open karna
    window.open(url, '_blank');
}

function addToCart() {
    alert("Added to Cart! (Demo Mode)");
}

// Fake Stock Counter (Thoda real lagne ke liye)
let stock = 7;
const stockElement = document.getElementById('stock-count');

// Har 5 second mein stock randomly kam hoga (Effect ke liye)
setInterval(() => {
    if (stock > 2) {
        stock--;
        stockElement.innerText = stock;
    }
}, 20000); // 20 seconds