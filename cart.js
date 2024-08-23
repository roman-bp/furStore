function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        if (!item.price) {
            console.error(`Ціна не визначена для товару ${item.id}`);
            return;
        }

        const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        if (isNaN(itemPrice)) {
            console.error(`Помилка перетворення ціни для товару ${item.id}`);
            return;
        }

        total += itemPrice;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price}</span>
        `;
        cartItems.appendChild(cartItem);
    });

   // cartTotal.textContent = `Ітого: ${total.toFixed(2)} грн.`;
    cartButton.textContent = `замовити перегляд (${cart.length})`;
}
