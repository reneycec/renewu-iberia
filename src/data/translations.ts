import { LanguageCode, LanguageOption } from "../types";

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt-PT", name: "Português (PT)", flag: "🇵🇹" },
  { code: "pt-BR", name: "Português (BR)", flag: "🇧🇷" },
];

export interface Dictionary {
  // Navigation & General
  navCourses: string;
  navAbout: string;
  navEnrollment: string;
  navPayment: string;
  navAITutor: string;
  navMoodleAdmin: string;
  navIframe: string;
  navCMSEditor: string;
  adminLoginTitle: string;
  adminLoginDesc: string;
  adminPasswordLabel: string;
  adminLoginBtn: string;
  adminLogoutBtn: string;
  adminUnlockMsg: string;

  // Hero & Catalog
  heroTitle: string;
  heroSubtitle: string;
  btnExploreCourses: string;
  btnStartRegistration: string;
  coursesTitle: string;
  coursesSubtitle: string;
  singleCoursePrice: string;
  fullProgramPrice: string;
  categoryAll: string;
  categoryBiblical: string;
  categorySystematic: string;
  categoryPractical: string;
  categoryHistory: string;
  btnViewSyllabus: string;
  btnEnrollCourse: string;
  modalSyllabusTitle: string;
  modalCloseBtn: string;

  // About Us
  aboutTitle: string;
  aboutSubtitle: string;
  aboutMissionTitle: string;
  aboutMissionDesc: string;
  aboutPillarsTitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;
  aboutFaqTitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;

  // Faculty Advisors
  facultyTitle: string;
  facultySubtitle: string;

  // Enrollment Form
  formTitle: string;
  formSubtitle: string;
  personalDataTitle: string;
  churchDataTitle: string;
  academicDataTitle: string;
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  churchLabel: string;
  educationalBgLabel: string;
  churchExpLabel: string;
  ministryInvLabel: string;
  referencesLabel: string;
  referralSourceLabel: string;
  btnSubmitEnrollment: string;

  // Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  selectPlanTitle: string;
  planSingleTitle: string;
  planSingleDesc: string;
  planFullTitle: string;
  planFullDesc: string;
  cardNameLabel: string;
  cardNumberLabel: string;
  cardExpiryLabel: string;
  cardCvcLabel: string;
  payCardBtn: string;
  paySuccessMsg: string;

  // AI Tutor
  aiTutorTitle: string;
  aiTutorSubtitle: string;
  aiGreeting: string;
  aiPlaceholder: string;
  aiSendBtn: string;
  quickPrompt1: string;
  quickPrompt2: string;
  quickPrompt3: string;
  quickPrompt4: string;
}

export const defaultTranslations: Record<LanguageCode, Dictionary> = {
  es: {
    navCourses: "Cursos",
    navAbout: "Nosotros",
    navEnrollment: "Inscripción",
    navPayment: "Pago",
    navAITutor: "Tutor IA",
    navMoodleAdmin: "Admin & Sync",
    navIframe: "Iframe / LMS",
    navCMSEditor: "Editor CMS",
    adminLoginTitle: "Modo Administración RenewU",
    adminLoginDesc: "Ingresa la contraseña de administrador para gestionar Moodle y editar textos en vivo.",
    adminPasswordLabel: "Contraseña de Administrador",
    adminLoginBtn: "Acceder como Admin",
    adminLogoutBtn: "Cerrar Sesión Admin",
    adminUnlockMsg: "Modo Administración Activo. Tienes acceso a Admin & Sync, Iframe/LMS y Editor CMS.",

    heroTitle: "Certificado en Teología — Renew University",
    heroSubtitle: "Formación teológica rigurosa, accesible y 100% conectada con el aula virtual Moodle LMS (campus.renewu-iberia.com).",
    btnExploreCourses: "Explorar 12 Cursos",
    btnStartRegistration: "Iniciar Inscripción",
    coursesTitle: "Catálogo Académico de 12 Cursos",
    coursesSubtitle: "Cursos de 6 semanas diseñados para líderes eclesiales, pastores y estudiantes de teología.",
    singleCoursePrice: "Curso Individual ($59 USD)",
    fullProgramPrice: "Programa Completo ($709 USD)",
    categoryAll: "Todos",
    categoryBiblical: "Estudios Bíblicos",
    categorySystematic: "Teología Sistemática",
    categoryPractical: "Ministerio Práctico",
    categoryHistory: "Historia y Apologética",
    btnViewSyllabus: "Ver Programa Detallado",
    btnEnrollCourse: "Inscribirse a este Curso",
    modalSyllabusTitle: "Plan de Estudio Académico",
    modalCloseBtn: "Cerrar",

    aboutTitle: "Acerca de Renew University",
    aboutSubtitle: "Formando a la próxima generación de líderes y pastores con excelencia bíblica y teológica.",
    aboutMissionTitle: "Nuestra Misión",
    aboutMissionDesc: "Equipar a hombres y mujeres de fe con las herramientas teológicas, hermenéuticas y pastorales necesarias para impactar la iglesia y la sociedad moderna.",
    aboutPillarsTitle: "Pilares Académicos",
    pillar1Title: "Fidelidad Bíblica",
    pillar1Desc: "Enseñanza profundamente arraigada en las Sagradas Escrituras y la tradición ortodoxa.",
    pillar2Title: "Rigurosidad Académica",
    pillar2Desc: "Cuerpo docente universitario con doctorados y amplia trayectoria en formación teológica.",
    pillar3Title: "Integración Tecnológica Moodle",
    pillar3Desc: "Aulas virtuales de vanguardia disponibles 24/7 en campus.renewu-iberia.com.",
    pillar4Title: "Accesibilidad Global",
    pillar4Desc: "Educación accesible a $59 USD por curso o $709 por el programa completo de 12 materias.",
    aboutFaqTitle: "Preguntas Frecuentes",
    faq1Q: "¿Cómo accedo al aula virtual tras realizar el pago?",
    faq1A: "Al completar tu pago mediante Stripe, el sistema te matriculará automáticamente en Moodle (campus.renewu-iberia.com) y recibirás tus accesos al instante por correo electrónico.",
    faq2Q: "¿Recibiré un certificado al finalizar los 12 cursos?",
    faq2A: "Sí, obtendrás el Diplomas en Certificado Teológico emitido por Renew University con validez académica.",

    facultyTitle: "Cuerpo Docente y Consejeros Académicos",
    facultySubtitle: "Instructores que combinan rigurosidad teológica con compromiso pastoral.",

    formTitle: "Solicitud de Inscripción Académica",
    formSubtitle: "Completa tus datos para registrar tu expediente y sincronizar tu usuario en Moodle.",
    personalDataTitle: "Datos Personales",
    churchDataTitle: "Información Eclesial y Ministerial",
    academicDataTitle: "Experiencia Académica y Referencias",
    firstNameLabel: "Nombre(s)",
    lastNameLabel: "Apellidos",
    emailLabel: "Correo Electrónico",
    phoneLabel: "Teléfono / WhatsApp",
    churchLabel: "Iglesia Local o Comunidad",
    educationalBgLabel: "Estudios Académicos Previos",
    churchExpLabel: "Experiencia Eclesial o Liderazgo",
    ministryInvLabel: "Ministerios en los que Colaboras",
    referencesLabel: "Referencias Pastorales o Personales",
    referralSourceLabel: "¿Cómo te enteraste de RenewU?",
    btnSubmitEnrollment: "Enviar Solicitud y Proceder al Pago",

    checkoutTitle: "Pasarela de Pago Segura Stripe",
    checkoutSubtitle: "Elige tu plan de estudio y confirma tu pago para activar tu inscripción automática en Moodle.",
    selectPlanTitle: "Selecciona tu Plan de Pago",
    planSingleTitle: "Curso Individual — $59 USD",
    planSingleDesc: "Acceso inmediato al curso seleccionado por 6 semanas con tutoría y evaluación.",
    planFullTitle: "Programa Completo — $709 USD",
    planFullDesc: "Acceso ilimitado a los 12 cursos del Certificado con certificación final incluida.",
    cardNameLabel: "Nombre en la Tarjeta",
    cardNumberLabel: "Número de Tarjeta",
    cardExpiryLabel: "Fecha de Expiración (MM/AA)",
    cardCvcLabel: "Código CVC",
    payCardBtn: "Pagar con Tarjeta de Crédito / Débito",
    paySuccessMsg: "¡Pago completado con éxito! Tu usuario ha sido sincronizado con campus.renewu-iberia.com",

    aiTutorTitle: "Tutor Teológico Inteligente RenewU",
    aiTutorSubtitle: "Asistencia académica, dudas sobre cursos y acreditación Moodle impulsada por Gemini AI.",
    aiGreeting: "¡Paz y bienvenido a Renew University! Soy el Tutor Teológico Inteligente de RenewU. ¿En qué puedo ayudarte sobre la malla curricular de 12 cursos o el aula virtual Moodle?",
    aiPlaceholder: "Escribe tu consulta académica o teológica...",
    aiSendBtn: "Enviar",
    quickPrompt1: "¿Cuáles son los 12 cursos del Certificado en Teología?",
    quickPrompt2: "¿Cómo funciona la acreditación y créditos universitarios?",
    quickPrompt3: "¿Cómo se sincroniza mi inscripción con el aula Moodle?",
    quickPrompt4: "Explícame la diferencia entre Teología Sistemática y Hermenéutica",
  },
  en: {
    navCourses: "Courses",
    navAbout: "About Us",
    navEnrollment: "Enrollment",
    navPayment: "Payment",
    navAITutor: "AI Tutor",
    navMoodleAdmin: "Admin & Sync",
    navIframe: "Iframe / LMS",
    navCMSEditor: "CMS Editor",
    adminLoginTitle: "RenewU Administration Mode",
    adminLoginDesc: "Enter the administrator password to manage Moodle settings and edit live site texts.",
    adminPasswordLabel: "Administrator Password",
    adminLoginBtn: "Access as Admin",
    adminLogoutBtn: "Logout Admin",
    adminUnlockMsg: "Administrator Mode Active. You have access to Admin & Sync, Iframe/LMS, and CMS Editor.",

    heroTitle: "Certificate in Theology — Renew University",
    heroSubtitle: "Rigorous, accessible theological training, 100% connected to Moodle LMS virtual campus (campus.renewu-iberia.com).",
    btnExploreCourses: "Explore 12 Courses",
    btnStartRegistration: "Start Enrollment",
    coursesTitle: "12-Course Academic Catalog",
    coursesSubtitle: "6-week courses designed for church leaders, pastors, and theology students.",
    singleCoursePrice: "Single Course ($59 USD)",
    fullProgramPrice: "Full Program ($709 USD)",
    categoryAll: "All",
    categoryBiblical: "Biblical Studies",
    categorySystematic: "Systematic Theology",
    categoryPractical: "Practical Ministry",
    categoryHistory: "History & Apologetics",
    btnViewSyllabus: "View Detailed Syllabus",
    btnEnrollCourse: "Enroll in This Course",
    modalSyllabusTitle: "Academic Course Syllabus",
    modalCloseBtn: "Close",

    aboutTitle: "About Renew University",
    aboutSubtitle: "Equipping the next generation of leaders and pastors with biblical and theological excellence.",
    aboutMissionTitle: "Our Mission",
    aboutMissionDesc: "To equip men and women of faith with the theological, hermeneutical, and pastoral tools necessary to impact the church and modern society.",
    aboutPillarsTitle: "Academic Pillars",
    pillar1Title: "Biblical Fidelity",
    pillar1Desc: "Teaching deeply rooted in the Holy Scriptures and orthodox Christian tradition.",
    pillar2Title: "Academic Rigor",
    pillar2Desc: "University faculty holding doctorates and extensive experience in theological education.",
    pillar3Title: "Moodle Tech Integration",
    pillar3Desc: "Cutting-edge virtual classrooms accessible 24/7 at campus.renewu-iberia.com.",
    pillar4Title: "Global Accessibility",
    pillar4Desc: "Affordable education at $59 USD per course or $709 for the complete 12-subject program.",
    aboutFaqTitle: "Frequently Asked Questions",
    faq1Q: "How do I access the virtual campus after payment?",
    faq1A: "Upon completing your payment via Stripe, the system will automatically enroll you in Moodle (campus.renewu-iberia.com) and you will receive your login details via email.",
    faq2Q: "Will I receive a diploma upon completing all 12 courses?",
    faq2A: "Yes, you will earn the Certificate in Theology diploma issued by Renew University.",

    facultyTitle: "Faculty & Academic Advisors",
    facultySubtitle: "Instructors combining theological rigor with pastoral commitment.",

    formTitle: "Academic Registration Form",
    formSubtitle: "Complete your details to register your student profile and sync your Moodle account.",
    personalDataTitle: "Personal Details",
    churchDataTitle: "Church & Ministry Background",
    academicDataTitle: "Academic Experience & References",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone / WhatsApp",
    churchLabel: "Local Church or Community",
    educationalBgLabel: "Prior Academic Background",
    churchExpLabel: "Church Experience & Leadership",
    ministryInvLabel: "Current Ministry Involvement",
    referencesLabel: "Pastoral or Personal References",
    referralSourceLabel: "How did you hear about RenewU?",
    btnSubmitEnrollment: "Submit Registration & Proceed to Payment",

    checkoutTitle: "Stripe Secure Payment Gateway",
    checkoutSubtitle: "Select your payment plan and confirm your tuition to activate automatic Moodle enrollment.",
    selectPlanTitle: "Select Payment Plan",
    planSingleTitle: "Single Course — $59 USD",
    planSingleDesc: "Immediate access to selected course for 6 weeks with tutoring and grading.",
    planFullTitle: "Full Program — $709 USD",
    planFullDesc: "Unlimited access to all 12 Certificate courses with final diploma included.",
    cardNameLabel: "Name on Card",
    cardNumberLabel: "Card Number",
    cardExpiryLabel: "Expiry Date (MM/YY)",
    cardCvcLabel: "CVC Code",
    payCardBtn: "Pay with Credit / Debit Card",
    paySuccessMsg: "Payment successful! Your account has been synced with campus.renewu-iberia.com",

    aiTutorTitle: "RenewU Intelligent Theology Tutor",
    aiTutorSubtitle: "Academic support, course inquiries, and Moodle accreditation powered by Gemini AI.",
    aiGreeting: "Welcome to Renew University! I am the RenewU Intelligent Theology Tutor. How can I assist you regarding our 12-course catalog or Moodle virtual campus?",
    aiPlaceholder: "Ask your academic or theological question...",
    aiSendBtn: "Send",
    quickPrompt1: "What are the 12 courses in the Certificate in Theology?",
    quickPrompt2: "How does accreditation and college credit work?",
    quickPrompt3: "How is my registration synced with Moodle?",
    quickPrompt4: "Explain the difference between Systematic Theology and Hermeneutics",
  },
  "pt-PT": {
    navCourses: "Cursos",
    navAbout: "Sobre Nós",
    navEnrollment: "Inscrição",
    navPayment: "Propina / Pagamento",
    navAITutor: "Tutor IA",
    navMoodleAdmin: "Admin & Sync",
    navIframe: "Iframe / LMS",
    navCMSEditor: "Editor CMS",
    adminLoginTitle: "Modo de Administração RenewU",
    adminLoginDesc: "Introduza a palavra-passe de administrador para gerir o Moodle e editar textos em direto.",
    adminPasswordLabel: "Palavra-passe de Administrador",
    adminLoginBtn: "Aceder como Admin",
    adminLogoutBtn: "Terminar Sessão Admin",
    adminUnlockMsg: "Modo de Administração Ativo. Tem acesso a Admin & Sync, Iframe/LMS e Editor CMS.",

    heroTitle: "Certificado em Teologia — Renew University",
    heroSubtitle: "Formação teológica rigorosa, acessível e 100% ligada à plataforma Moodle LMS (campus.renewu-iberia.com).",
    btnExploreCourses: "Explorar 12 Cursos",
    btnStartRegistration: "Iniciar Inscrição",
    coursesTitle: "Catálogo Académico de 12 Cursos",
    coursesSubtitle: "Cursos de 6 semanas concebidos para líderes eclesiais, pastores e estudantes de teologia.",
    singleCoursePrice: "Curso Individual ($59 USD)",
    fullProgramPrice: "Programa Completo ($709 USD)",
    categoryAll: "Todos",
    categoryBiblical: "Estudos Bíblicos",
    categorySystematic: "Teologia Sistemática",
    categoryPractical: "Ministério Prático",
    categoryHistory: "História e Apologética",
    btnViewSyllabus: "Ver Programa Detalhado",
    btnEnrollCourse: "Inscrever neste Curso",
    modalSyllabusTitle: "Programa do Curso Académico",
    modalCloseBtn: "Fechar",

    aboutTitle: "Sobre a Renew University",
    aboutSubtitle: "Capacitar a próxima geração de líderes e pastores com excelência bíblica e teológica.",
    aboutMissionTitle: "A Nossa Missão",
    aboutMissionDesc: "Equipar homens e mulheres de fé com as ferramentas teológicas e pastorais necessárias para impactar a igreja e a sociedade.",
    aboutPillarsTitle: "Pilares Académicos",
    pillar1Title: "Fidelidade Bíblica",
    pillar1Desc: "Ensino profundamente enraizado nas Sagradas Escrituras e na tradição cristã.",
    pillar2Title: "Rigor Académico",
    pillar2Desc: "Corpo docente universitário com doutoramento e vasta experiência em formação teológica.",
    pillar3Title: "Integração Moodle",
    pillar3Desc: "Salas virtuais de ponta disponíveis 24 horas por dia em campus.renewu-iberia.com.",
    pillar4Title: "Acessibilidade Global",
    pillar4Desc: "Educação acessível a $59 USD por curso ou $709 pelo programa completo de 12 disciplinas.",
    aboutFaqTitle: "Perguntas Frequentes",
    faq1Q: "Como acedo à plataforma virtual após o pagamento?",
    faq1A: "Ao concluir o pagamento via Stripe, o sistema inscreve-o automaticamente no Moodle (campus.renewu-iberia.com) e receberá as credenciais por correio eletrónico.",
    faq2Q: "Receberei um diploma ao concluir os 12 cursos?",
    faq2A: "Sim, obterá o Certificado em Teologia emitido pela Renew University.",

    facultyTitle: "Corpo Docente e Conselheiros Académicos",
    facultySubtitle: "Instrutores que combinam rigor teológico com compromisso pastoral.",

    formTitle: "Ficha de Inscrição Académica",
    formSubtitle: "Preencha os seus dados para registar o seu processo e sincronizar o seu utilizador no Moodle.",
    personalDataTitle: "Dados Pessoais",
    churchDataTitle: "Informação Eclesial e Ministerial",
    academicDataTitle: "Experiência Académica e Referências",
    firstNameLabel: "Nome",
    lastNameLabel: "Apelidos",
    emailLabel: "Correio Eletrónico",
    phoneLabel: "Telefone / WhatsApp",
    churchLabel: "Igreja Local ou Comunidade",
    educationalBgLabel: "Estudos Académicos Anteriores",
    churchExpLabel: "Experiência Eclesial ou Liderança",
    ministryInvLabel: "Ministérios em que Colabora",
    referencesLabel: "Referências Pastorais ou Pessoais",
    referralSourceLabel: "Como conheceu a RenewU?",
    btnSubmitEnrollment: "Submeter Inscrição e Proceder ao Pagamento",

    checkoutTitle: "Plataforma de Pagamento Segura Stripe",
    checkoutSubtitle: "Escolha o seu plano de estudos e confirme a sua propina para ativar a inscrição automática no Moodle.",
    selectPlanTitle: "Selecione o Plano de Pagamento",
    planSingleTitle: "Curso Individual — $59 USD",
    planSingleDesc: "Acesso imediato ao curso selecionado durante 6 semanas com tutoria.",
    planFullTitle: "Programa Completo — $709 USD",
    planFullDesc: "Acesso ilimitado aos 12 cursos do Certificado com diploma incluído.",
    cardNameLabel: "Nome no Cartão",
    cardNumberLabel: "Número do Cartão",
    cardExpiryLabel: "Data de Validade (MM/AA)",
    cardCvcLabel: "Código CVC",
    payCardBtn: "Pagar com Cartão de Crédito / Débito",
    paySuccessMsg: "Pagamento concluído com sucesso! O seu utilizador foi sincronizado com campus.renewu-iberia.com",

    aiTutorTitle: "Tutor Teológico Inteligente RenewU",
    aiTutorSubtitle: "Apoio académico, dúvidas sobre cursos e acreditação Moodle com tecnologia Gemini AI.",
    aiGreeting: "Bem-vindo à Renew University! Sou o Tutor Teológico Inteligente da RenewU. Em que posso ajudar relativamente aos 12 cursos ou à plataforma Moodle?",
    aiPlaceholder: "Escreva a sua dúvida académica ou teológica...",
    aiSendBtn: "Enviar",
    quickPrompt1: "Quais são os 12 cursos do Certificado em Teologia?",
    quickPrompt2: "Como funciona a acreditação e créditos universitários?",
    quickPrompt3: "Como é sincronizada a minha inscrição com o Moodle?",
    quickPrompt4: "Explique a diferença entre Teologia Sistemática e Hermenêutica",
  },
  "pt-BR": {
    navCourses: "Cursos",
    navAbout: "Sobre Nós",
    navEnrollment: "Matrícula",
    navPayment: "Pagamento / Mensalidade",
    navAITutor: "Tutor IA",
    navMoodleAdmin: "Admin & Sync",
    navIframe: "Iframe / LMS",
    navCMSEditor: "Editor CMS",
    adminLoginTitle: "Modo de Administração RenewU",
    adminLoginDesc: "Digite a senha de administrador para gerenciar o Moodle e editar textos ao vivo.",
    adminPasswordLabel: "Senha de Administrador",
    adminLoginBtn: "Acessar como Admin",
    adminLogoutBtn: "Sair do Modo Admin",
    adminUnlockMsg: "Modo de Administração Ativo. Você tem acesso a Admin & Sync, Iframe/LMS e Editor CMS.",

    heroTitle: "Certificado em Teologia — Renew University",
    heroSubtitle: "Formação teológica rigorosa, acessível e 100% conectada à plataforma Moodle LMS (campus.renewu-iberia.com).",
    btnExploreCourses: "Explorar 12 Cursos",
    btnStartRegistration: "Iniciar Matrícula",
    coursesTitle: "Catálogo Acadêmico de 12 Cursos",
    coursesSubtitle: "Cursos de 6 semanas desenvolvidos para líderes eclesiásticos, pastores e estudantes de teologia.",
    singleCoursePrice: "Curso Individual ($59 USD)",
    fullProgramPrice: "Programa Completo ($709 USD)",
    categoryAll: "Todos",
    categoryBiblical: "Estudos Bíblicos",
    categorySystematic: "Teologia Sistemática",
    categoryPractical: "Ministério Prático",
    categoryHistory: "História e Apologética",
    btnViewSyllabus: "Ver Programa Detalhado",
    btnEnrollCourse: "Matricular-se neste Curso",
    modalSyllabusTitle: "Plano de Ensino Acadêmico",
    modalCloseBtn: "Fechar",

    aboutTitle: "Sobre a Renew University",
    aboutSubtitle: "Capacitando a próxima geração de líderes e pastores com excelência bíblica e teológica.",
    aboutMissionTitle: "Nossa Missão",
    aboutMissionDesc: "Equipar homens e mulheres de fé com as ferramentas teológicas e pastorais necessárias para impactar a igreja e a sociedade.",
    aboutPillarsTitle: "Pilares Acadêmicos",
    pillar1Title: "Fidelidade Bíblica",
    pillar1Desc: "Ensino profundamente enraizado nas Sagradas Escrituras e na tradição cristã.",
    pillar2Title: "Rigor Acadêmico",
    pillar2Desc: "Corpo docente universitário com doutorado e ampla experiência em formação teológica.",
    pillar3Title: "Integração Moodle",
    pillar3Desc: "Salas virtuais de ponta disponíveis 24h por dia em campus.renewu-iberia.com.",
    pillar4Title: "Acessibilidade Global",
    pillar4Desc: "Educação acessível por $59 USD por curso ou $709 pelo programa completo de 12 matérias.",
    aboutFaqTitle: "Perguntas Frequentes",
    faq1Q: "Como acesso o ambiente virtual após o pagamento?",
    faq1A: "Ao concluir o pagamento via Stripe, o sistema matricula você automaticamente no Moodle (campus.renewu-iberia.com) e você receberá o acesso por e-mail.",
    faq2Q: "Receberei um certificado ao concluir os 12 cursos?",
    faq2A: "Sim, você receberá o Certificado em Teologia emitido pela Renew University.",

    facultyTitle: "Corpo Docente e Conselheiros Acadêmicos",
    facultySubtitle: "Instrutores que combinam rigor teológico com compromisso pastoral.",

    formTitle: "Ficha de Matrícula Acadêmica",
    formSubtitle: "Preencha seus dados para registrar seu cadastro e sincronizar seu usuário no Moodle.",
    personalDataTitle: "Dados Pessoais",
    churchDataTitle: "Informações Eclesiásticas e Ministeriais",
    academicDataTitle: "Experiência Acadêmica e Referências",
    firstNameLabel: "Nome",
    lastNameLabel: "Sobrenome",
    emailLabel: "E-mail",
    phoneLabel: "Telefone / WhatsApp",
    churchLabel: "Igreja Local ou Comunidade",
    educationalBgLabel: "Estudos Acadêmicos Anteriores",
    churchExpLabel: "Experiência Eclesiástica ou Liderança",
    ministryInvLabel: "Ministérios em que Atua",
    referencesLabel: "Referências Pastorais ou Pessoais",
    referralSourceLabel: "Como conheceu a RenewU?",
    btnSubmitEnrollment: "Enviar Matrícula e Prosseguir ao Pagamento",

    checkoutTitle: "Gateway de Pagamento Seguro Stripe",
    checkoutSubtitle: "Escolha seu plano de estudos e confirme seu pagamento para ativar a matrícula automática no Moodle.",
    selectPlanTitle: "Selecione o Plano de Pagamento",
    planSingleTitle: "Curso Individual — $59 USD",
    planSingleDesc: "Acesso imediato ao curso selecionado por 6 semanas com tutoria.",
    planFullTitle: "Programa Completo — $709 USD",
    planFullDesc: "Acesso ilimitado aos 12 cursos do Certificado com diploma incluído.",
    cardNameLabel: "Nome no Cartão",
    cardNumberLabel: "Número do Cartão",
    cardExpiryLabel: "Data de Validade (MM/AA)",
    cardCvcLabel: "Código CVC",
    payCardBtn: "Pagar com Cartão de Crédito / Débito",
    paySuccessMsg: "Pagamento concluído com sucesso! Seu usuário foi sincronizado com campus.renewu-iberia.com",

    aiTutorTitle: "Tutor Teológico Inteligente RenewU",
    aiTutorSubtitle: "Suporte acadêmico, dúvidas sobre cursos e acreditação Moodle com inteligência Gemini AI.",
    aiGreeting: "Bem-vindo à Renew University! Sou o Tutor Teológico Inteligente da RenewU. Como posso ajudar sobre os 12 cursos ou a sala virtual Moodle?",
    aiPlaceholder: "Digite sua dúvida acadêmica ou teológica...",
    aiSendBtn: "Enviar",
    quickPrompt1: "Quais são os 12 cursos do Certificado em Teologia?",
    quickPrompt2: "Como funciona a acreditação e créditos universitários?",
    quickPrompt3: "Como minha matrícula é sincronizada com o Moodle?",
    quickPrompt4: "Explique a diferença entre Teologia Sistemática e Hermenêutica",
  },
};
