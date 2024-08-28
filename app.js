 
// Переменные для работы с корзиной
let cart = [];
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartButton = document.querySelector('.hero .btn');
let products = [];

// Telegram bot integration
const TELEGRAM_BOT_TOKEN = '6852234273:AAGtNELD5wP9Kw-SOx_9l8uPKyS9fPj8aCk';  // Replace with your bot token
const TELEGRAM_CHAT_ID = '720338217';  // Replace with your Telegram chat ID

function sendOrderToTelegram(cartItems, total, customerName, customerAddress, customerPhone) {
    let message = `Нове замовлення:

`;
    
    message += `Ім'я: ${customerName}
`;
    message += `Адреса: ${customerAddress}
`;
    message += `Телефон: ${customerPhone}

`;

    cartItems.forEach(item => {
        message += `${item.name} - ${item.quantity} шт. за ${item.price} грн
`;
    });

    message += `
Загальна сума: ${total.toFixed(2)} грн`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('Замовлення відправлено до Telegram!');
        } else {
            alert('Помилка при відправці замовлення.');
        }
    })
    .catch(error => console.error('Помилка:', error));
}

// Функция добавления товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Функция удаления товара из корзины
function removeFromCart(productId) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity--;

        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    updateCart();
}

// Функция обновления корзины
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        if (!isNaN(itemPrice)) {
            const itemTotal = itemPrice * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <span>${item.quantity} x ${item.price} грн.</span>
                <span>${itemTotal.toFixed(2)} грн.</span>
                <button class="remove-from-cart" data-id="${item.id}">-</button>
                <button class="add-to-cart" data-id="${item.id}">+</button>
            `;
            cartItems.appendChild(cartItem);
        } else {
            console.error(`Ошибка преобразования цены для товара ${item.id}`);
        }
    });

    cartTotal.textContent = `Итого: ${total.toFixed(2)} грн.`;
    cartButton.textContent = `Корзина (${itemCount})`;
}

// Функция переключения модального окна корзины
function toggleCartModal(event) {
    event.preventDefault();
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

// Обработчик для добавления и удаления товара
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
        event.stopPropagation(); // Запобігає додатковим викликам на батьківських елементах
        const id = event.target.dataset.id;
        addToCart(id);
    }

    if (event.target.classList.contains('remove-from-cart')) {
        event.stopPropagation(); // Запобігає додатковим викликам на батьківських елементах
        const id = event.target.dataset.id;
        removeFromCart(id);
    }
});

// Функция оформления замовлення
function checkout() {
    const total = cart.reduce((acc, item) => acc + parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity, 0);

    // Отримуємо дані клієнта
    const customerName = document.getElementById('customer-name').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerPhone = document.getElementById('customer-phone').value;
    
    if (cart.length > 0 && customerName && customerAddress && customerPhone) {
        sendOrderToTelegram(cart, total, customerName, customerAddress, customerPhone);
    } else {
        alert('Будь ласка, заповніть всі поля і додайте товари до корзини.');
    }

    cart = [];
    updateCart();
    toggleCartModal(new Event('click')); // Закрити корзину після оформлення замовлення
}

// Загрузка товаров и отображение их на странице
document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('product-grid');
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');

    function fetchProducts() {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                updateProductGrid();
            })
            .catch(error => console.error('Ошибка загрузки товаров:', error));
    }

    function updateProductGrid() {
        productGrid.innerHTML = '';

        let filteredProducts = products;

        // Фильтрация по категории
        const selectedCategory = categorySelect.value;
        if (selectedCategory !== 'all') {
            filteredProducts = products.filter(product => product.category === selectedCategory);
        }

        // Сортировка
        const sortValue = sortSelect.value;
        if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]+/g, '')) - parseFloat(b.price.replace(/[^0-9.-]+/g, '')));
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]+/g, '')) - parseFloat(a.price.replace(/[^0-9.-]+/g, '')));
        }

        // Отображение товаров
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    categorySelect.addEventListener('change', updateProductGrid);
    sortSelect.addEventListener('change', updateProductGrid);

    fetchProducts();
});

// Закрытие корзины при клике вне её
document.querySelector('.cart-modal .close').addEventListener('click', toggleCartModal);
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        toggleCartModal(event);
    }
});
