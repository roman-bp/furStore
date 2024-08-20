function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        if (!item.price) {
            console.error(`Цена не определена для товара ${item.id}`);
            return;
        }

        const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        if (isNaN(itemPrice)) {
            console.error(`Ошибка преобразования цены для товара ${item.id}`);
            return;
        }

        const itemTotal = itemPrice * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>${item.quantity} x ${item.price}</span>
            <span>${itemTotal.toFixed(2)} грн.</span>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `Итого: ${total.toFixed(2)} грн.`;
    cartButton.textContent = `Корзина (${cart.length})`;
}
