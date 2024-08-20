 
// Переменные для работы с корзиной
let cart = [];
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartButton = document.querySelector('.hero .btn');
let products = [];

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
