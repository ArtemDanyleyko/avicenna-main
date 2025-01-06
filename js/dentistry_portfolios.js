document.addEventListener('DOMContentLoaded', () => {
    const portfolioList = document.querySelector('.portfolio__list');

    fetch('./json/dentistry_portfolios.json')
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

                    // Создаем описание
                    let descriptionHTML = '';
                    if (item.description) {
                        descriptionHTML = `<p class="portfolio__description">${item.description.trim()}</p>`;
                        console.log('Adding has-description class');
                    }

                    // Создаем блок картинок
                    const portfolioImages = document.createElement('div');
                    portfolioImages.className = 'portfolio__images';
                    if (descriptionHTML) {
                        portfolioImages.classList.add('has-description');
                    }

                    portfolioImages.innerHTML = `
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
                    `;

                    portfolioItem.appendChild(portfolioImages);

                    // Добавляем описание
                    if (descriptionHTML) {
                        const descriptionElement = document.createElement('div');
                        descriptionElement.innerHTML = descriptionHTML;
                        portfolioItem.appendChild(descriptionElement);
                    }

                    itemsContainer.appendChild(portfolioItem);
                });
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
