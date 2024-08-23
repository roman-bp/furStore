// Telegram bot integration
const TELEGRAM_BOT_TOKEN = '6852234273:AAGtNELD5wP9Kw-SOx_9l8uPKyS9fPj8aCk';  // Замість 'Ваш_Telegram_Bot_Token'
const TELEGRAM_CHAT_ID = '720338217';  // Замість 'Ваш_Chat_ID'

// Функція відправки повідомлення до Telegram
function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    return fetch(url, {
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
            return true;
        } else {
            console.error('Помилка при відправці повідомлення:', data);
            return false;
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
        return false;
    });
}

// Функція відправки замовлення з корзини до Telegram
function sendOrderToTelegram(cartItems, total, customerName, customerAddress, customerPhone) {
    let orderMessage = `Нове замовлення:

Ім'я: ${customerName}
Адреса: ${customerAddress}
Телефон: ${customerPhone}

`;

    cartItems.forEach(item => {
        orderMessage += `${item.name} - ${item.price} грн\n`;
    });

    orderMessage += `
Загальна сума: ${total.toFixed(2)} грн`;

    sendToTelegram(orderMessage).then(success => {
        if (success) {
            alert('Замовлення відправлено до Telegram!');
        } else {
            alert('Помилка при відправці замовлення.');
        }
    });
}

// Функція для відправки форми "Контакти" в Telegram
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                const telegramMessage = `Нове повідомлення з форми "Контакти":

Ім'я: ${name}
Email: ${email}
Повідомлення:
${message}`;

                sendToTelegram(telegramMessage).then(success => {
                    if (success) {
                        alert('Ваше повідомлення відправлено до Telegram!');
                        contactForm.reset(); // Очищення форми після відправки
                    } else {
                        alert('Помилка при відправці повідомлення.');
                    }
                });
            } else {
                alert('Будь ласка, заповніть всі поля.');
            }
        });
    }
});

// Логіка роботи з корзиною
let cart = [];
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartButton = document.querySelector('.hero .btn');
let products = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);  // Знаходить товар за його ID
    const cartItem = cart.find(item => item.id === productId);  // Перевіряє, чи товар вже є у корзині

    if (!cartItem) {  // Додає товар, тільки якщо його ще немає у корзині
        cart.push(product);
        updateCart();  // Оновлює відображення корзини після додавання товару
    } else {
        alert('Цей товар вже доданий до корзини.');  // Повідомлення, якщо товар вже у корзині
    }
}

function updateCart() {
    cartItems.innerHTML = '';  // Очищує вміст корзини
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
            <span>${item.price} грн.</span>
        `;
        cartItems.appendChild(cartItem);
    });

    //cartTotal.textContent = `Ітого: ${total.toFixed(2)} грн.`;
    cartButton.textContent = `Замовити перегляд (${cart.length})`;
}

function toggleCartModal(event) {
    event.preventDefault();
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
        event.stopPropagation();
        const id = event.target.dataset.id;
        addToCart(id);
    }
});

function checkout() {
    const total = cart.reduce((acc, item) => acc + parseFloat(item.price.replace(/[^0-9.-]+/g, '')), 0);

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
    toggleCartModal(new Event('click'));
}

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
            .catch(error => console.error('Помилка завантаження товарів:', error));
    }

    function updateProductGrid() {
        productGrid.innerHTML = '';

        let filteredProducts = products;

        const selectedCategory = categorySelect.value;
        if (selectedCategory !== 'all') {
            filteredProducts = products.filter(product => product.category === selectedCategory);
        }

        const sortValue = sortSelect.value;
        if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]+/g, '')) - parseFloat(b.price.replace(/[^0-9.-]+/g, '')));
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]+/g, '')) - parseFloat(a.price.replace(/[^0-9.-]+/g, '')));
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Хочу перегляд об'екту</button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    categorySelect.addEventListener('change', updateProductGrid);
    sortSelect.addEventListener('change', updateProductGrid);

    fetchProducts();
});

document.querySelector('.cart-modal .close').addEventListener('click', toggleCartModal);
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        toggleCartModal(event);
    }
});
