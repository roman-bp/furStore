document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const closeModal = document.querySelector('.cart-modal-content .close');
    const checkoutButton = document.getElementById('checkout');
    const openCartButton = document.getElementById('open-cart');

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="max-width: 50px; border-radius: 5px;">
                <span>${item.name}</span>
                <span>${item.price}</span>
                <button class="remove-from-cart" data-id="${item.id}">Удалить</button>
            `;
            cartItems.appendChild(cartItem);
            total += parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        });

        cartTotal.textContent = `Итого: ${total.toLocaleString()} грн.`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function openCartModal() {
        if (cartModal) cartModal.style.display = 'flex';
        updateCart();
    }

    function closeCartModal() {
        if (cartModal) cartModal.style.display = 'none';
    }

    function addToCart(event) {
        const product = event.detail;
        if (product) {
            const existingProduct = cart.find(item => item.id === product.id);
            if (!existingProduct) {
                cart.push(product);
                updateCart();
            }
        }
    }

    function removeFromCart(event) {
        const id = event.target.dataset.id;
        const index = cart.findIndex(item => item.id === id);
        if (index > -1) {
            cart.splice(index, 1);
            updateCart();
        }
    }

    function checkout() {
        alert('Спасибо за покупку!');
        localStorage.removeItem('cart');
        updateCart();
        closeCartModal();
    }

    document.addEventListener('add-to-cart', addToCart);
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-cart')) {
            removeFromCart(event);
        }
    });

    if (closeModal) closeModal.addEventListener('click', closeCartModal);
    if (checkoutButton) checkoutButton.addEventListener('click', checkout);
    if (openCartButton) openCartButton.addEventListener('click', openCartModal);
});
