const menuButton = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');

menuButton?.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('nav-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const message = [
    'Olá! Gostaria de falar com um especialista.',
    '',
    '*Nome*',
    String(formData.get('nome')).trim(),
    '',
    '*E-mail*',
    String(formData.get('email')).trim(),
    '',
    '*Como podemos ajudar?*',
    String(formData.get('mensagem')).trim(),
  ].join('\r\n');
  window.open(`https://wa.me/5585998406661?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

const triagePanel = document.querySelector('.triage-panel');

if (triagePanel) {
  const triageQuestions = [
    { question: 'As parcelas estão em dia?', options: ['Sim, todas', 'Algumas estão em atraso', 'Parei de pagar'] },
    { question: 'Você já recebeu alguma notificação?', options: ['Ainda não recebi', 'Recebi uma notificação', 'Não tenho certeza'] },
    { question: 'Qual informação você busca agora?', options: ['Entender meu contrato', 'Orientação sobre veículo', 'Falar com um especialista'] },
  ];
  const question = triagePanel.querySelector('.triage-question');
  const context = triagePanel.querySelector('.triage-context');
  const options = triagePanel.querySelector('.triage-options');
  const progress = triagePanel.querySelector('.triage-progress span');
  const stepLabel = triagePanel.querySelector('.triage-step-label');
  const questionWrap = triagePanel.querySelector('.triage-question-wrap');
  const result = triagePanel.querySelector('.triage-result');
  const whatsappLink = triagePanel.querySelector('.triage-whatsapp');
  let currentStep = 0;
  let responses = [];

  const renderTriageStep = () => {
    const step = triageQuestions[currentStep];
    question.textContent = step.question;
    context.textContent = currentStep === 2 ? 'Selecione a opção que mais corresponde ao que você precisa neste momento.' : 'Escolha a alternativa que melhor descreve sua situação atual.';
    stepLabel.textContent = `Etapa ${currentStep + 1} de ${triageQuestions.length}`;
    progress.style.width = `${((currentStep + 1) / triageQuestions.length) * 100}%`;
    options.innerHTML = step.options.map((option) => `<button class="triage-option" type="button">${option}</button>`).join('');
  };

  options.addEventListener('click', (event) => {
    const option = event.target.closest('.triage-option');
    if (!option) return;
    responses.push({ question: triageQuestions[currentStep].question, answer: option.textContent });
    currentStep += 1;
    if (currentStep < triageQuestions.length) {
      renderTriageStep();
      questionWrap.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
      return;
    }
    questionWrap.hidden = true;
    result.hidden = false;
    stepLabel.textContent = 'Triagem concluída';
    progress.style.width = '100%';
    const lineBreak = '\r\n';
    const message = [
      'Olá! Concluí a triagem inicial no site e gostaria de falar com um especialista.',
      '',
      'Minhas respostas:',
      '',
      ...responses.flatMap((response, index) => [
        `*${index + 1}. ${response.question}*`,
        `Resposta: ${response.answer}`,
        '',
      ]),
    ].join(lineBreak);
    whatsappLink.href = `https://wa.me/5585998406661?text=${encodeURIComponent(message)}`;
  });

  triagePanel.querySelector('.triage-restart').addEventListener('click', () => {
    currentStep = 0;
    responses = [];
    result.hidden = true;
    questionWrap.hidden = false;
    renderTriageStep();
  });

  renderTriageStep();
}

const simulatorForm = document.querySelector('.simulator-form');

if (simulatorForm) {
  const installmentInput = simulatorForm.querySelector('.simulator-installment');
  const monthsInput = simulatorForm.querySelector('.simulator-months');
  const totalOutput = simulatorForm.querySelector('.simulator-total');
  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const getInstallment = () => Number(installmentInput.value.replace(/[^0-9,.-]/g, '').replace('.', '').replace(',', '.')) || 0;
  const getMonths = () => Number(monthsInput.value) || 0;

  const updateSimulator = () => {
    const total = getInstallment() * getMonths();
    totalOutput.innerHTML = `Total estimado das parcelas restantes: <strong>${formatCurrency(total)}</strong>`;
  };

  installmentInput.addEventListener('input', updateSimulator);
  monthsInput.addEventListener('input', updateSimulator);
  simulatorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = [
      'Olá! Gostaria de solicitar uma análise inicial do meu financiamento.',
      '',
      `Parcela informada: ${formatCurrency(getInstallment())}`,
      `Meses restantes: ${getMonths()}`,
      `Total estimado das parcelas restantes: ${formatCurrency(getInstallment() * getMonths())}`,
    ].join('\r\n');
    window.open(`https://wa.me/5585998406661?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  updateSimulator();
}
