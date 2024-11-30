document.addEventListener('DOMContentLoaded', function () {
  const CHUNK_SIZE = 5; // Количество панелей для загрузки за раз
  let currentIndex = 0; // Индекс текущей позиции
  let panels = []; // Список панелей

  // Функция для загрузки JSON из файла
  const loadJsonData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      const data = await response.json();
      panels = data.panels; // Сохраняем панели
      renderNextPanels(); // Загружаем первую порцию
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  // Функция для рендеринга следующей порции панелей
  const renderNextPanels = () => {
    const appContainer = document.getElementById('laboratory-list');
    const chunk = panels.slice(currentIndex, currentIndex + CHUNK_SIZE); // Берем часть панелей
    currentIndex += CHUNK_SIZE;

    chunk.forEach((panel) => {
      const panelContainer = document.createElement('div');
      panelContainer.className = 'panel';

      const panelTitle = document.createElement('h2');
      panelTitle.className = 'panel-title';
      panelTitle.innerText = panel.name;
      panelContainer.appendChild(panelTitle);

      // Создание секции с тестами
      if (panel.tests && panel.tests.length > 0) {
        const testsContainer = document.createElement('div');
        testsContainer.className = 'tests';
        panel.tests.forEach((test) => {
          const testDiv = document.createElement('div');
          testDiv.className = 'test-item';
          testDiv.innerHTML = `<strong>${test.name}</strong> - ${test.price} грн`;
          testsContainer.appendChild(testDiv);
        });
        panelContainer.appendChild(testsContainer);
      }

      // Создание секции с пакетами
      if (panel.packages && panel.packages.length > 0) {
        const packagesContainer = document.createElement('div');
        packagesContainer.className = 'packages';
        panel.packages.forEach((pkg) => {
          const packageDiv = document.createElement('div');
          packageDiv.className = 'package-item';
          packageDiv.innerHTML = `
            <strong>${pkg.name}</strong><br>
            Содержание: ${pkg.content.join(', ')}<br>
            Цена: ${pkg.price} грн
          `;
          packagesContainer.appendChild(packageDiv);
        });
        panelContainer.appendChild(packagesContainer);
      }

      appContainer.appendChild(panelContainer);
    });

    // Проверяем, есть ли еще панели для загрузки
    const loadMoreButton = document.getElementById('load-more');
    if (currentIndex < panels.length) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
    }
  };

  // Обработчик кнопки "Загрузить еще"
  document.getElementById('load-more').addEventListener('click', renderNextPanels);

  // Загружаем данные из JSON
  loadJsonData('laboratory.json');
});
