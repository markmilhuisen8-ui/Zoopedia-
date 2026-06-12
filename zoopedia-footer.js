/* zoopedia-footer.js */

document.addEventListener('DOMContentLoaded', function() {
    const footerColumns = document.querySelectorAll('.footer-column h3');
    
    footerColumns.forEach(header => {
        header.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                const column = header.parentElement;
                column.classList.toggle('active');
            }
        });
    });
});
