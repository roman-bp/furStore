document.addEventListener('DOMContentLoaded', function() {
    const productDetail = document.querySelector('.product-detail');
    const productId = new URLSearchParams(window.location.search).get('id');

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.id === productId);
            if (product) {
                let imageSlides = '';
                product.images.forEach(image => {
                    imageSlides += `<div><img src="${image}" alt="${product.name}" class="product-image"></div>`;
                });

                productDetail.innerHTML = `
                    <h1>${product.name}</h1>
                    <div class="product-carousel">
                        ${imageSlides}
                    </div>
                    <p>Цена: ${product.price}</p>
                    <p>${product.description}</p>
                    <button onclick="addToCart('${product.id}')">Добавить в корзину</button>
                `;

                // Ініціалізуємо карусель після додавання елементів
                $('.product-carousel').slick({
                    dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    adaptiveHeight: true
                });
            } else {
                productDetail.innerHTML = `<p>Продукт не найден.</p>`;
            }
        })
        .catch(error => console.error('Ошибка загрузки продукта:', error));
});
