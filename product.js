document.addEventListener('DOMContentLoaded', function() {
    const productDetail = document.querySelector('.product-detail');
    const productId = new URLSearchParams(window.location.search).get('id');

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.id === productId);
            if (product) {
                productDetail.innerHTML = `
                    <h1>${product.name}</h1>
                    <img src="${product.image}" alt="${product.name}">
                    <p>Цена: ${product.price}</p>
                    <p>${product.description}</p>
                    <button onclick="addToCart('${product.id}')">Добавить в корзину</button>
                `;
            } else {
                productDetail.innerHTML = `<p>Продукт не найден.</p>`;
            }
        })
        .catch(error => console.error('Ошибка загрузки продукта:', error));
});
