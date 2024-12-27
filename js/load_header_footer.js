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
      const header = document.querySelector('header');
      if (header) {
        header.outerHTML = data;

        // Отправляем пользовательское событие, что хедер загружен
        document.dispatchEvent(new Event('headerLoaded'));
      } else {
        console.error("Элемент <header> не найден.");
      }
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
      const footer = document.querySelector('footer');
      if (footer) {
        footer.outerHTML = data;
      } else {
        console.error("Элемент <footer> не найден.");
      }
    })
    .catch(error => console.error(error));
});

// Функция подсветки текущей страницы
function highlightCurrentPage() {
  const currentURL = window.location.pathname; // Текущий путь страницы
  const links = document.querySelectorAll('.header__pagelist-link, .header-menu__pagelist-link');

  if (links.length === 0) {
    console.warn("Ссылки для подсветки текущей страницы не найдены.");
    return;
  }

  links.forEach(link => {
    if (link.getAttribute('href') === currentURL || link.href.endsWith(currentURL)) {
      link.classList.add('current', 'active'); // Добавляем классы current и active
    } else {
      link.classList.remove('current', 'active'); // Убираем классы с остальных
    }
  });
}

// Логика меню
function initMenu() {
  const menuBtnRef = document.querySelector("[data-menu-button]");
  const mobileMenuRef = document.querySelector("[data-menu]");
  const pageBody = document.querySelector("body");
  const overlay = document.querySelector(".header-menu__overlay");

  if (!menuBtnRef || !mobileMenuRef || !overlay || !pageBody) {
    console.error("Не все элементы найдены. Проверьте разметку.");
    return;
  }

  menuBtnRef.addEventListener("click", () => {
    const expanded = menuBtnRef.getAttribute("aria-expanded") === "true";

    // Переключаем состояние кнопки меню
    menuBtnRef.classList.toggle("is-open");
    menuBtnRef.setAttribute("aria-expanded", !expanded);

    // Переключаем состояние меню
    mobileMenuRef.classList.toggle("is-open");

    // Добавляем/удаляем блокировку прокрутки
    pageBody.classList.toggle("no-scroll");

    // Переключаем состояние оверлея
    overlay.classList.toggle("is-open");
  });

  // Закрытие меню при клике на оверлей
  overlay.addEventListener("click", () => {
    mobileMenuRef.classList.remove("is-open");
    menuBtnRef.classList.remove("is-open");
    pageBody.classList.remove("no-scroll");
    overlay.classList.remove("is-open");
  });
}

// Слушаем пользовательское событие headerLoaded
document.addEventListener('headerLoaded', () => {
  highlightCurrentPage(); // Подсветка текущей страницы после загрузки хедера
  initMenu(); // Инициализация меню
});
