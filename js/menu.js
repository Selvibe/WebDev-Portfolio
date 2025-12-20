const burger = document.getElementById('burgerBtn');
const menu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    menu.classList.toggle('active');
});
