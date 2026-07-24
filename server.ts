import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client for server-side calls
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-Memory Database for Student Enrollments & Moodle Sync
interface StudentEnrollment {
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

interface MoodleConfig {
  moodleUrl: string;
  wsToken: string;
  autoSyncOnPayment: boolean;
  defaultCourseId: number;
}

let moodleConfig: MoodleConfig = {
  moodleUrl: "https://moodle.renew.edu/webservice/rest/server.php",
  wsToken: "wstoken_demo_renewu_9876543210",
  autoSyncOnPayment: true,
  defaultCourseId: 101, // Certificado en Teología - Curso 1
};

// Initial pre-loaded sample students for immediate testing in Moodle Dashboard
let studentDatabase: StudentEnrollment[] = [
  {
    id: "enr-001",
    moodleUsername: "carlos.mendoza",
    firstName: "Carlos",
    lastName: "Mendoza",
    gender: "m",
    isOver18: "yes",
    email: "carlos.mendoza@ejemplo.com",
    phone: "+34 612 345 678",
    address: "Calle Mayor 12",
    city: "Madrid",
    state: "Madrid",
    country: "España",
    postalCode: "28001",
    localChurch: "Iglesia Gracia y Vida Madrid",
    isBeliever: true,
    isActiveMember: true,
    educationalBackground: "Licenciatura en Historia, Universidad Complutense",
    churchExperience: "5 años colaborando en el ministerio de jóvenes y liderazgo de grupo pequeño.",
    references: "Pastor Juan López (juan@graciayvida.org), Pedro Sánchez (pedro@ejemplo.com)",
    ministryInvolvement: "Líder de discipulado y maestro de escuela dominical.",
    referralSource: "Recomendación de mi pastor local",
    partnershipOptIn: "opt_in",
    smsConsent: true,
    marketingConsent: true,
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    paymentStatus: "paid_full",
    paymentPlan: "full_program",
    paymentAmount: 709,
    currency: "USD",
    moodleSyncStatus: "synced",
    moodleUserId: 1042,
    moodleSyncedAt: new Date(Date.now() - 86400000).toISOString(),
    moodleCourseId: 101,
  },
  {
    id: "enr-002",
    moodleUsername: "maria.torres",
    firstName: "María",
    lastName: "Torres",
    gender: "f",
    isOver18: "yes",
    email: "maria.torres@ejemplo.com",
    phone: "+52 55 9876 5432",
    address: "Av. Insurgentes Sur 450",
    city: "Ciudad de México",
    state: "CDMX",
    country: "México",
    postalCode: "03100",
    localChurch: "Comunidad Fe y Esperanza",
    isBeliever: true,
    isActiveMember: true,
    educationalBackground: "Pedagogía, UNAM",
    churchExperience: "3 años en el equipo de alabanza y coordinación de eventos.",
    references: "Dra. Ana Gómez (ana@feyesperanza.mx), Sofía Ruiz (sofia@ejemplo.com)",
    ministryInvolvement: "Coordinación del ministerio infantil y formación cristiana.",
    referralSource: "Redes sociales de RenewU",
    partnershipOptIn: "opt_in",
    smsConsent: true,
    marketingConsent: false,
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    paymentStatus: "paid_single",
    paymentPlan: "single_course",
    paymentAmount: 59,
    currency: "USD",
    moodleSyncStatus: "pending",
    moodleCourseId: 101,
  }
];

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET Enrollments
app.get("/api/enrollments", (_req: Request, res: Response) => {
  res.json({
    success: true,
    students: studentDatabase,
    count: studentDatabase.length,
  });
});

// POST Submit New Enrollment
app.post("/api/enrollment", (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Generate Moodle-compatible username (slugified firstname.lastname)
    const rawUsername = `${data.firstName || 'estudiante'}.${data.lastName || 'renewu'}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9.]/g, "");
    
    const uniqueId = `enr-${Date.now().toString().slice(-6)}`;
    const moodleUsername = `${rawUsername}${Math.floor(Math.random() * 90 + 10)}`;

    const newStudent: StudentEnrollment = {
      id: uniqueId,
      moodleUsername,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      gender: data.gender || "",
      isOver18: data.isOver18 || "yes",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      country: data.country || "",
      postalCode: data.postalCode || "",
      localChurch: data.localChurch || "",
      isBeliever: !!data.isBeliever,
      isActiveMember: !!data.isActiveMember,
      educationalBackground: data.educationalBackground || "",
      churchExperience: data.churchExperience || "",
      references: data.references || "",
      ministryInvolvement: data.ministryInvolvement || "",
      referralSource: data.referralSource || "",
      partnershipOptIn: data.partnershipOptIn === "opt_out" ? "opt_out" : "opt_in",
      smsConsent: !!data.smsConsent,
      marketingConsent: !!data.marketingConsent,
      submittedAt: new Date().toISOString(),
      paymentStatus: "pending",
      paymentPlan: data.paymentPlan || "full_program",
      paymentAmount: data.paymentPlan === "single_course" ? 59 : 709,
      currency: "USD",
      moodleSyncStatus: "pending",
      moodleCourseId: moodleConfig.defaultCourseId,
    };

    studentDatabase.unshift(newStudent);

    res.status(201).json({
      success: true,
      message: "Solicitud registrada con éxito",
      student: newStudent,
      redirectUrl: `/checkout?id=${newStudent.id}`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Payment Checkout (Stripe Multi-Region Simulation)
app.post("/api/payment/checkout", (req: Request, res: Response) => {
  try {
    const { studentId, plan, paymentMethod, cardDetails, region } = req.body;
    
    const student = studentDatabase.find(s => s.id === studentId || s.email === req.body.email);
    
    const targetStudent = student || studentDatabase[0];
    if (targetStudent) {
      targetStudent.paymentPlan = plan === "single_course" ? "single_course" : "full_program";
      targetStudent.paymentAmount = plan === "single_course" ? 59 : 709;
      targetStudent.paymentStatus = plan === "single_course" ? "paid_single" : "paid_full";
      
      // Auto Sync with Moodle if enabled
      if (moodleConfig.autoSyncOnPayment && targetStudent.moodleSyncStatus !== "synced") {
        targetStudent.moodleSyncStatus = "synced";
        targetStudent.moodleUserId = Math.floor(1000 + Math.random() * 9000);
        targetStudent.moodleSyncedAt = new Date().toISOString();
      }
    }

    // Return realistic Stripe Charge / Moodle Enrolment Payload
    res.json({
      success: true,
      transactionId: `ch_stripe_${Math.random().toString(36).substring(2, 12)}`,
      receiptNumber: `INV-RENEWU-${Math.floor(10000 + Math.random() * 90000)}`,
      amountPaid: plan === "single_course" ? 59 : 709,
      currency: "USD",
      regionDetected: region || "España / Europa",
      paymentMethodUsed: paymentMethod || "credit_card",
      student: targetStudent,
      moodleSync: {
        status: targetStudent?.moodleSyncStatus,
        moodleUserId: targetStudent?.moodleUserId,
        moodleUsername: targetStudent?.moodleUsername,
        enrolledCourse: "Certificado en Teología - RenewU (6 Semanas)",
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Trigger Moodle REST API Sync (`core_user_create_users` simulation)
app.post("/api/moodle/sync", (req: Request, res: Response) => {
  try {
    const { studentIds } = req.body;
    
    const syncedResults: any[] = [];
    
    studentDatabase.forEach((student) => {
      if (!studentIds || studentIds.includes(student.id)) {
        student.moodleSyncStatus = "synced";
        if (!student.moodleUserId) {
          student.moodleUserId = Math.floor(1000 + Math.random() * 9000);
        }
        student.moodleSyncedAt = new Date().toISOString();
        
        syncedResults.push({
          id: student.moodleUserId,
          username: student.moodleUsername,
          email: student.email,
          firstname: student.firstName,
          lastname: student.lastName,
          moodleCourseEnrolled: student.moodleCourseId,
          customfields: [
            { type: "church", value: student.localChurch },
            { type: "ministry", value: student.ministryInvolvement },
            { type: "payment_status", value: student.paymentStatus }
          ]
        });
      }
    });

    res.json({
      success: true,
      message: `${syncedResults.length} usuario(s) sincronizado(s) exitosamente con la API REST de Moodle.`,
      moodleResponse: syncedResults,
      moodleEndpoint: moodleConfig.moodleUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Download Moodle Bulk Import CSV Format
app.get("/api/moodle/export-csv", (_req: Request, res: Response) => {
  const headers = "username,password,firstname,lastname,email,city,country,course1,role1,profile_field_church,profile_field_payment\n";
  const rows = studentDatabase.map(s => {
    return [
      s.moodleUsername,
      "RenewU2026!",
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      s.email,
      `"${s.city}"`,
      `"${s.country}"`,
      s.moodleCourseId || 101,
      "student",
      `"${s.localChurch}"`,
      s.paymentStatus
    ].join(",");
  }).join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="moodle_bulk_users_renewu.csv"');
  res.send(headers + rows);
});

// GET & POST Moodle WebService Settings
app.get("/api/moodle/config", (_req: Request, res: Response) => {
  res.json({ success: true, config: moodleConfig });
});

app.post("/api/moodle/config", (req: Request, res: Response) => {
  moodleConfig = { ...moodleConfig, ...req.body };
  res.json({ success: true, config: moodleConfig, message: "Configuración de Moodle actualizada." });
});

// POST Chat with Theological AI Tutor (Gemini API Integration)
app.post("/api/llm/chat", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        reply: "Hola, soy el Tutor de IA Teológico de Renew University. (Nota: Para respuestas en vivo, configura GEMINI_API_KEY en Panel de Secretos). ¿En qué puedo ayudarte sobre el Certificado en Teología, la malla curricular o el proceso de inscripción?",
      });
    }

    const systemInstruction = `
Eres el Tutor Teológico Académico e Inteligente de Renew University (RenewU).
Respondes preguntas de los estudiantes sobre:
1. El Programa de Certificado en Teología (12 cursos, 6 semanas cada uno, $59/curso o $709 programa completo).
2. Preguntas bíblicas, hermenéutica, teología sistemática, historia de la iglesia y vida cristiana.
3. El proceso de inscripción, sincronización con el aula virtual Moodle y soporte de pagos multirregión (Stripe, PayPal, SEPA/SPEI).

Tu tono es cálido, respetuoso, erudito pero accesible, y alentador.
Responde siempre en idioma Español con excelente formato en Markdown.
    `;

    const chatHistoryParts = conversationHistory.map((h: any) => `${h.sender === "user" ? "Estudiante" : "Tutor RenewU"}: ${h.text}`).join("\n");
    const fullPrompt = `${chatHistoryParts}\nEstudiante: ${message}\nTutor RenewU:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      reply: response.text || "Ha ocurrido una pausa en la respuesta. ¿Puedo ayudarte con otra pregunta sobre el programa?",
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      reply: "Disculpa, hubo un inconveniente al conectar con el asistente de IA teológico. Por favor intenta de nuevo.",
    });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RenewU Applet running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
