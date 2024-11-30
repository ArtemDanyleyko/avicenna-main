fetch('prices.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const priceList = document.getElementById('price-list');

        if (!data.categories || !Array.isArray(data.categories)) {
            throw new Error('Неверная структура данных в JSON');
        }

        data.categories.forEach(category => {
            // Создание блока категории
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');

            // Заголовок категории
            const categoryTitle = document.createElement('h2');
            categoryTitle.classList.add('category__title');
            categoryTitle.textContent = category.name;
            categoryDiv.appendChild(categoryTitle);

            // Добавление услуг
            category.services.forEach(service => {
                const serviceDiv = document.createElement('div');
                serviceDiv.classList.add(service.subservice ? 'subservice' : 'service');

                // Наполнение услуги с проверкой на наличие данных
                const serviceName = document.createElement('span');
                serviceName.classList.add('service__name');
                serviceName.textContent = service.name || 'Без назви';

                const servicePrice = document.createElement('span');
                servicePrice.classList.add('service__price');
                servicePrice.textContent = service.price ? `${service.price}` : '';

                // Объединение в один блок
                serviceDiv.appendChild(serviceName);
                serviceDiv.appendChild(servicePrice);

                categoryDiv.appendChild(serviceDiv);
            });

            // Добавление категории на страницу
            priceList.appendChild(categoryDiv);
        });
    })
    .catch(error => {
        console.error('Ошибка загрузки данных:', error);

        // Отображение сообщения об ошибке на странице
        const priceList = document.getElementById('price-list');
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.textContent = 'Не удалось загрузить данные. Пожалуйста, попробуйте позже.';
        priceList.appendChild(errorDiv);
    });