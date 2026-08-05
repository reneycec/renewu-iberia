export type LanguageCode = "es" | "en" | "pt-PT" | "pt-BR";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
}

export interface StudentEnrollment {
  id: string;
  moodleUsername: string;
  firstName: string;
  lastName: string;
  gender: string;
  isOver18: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  localChurch: string;
  isBeliever: boolean;
  isActiveMember: boolean;
  educationalBackground: string;
  churchExperience: string;
  references: string;
  ministryInvolvement: string;
  referralSource: string;
  partnershipOptIn: "opt_in" | "opt_out";
  smsConsent: boolean;
  marketingConsent: boolean;
  submittedAt: string;
  paymentStatus: "pending" | "paid_single" | "paid_full";
  paymentPlan: "single_course" | "full_program";
  paymentAmount: number;
  currency: string;
  moodleSyncStatus: "pending" | "synced" | "error";
  moodleUserId?: number;
  moodleSyncedAt?: string;
  moodleCourseId?: number;
}

export interface MoodleConfig {
  moodleUrl: string;
  wsToken: string;
  autoSyncOnPayment: boolean;
  defaultCourseId: number;
}

export interface PaymentRequest {
  studentId?: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: "single_course" | "full_program";
  paymentMethod: "credit_card" | "paypal" | "transfer";
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  region: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface Course {
  id: string;
  moodleCourseId: number;
  code: string;
  title: string;
  category: "Estudios Bíblicos" | "Teología Sistemática" | "Ministerio Práctico" | "Historia y Apologética";
  credits: number;
  description: string;
  detailedSyllabus: string[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  instructor: string;
  priceSingle: number;
  moodleShortname: string;
  status: "activo" | "proximo" | "archivado";
  bannerBg?: string;
}

export type ViewMode = "enrollment" | "checkout" | "courses" | "about" | "moodle_admin" | "ai_tutor" | "iframe_mode" | "cms_editor";

