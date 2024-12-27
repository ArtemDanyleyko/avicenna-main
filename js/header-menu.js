document.addEventListener("headerLoaded", () => {
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
});
