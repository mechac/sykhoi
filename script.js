// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Данные товаров
const products = {
    plaster: [
        { id: 1, name: 'Штукатурка "Ак-Таш"', price: 450, image: 'https://via.placeholder.com/300?text=Штукатурка+Ак-Таш' },
        { id: 2, name: 'Штукатурка "Чуй"', price: 380, image: 'https://via.placeholder.com/300?text=Штукатурка+Чуй' }
    ],
    putty: [
        { id: 3, name: 'Шпаклевка "Ала-Тоо"', price: 320, image: 'https://via.placeholder.com/300?text=Шпаклевка+Ала-Тоо' },
        { id: 4, name: 'Шпаклевка "Талас"', price: 290, image: 'https://via.placeholder.com/300?text=Шпаклевка+Талас' }
    ],
    adhesive: [
        { id: 5, name: 'Клей "Тянь-Шань"', price: 280, image: 'https://via.placeholder.com/300?text=Клей+Тянь-Шань' },
        { id: 6, name: 'Клей "Бишкек"', price: 310, image: 'https://via.placeholder.com/300?text=Клей+Бишкек' }
    ],
    screed: [
        { id: 7, name: 'Стяжка "Иссык-Куль"', price: 380, image: 'https://via.placeholder.com/300?text=Стяжка+Иссык-Куль' },
        { id: 8, name: 'Стяжка "Нарын"', price: 420, image: 'https://via.placeholder.com/300?text=Стяжка+Нарын' }
    ]
};

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Развернуть приложение на весь экран
    tg.expand();
    
    // Загружаем популярные товары
    loadPopularProducts();
    
    // Инициализация кнопки корзины
    document.getElementById('cart-btn').addEventListener('click', showCart);
    
    // Инициализация кнопки оформления заказа
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    
    // Обновляем счетчик корзины
    updateCartCount();
});

// Загрузка популярных товаров
function loadPopularProducts() {
    const popularProducts = [
        products.plaster[0],
        products.putty[0],
        products.adhesive[0],
        products.screed[0]
    ];
    
    const container = document.getElementById('popular-products');
    container.innerHTML = '';
    
    popularProducts.forEach(product => {
        const productElement = createProductElement(product);
        container.appendChild(productElement);
    });
}

// Показать категорию
function showCategory(categoryId) {
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('category-screen').style.display = 'block';
    
    const categoryTitle = document.getElementById('category-title');
    const categoryProducts = document.getElementById('category-products');
    
    // Устанавливаем название категории
    switch(categoryId) {
        case 'plaster': categoryTitle.textContent = 'Штукатурные смеси'; break;
        case 'putty': categoryTitle.textContent = 'Шпаклевочные смеси'; break;
        case 'adhesive': categoryTitle.textContent = 'Клеевые смеси'; break;
        case 'screed': categoryTitle.textContent = 'Смеси для стяжки'; break;
    }
    
    // Загружаем товары категории
    categoryProducts.innerHTML = '';
    products[categoryId].forEach(product => {
        const productElement = createProductElement(product);
        categoryProducts.appendChild(productElement);
    });
}

// Создание элемента товара
function createProductElement(product) {
    const element = document.createElement('div');
    element.className = 'product-card';
    
    element.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">${product.price} ₽</div>
        <div class="product-actions">
            <button class="btn" onclick="addToCart(${product.id})">В корзину</button>
        </div>
    `;
    
    return element;
}

// Добавление в корзину
function addToCart(productId) {
    // Находим товар во всех категориях
    let product;
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    // Проверяем, есть ли уже товар в корзине
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Сохраняем корзину
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик
    updateCartCount();
    
    // Показываем уведомление
    tg.showAlert(`Товар "${product.name}" добавлен в корзину`);
}

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Показать корзину
function showCart() {
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('category-screen').style.display = 'none';
    document.getElementById('cart-screen').style.display = 'block';
    
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    let totalPrice = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста</p>';
        document.getElementById('checkout-btn').style.display = 'none';
    } else {
        document.getElementById('checkout-btn').style.display = 'block';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            const itemPrice = item.price * item.quantity;
            totalPrice += itemPrice;
            
            itemElement.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <div>${item.price} ₽ × ${item.quantity} = ${itemPrice} ₽</div>
                </div>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">×</button>
            `;
            
            cartItems.appendChild(itemElement);
        });
    }
    
    document.getElementById('total-price').textContent = totalPrice;
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart();
    updateCartCount();
}

// Назад на главный экран
function backToMain() {
    document.getElementById('main-screen').style.display = 'block';
    document.getElementById('category-screen').style.display = 'none';
    document.getElementById('cart-screen').style.display = 'none';
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) return;
    
    // Получаем данные пользователя из Telegram
    const user = tg.initDataUnsafe.user;
    
    // Создаем описание заказа
    const description = cart.map(item => 
        `${item.name} (${item.quantity} × ${item.price} ₽)`
    ).join('\n');
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Параметры для платежа
    const paymentParams = {
        title: 'Заказ сухих смесей "Кыргыз Тамыры"',
        description: description,
        prices: [
            {
                label: 'Итого',
                amount: totalPrice * 100 // в копейках
            }
        ]
    };
    
    // Открываем интерфейс платежа
    tg.openInvoice(paymentParams, (status) => {
        if (status === 'paid') {
            // Заказ успешно оплачен
            tg.showAlert('Спасибо за заказ! Мы свяжемся с вами для уточнения деталей.');
            
            // Очищаем корзину
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            backToMain();
        } else if (status === 'failed') {
            tg.showAlert('Оплата не прошла. Пожалуйста, попробуйте еще раз.');
        } else if (status === 'cancelled') {
            tg.showAlert('Оплата отменена.');
        }
    });
}

// Делаем функции глобальными для использования в HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.showCategory = showCategory;
window.backToMain = backToMain;
window.showCart = showCart;
