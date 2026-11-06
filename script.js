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

const whatsappInput = document.getElementById('whatsapp');
const clientForm = document.getElementById('clientForm');
const formFeedback = document.getElementById('formFeedback');
const btnSubmitClient = document.getElementById('btnSubmitClient');

whatsappInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    
    if (valor.length > 2) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }
    if (valor.length > 10) {
        valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
    }
    e.target.value = valor;
});

clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';
    btnSubmitClient.disabled = true;
    btnSubmitClient.textContent = 'ENVIANDO...';

    const payload = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('whatsapp').value,
        data_nascimento: document.getElementById('data_nascimento').value
    };

    try {
        const response = await fetch('cadastrar_cliente.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const resultado = await response.json();

        if (response.ok && resultado.sucesso) {
            formFeedback.textContent = resultado.mensagem;
            formFeedback.classList.add('sucesso');
            clientForm.reset();
        } else {
            formFeedback.textContent = resultado.mensagem || 'Ocorreu um erro.';
            formFeedback.classList.add('erro');
        }
    } catch (error) {
        formFeedback.textContent = 'Erro de comunicação com o servidor.';
        formFeedback.classList.add('erro');
    } finally {
        btnSubmitClient.disabled = false;
        btnSubmitClient.textContent = 'CADASTRAR';
    }
});
});