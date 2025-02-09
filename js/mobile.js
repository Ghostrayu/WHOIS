// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-button');
    const autobiography = document.getElementById('autobiography');
    let isHidden = false;

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            isHidden = !isHidden;
            menuButton.classList.toggle('active');
            
            if (isHidden) {
                autobiography.classList.add('hidden');
            } else {
                autobiography.classList.remove('hidden');
            }
        });
    }
});
