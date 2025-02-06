
document.addEventListener('DOMContentLoaded', function() {
    // Если в HTML нет поля поиска, создаём его динамически:
    let searchInput = document.getElementById('search-input');
    if (!searchInput) {
        searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Пошук...';
        searchInput.id = 'search-input';
        // Добавляем поле поиска перед основным контентом
        document.body.insertBefore(searchInput, document.body.firstChild);
    }

    // Глобальные переменные для данных:
    let pricesData = null;
    let labPanels = [];
    let currentLabIndex = 0;
    const CHUNK_SIZE = 5; // Количество панелей для загрузки за раз

    // Функция для рендеринга раздела "НАШІ ЦІНИ"
    function renderPrices(searchQuery) {
        const priceList = document.getElementById('price-list');
        priceList.innerHTML = '';
        let hasAnyCategory = false;

        if (pricesData && pricesData.categories && Array.isArray(pricesData.categories)) {
            pricesData.categories.forEach(category => {
                // Фильтруем услуги внутри категории по запросу (регистр не учитывается)
                const filteredServices = category.services.filter(service => {
                    const serviceName = service.name || '';
                    return serviceName.toLowerCase().includes(searchQuery.toLowerCase());
                });
                if (filteredServices.length > 0) {
                    hasAnyCategory = true;
                    // Создаём блок категории
                    const categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('category');

                    // Заголовок категории
                    const categoryTitle = document.createElement('h2');
                    categoryTitle.classList.add('category__title');
                    categoryTitle.textContent = category.name;
                    categoryDiv.appendChild(categoryTitle);

                    // Добавляем каждую услугу
                    filteredServices.forEach(service => {
                        const serviceDiv = document.createElement('div');
                        serviceDiv.classList.add(service.subservice ? 'subservice' : 'service');

                        const serviceName = document.createElement('span');
                        serviceName.classList.add('service__name');
                        serviceName.textContent = service.name || 'Без назви';

                        const servicePrice = document.createElement('span');
                        servicePrice.classList.add('service__price');
                        servicePrice.textContent = service.price ? service.price : '';

                        serviceDiv.appendChild(serviceName);
                        serviceDiv.appendChild(servicePrice);
                        categoryDiv.appendChild(serviceDiv);
                    });
                    priceList.appendChild(categoryDiv);
                }
            });
        }
        // Показываем или скрываем заголовок раздела "НАШІ ЦІНИ"
        // Предполагается, что первый заголовок с классом .prices__title относится к ценам
        const pricesTitle = document.querySelectorAll('.prices__title')[0];
        if (hasAnyCategory) {
            pricesTitle.style.display = 'block';
            priceList.style.display = 'block';
        } else {
            pricesTitle.style.display = 'none';
            priceList.style.display = 'none';
        }
    }

    // Функция для рендеринга раздела "ЛАБОРАТОРIЯ"
    function renderLaboratory(searchQuery) {
        const labList = document.getElementById('laboratory-list');
        labList.innerHTML = '';
        const loadMoreButton = document.getElementById('load-more');

        let panelsToRender = [];
        if (searchQuery.trim() === '') {
            // Если поиск пустой – используем пагинацию
            panelsToRender = labPanels.slice(0, currentLabIndex);
            loadMoreButton.style.display = (currentLabIndex < labPanels.length) ? 'block' : 'none';
        } else {
            // При поиске показываем все подходящие панели
            panelsToRender = labPanels.filter(panel => {
                // Фильтруем по названию панели, а также по названиям тестов и пакетов
                const panelNameMatch = panel.name && panel.name.toLowerCase().includes(searchQuery.toLowerCase());
                let testsMatch = false;
                if (panel.tests && Array.isArray(panel.tests)) {
                    testsMatch = panel.tests.some(test => test.name && test.name.toLowerCase().includes(searchQuery.toLowerCase()));
                }
                let packagesMatch = false;
                if (panel.packages && Array.isArray(panel.packages)) {
                    packagesMatch = panel.packages.some(pkg => pkg.name && pkg.name.toLowerCase().includes(searchQuery.toLowerCase()));
                }
                return panelNameMatch || testsMatch || packagesMatch;
            });
            loadMoreButton.style.display = 'none';
        }

        panelsToRender.forEach(panel => {
            const panelContainer = document.createElement('div');
            panelContainer.className = 'panel';

            // Заголовок панели
            const panelTitle = document.createElement('h2');
            panelTitle.className = 'panel-title';
            panelTitle.innerText = panel.name;
            panelContainer.appendChild(panelTitle);

            // Секция с тестами
            if (panel.tests && panel.tests.length > 0) {
                const testsContainer = document.createElement('div');
                testsContainer.className = 'tests';
                panel.tests.forEach(test => {
                    // Если идёт поиск, показываем только подходящие тесты
                    if (searchQuery.trim() === '' || (test.name && test.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
                        const testDiv = document.createElement('div');
                        testDiv.className = 'test-item';
                        testDiv.innerHTML = `<strong>${test.name}</strong> - ${test.price} грн`;
                        testsContainer.appendChild(testDiv);
                    }
                });
                if (testsContainer.children.length > 0) {
                    panelContainer.appendChild(testsContainer);
                }
            }

            // Секция с пакетами
            if (panel.packages && panel.packages.length > 0) {
                const packagesContainer = document.createElement('div');
                packagesContainer.className = 'packages';
                panel.packages.forEach(pkg => {
                    if (searchQuery.trim() === '' || (pkg.name && pkg.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
                        const packageDiv = document.createElement('div');
                        packageDiv.className = 'package-item';
                        packageDiv.innerHTML = `<strong>${pkg.name}</strong><br>
                        Перелік: ${pkg.content.join(', ')}<br>
                        Ціна: ${pkg.price} грн`;
                        packagesContainer.appendChild(packageDiv);
                    }
                });
                if (packagesContainer.children.length > 0) {
                    panelContainer.appendChild(packagesContainer);
                }
            }
            labList.appendChild(panelContainer);
        });

        // Показываем или скрываем заголовок раздела "ЛАБОРАТОРIЯ"
        // Предполагается, что второй заголовок с классом .prices__title относится к лабораторії
        const labTitle = document.querySelectorAll('.prices__title')[1];
        if (labList.children.length > 0) {
            labTitle.style.display = 'block';
            labList.style.display = 'block';
        } else {
            labTitle.style.display = 'none';
            labList.style.display = 'none';
        }
    }

    // Функция загрузки данных для "НАШІ ЦІНИ"
    function loadPricesData() {
        fetch('prices.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                pricesData = data;
                renderPrices(searchInput.value);
            })
            .catch(error => {
                console.error('Ошибка загрузки данных:', error);
                const priceList = document.getElementById('price-list');
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('error-message');
                errorDiv.textContent = 'Не удалось загрузить данные. Пожалуйста, попробуйте позже.';
                priceList.appendChild(errorDiv);
            });
    }

    // Функция загрузки данных для "ЛАБОРАТОРIЯ"
    function loadLaboratoryData() {
        fetch('laboratory.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Если JSON содержит ключ panels, используем его, иначе предполагаем, что данные — массив
                labPanels = data.panels || data;
                // Для пагинации начинаем с первого чанка
                currentLabIndex = CHUNK_SIZE;
                renderLaboratory(searchInput.value);
            })
            .catch(error => {
                console.error('Ошибка загрузки данных лаборатории:', error);
            });
    }

    // Обработчик изменения значения в поле поиска
    searchInput.addEventListener('input', function() {
        const query = searchInput.value;
        renderPrices(query);
        // При пустом поиске сбрасываем пагинацию
        if(query.trim() === ''){
            currentLabIndex = CHUNK_SIZE;
        }
        renderLaboratory(query);
    });

    // Обработчик кнопки "Завантажити ще" (активен только если поиск пустой)
    document.getElementById('load-more').addEventListener('click', function() {
        currentLabIndex += CHUNK_SIZE;
        renderLaboratory(searchInput.value);
    });

    // Загружаем данные для обоих разделов
    loadPricesData();
    loadLaboratoryData();
});

