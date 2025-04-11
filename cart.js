document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update cart count badge (optional)
    updateCartCount();

    // Handle Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // ✅ Check if product is out of stock
            if (this.getAttribute('data-stock') === 'out') {
                alert('Sorry, this product is currently out of stock. It will be available in 2 days. You can save it to your watchlist.');
                return;
            }

            // Get product data from button attributes
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                image: this.getAttribute('data-image'),
                brand: this.getAttribute('data-brand'),
                quantity: 1
            };

            // Check if already in cart
            const existingProductIndex = cart.findIndex(item => item.id === product.id);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity++;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${product.name} has been added to your cart!`);
        });
    });

    // Handle Watchlist buttons
    const watchlistButtons = document.querySelectorAll('.watchlist-btn');
    watchlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const productElement = this.closest('.pro');
            const addToCartButton = productElement.querySelector('.add-cart');

            const product = {
                id: addToCartButton.getAttribute('data-id'),
                name: addToCartButton.getAttribute('data-name'),
                price: parseFloat(addToCartButton.getAttribute('data-price')),
                image: addToCartButton.getAttribute('data-image'),
                brand: addToCartButton.getAttribute('data-brand')
            };

            let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            const exists = watchlist.find(item => item.id === product.id);

            if (exists) {
                alert(`${product.name} is already in your watchlist!`);
            } else {
                watchlist.push(product);
                localStorage.setItem('watchlist', JSON.stringify(watchlist));
                alert(`${product.name} has been added to your watchlist!`);
            }
        });
    });

    // If on cart page, display items
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }

    // Update cart count in header
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }
});

// Add to Cart helper for other pages (optional)
function addToCart(id, name, price, image, brand, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
        cart[index].quantity += quantity;
    } else {
        cart.push({ id, name, price, image, brand, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Display cart items in cart.html
function displayCartItems() {
    const container = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-cart">
                        <p>Your cart is empty</p>
                        <a href="shop.html" class="normal">Continue Shopping</a>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById('cart-subtotal').textContent = '₹0';
        document.getElementById('cart-total').textContent = '₹0';
        return;
    }

    let totalAmount = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalAmount += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="remove-item" data-id="${item.id}"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </td>
            <td>₹${subtotal}</td>
        `;
        container.appendChild(tr);
    });

    document.getElementById('cart-subtotal').textContent = `₹${totalAmount}`;
    document.getElementById('cart-total').textContent = `₹${totalAmount}`;

    addCartEventListeners();
}

// Cart control buttons
function addCartEventListeners() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            removeFromCart(this.getAttribute('data-id'));
            displayCartItems();
        });
    });

    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            updateCartItemQuantity(btn.getAttribute('data-id'), 'decrease');
            displayCartItems();
        });
    });

    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', () => {
            updateCartItemQuantity(btn.getAttribute('data-id'), 'increase');
            displayCartItems();
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const newQuantity = parseInt(input.value);
            if (newQuantity > 0) {
                updateCartItemQuantity(input.getAttribute('data-id'), 'set', newQuantity);
                displayCartItems();
            }
        });
    });
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart quantity
function updateCartItemQuantity(productId, action, value = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
        if (action === 'increase') {
            cart[index].quantity++;
        } else if (action === 'decrease') {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        } else if (action === 'set') {
            cart[index].quantity = value;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }
}
