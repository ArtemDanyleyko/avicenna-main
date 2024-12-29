document.addEventListener('DOMContentLoaded', () => {
    const portfolioList = document.querySelector('.portfolio__list');

    fetch('./json/portfolios.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch portfolios.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.categories.forEach(category => {
                const categoryContainer = document.createElement('div');
                categoryContainer.className = 'portfolio__category';

                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = category.name;
                categoryTitle.className = 'portfolio__category-title';
                categoryContainer.appendChild(categoryTitle);

                const itemsContainer = document.createElement('div');
                itemsContainer.className = 'portfolio__items';

                category.items.forEach(item => {
                    const portfolioItem = document.createElement('div');
                    portfolioItem.className = 'portfolio__item';

                    // Проверка на пустое описание
                    let descriptionHTML = '';
                    if (item.description && item.description.trim() !== '') {
                        descriptionHTML = `<p class="portfolio__description">${item.description}</p>`;
                    }

                    portfolioItem.innerHTML = 
                        `<div class="portfolio__images">
                            <div class="portfolio__image-container">
                                <h4 class="portfolio__image-label">До</h4>
                                <a href="${item.beforeImage}" class="portfolio__link">
                                    <img src="${item.beforeImage}" alt="${item.alt1}" class="portfolio__image" />
                                </a>
                            </div>
                            <div class="portfolio__image-container">
                                <h4 class="portfolio__image-label">Після</h4>
                                <a href="${item.afterImage}" class="portfolio__link">
                                    <img src="${item.afterImage}" alt="${item.alt2}" class="portfolio__image" />
                                </a>
                            </div>
                        </div>
                        ${descriptionHTML}`;

                    itemsContainer.appendChild(portfolioItem);
                });

                // Если карточек в категории одна, добавляем класс "single"
                if (category.items.length === 1) {
                    itemsContainer.classList.add('single');
                }

                categoryContainer.appendChild(itemsContainer);
                portfolioList.appendChild(categoryContainer);
            });

            // Инициализация SimpleLightbox
            let lightbox = new SimpleLightbox('.portfolio__link', {
                captions: true,
                captionsData: 'alt',
                captionDelay: 250,
            });

            // Обновление SimpleLightbox для динамически добавленных элементов
            lightbox.refresh();
        })
        .catch(error => {
            console.error('Error loading portfolio data:', error);
        });
});
