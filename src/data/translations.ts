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

  // Hero / Courses
  heroTitle: string;
  heroSubtitle: string;
  btnExploreCourses: string;
  btnStartRegistration: string;
  coursesTitle: string;
  coursesSubtitle: string;
  singleCoursePrice: string;
  fullProgramPrice: string;

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
  btnSubmitEnrollment: string;

  // Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  selectPlanTitle: string;
  payCardBtn: string;
  paySuccessMsg: string;

  // AI Tutor
  aiTutorTitle: string;
  aiTutorSubtitle: string;
  aiPlaceholder: string;
  aiSendBtn: string;
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
    heroSubtitle: "Formación teológica rigurosa, accesible y 100% conectada con el aula virtual Moodle LMS.",
    btnExploreCourses: "Explorar 12 Cursos",
    btnStartRegistration: "Iniciar Inscripción",
    coursesTitle: "Catálogo Académico de 12 Cursos",
    coursesSubtitle: "Cursos de 6 semanas diseñados para líderes eclesiales, pastores y estudiantes de teología.",
    singleCoursePrice: "Curso Individual ($59 USD)",
    fullProgramPrice: "Programa Completo ($709 USD)",

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
    btnSubmitEnrollment: "Enviar Solicitud y Proceder al Pago",

    checkoutTitle: "Pasarela de Pago Segura Stripe",
    checkoutSubtitle: "Elige tu plan de estudio y confirma tu pago para activar tu inscripción automática en Moodle.",
    selectPlanTitle: "Selecciona tu Plan de Pago",
    payCardBtn: "Pagar con Tarjeta de Crédito / Débito",
    paySuccessMsg: "¡Pago completado con éxito! Tu usuario ha sido sincronizado con campus.renewu-iberia.com",

    aiTutorTitle: "Tutor Teológico Inteligente RenewU",
    aiTutorSubtitle: "Asistencia académica, dudas sobre cursos y acreditación Moodle impulsada por Gemini AI.",
    aiPlaceholder: "Escribe tu consulta académica o teológica...",
    aiSendBtn: "Enviar",
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
    heroSubtitle: "Rigorous, accessible theological training, 100% connected to Moodle LMS virtual campus.",
    btnExploreCourses: "Explore 12 Courses",
    btnStartRegistration: "Start Enrollment",
    coursesTitle: "12-Course Academic Catalog",
    coursesSubtitle: "6-week courses designed for church leaders, pastors, and theology students.",
    singleCoursePrice: "Single Course ($59 USD)",
    fullProgramPrice: "Full Program ($709 USD)",

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
    btnSubmitEnrollment: "Submit Registration & Proceed to Payment",

    checkoutTitle: "Stripe Secure Payment Gateway",
    checkoutSubtitle: "Select your payment plan and confirm your tuition to activate automatic Moodle enrollment.",
    selectPlanTitle: "Select Payment Plan",
    payCardBtn: "Pay with Credit / Debit Card",
    paySuccessMsg: "Payment successful! Your account has been synced with campus.renewu-iberia.com",

    aiTutorTitle: "RenewU Intelligent Theology Tutor",
    aiTutorSubtitle: "Academic support, course inquiries, and Moodle accreditation powered by Gemini AI.",
    aiPlaceholder: "Ask your academic or theological question...",
    aiSendBtn: "Send",
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
    heroSubtitle: "Formação teológica rigorosa, acessível e 100% ligada à plataforma Moodle LMS.",
    btnExploreCourses: "Explorar 12 Cursos",
    btnStartRegistration: "Iniciar Inscrição",
    coursesTitle: "Catálogo Académico de 12 Cursos",
    coursesSubtitle: "Cursos de 6 semanas concebidos para líderes eclesiais, pastores e estudantes de teologia.",
    singleCoursePrice: "Curso Individual ($59 USD)",
    fullProgramPrice: "Programa Completo ($709 USD)",

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
    btnSubmitEnrollment: "Submeter Inscrição e Proceder ao Pagamento",

    checkoutTitle: "Plataforma de Pagamento Segura Stripe",
    checkoutSubtitle: "Escolha o seu plano de estudos e confirme a sua propina para ativar a inscrição automática no Moodle.",
    selectPlanTitle: "Selecione o Plano de Pagamento",
    payCardBtn: "Pagar com Cartão de Crédito / Débito",
    paySuccessMsg: "Pagamento concluído com sucesso! O seu utilizador foi sincronizado com campus.renewu-iberia.com",

    aiTutorTitle: "Tutor Teológico Inteligente RenewU",
    aiTutorSubtitle: "Apoio académico, dúvidas sobre cursos e acreditação Moodle com tecnologia Gemini AI.",
    aiPlaceholder: "Escreva a sua dúvida académica ou teológica...",
    aiSendBtn: "Enviar",
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
    heroSubtitle: "Formação teológica rigorosa, acessível e 100% conectada à plataforma Moodle LMS.",
    btnExploreCourses: "Explorar 12 Cursos",
    btnStartRegistration: "Iniciar Matrícula",
    coursesTitle: "Catálogo Acadêmico de 12 Cursos",
    coursesSubtitle: "Cursos de 6 semanas desenvolvidos para líderes eclesiásticos, pastores e estudantes de teologia.",
    singleCoursePrice: "Curso Individual ($59 USD)",
    fullProgramPrice: "Programa Completo ($709 USD)",

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
    btnSubmitEnrollment: "Enviar Matrícula e Prosseguir ao Pagamento",

    checkoutTitle: "Gateway de Pagamento Seguro Stripe",
    checkoutSubtitle: "Escolha seu plano de estudos e confirme seu pagamento para ativar a matrícula automática no Moodle.",
    selectPlanTitle: "Selecione o Plano de Pagamento",
    payCardBtn: "Pagar com Cartão de Crédito / Débito",
    paySuccessMsg: "Pagamento concluído com sucesso! Seu usuário foi sincronizado com campus.renewu-iberia.com",

    aiTutorTitle: "Tutor Teológico Inteligente RenewU",
    aiTutorSubtitle: "Suporte acadêmico, dúvidas sobre cursos e acreditação Moodle com inteligência Gemini AI.",
    aiPlaceholder: "Digite sua dúvida acadêmica ou teológica...",
    aiSendBtn: "Enviar",
  },
};
