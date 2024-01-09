export function setupNavbar() {
    function collapseAllPages() {
        const navLinks = document.querySelectorAll('.navbar .nav-link');
        navLinks.forEach((el) => {
            el.classList.remove('active');
            document.querySelector(el.getAttribute('href')).classList.add('collapse');
        });
    }

    const navbar = document.querySelector('.navbar');
    navbar.addEventListener('click', (event) => {
        if (event.target.classList.contains('nav-link')) {
            const collapseId = event.target.getAttribute('href');
            const collapseElement = document.querySelector(collapseId);

            if (!event.target.classList.contains('active')) {
                collapseAllPages();
                event.target.classList.add('active');
                collapseElement.classList.remove('collapse');
            }
        }
    });
}

export function copyToClipboard(text) {
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = text;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
}