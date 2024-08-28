document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('product-grid');
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    let products = [];

    

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

    function handleAddToCart(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const id = event.target.dataset.id;
            addToCart(id);
        }
    }

    categorySelect.addEventListener('change', updateProductGrid);
    sortSelect.addEventListener('change', updateProductGrid);
    productGrid.addEventListener('click', handleAddToCart);

    fetchProducts();
});
