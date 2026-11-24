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

    const openBooking = () => bookingModal.classList.add('active');
    const closeBooking = () => bookingModal.classList.remove('active');

    btnOpenModal.addEventListener('click', openBooking);
    btnHeroAgendar.addEventListener('click', openBooking);
    btnCloseModal.addEventListener('click', closeBooking);

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeBooking();
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
        alert('Cadastro na newsletter realizado com sucesso!');
        newsletterForm.reset();
    });

    franchiseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Solicitação de franquia enviada! Nossa equipe entrará em contato.');
        franchiseForm.reset();
    });

    const authModal = document.getElementById('authModal');
    const btnOpenAuth = document.getElementById('btnOpenAuth');
    const footerLinkConta = document.getElementById('footerLinkConta');
    const btnCloseAuth = document.getElementById('btnCloseAuth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authViews = document.getElementById('authViews');
    const profileView = document.getElementById('profileView');
    const loggedUserName = document.getElementById('loggedUserName');
    const btnLogout = document.getElementById('btnLogout');

    const updateAuthUI = () => {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (clienteLogado) {
            const primeiroNome = clienteLogado.nome.split(' ')[0];
            loggedUserName.textContent = primeiroNome;
            authViews.style.display = 'none';
            profileView.classList.add('active');
            document.getElementById('profNome').textContent = clienteLogado.nome;
            document.getElementById('profEmail').textContent = clienteLogado.email;
            document.getElementById('profWhatsapp').textContent = clienteLogado.whatsapp;
            document.getElementById('profNascimento').textContent = clienteLogado.data_nascimento.split('-').reverse().join('/');
        } else {
            loggedUserName.textContent = 'Entrar';
            authViews.style.display = 'block';
            profileView.classList.remove('active');
        }
    };

    updateAuthUI();

    const openAuth = (e) => {
        if (e) e.preventDefault();
        updateAuthUI();
        authModal.classList.add('active');
    };

    const closeAuth = () => authModal.classList.remove('active');

    btnOpenAuth.addEventListener('click', openAuth);
    footerLinkConta.addEventListener('click', openAuth);
    btnCloseAuth.addEventListener('click', closeAuth);

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuth();
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.tab === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });

    const aplicarMascaraTelefone = (input) => {
        input.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);
            if (valor.length > 2) valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
            if (valor.length > 10) valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
            e.target.value = valor;
        });
    };

    aplicarMascaraTelefone(document.getElementById('regWhatsapp'));
    aplicarMascaraTelefone(document.getElementById('loginWhatsapp'));

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = document.getElementById('registerFeedback');
        const btnSubmit = document.getElementById('btnSubmitRegister');
        feedback.textContent = '';
        feedback.className = 'form-feedback';
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'CRIANDO CONTA...';

        const payload = {
            acao: 'cadastrar',
            nome: document.getElementById('regNome').value.trim(),
            email: document.getElementById('regEmail').value.trim(),
            whatsapp: document.getElementById('regWhatsapp').value.trim(),
            data_nascimento: document.getElementById('regNascimento').value
        };

        try {
            const response = await fetch('/api/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 404 || response.status === 405) {
                throw new Error('Ambiente local sem backend ativo');
            }

            const resultado = await response.json();

            if (response.ok && resultado.sucesso) {
                localStorage.setItem('clienteLogado', JSON.stringify(payload));
                feedback.textContent = 'Conta criada com sucesso!';
                feedback.classList.add('sucesso');
                registerForm.reset();
                setTimeout(() => updateAuthUI(), 800);
            } else {
                feedback.textContent = resultado.mensagem || 'Erro ao cadastrar.';
                feedback.classList.add('erro');
            }
        } catch (err) {
            const listaLocal = JSON.parse(localStorage.getItem('clientesBarbearia') || '[]');
            const jaExiste = listaLocal.some(c => c.email.toLowerCase() === payload.email.toLowerCase());

            if (jaExiste) {
                feedback.textContent = 'Este e-mail já está cadastrado.';
                feedback.classList.add('erro');
            } else {
                listaLocal.push(payload);
                localStorage.setItem('clientesBarbearia', JSON.stringify(listaLocal));
                localStorage.setItem('clienteLogado', JSON.stringify(payload));
                feedback.textContent = 'Conta criada com sucesso!';
                feedback.classList.add('sucesso');
                registerForm.reset();
                setTimeout(() => updateAuthUI(), 800);
            }
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'CRIAR CONTA';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = document.getElementById('loginFeedback');
        const btnSubmit = document.getElementById('btnSubmitLogin');
        feedback.textContent = '';
        feedback.className = 'form-feedback';
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'VERIFICANDO...';

        const email = document.getElementById('loginEmail').value.trim();
        const whatsapp = document.getElementById('loginWhatsapp').value.trim();

        try {
            const response = await fetch('/api/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ acao: 'login', email, whatsapp })
            });

            if (response.status === 404 || response.status === 405) {
                throw new Error('Ambiente local sem backend ativo');
            }

            const resultado = await response.json();

            if (response.ok && resultado.sucesso) {
                localStorage.setItem('clienteLogado', JSON.stringify(resultado.cliente));
                loginForm.reset();
                updateAuthUI();
            } else {
                feedback.textContent = resultado.mensagem || 'Dados não conferem.';
                feedback.classList.add('erro');
            }
        } catch (err) {
            const listaLocal = JSON.parse(localStorage.getItem('clientesBarbearia') || '[]');
            const cliente = listaLocal.find(
                c => c.email.toLowerCase() === email.toLowerCase() && c.whatsapp === whatsapp
            );

            if (cliente) {
                localStorage.setItem('clienteLogado', JSON.stringify(cliente));
                loginForm.reset();
                updateAuthUI();
            } else {
                feedback.textContent = 'Cliente não encontrado. Verifique e-mail e WhatsApp.';
                feedback.classList.add('erro');
            }
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'ACESSAR CONTA';
        }
    });

    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('clienteLogado');
        updateAuthUI();
    });
    const mainView = document.getElementById('mainView');
    const kidsView = document.getElementById('kidsView');
    const badgeKidsLink = document.querySelector('.badge-kids');
    const btnVoltarAdulto = document.getElementById('btnVoltarAdulto');
    const btnKidsAgendar = document.getElementById('btnKidsAgendar');
    const btnOpenKids = document.querySelector('.btn-open-kids');
    const expKidsCard = document.getElementById('kids');

    const secoesAdulto = document.querySelectorAll(
        '.hero, .experience-section, .portfolio-section, .testimonials-section'
    );

    const abrirAbaKids = (e) => {
        if (e) e.preventDefault();
        if (!kidsView) return;

        secoesAdulto.forEach(sec => sec.style.display = 'none');
        kidsView.classList.add('active');
        if (badgeKidsLink) badgeKidsLink.classList.add('active-tab');
        navbar.classList.remove('active');

        kidsView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const voltarSalaoAdulto = () => {
        if (!kidsView) return;
        kidsView.classList.remove('active');
        secoesAdulto.forEach(sec => sec.style.display = '');
        if (badgeKidsLink) badgeKidsLink.classList.remove('active-tab');
    };

    if (badgeKidsLink) badgeKidsLink.addEventListener('click', abrirAbaKids);
    if (btnOpenKids) btnOpenKids.addEventListener('click', abrirAbaKids);
    if (expKidsCard) expKidsCard.addEventListener('click', abrirAbaKids);

    if (btnVoltarAdulto) {
        btnVoltarAdulto.addEventListener('click', () => {
            voltarSalaoAdulto();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnKidsAgendar) {
        btnKidsAgendar.addEventListener('click', openBooking);
    }

    document.querySelectorAll('.nav-link:not(.badge-kids), .logo').forEach(link => {
        link.addEventListener('click', () => {
            voltarSalaoAdulto();
        });
    });
const kidsCards = document.querySelectorAll('.kids-card');

    kidsCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    const emojisKids = ['⭐', '⚡', '🎮', '✨', '🏎️', '🚀'];
    let ultimoSparkle = 0;

    if (kidsView) {
        kidsView.addEventListener('mousemove', (e) => {
            const agora = Date.now();
            if (agora - ultimoSparkle < 90) return;
            ultimoSparkle = agora;

            const sparkle = document.createElement('span');
            sparkle.className = 'kids-sparkle';
            sparkle.textContent = emojisKids[Math.floor(Math.random() * emojisKids.length)];
            sparkle.style.left = `${e.clientX}px`;
            sparkle.style.top = `${e.clientY}px`;

            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        });
    }
    const sonsKids = [
        new Audio('sons/game.mp3'),
        new Audio('sons/silencio.mp3'),
        new Audio('sons/honk.mp3')
    ];

    sonsKids.forEach(som => {
        som.volume = 0.5;
    });

    document.querySelectorAll('.kids-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            sonsKids.forEach(s => {
                s.pause();
                s.currentTime = 0;
            });

            const somAtual = sonsKids[index] || sonsKids[0];
            somAtual.play().catch(() => {});
        });
    });
    const formAgendamento = document.getElementById('formAgendamento');
    const agNome = document.getElementById('agNome');
    const agWhatsapp = document.getElementById('agWhatsapp');
    const agAmbiente = document.getElementById('agAmbiente');
    const agBarbeiro = document.getElementById('agBarbeiro');
    const agData = document.getElementById('agData');
    const agHorario = document.getElementById('agHorario');
    const listaMeusAgendamentos = document.getElementById('listaMeusAgendamentos');

    if (agWhatsapp) aplicarMascaraTelefone(agWhatsapp);

    if (agData) {
        const hoje = new Date().toISOString().split('T')[0];
        agData.setAttribute('min', hoje);
    }

    const preencherDadosAgendamento = (ambientePadrao) => {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (clienteLogado && agNome && agWhatsapp) {
            agNome.value = clienteLogado.nome || '';
            agWhatsapp.value = clienteLogado.whatsapp || '';
        }
        if (ambientePadrao && agAmbiente) {
            agAmbiente.value = ambientePadrao;
        }
    };

    const atualizarHorariosDisponiveis = async () => {
        if (!agBarbeiro || !agData || !agHorario) return;
        const barbeiro = agBarbeiro.value;
        const data = agData.value;
        if (!barbeiro || !data) return;

        Array.from(agHorario.options).forEach(opt => {
            if (opt.value) {
                opt.disabled = false;
                opt.textContent = opt.value;
            }
        });

        try {
            const url = `/api/agendamentos?barbeiro=${encodeURIComponent(barbeiro)}&data=${encodeURIComponent(data)}`;
            const response = await fetch(url);
            const resultado = await response.json();

            if (resultado.sucesso && Array.isArray(resultado.ocupados)) {
                Array.from(agHorario.options).forEach(opt => {
                    if (resultado.ocupados.includes(opt.value)) {
                        opt.disabled = true;
                        opt.textContent = `${opt.value} (Ocupado)`;
                        if (agHorario.value === opt.value) agHorario.value = '';
                    }
                });
            }
        } catch (err) {}
    };

    if (agBarbeiro) agBarbeiro.addEventListener('change', atualizarHorariosDisponiveis);
    if (agData) agData.addEventListener('change', atualizarHorariosDisponiveis);

    btnOpenModal.addEventListener('click', () => preencherDadosAgendamento('Salão Clássico'));
    btnHeroAgendar.addEventListener('click', () => preencherDadosAgendamento('Salão Clássico'));
    if (btnKidsAgendar) {
        btnKidsAgendar.addEventListener('click', () => preencherDadosAgendamento('Espaço Kids'));
    }

    const carregarMeusAgendamentos = async () => {
        if (!listaMeusAgendamentos) return;
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (!clienteLogado || !clienteLogado.whatsapp) return;

        listaMeusAgendamentos.innerHTML = '<p class="ag-empty">Carregando...</p>';

        try {
            const url = `/api/agendamentos?whatsapp=${encodeURIComponent(clienteLogado.whatsapp)}`;
            const response = await fetch(url);
            const resultado = await response.json();

            if (!resultado.sucesso || !resultado.agendamentos.length) {
                listaMeusAgendamentos.innerHTML = '<p class="ag-empty">Nenhum agendamento encontrado.</p>';
                return;
            }

            listaMeusAgendamentos.innerHTML = resultado.agendamentos.map(ag => {
                const dataFormatada = ag.data_agendamento.split('-').reverse().join('/');
                return `
                    <div class="ag-card">
                        <div class="ag-info">
                            <strong>${ag.servico}</strong>
                            <span>${dataFormatada} às ${ag.horario} • ${ag.barbeiro} (${ag.ambiente})</span>
                        </div>
                        <button class="btn-cancelar-ag" data-id="${ag.id}">Cancelar</button>
                    </div>
                `;
            }).join('');

            listaMeusAgendamentos.querySelectorAll('.btn-cancelar-ag').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (!confirm('Deseja cancelar este agendamento?')) return;

                    btn.disabled = true;
                    btn.textContent = '...';

                    try {
                        const delUrl = `/api/agendamentos?id=${btn.dataset.id}&whatsapp=${encodeURIComponent(clienteLogado.whatsapp)}`;
                        const res = await fetch(delUrl, { method: 'DELETE' });
                        const data = await res.json();

                        if (data.sucesso) {
                            carregarMeusAgendamentos();
                            atualizarHorariosDisponiveis();
                        } else {
                            alert('Não foi possível cancelar o agendamento.');
                            btn.disabled = false;
                            btn.textContent = 'Cancelar';
                        }
                    } catch (err) {
                        alert('Erro de conexão ao cancelar.');
                        btn.disabled = false;
                        btn.textContent = 'Cancelar';
                    }
                });
            });
        } catch (err) {
            listaMeusAgendamentos.innerHTML = '<p class="ag-empty">Disponível na versão online.</p>';
        }
    };

    btnOpenAuth.addEventListener('click', carregarMeusAgendamentos);
    footerLinkConta.addEventListener('click', carregarMeusAgendamentos);

    if (formAgendamento) {
        formAgendamento.addEventListener('submit', async (e) => {
            e.preventDefault();
            const feedback = document.getElementById('agendamentoFeedback');
            const btnSubmit = document.getElementById('btnSubmitAgendamento');

            feedback.textContent = '';
            feedback.className = 'form-feedback';
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'RESERVANDO...';

            const payload = {
                cliente_nome: agNome.value.trim(),
                cliente_whatsapp: agWhatsapp.value.trim(),
                ambiente: agAmbiente.value,
                servico: document.getElementById('agServico').value,
                barbeiro: agBarbeiro.value,
                data_agendamento: agData.value,
                horario: agHorario.value
            };

            try {
                const response = await fetch('/api/agendamentos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const resultado = await response.json();

                if (!response.ok || !resultado.sucesso) {
                    feedback.textContent = resultado.mensagem || 'Erro ao agendar.';
                    feedback.classList.add('erro');
                    return;
                }

                feedback.textContent = 'Horário reservado com sucesso!';
                feedback.classList.add('sucesso');
                formAgendamento.reset();
                atualizarHorariosDisponiveis();
            } catch (err) {
                feedback.textContent = 'Erro de conexão. Teste pelo link da Vercel.';
                feedback.classList.add('erro');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'CONFIRMAR HORÁRIO';
            }
        });
    }
const agServico = document.getElementById('agServico');

    const servicosPorAmbiente = {
        'Salão Clássico': [
            { value: 'Corte Clássico - R$ 70', label: 'Corte Clássico (R$ 70)' },
            { value: 'Barba Tradicional - R$ 55', label: 'Barba Tradicional (R$ 55)' },
            { value: 'Combo Cabelo + Barba - R$ 110', label: 'Combo Cabelo + Barba (R$ 110)' },
            { value: 'Combo Pai & Filho - R$ 130', label: 'Combo Pai & Filho (R$ 130)' }
        ],
        'Espaço Kids': [
            { value: 'Corte Infantil Kids - R$ 60', label: 'Corte Infantil Kids (R$ 60)' },
            { value: 'Meu Primeiro Corte - R$ 75', label: 'Meu Primeiro Corte (R$ 75)' },
            { value: 'Combo Pai & Filho - R$ 130', label: 'Combo Pai & Filho (R$ 130)' }
        ]
    };

    const atualizarServicosPorAmbiente = () => {
        if (!agAmbiente || !agServico) return;
        const opcoes = servicosPorAmbiente[agAmbiente.value] || [];

        agServico.innerHTML = '<option value="" disabled selected>Escolha o Serviço</option>';
        opcoes.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.label;
            agServico.appendChild(option);
        });
    };

    if (agAmbiente) {
        agAmbiente.addEventListener('change', atualizarServicosPorAmbiente);
        atualizarServicosPorAmbiente();
    }

    btnOpenModal.addEventListener('click', atualizarServicosPorAmbiente);
    btnHeroAgendar.addEventListener('click', atualizarServicosPorAmbiente);
    if (btnKidsAgendar) {
        btnKidsAgendar.addEventListener('click', atualizarServicosPorAmbiente);
    }
    const promoPopup = document.getElementById('promoPopup');
    const closePromoPopup = document.getElementById('closePromoPopup');
    const btnPromoAgendar = document.getElementById('btnPromoAgendar');

    if (promoPopup && !sessionStorage.getItem('promoVinhoFechada')) {
        setTimeout(() => {
            promoPopup.classList.add('show');
        }, 3000);
    }

    if (closePromoPopup) {
        closePromoPopup.addEventListener('click', () => {
            promoPopup.classList.remove('show');
            sessionStorage.setItem('promoVinhoFechada', 'true');
        });
    }

    if (btnPromoAgendar) {
        btnPromoAgendar.addEventListener('click', () => {
            promoPopup.classList.remove('show');
            preencherDadosAgendamento('Salão Clássico');
            atualizarServicosPorAmbiente();
            openBooking();
        });
    }
});