const burger = document.getElementById('burgerBtn');
const menu = document.getElementById('mobileMenu');

// Бургер
burger.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Dropdown для мобильных
document.querySelectorAll(".dropdown").forEach(drop => {
    const btn = drop.querySelector(".drop-btn");

    btn.addEventListener("click", e => {
        // отключаем действие ссылки
        e.preventDefault();

        // если ширина меньше 768px → работаем как dropdown по клику
        if (window.innerWidth <= 768) {

            // закрыть все остальные открытые
            document.querySelectorAll(".dropdown.open").forEach(d => {
                if (d !== drop) d.classList.remove("open");
            });

            // открыть текущий
            drop.classList.toggle("open");
        }
    });
});

// Закрытие dropdown при клике вне меню (мобильные)
document.addEventListener('click', (e) => {
    const isDropdown = e.target.closest(".dropdown");
    const isBtn = e.target.closest(".drop-btn");

    if (!isDropdown && !isBtn && window.innerWidth <= 768) {
        document.querySelectorAll(".dropdown.open")
            .forEach(d => d.classList.remove("open"));
    }
});
