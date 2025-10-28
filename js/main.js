// Variáveis globais
let assinaturasCarregadas = 0;
const assinaturasPorPagina = 6;

// Dados simulados de assinaturas (em produção viriam de API)
const assinaturasSimuladas = [
    { nome: "João Silva", data: "24/10/2025", mensagem: "É fundamental essa mudança para a segurança dos pedestres!" },
    { nome: "Maria Santos", data: "23/10/2025", mensagem: "Apoio totalmente esta iniciativa. Vamos transformar nosso bairro!" },
    { nome: "Carlos Oliveira", data: "23/10/2025", mensagem: "Trânsito organizado é vida segura. Parabéns pela campanha!" },
    { nome: "Ana Pereira", data: "22/10/2025", mensagem: "Finalmente alguém se preocupando com o trânsito de Seropédica!" },
    { nome: "Roberto Costa", data: "22/10/2025", mensagem: "Essa mudança vai melhorar a qualidade de vida de todos nós." },
    { nome: "Fernanda Lima", data: "21/10/2025", mensagem: "Minha família apoia 100%. Bora mudar essa situação!" },
    { nome: "Pedro Henrique", data: "21/10/2025", mensagem: "Segurança no trânsito é direito de todos. Conte comigo!" },
    { nome: "Luiza Mendes", data: "20/10/2025", mensagem: "Excelente iniciativa! Seropédica merece atenção especial." },
    { nome: "Gustavo Almeida", data: "20/10/2025", mensagem: "Moro há 20 anos aqui e vejo a necessidade urgente dessa mudança." },
    { nome: "Camila Rocha", data: "19/10/2025", mensagem: "Minha filha estuda na região e a segurança é fundamental!" },
    { nome: "Ricardo Ferreira", data: "19/10/2025", mensagem: "Como motorista e morador, reconheço a importância desta campanha." },
    { nome: "Patricia Gomes", data: "18/10/2025", mensagem: "Vamos juntos construir um trânsito mais humano para nossa comunidade!" }
];

// Inicialização quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarMascaras();
    inicializarBuscaCEP();
    carregarAssinaturas();
    inicializarFormulario();
    inicializarCompartilhamento();
    inicializarModal();
    animarContador();
    inicializarProgresso();
    inicializarAnimacoesNumeros();
    inicializarScrollIndicator();
    inicializarBotaoFlutuante();
    inicializarBannerModal();
    inicializarAssistenciaFormulario();
});

// Máscaras para inputs
function inicializarMascaras() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        e.target.value = value;
    });

    // Máscara para Telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        e.target.value = value;
    });

    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        e.target.value = value;
    });
}

// Busca de CEP via API ViaCEP
function inicializarBuscaCEP() {
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('blur', function(e) {
        const cep = e.target.value.replace(/\D/g, '');

        if (cep.length === 8) {
            buscarEnderecoPorCEP(cep);
        }
    });
}

function buscarEnderecoPorCEP(cep) {
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const numeroInput = document.getElementById('numero');

    // Adicionar estado de carregamento
    enderecoInput.disabled = true;
    bairroInput.disabled = true;
    cidadeInput.disabled = true;
    estadoInput.disabled = true;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                enderecoInput.value = data.logradouro || '';
                bairroInput.value = data.bairro || '';
                cidadeInput.value = data.localidade || '';
                estadoInput.value = data.uf || '';

                // Focar no número do endereço
                numeroInput.focus();

                // Mostrar feedback visual
                enderecoInput.classList.add('success');
                setTimeout(() => {
                    enderecoInput.classList.remove('success');
                }, 2000);
            } else {
                mostrarNotificacao('CEP não encontrado. Por favor, preencha o endereço manualmente.', 'warning');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            mostrarNotificacao('Erro ao buscar CEP. Verifique sua conexão e tente novamente.', 'error');
        })
        .finally(() => {
            // Remover estado de carregamento
            enderecoInput.disabled = false;
            bairroInput.disabled = false;
            cidadeInput.disabled = false;
            estadoInput.disabled = false;
        });
}

// Carregar assinaturas
function carregarAssinaturas() {
    const grid = document.getElementById('assinaturasGrid');
    const inicio = assinaturasCarregadas;
    const fim = Math.min(inicio + assinaturasPorPagina, assinaturasSimuladas.length);

    for (let i = inicio; i < fim; i++) {
        const assinatura = criarCardAssinatura(assinaturasSimuladas[i]);
        grid.appendChild(assinatura);

        // Adicionar animação de entrada
        setTimeout(() => {
            assinatura.style.opacity = '1';
            assinatura.style.transform = 'translateY(0)';
        }, (i - inicio) * 100);
    }

    assinaturasCarregadas = fim;

    // Esconder botão "Ver mais" se não houver mais assinaturas
    if (assinaturasCarregadas >= assinaturasSimuladas.length) {
        document.getElementById('verMaisAssinaturas').style.display = 'none';
    }
}

function criarCardAssinatura(assinatura) {
    const card = document.createElement('div');
    card.className = 'assinatura-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    card.innerHTML = `
        <div class="assinatura-nome">${assinatura.nome}</div>
        <div class="assinatura-data">${assinatura.data}</div>
        ${assinatura.mensagem ? `<div class="assinatura-mensagem">"${assinatura.mensagem}"</div>` : ''}
    `;

    return card;
}

// Inicializar formulário
function inicializarFormulario() {
    const form = document.getElementById('formAssinatura');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validarFormulario()) {
            enviarFormulario();
        }
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(input);
        });

        input.addEventListener('input', function() {
            if (input.classList.contains('error')) {
                validarCampo(input);
            }
        });
    });
}

// Sistema de etapas do formulário
let currentStep = 1;
const totalSteps = 4;

function showStep(step) {
    // Esconder todas as etapas
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => s.classList.remove('active'));

    // Mostrar etapa atual
    document.getElementById(`step${step}`).classList.add('active');

    // Atualizar indicadores de progresso
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach(indicator => {
        const indicatorStep = parseInt(indicator.dataset.step);
        if (indicatorStep <= step) {
            indicator.classList.add('active');
            if (indicatorStep < step) {
                indicator.classList.add('completed');
            } else {
                indicator.classList.remove('completed');
            }
        } else {
            indicator.classList.remove('active', 'completed');
        }
    });

    // Se for a última etapa, atualizar dados de revisão
    if (step === 4) {
        atualizarDadosRevisao();
    }

    // Rolar para o topo do formulário
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextStep() {
    // Validar etapa atual antes de avançar
    if (validarEtapaAtual(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function validarEtapaAtual(step) {
    const currentStepElement = document.getElementById(`step${step}`);
    const requiredInputs = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!validarCampo(input)) {
            isValid = false;
            // Focar no primeiro campo inválido
            if (isValid === false) {
                input.focus();
            }
        }
    });

    if (!isValid) {
        mostrarNotificacao('Por favor, preencha todos os campos obrigatórios corretamente.', 'warning');
    }

    return isValid;
}

function atualizarDadosRevisao() {
    // Atualizar dados pessoais
    document.getElementById('review-nome').textContent = document.getElementById('nome').value || '-';
    document.getElementById('review-email').textContent = document.getElementById('email').value || '-';
    document.getElementById('review-cpf').textContent = document.getElementById('cpf').value || '-';
    document.getElementById('review-telefone').textContent = document.getElementById('telefone').value || '-';

    // Atualizar endereço
    document.getElementById('review-cep').textContent = document.getElementById('cep').value || '-';
    document.getElementById('review-endereco').textContent = document.getElementById('endereco').value || '-';
    document.getElementById('review-numero').textContent = document.getElementById('numero').value || '-';
    document.getElementById('review-bairro').textContent = document.getElementById('bairro').value || '-';

    const cidade = document.getElementById('cidade').value || '';
    const estado = document.getElementById('estado').value || '';
    document.getElementById('review-cidade-estado').textContent = cidade && estado ? `${cidade} - ${estado}` : '-';

    // Atualizar mensagem se existir
    const mensagem = document.getElementById('mensagem').value;
    if (mensagem && mensagem.trim()) {
        document.getElementById('review-mensagem-group').style.display = 'block';
        document.getElementById('review-mensagem').textContent = mensagem;
    } else {
        document.getElementById('review-mensagem-group').style.display = 'none';
    }
}

function validarFormulario() {
    const form = document.getElementById('formAssinatura');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let valido = true;

    inputs.forEach(input => {
        if (!validarCampo(input)) {
            valido = false;
        }
    });

    return valido;
}

function validarCampo(campo) {
    let isValid = true;

    // Remover mensagens de erro anteriores
    const existingError = campo.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validar campo obrigatório
    if (campo.hasAttribute('required') && !campo.value.trim()) {
        mostrarErroCampo(campo, 'Este campo é obrigatório');
        isValid = false;
    }

    // Validações específicas
    if (isValid && campo.value.trim()) {
        switch (campo.id) {
            case 'email':
                if (!validarEmail(campo.value)) {
                    mostrarErroCampo(campo, 'Digite um e-mail válido');
                    isValid = false;
                }
                break;

            case 'cpf':
                if (!validarCPF(campo.value.replace(/\D/g, ''))) {
                    mostrarErroCampo(campo, 'Digite um CPF válido');
                    isValid = false;
                }
                break;

            case 'telefone':
                if (!validarTelefone(campo.value.replace(/\D/g, ''))) {
                    mostrarErroCampo(campo, 'Digite um telefone válido');
                    isValid = false;
                }
                break;

            case 'cep':
                if (!validarCEP(campo.value.replace(/\D/g, ''))) {
                    mostrarErroCampo(campo, 'Digite um CEP válido');
                    isValid = false;
                }
                break;
        }
    }

    // Atualizar classes CSS
    if (isValid) {
        campo.classList.remove('error');
        campo.classList.add('success');
    } else {
        campo.classList.add('error');
        campo.classList.remove('success');
    }

    return isValid;
}

function mostrarErroCampo(campo, mensagem) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensagem;
    errorDiv.style.color = '#22c55e';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.3rem';

    campo.parentElement.appendChild(errorDiv);
}

// Validações de formatos
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do CPF
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validarTelefone(telefone) {
    // Remove caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');
    // Verifica se tem 10 ou 11 dígitos
    return telefone.length === 10 || telefone.length === 11;
}

function validarCEP(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    // Verifica se tem 8 dígitos
    return cep.length === 8;
}

// Enviar formulário
function enviarFormulario() {
    const form = document.getElementById('formAssinatura');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Adicionar estado de carregamento
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    // Simular envio (em produção seria uma requisição para API)
    setTimeout(() => {
        // Coletar dados do formulário
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        console.log('Dados enviados:', dados);

        // Simular sucesso
        mostrarModalSucesso();

        // Resetar formulário
        form.reset();

        // Remover classes de validação
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('success', 'error');
        });

        // Restaurar botão
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-signature"></i> Assinar Abaixo Assinado';

        // Adicionar nova assinatura à lista (simulação)
        const novaAssinatura = {
            nome: dados.nome,
            data: new Date().toLocaleDateString('pt-BR'),
            mensagem: dados.mensagem || ''
        };

        adicionarNovaAssinatura(novaAssinatura);

    }, 2000);
}

function adicionarNovaAssinatura(assinatura) {
    const grid = document.getElementById('assinaturasGrid');
    const card = criarCardAssinatura(assinatura);

    // Adicionar ao início da lista
    grid.insertBefore(card, grid.firstChild);

    // Animar entrada
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);

    // Atualizar contador (simulação)
    atualizarContadorAssinaturas();
}

// Funcionalidades de compartilhamento
function inicializarCompartilhamento() {
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            compartilharCampanha(platform);
        });
    });
}

function compartilharCampanha(plataforma) {
    const url = window.location.href;
    const title = 'Vamos Mudar o Trânsito de Seropédica';
    const text = 'Apoie nossa campanha por um trânsito mais seguro e organizado em Seropédica!';

    let shareUrl = '';

    switch (plataforma) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + ' ' + url)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Modal de sucesso
function inicializarModal() {
    const modal = document.getElementById('modalSucesso');
    const closeBtn = modal.querySelector('.close');
    const fecharModalBtn = document.getElementById('fecharModal');

    closeBtn.addEventListener('click', fecharModal);
    fecharModalBtn.addEventListener('click', fecharModal);

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

function mostrarModalSucesso() {
    const modal = document.getElementById('modalSucesso');
    modal.style.display = 'block';

    // Impedir scroll do body
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    const modal = document.getElementById('modalSucesso');
    modal.style.display = 'none';

    // Restaurar scroll do body
    document.body.style.overflow = 'auto';
}

// Animação do contador
function animarContador() {
    const counterElement = document.querySelector('.stat-number[data-meta]');
    if (!counterElement) return;

    const target = parseInt(counterElement.getAttribute('data-meta'));
    const duration = 2000; // 2 segundos
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        counterElement.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
}

// Atualizar contador após nova assinatura
function atualizarContadorAssinaturas() {
    const counterElement = document.querySelector('.stat-number[data-meta]');
    if (counterElement) {
        const currentValue = parseInt(counterElement.getAttribute('data-meta'));
        const newValue = currentValue + 1;
        counterElement.setAttribute('data-meta', newValue);

        // Animar o novo valor
        counterElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counterElement.style.transform = 'scale(1)';
            counterElement.textContent = newValue.toLocaleString('pt-BR');
        }, 300);
    }
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'error' ? '#22c55e' : tipo === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    notification.textContent = mensagem;
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Botão "Ver mais assinaturas"
document.getElementById('verMaisAssinaturas')?.addEventListener('click', function() {
    carregarAssinaturas();
});

// Adicionar estilos CSS para estados de erro e sucesso
const additionalStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #22c55e;
        background-color: #fdf2f2;
    }

    .form-group input.success,
    .form-group select.success,
    .form-group textarea.success {
        border-color: #27ae60;
        background-color: #f2fdf5;
    }

    .success {
        animation: successPulse 0.5s ease;
    }

    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

// Inicializar animações dos números de progresso
function inicializarAnimacoesNumeros() {
    // Mobile/Tablet numbers
    const mobileNumbers = document.querySelectorAll('.mobile-progress .stat-number[data-target]');

    // Desktop numbers
    const desktopNumbers = document.querySelectorAll('.desktop-progress .stat-number-large[data-target]');
    const targetNumbers = document.querySelectorAll('.desktop-progress .target-number[data-target]');

    // Combinar todos os números
    const allNumbers = [...mobileNumbers, ...desktopNumbers, ...targetNumbers];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    allNumbers.forEach(number => {
        observer.observe(number);
    });
}

// Animar número progressivamente
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }

        element.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
}

// Inicializar seção de progresso
function inicializarProgresso() {
    const currentProgress = 50; // Porcentagem atual

    // Atualizar milestones mobile
    const mobileMilestones = document.querySelectorAll('.mobile-progress .milestone');
    mobileMilestones.forEach((milestone, index) => {
        const thresholdValues = [25, 50, 75, 100];
        if (currentProgress >= thresholdValues[index]) {
            milestone.classList.add('achieved');
        }
    });

    // Atualizar markers desktop
    const desktopMarkers = document.querySelectorAll('.desktop-progress .marker');
    desktopMarkers.forEach((marker, index) => {
        const thresholdValues = [25, 50, 75, 100];
        if (currentProgress >= thresholdValues[index]) {
            marker.classList.add('achieved');
        }
    });

    // Animar barras de progresso quando visíveis
    const progressFills = [
        ...document.querySelectorAll('.mobile-progress .progress-fill'),
        ...document.querySelectorAll('.desktop-progress .progress-fill-advanced')
    ];

    progressFills.forEach(fill => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.width = '50%';
                    }, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(fill);
    });

    // Inicializar countdown se existir
    inicializarCountdown();
}

// Inicializar countdown de urgência
function inicializarCountdown() {
    // Mobile countdown
    const mobileCountdown = document.querySelector('.mobile-progress .countdown-timer');

    // Desktop countdown
    const desktopCountdown = document.querySelector('.desktop-progress .countdown-days');

    function updateCountdown() {
        const days = 30; // Fixo para exemplo
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);

        const now = new Date();
        const difference = targetDate - now;

        if (difference > 0) {
            const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            // Atualizar mobile
            if (mobileCountdown) {
                mobileCountdown.textContent = `${daysLeft}d ${hoursLeft}h`;
            }

            // Atualizar desktop
            if (desktopCountdown) {
                desktopCountdown.textContent = `${daysLeft}d ${hoursLeft}h`;
            }
        } else {
            if (mobileCountdown) {
                mobileCountdown.textContent = 'Encerrado';
                mobileCountdown.style.color = '#22C55E';
            }
            if (desktopCountdown) {
                desktopCountdown.textContent = 'Encerrado';
                desktopCountdown.style.color = '#22C55E';
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60); // Atualizar a cada hora
}

// Inicializar Scroll Indicator
function inicializarScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    // Esconder scroll indicator quando rolar a página
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;

        if (scrollPosition > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });

    // Adicionar clique para rolar suavemente
    scrollIndicator.addEventListener('click', function() {
        const sobreSection = document.querySelector('.sobre-campanha');
        if (sobreSection) {
            sobreSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Inicializar Botão Flutuante de Assinatura
function inicializarBotaoFlutuante() {
    const floatingBtn = document.getElementById('floatingAssinaturaBtn');
    if (!floatingBtn) return;

    // Scroll suave para a seção de assinatura
    floatingBtn.addEventListener('click', function() {
        const formSection = document.querySelector('.formulario-assinatura');
        if (formSection) {
            formSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Adicionar destaque visual temporário ao formulário
            const formCard = formSection.querySelector('.form-card');
            if (formCard) {
                formCard.style.transition = 'all 0.3s ease';
                formCard.style.boxShadow = '0 0 40px rgba(34, 197, 94, 0.4)';
                formCard.style.transform = 'scale(1.02)';

                // Remover destaque após 2 segundos
                setTimeout(() => {
                    formCard.style.boxShadow = '';
                    formCard.style.transform = '';
                }, 2000);
            }
        }
    });

    // Mostrar/ocultar botão baseado no scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Ocultar botão quando estiver na seção de assinatura
        const formSection = document.querySelector('.formulario-assinatura');
        if (formSection) {
            const formRect = formSection.getBoundingClientRect();
            const isInFormSection = formRect.top <= window.innerHeight && formRect.bottom >= 0;

            if (isInFormSection) {
                floatingBtn.style.opacity = '0';
                floatingBtn.style.transform = 'translateY(10px)';
                floatingBtn.style.pointerEvents = 'none';
            } else {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.transform = 'translateY(0)';
                floatingBtn.style.pointerEvents = 'auto';
            }
        }

        lastScrollTop = scrollTop;
    });
}

// Inicializar Modal do Banner
function inicializarBannerModal() {
    const modal = document.getElementById('bannerModal');
    const bannerImages = document.querySelectorAll('.campaign-banner');
    const closeBtn = document.querySelector('.banner-modal-close');

    if (!modal || !bannerImages.length || !closeBtn) return;

    // Abrir modal ao clicar no banner
    bannerImages.forEach(banner => {
        banner.style.cursor = 'zoom-in';
        banner.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Impede scroll do body

            // Animação de entrada
            setTimeout(() => {
                modal.classList.add('modal-open');
            }, 10);
        });
    });

    // Fechar modal ao clicar no X
    closeBtn.addEventListener('click', fecharBannerModal);

    // Fechar modal ao clicar fora da imagem
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharBannerModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            fecharBannerModal();
        }
    });

    function fecharBannerModal() {
        modal.classList.remove('modal-open');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restaura scroll do body
        }, 300);
    }
}

// Sistema de assistência para formulário
function inicializarAssistenciaFormulario() {
    // Adicionar validação amigável
    adicionarValidacaoAmigavel();

    // Adicionar navegação por teclado
    adicionarNavegacaoTeclado();
}

function adicionarValidacaoAmigavel() {
    const inputs = document.querySelectorAll('input[required]');

    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();

            // Mensagem amigável baseada no tipo
            let mensagem = 'Por favor, preencha este campo.';

            if (input.id === 'email') {
                mensagem = 'Digite um e-mail válido, como: exemplo@email.com';
            } else if (input.id === 'cpf') {
                mensagem = 'Digite seu CPF completo (11 números)';
            } else if (input.id === 'telefone') {
                mensagem = 'Digite seu telefone com DDD';
            } else if (input.id === 'cep') {
                mensagem = 'Digite seu CEP completo (8 números)';
            }

            mostrarNotificacao(mensagem, 'warning');
            input.focus();
        });
    });
}

function adicionarNavegacaoTeclado() {
    // Navegação entre campos com Enter
    const form = document.getElementById('formAssinatura');
    if (!form) return;

    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;

            // Se estiver em um campo de texto e não for textarea
            if (activeElement.tagName === 'INPUT' && activeElement.type !== 'submit') {
                e.preventDefault();

                // Tentar avançar para o próximo campo
                const formElements = Array.from(form.querySelectorAll('input, select, textarea, button'));
                const currentIndex = formElements.indexOf(activeElement);

                // Encontrar próximo elemento focável
                for (let i = currentIndex + 1; i < formElements.length; i++) {
                    const element = formElements[i];
                    if (element.type !== 'hidden' && !element.disabled && element.offsetParent !== null) {
                        element.focus();
                        break;
                    }
                }
            }
        }
    });
}


// Adicionar estilos ao head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);