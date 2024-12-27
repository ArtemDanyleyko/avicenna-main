document.addEventListener("DOMContentLoaded", () => {
  // Загрузка хедера
  fetch('./controls/header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка загрузки хедера');
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('header').outerHTML = data;
      highlightCurrentPage(); // Подсветка текущей страницы
    })
    .catch(error => console.error(error));

  // Загрузка футера
  fetch('./controls/footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка загрузки футера');
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('footer').outerHTML = data;
    })
    .catch(error => console.error(error));
});

// Функция подсветки текущей страницы
function highlightCurrentPage() {
  const currentURL = window.location.pathname; // Текущий путь страницы
  const links = document.querySelectorAll('.header__pagelist-link, .header-menu__pagelist-link');

  links.forEach(link => {
    if (link.getAttribute('href') === currentURL || link.href.endsWith(currentURL)) {
      link.classList.add('current', 'active'); // Добавляем классы current и active
    } else {
      link.classList.remove('current', 'active'); // Убираем классы с остальных
    }
  });
}