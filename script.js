document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbar = document.getElementById('navbar');

    mobileToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });

    const bookingModal = document.getElementById('bookingModal');
    const btnOpenModal = document.getElementById('btnOpenModal');
    const btnHeroAgendar = document.getElementById('btnHeroAgendar');
    const btnCloseModal = document.getElementById('btnCloseModal');

    const openModal = () => bookingModal.classList.add('active');
    const closeModal = () => bookingModal.classList.remove('active');

    btnOpenModal.addEventListener('click', openModal);
    btnHeroAgendar.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'todos' || filterValue === itemCategory) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    const carousel = document.getElementById('portfolioCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 340, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -340, behavior: 'smooth' });
    });

    const newsletterForm = document.getElementById('newsletterForm');
    const franchiseForm = document.getElementById('franchiseForm');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Cadastro realizado com sucesso! Você receberá nossas novidades.');
        newsletterForm.reset();
    });

    franchiseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Solicitação de franquia enviada! Nossa equipe entrará em contato.');
        franchiseForm.reset();
    });
});