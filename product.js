// product.js
document.addEventListener('DOMContentLoaded', function() {
    const productDetail = document.querySelector('.product-detail');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Проверка наличия элемента
    if (!productDetail) {
        console.error('Элемент с классом product-detail не найден.');
        return;
    }

    if (!productId) {
        productDetail.innerHTML = '<p>ID продукта не указан в URL.</p>';
        return;
    }

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                productDetail.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" style="max-width: 100%; border-radius: 10px;">
                    <h1>${product.name}</h1>
                    <p>${product.description}</p>
                    <p>${product.price}</p>
                `;
            } else {
                productDetail.innerHTML = '<p>Продукт не найден.</p>';
            }
        })
        .catch(error => console.error('Ошибка загрузки подробностей продукта:', error));
});
