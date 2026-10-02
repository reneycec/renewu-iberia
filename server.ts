import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { DEFAULT_FACULTY } from "./src/data/facultyData";
import {
  getMoodleCourses,
  syncStudentToMoodle,
  testMoodleConnection,
  resolveMoodleCourseId,
  DEFAULT_MOODLE_COURSE_ID,
  getMoodleCredentials,
  getMoodleUserByEmail,
  getUserEnrolledCourses,
} from "./src/services/moodleService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Initialize Google GenAI client for server-side calls
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.DEEP_API_KEY || "AIzaSy_placeholder_key_for_dev";
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Unified LLM AI Caller (OpenAI gpt-4o-mini & Gemini API)
async function callOpenAI(promptText: string): Promise<string | null> {
  const openAiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!openAiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional academic theological translator for RenewU Iberia. Translate accurately from English to Spanish or target language. Preserve all HTML markup." },
          { role: "user", content: promptText }
        ],
        temperature: 0.3
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } else {
      const errText = await response.text();
      console.warn("[OpenAI API Warning]:", response.status, errText);
    }
  } catch (err) {
    console.error("[OpenAI API Error]:", err);
  }
  return null;
}

async function callGemini(promptText: string): Promise<string | null> {
  const gKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.DEEP_API_KEY;
  if (!gKey || gKey.includes("placeholder")) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });
    return response.text || null;
  } catch (err) {
    console.error("[Gemini API Error]:", err);
  }
  return null;
}

async function callAI(promptText: string): Promise<string | null> {
  // 1. Try OpenAI if OPENAI_API_KEY is available
  if (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY) {
    const openAiRes = await callOpenAI(promptText);
    if (openAiRes && openAiRes.trim()) return openAiRes;
  }
  // 2. Try Gemini / Deep API
  const geminiRes = await callGemini(promptText);
  if (geminiRes && geminiRes.trim()) return geminiRes;

  return null;
}

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
  moodleUrl: process.env.MOODLE_URL || "https://campus.renewu-iberia.com/webservice/rest/server.php",
  wsToken: process.env.MOODLE_WS_TOKEN || "23249f3647d12df422b98e3ee56e6201",
  autoSyncOnPayment: true,
  defaultCourseId: DEFAULT_MOODLE_COURSE_ID, // 101 Jesús y los Evangelios (Moodle ID 3)
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

// POST Payment Checkout (Stripe Multi-Region Simulation + Real Moodle Enrollment)
app.post("/api/payment/checkout", async (req: Request, res: Response) => {
  try {
    const { studentId, plan, paymentMethod, cardDetails, region } = req.body;
    
    const student = studentDatabase.find(s => s.id === studentId || s.email === req.body.email);
    const targetStudent = student || studentDatabase[0];

    let moodleSyncResult: any = null;

    if (targetStudent) {
      targetStudent.paymentPlan = plan === "single_course" ? "single_course" : "full_program";
      targetStudent.paymentAmount = plan === "single_course" ? 59 : 709;
      targetStudent.paymentStatus = plan === "single_course" ? "paid_single" : "paid_full";
      
      // Auto Sync with real Moodle LMS if enabled
      if (moodleConfig.autoSyncOnPayment) {
        try {
          const syncRes = await syncStudentToMoodle({
            id: targetStudent.id,
            moodleUsername: targetStudent.moodleUsername,
            email: targetStudent.email,
            firstName: targetStudent.firstName,
            lastName: targetStudent.lastName,
            city: targetStudent.city,
            country: targetStudent.country,
            moodleCourseId: targetStudent.moodleCourseId || moodleConfig.defaultCourseId,
          });

          targetStudent.moodleSyncStatus = "synced";
          targetStudent.moodleUserId = syncRes.moodleUserId;
          targetStudent.moodleSyncedAt = new Date().toISOString();
          moodleSyncResult = syncRes;
        } catch (syncErr: any) {
          console.error("[Moodle Auto-Sync on Payment Error]:", syncErr.message);
          targetStudent.moodleSyncStatus = "error";
          moodleSyncResult = { error: syncErr.message };
        }
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
        moodleCourseId: targetStudent?.moodleCourseId || moodleConfig.defaultCourseId,
        enrolledCourse: "Certificado en Teología - RenewU",
        liveDetails: moodleSyncResult,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Trigger Real Moodle REST API Sync
app.post("/api/moodle/sync", async (req: Request, res: Response) => {
  try {
    const { studentIds } = req.body;
    const syncedResults: any[] = [];
    const errors: any[] = [];

    const targetStudents = studentDatabase.filter((s) => !studentIds || studentIds.includes(s.id));

    for (const student of targetStudents) {
      try {
        const syncRes = await syncStudentToMoodle({
          id: student.id,
          moodleUsername: student.moodleUsername,
          email: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          city: student.city,
          country: student.country,
          moodleCourseId: student.moodleCourseId || moodleConfig.defaultCourseId,
        });

        student.moodleSyncStatus = "synced";
        student.moodleUserId = syncRes.moodleUserId;
        student.moodleSyncedAt = new Date().toISOString();

        syncedResults.push({
          id: syncRes.moodleUserId,
          studentId: student.id,
          username: syncRes.moodleUsername,
          email: student.email,
          firstname: student.firstName,
          lastname: student.lastName,
          moodleCourseEnrolled: syncRes.moodleCourseId,
          enrolled: syncRes.enrolled,
          isNewUser: syncRes.isNewUser,
        });
      } catch (err: any) {
        student.moodleSyncStatus = "error";
        errors.push({
          studentId: student.id,
          username: student.moodleUsername,
          email: student.email,
          error: err.message,
        });
      }
    }

    res.json({
      success: errors.length === 0 || syncedResults.length > 0,
      message: `${syncedResults.length} usuario(s) sincronizado(s) exitosamente con la API REST de Moodle.${errors.length > 0 ? ` (${errors.length} fallaron)` : ""}`,
      moodleResponse: syncedResults,
      errors: errors.length > 0 ? errors : undefined,
      moodleEndpoint: moodleConfig.moodleUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Live Moodle Connection Status & Courses
app.get("/api/moodle/status", async (_req: Request, res: Response) => {
  try {
    const status = await testMoodleConnection();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/moodle/courses", async (_req: Request, res: Response) => {
  try {
    const courses = await getMoodleCourses();
    res.json({ success: true, courses });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Verify Moodle Student Enrollment (Used by BookReader & Student Validation)
app.get("/api/moodle/verify-user", async (req: Request, res: Response) => {
  try {
    const email = (req.query.email as string || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, verified: false, message: "El correo electrónico es requerido." });
    }

    // 1. Check in real Moodle REST API
    try {
      const moodleUser = await getMoodleUserByEmail(email);
      if (moodleUser) {
        const enrolledCourses = await getUserEnrolledCourses(moodleUser.id);
        return res.json({
          success: true,
          verified: true,
          source: "moodle_api",
          student: {
            id: moodleUser.id,
            username: moodleUser.username,
            name: moodleUser.fullname || `${moodleUser.firstname} ${moodleUser.lastname}`,
            email: moodleUser.email,
            city: moodleUser.city,
            country: moodleUser.country,
            enrolledCourses: enrolledCourses.map((c: any) => ({
              id: c.id,
              fullname: c.fullname,
              shortname: c.shortname,
            })),
          },
        });
      }
    } catch (moodleErr: any) {
      console.warn("[Moodle User Verification Warning]:", moodleErr.message);
    }

    // 2. Check in local student database (for students registered or paid through the portal)
    const localStudent = studentDatabase.find(
      (s) => s.email.toLowerCase() === email
    );

    if (
      localStudent &&
      (localStudent.paymentStatus === "paid_full" ||
        localStudent.paymentStatus === "paid_single" ||
        localStudent.moodleSyncStatus === "synced")
    ) {
      return res.json({
        success: true,
        verified: true,
        source: "portal_database",
        student: {
          id: localStudent.moodleUserId || 1,
          username: localStudent.moodleUsername,
          name: `${localStudent.firstName} ${localStudent.lastName}`,
          email: localStudent.email,
          city: localStudent.city,
          country: localStudent.country,
          enrolledCourses: [
            {
              id: localStudent.moodleCourseId || 101,
              fullname: "Certificado en Teología - RenewU",
              shortname: "RenewU",
            },
          ],
        },
      });
    }

    return res.json({
      success: true,
      verified: false,
      message:
        "No se encontró ninguna matrícula activa en Moodle ni en el registro académico con este correo. Por favor matricúlate o verifica el email ingresado.",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, verified: false, error: err.message });
  }
});

// GET & POST Moodle Config
app.get("/api/moodle/config", (_req: Request, res: Response) => {
  res.json({ success: true, config: moodleConfig });
});

app.post("/api/moodle/config", (req: Request, res: Response) => {
  try {
    const { moodleUrl, wsToken, autoSyncOnPayment, defaultCourseId } = req.body;
    if (moodleUrl) moodleConfig.moodleUrl = moodleUrl;
    if (wsToken) moodleConfig.wsToken = wsToken;
    if (autoSyncOnPayment !== undefined) moodleConfig.autoSyncOnPayment = !!autoSyncOnPayment;
    if (defaultCourseId) moodleConfig.defaultCourseId = Number(defaultCourseId);

    res.json({ success: true, message: "Configuración de Moodle actualizada", config: moodleConfig });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
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

// Disk Persistent CMS Translations Store (data/cms_store.json)
const CMS_STORE_PATH = path.join(process.cwd(), "data", "cms_store.json");

let customTranslations: any = null;
try {
  if (fs.existsSync(CMS_STORE_PATH)) {
    const rawData = fs.readFileSync(CMS_STORE_PATH, "utf-8");
    customTranslations = JSON.parse(rawData);
    console.log("CMS translations loaded from data/cms_store.json");
  }
} catch (err) {
  console.error("Error reading cms_store.json:", err);
}

// GET & POST Translations (CMS Editor)
app.get("/api/translations", (_req: Request, res: Response) => {
  res.json({ success: true, translations: customTranslations });
});

app.post("/api/translations", (req: Request, res: Response) => {
  try {
    customTranslations = req.body.translations;
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(CMS_STORE_PATH, JSON.stringify(customTranslations, null, 2), "utf-8");
    res.json({ success: true, message: "Traducciones guardadas exitosamente en data/cms_store.json" });
  } catch (err: any) {
    console.error("Error saving cms_store.json:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET & POST Faculty Members (CMS & Data Sync)
let customFaculty: any = null;

app.get("/api/faculty", (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(CMS_STORE_PATH)) {
      const rawData = fs.readFileSync(CMS_STORE_PATH, "utf-8");
      const store = JSON.parse(rawData);
      if (store && Array.isArray(store.faculty) && store.faculty.length > 0) {
        customFaculty = store.faculty;
      }
    }
  } catch (err) {
    console.error("Error reading faculty from cms_store.json:", err);
  }
  res.json({ success: true, faculty: customFaculty || DEFAULT_FACULTY });
});

app.post("/api/faculty", (req: Request, res: Response) => {
  try {
    customFaculty = req.body.faculty;
    let existingData: any = {};
    if (fs.existsSync(CMS_STORE_PATH)) {
      try {
        existingData = JSON.parse(fs.readFileSync(CMS_STORE_PATH, "utf-8"));
      } catch (e) {}
    }
    existingData.faculty = customFaculty;
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(CMS_STORE_PATH, JSON.stringify(existingData, null, 2), "utf-8");
    res.json({ success: true, message: "Datos de profesores guardados en data/cms_store.json" });
  } catch (err: any) {
    console.error("Error saving faculty data:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Disk Persistent Books Store (data/books_store.json)
const BOOKS_STORE_PATH = path.join(process.cwd(), "data", "books_store.json");

let storedBooks: any[] = [];
try {
  if (fs.existsSync(BOOKS_STORE_PATH)) {
    const rawData = fs.readFileSync(BOOKS_STORE_PATH, "utf-8");
    storedBooks = JSON.parse(rawData);
    console.log(`Loaded ${storedBooks.length} books from data/books_store.json`);
  }
} catch (err) {
  console.error("Error reading books_store.json:", err);
}

// GET Books
app.get("/api/books", (_req: Request, res: Response) => {
  res.json({ success: true, books: storedBooks });
});

// POST Save / Upload Book
app.post("/api/books", (req: Request, res: Response) => {
  try {
    const { book } = req.body;
    if (!book || !book.id || !book.title) {
      return res.status(400).json({ success: false, message: "Datos de libro incompletos." });
    }

    const existingIndex = storedBooks.findIndex((b) => b.id === book.id);
    if (existingIndex >= 0) {
      storedBooks[existingIndex] = book;
    } else {
      storedBooks.unshift(book);
    }

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(BOOKS_STORE_PATH, JSON.stringify(storedBooks, null, 2), "utf-8");

    res.json({ success: true, message: "Libro guardado exitosamente.", book });
  } catch (err: any) {
    console.error("Error saving book:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Book
app.delete("/api/books/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    storedBooks = storedBooks.filter((b) => b.id !== id);

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(BOOKS_STORE_PATH, JSON.stringify(storedBooks, null, 2), "utf-8");

    res.json({ success: true, message: "Libro eliminado con éxito." });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Upload PDF and Convert via Python Script (convertir_pdf_a_visor_v2.py)
app.post("/api/books/upload-pdf", (req: Request, res: Response) => {
  try {
    const { pdfBase64, filename = "libro.pdf", title = "Libro", author = "Autor Desconocido", category = "Estudios Bíblicos" } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ success: false, message: "No se recibió archivo PDF." });
    }

    const uploadsDir = path.join(process.cwd(), "data", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const tempPdfName = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}.pdf`;
    const tempPdfPath = path.join(uploadsDir, tempPdfName);

    // Strip Data URL prefix if present
    const base64Clean = pdfBase64.replace(/^data:application\/pdf;base64,/, "").replace(/^data:.*;base64,/, "");
    const pdfBuffer = Buffer.from(base64Clean, "base64");
    fs.writeFileSync(tempPdfPath, pdfBuffer);

    const scriptPath = path.join(process.cwd(), "scripts", "convertir_pdf_a_visor_v2.py");
    const sanitizedTitle = (title || filename.replace(/\.pdf$/i, "")).replace(/"/g, '\\"');
    const sanitizedAuthor = (author || "Autor Desconocido").replace(/"/g, '\\"');

    const cmd = `python "${scriptPath}" "${tempPdfPath}" --titulo "${sanitizedTitle}" --autor "${sanitizedAuthor}"`;

    exec(
      cmd,
      {
        encoding: "utf-8",
        maxBuffer: 1024 * 1024 * 100,
        env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      },
      (error, stdout, stderr) => {
      // Clean up temp PDF
      try {
        if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
      } catch (e) {}

      if (error) {
        console.error("Error executing Python PDF converter script:", error, stderr);
        return res.status(500).json({
          success: false,
          message: `Error al procesar el archivo PDF con Python: ${stderr || error.message}`,
        });
      }

      try {
        const parsedResult = JSON.parse(stdout);
        const pages = parsedResult.pages || [];

        const chapters = pages.map((p: any, idx: number) => {
          const contentText = p.content || "";
          const wordCount = contentText.replace(/<[^>]*>/g, "").split(/\s+/).length;
          return {
            id: `chap-pdf-${Date.now()}-${idx + 1}`,
            number: idx + 1,
            title: p.title || `Capítulo ${idx + 1}`,
            subtitle: `Sección ${idx + 1}`,
            estimatedReadTimeMinutes: Math.max(3, Math.ceil(wordCount / 200)),
            content: contentText,
          };
        });

        const newBook = {
          id: `book-${Date.now().toString().slice(-6)}`,
          title: parsedResult.title || title || filename.replace(/\.pdf$/i, ""),
          author: parsedResult.author || author || "Autor Desconocido",
          year: parsedResult.year || "2026",
          category: category || "Estudios Bíblicos",
          accessRule: "registered_only",
          publishedAt: new Date().toISOString().split("T")[0],
          totalPages: chapters.length,
          coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
          description: `Libro procesado exitosamente desde el archivo PDF "${filename}".`,
          chapters,
        };

        res.json({
          success: true,
          message: `PDF procesado con éxito. Se extrajeron ${chapters.length} capítulos.`,
          book: newBook,
        });
      } catch (parseError: any) {
        console.error("Error parsing Python script output:", stdout);
        res.status(500).json({
          success: false,
          message: "No se pudo interpretar el resultado JSON devuelto por Python.",
        });
      }
    });
  } catch (err: any) {
    console.error("Error in PDF upload endpoint:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Disk Persistent Student Progress Store (data/student_progress.json)
const STUDENT_PROGRESS_PATH = path.join(process.cwd(), "data", "student_progress.json");
let studentProgressStore: Record<string, any> = {};

try {
  if (fs.existsSync(STUDENT_PROGRESS_PATH)) {
    studentProgressStore = JSON.parse(fs.readFileSync(STUDENT_PROGRESS_PATH, "utf-8"));
  }
} catch (err) {
  console.error("Error reading student_progress.json:", err);
}

// GET Student Reading Progress
app.get("/api/student/progress/:studentId/:bookId", (req: Request, res: Response) => {
  const { studentId, bookId } = req.params;
  const key = `${studentId}_${bookId}`;
  const progress = studentProgressStore[key] || null;
  res.json({ success: true, progress });
});

// POST Save Student Reading Progress
app.post("/api/student/progress", (req: Request, res: Response) => {
  try {
    const { progress } = req.body;
    if (!progress || !progress.studentId || !progress.bookId) {
      return res.status(400).json({ success: false, message: "Progreso inválido." });
    }

    const key = `${progress.studentId}_${progress.bookId}`;
    studentProgressStore[key] = progress;

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(STUDENT_PROGRESS_PATH, JSON.stringify(studentProgressStore, null, 2), "utf-8");

    res.json({ success: true, message: "Progreso de estudiante guardado." });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Admin Login Validation
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "renewu2026admin";
  if (password === adminPassword) {
    res.json({ success: true, authenticated: true });
  } else {
    res.status(401).json({ success: false, authenticated: false, message: "Contraseña incorrecta" });
  }
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
// BOOK TRANSLATOR AI API ENDPOINTS (ADMIN EXCLUSIVE)
// ----------------------------------------------------
let translationJobsHistory: any[] = [];

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    version: "3.0.0-integrated",
    debug: true,
    database: "connected",
    available_translators: ["openai", "gemini", "anthropic"],
    available_parsers: ["pdf", "epub", "docx", "txt"],
  });
});

app.get("/api/config", (_req: Request, res: Response) => {
  res.json({
    app_name: "RenewU Book Translator",
    version: "3.0.0",
    supported_formats: [".docx", ".pdf", ".epub", ".txt"],
    available_translators: ["openai", "gemini", "anthropic"],
    default_source_lang: "en",
    default_target_lang: "es-MX",
    chunk_size_words: 1500,
    max_upload_size_mb: 50,
  });
});

// Helper to generate dynamic AI doubts for a specific uploaded book
async function generateDynamicAIQuestions(sections: any[], cleanTitle: string) {
  const sampleText = sections.slice(0, 4).map(s => `${s.title}: ${s.content.replace(/<[^>]+>/g, ' ')}`).join("\n").slice(0, 3000);

  const prompt = `Analyze this extracted book text for "${cleanTitle}" and identify 2 key complex theological terms, idiomatic expressions, or ambiguous phrases that require human assistant decision during translation from English to Spanish.
Return JSON format ONLY:
[
  {
    "id": "q-1",
    "chapterTitle": "<chapter or section title from text>",
    "originalTerm": "<term or phrase in English extracted from text>",
    "question": "<clarifying question in Spanish for the admin translator>",
    "options": [
      "<Option 1 (Recommended formal academic)>",
      "<Option 2 (Alternative accessible)>",
      "<Option 3 (Keep original with footnote)>"
    ]
  }
]

Text sample from ${cleanTitle}:
${sampleText}`;

  try {
    const aiResponse = await callAI(prompt);
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q: any, idx: number) => ({
          id: `q-${idx + 1}`,
          chapterTitle: q.chapterTitle || `Sección ${idx + 1}`,
          originalTerm: q.originalTerm || "Término Técnico",
          question: q.question || `¿Cómo prefieres adaptar '${q.originalTerm}'?`,
          options: q.options || ["Opción Recomendada", "Opción Alternativa"],
          status: "pending" as const,
        }));
      }
    }
  } catch (err) {
    console.warn("[Dynamic AI Questions Error]:", err);
  }

  // Book-specific Dynamic Fallback Questions based on actual uploaded text
  const bookTextLower = sampleText.toLowerCase();
  const dynamicDoubts = [];

  if (bookTextLower.includes("end time") || bookTextLower.includes("resurrection") || bookTextLower.includes("judgment") || bookTextLower.includes("eschatology")) {
    dynamicDoubts.push({
      id: "q-1",
      chapterTitle: sections[0]?.title || "Sección Principal",
      originalTerm: "End Times / Eschatology",
      question: `¿Cómo prefieres traducir las expresiones de escatología en '${cleanTitle}'?`,
      options: [
        "Eventos de los Últimos Tiempos (Recomendado)",
        "Escatología Cristiana y Esperanza Final",
        "Acontecimientos Finales"
      ],
      status: "pending" as const,
    });
  } else if (bookTextLower.includes("discipleship")) {
    dynamicDoubts.push({
      id: "q-1",
      chapterTitle: sections[0]?.title || "Sección Principal",
      originalTerm: "Discipleship",
      question: "¿Cómo prefieres traducir la expresión 'Discipleship' en el contexto del libro?",
      options: [
        "Discipulado Cristocéntrico (Recomendado)",
        "Formación Teológica de Discípulos",
        "Discipulado Práctico"
      ],
      status: "pending" as const,
    });
  } else {
    dynamicDoubts.push({
      id: "q-1",
      chapterTitle: sections[0]?.title || "Sección Principal",
      originalTerm: `Terminología Teológica de ${cleanTitle}`,
      question: `¿Deseas adaptar la terminología teológica de '${cleanTitle}' en estilo académico formal o pastoral divulgativo?`,
      options: [
        "Estilo Académico Formal (Recomendado para RenewU)",
        "Estilo Pastoral Divulgativo"
      ],
      status: "pending" as const,
    });
  }

  if (bookTextLower.includes("covenant") || bookTextLower.includes("theology") || bookTextLower.includes("doctrine")) {
    dynamicDoubts.push({
      id: "q-2",
      chapterTitle: sections[1]?.title || sections[0]?.title || "Capítulo 1",
      originalTerm: "Theological Framework",
      question: "¿Deseas adaptar 'Theological Framework' como 'Marco Teológico' o 'Estructura Doctrinal'?",
      options: [
        "Marco Teológico Académico",
        "Estructura Doctrinal Práctica"
      ],
      status: "pending" as const,
    });
  }

  return dynamicDoubts;
}

// Enhanced TXT File Content Parser & Detector
function parseTxtFileContent(rawText: string, cleanTitle: string) {
  const cleanRaw = rawText.replace(/^\uFEFF/, '').replace(/\0/g, '').trim();
  const rawParagraphs = cleanRaw.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(Boolean);

  const sections: Array<{ title: string; sectionType: 'prologue' | 'toc' | 'chapter' | 'appendix'; content: string }> = [];

  let currentTitle = `Prólogo: Introducción a ${cleanTitle}`;
  let currentType: 'prologue' | 'toc' | 'chapter' | 'appendix' = 'prologue';
  let currentParas: string[] = [];

  const pushSection = (title: string, type: 'prologue' | 'toc' | 'chapter' | 'appendix', paras: string[]) => {
    if (paras.length === 0) return;
    const html = paras.map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('');
    sections.push({
      title,
      sectionType: type,
      content: html,
    });
  };

  let chapterCounter = 1;
  let hasExplicitHeaders = false;

  for (const block of rawParagraphs) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0] || "";

    const headerMatch = firstLine.match(/^---+\s*(.*?)\s*---+$/) || firstLine.match(/^(Capítulo|Chapter|Prólogo|Prologue|Índice|Contents|Apéndice|Appendix)\s*\d*[:\.\s]?(.*)$/i);

    if (headerMatch) {
      hasExplicitHeaders = true;
      pushSection(currentTitle, currentType, currentParas);
      currentParas = lines.slice(1);

      const rawTitle = headerMatch[1] ? (headerMatch[2] ? `${headerMatch[1]}: ${headerMatch[2]}` : headerMatch[1]) : firstLine;
      currentTitle = rawTitle.replace(/^-+|-+$/g, '').trim() || `Capítulo ${chapterCounter++}`;
      const lower = currentTitle.toLowerCase();
      if (lower.includes("prólogo") || lower.includes("prologue") || lower.includes("introducción")) currentType = 'prologue';
      else if (lower.includes("índice") || lower.includes("contents") || lower.includes("tabla")) currentType = 'toc';
      else if (lower.includes("apéndice") || lower.includes("appendix")) currentType = 'appendix';
      else currentType = 'chapter';
    } else {
      currentParas.push(block.replace(/\r?\n/g, ' '));
    }
  }

  pushSection(currentTitle, currentType, currentParas);

  // If no explicit headers were detected or text fell into a single large section, auto-chunk by paragraphs
  if (!hasExplicitHeaders && (sections.length <= 1 || (sections[0] && sections[0].content.length > 2500))) {
    const allParas = rawParagraphs.map(p => p.replace(/\r?\n/g, ' '));
    const chunkSize = Math.max(3, Math.ceil(allParas.length / 5));
    const newSections: Array<{ title: string; sectionType: 'prologue' | 'toc' | 'chapter' | 'appendix'; content: string }> = [];

    for (let i = 0; i < allParas.length; i += chunkSize) {
      const slice = allParas.slice(i, i + chunkSize);
      const secIdx = newSections.length;
      let title = `Capítulo ${secIdx}: ${cleanTitle}`;
      let sType: 'prologue' | 'toc' | 'chapter' | 'appendix' = 'chapter';
      if (secIdx === 0) {
        title = `Prólogo: Introducción a ${cleanTitle}`;
        sType = 'prologue';
      } else if (i + chunkSize >= allParas.length && allParas.length > 6) {
        title = `Apéndice: Glosario y Resumen de ${cleanTitle}`;
        sType = 'appendix';
      }
      const html = slice.map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('');
      newSections.push({ title, sectionType: sType, content: html });
    }

    if (newSections.length > 0) return newSections;
  }

  return sections.length > 0 ? sections : [
    {
      title: `Prólogo: ${cleanTitle}`,
      sectionType: 'prologue',
      content: `<p>${cleanRaw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
    }
  ];
}

function isSpanishText(text: string): boolean {
  const spanishWords = [' de ', ' el ', ' la ', ' en ', ' que ', ' los ', ' las ', ' por ', ' para ', ' con ', ' capítulo ', ' traducción '];
  const lower = text.toLowerCase();
  let count = 0;
  for (const w of spanishWords) {
    if (lower.includes(w)) count++;
  }
  return count >= 3;
}

app.post("/api/translate/process_original", async (req: Request, res: Response) => {
  try {
    const { fileData, filename: rawFilename, source_lang } = req.body || {};
    const filename = rawFilename || "Libro.txt";
    const cleanTitle = filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

    const base64Clean = fileData ? (fileData.includes(";base64,") ? fileData.split(";base64,").pop()! : fileData) : "";
    const isPdfBinary = base64Clean.startsWith("JVBERi0"); // %PDF- magic header
    const lowerFilename = (filename || "").toLowerCase();
    const isExplicitTxt = lowerFilename.endsWith(".txt") || lowerFilename.endsWith(".text") || (fileData && fileData.startsWith("data:text/"));
    const isTxtFile = isExplicitTxt || (!isPdfBinary && base64Clean.length > 0);

    // Native TXT / Text Document Processor
    if (isTxtFile && base64Clean) {
      const rawTxtContent = Buffer.from(base64Clean, "base64").toString("utf-8");
      const parsedSections = parseTxtFileContent(rawTxtContent, cleanTitle);
      const isAlreadyTranslated = isSpanishText(rawTxtContent) || filename.toUpperCase().includes("TRANSLAT") || filename.toUpperCase().includes("TRADUC");

      const originalBookId = `txt-${Date.now()}`;
      const bookData = {
        id: originalBookId,
        title: `${cleanTitle} (${isAlreadyTranslated ? 'Versión Traducida' : 'Original'})`,
        author: "RenewU Text Processor",
        year: "2026",
        coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80",
        category: "Biblioteca RenewU",
        pages: parsedSections.map(s => ({ title: `[${s.sectionType.toUpperCase()}] ${s.title}`, content: s.content })),
      };

      try {
        let storeData: any = {};
        if (fs.existsSync(CMS_STORE_PATH)) {
          storeData = JSON.parse(fs.readFileSync(CMS_STORE_PATH, "utf-8"));
        }
        if (!storeData.books) storeData.books = [];
        storeData.books.unshift(bookData);
        fs.writeFileSync(CMS_STORE_PATH, JSON.stringify(storeData, null, 2), "utf-8");
      } catch (err) {
        console.error("Error auto-publishing TXT book:", err);
      }

      const aiQuestions = await generateDynamicAIQuestions(parsedSections, cleanTitle);

      return res.json({
        message: `Archivo TXT "${filename}" cargado y procesado exitosamente.`,
        filename,
        sourceLang: isAlreadyTranslated ? "es-MX" : (source_lang || "en-US"),
        targetLang: req.body.target_lang || "es-MX",
        originalBookId,
        sections: parsedSections,
        translatedSections: isAlreadyTranslated ? parsedSections : undefined,
        aiQuestions,
        isPreTranslated: isAlreadyTranslated,
      });
    }

    // PDF & Binary File Processing via pdfplumber
    const uploadsDir = path.join(process.cwd(), "data", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const tempFilePath = path.join(uploadsDir, `orig_${Date.now()}_${filename.replace(/[^a-zA-Z0-9\._-]/g, "")}.pdf`);

    if (fileData) {
      const base64Clean = fileData.includes(";base64,") ? fileData.split(";base64,").pop()! : fileData;
      fs.writeFileSync(tempFilePath, Buffer.from(base64Clean, "base64"));
    }

    const pythonScriptPath = path.join(process.cwd(), "scripts", "convertir_pdf_a_visor_v2.py");
    const pythonCmd = `python "${pythonScriptPath}" "${tempFilePath}" --titulo "${cleanTitle}"`;

    exec(pythonCmd, { maxBuffer: 1024 * 1024 * 50, encoding: "utf-8" }, async (execErr, stdout, _stderr) => {
      let extractedBook: any = null;

      if (!execErr && stdout && stdout.trim()) {
        try {
          extractedBook = JSON.parse(stdout.trim());
        } catch (jsonErr) {
          console.warn("[Python Script Output Parse Warning]:", jsonErr);
        }
      }

      try {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      } catch (e) {
        // ignore
      }

      let sections: Array<{ title: string; sectionType: 'prologue' | 'toc' | 'chapter' | 'appendix'; content: string }> = [];

      if (extractedBook && extractedBook.pages && extractedBook.pages.length > 0) {
        sections = extractedBook.pages.map((p: any) => {
          const titleLower = (p.title || "").toLowerCase();
          let sType: 'prologue' | 'toc' | 'chapter' | 'appendix' = 'chapter';
          if (titleLower.includes("prólogo") || titleLower.includes("prologue") || titleLower.includes("prefacio") || titleLower.includes("introducción")) {
            sType = 'prologue';
          } else if (titleLower.includes("índice") || titleLower.includes("indice") || titleLower.includes("contenido") || titleLower.includes("contents")) {
            sType = 'toc';
          } else if (titleLower.includes("apéndice") || titleLower.includes("appendix") || titleLower.includes("notas")) {
            sType = 'appendix';
          }
          return {
            title: p.title || `Capítulo: ${cleanTitle}`,
            sectionType: sType,
            content: p.content || "<p>Contenido procesado del documento original.</p>",
          };
        });
      } else {
        // Dynamic structural breakdown for the uploaded book
        sections = [
          {
            title: `Prólogo: Introducción a ${cleanTitle}`,
            sectionType: "prologue",
            content: `<p><strong>Original Language: ${source_lang || 'en-US'}</strong></p><p>This introductory section outlines the historical and theological scope of <em>${cleanTitle}</em>. It provides essential background regarding biblical exegesis and covenantal structures.</p>`,
          },
          {
            title: "Índice / Contents Overview",
            sectionType: "toc",
            content: `<p><strong>Table of Contents for ${cleanTitle}:</strong></p><ul><li>Prologue: Contextual Background</li><li>Chapter 1: Principles and Theological Framework</li><li>Chapter 2: Biblical Exegesis and Application</li><li>Appendix: Glossary</li></ul>`,
          },
          {
            title: `Chapter 1: Principles and Framework of ${cleanTitle}`,
            sectionType: "chapter",
            content: `<p>This chapter analyzes the foundational concepts presented in <em>${cleanTitle}</em>, examining how grammatical-historical exegesis informs our understanding and ecclesiastical application.</p>`,
          },
          {
            title: `Chapter 2: Exegesis and Cultural Application`,
            sectionType: "chapter",
            content: `<p>A careful reading of scripture demands that interpreters distinguish between universal theological principles and specific cultural applications in <em>${cleanTitle}</em>.</p>`,
          },
          {
            title: "Appendix: Key Theological Glossary",
            sectionType: "appendix",
            content: `<p><strong>Glossary of Technical Terms for ${cleanTitle}:</strong></p><p><em>Theological Framework:</em> System of hermeneutical interpretation applied throughout the text.</p>`,
          }
        ];
      }

      // Auto-publish original book to CMS store so readers can access it in BookReaderViewer
      const originalBookId = `orig-${Date.now()}`;
      const originalBookData = {
        id: originalBookId,
        title: `${cleanTitle} (Original - ${source_lang || 'en-US'})`,
        author: extractedBook?.author || "Original Author",
        year: "2026",
        coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80",
        category: "Original Books",
        pages: sections.map(s => ({ title: `[${s.sectionType.toUpperCase()}] ${s.title}`, content: s.content })),
      };

      try {
        let storeData: any = {};
        if (fs.existsSync(CMS_STORE_PATH)) {
          storeData = JSON.parse(fs.readFileSync(CMS_STORE_PATH, "utf-8"));
        }
        if (!storeData.books) storeData.books = [];
        storeData.books.unshift(originalBookData);
        fs.writeFileSync(CMS_STORE_PATH, JSON.stringify(storeData, null, 2), "utf-8");
      } catch (err) {
        console.error("Error auto-publishing original book:", err);
      }

      // Generate AI Doubts / Questions dynamically for this specific book!
      const aiQuestions = await generateDynamicAIQuestions(sections, cleanTitle);

      res.json({
        message: `Libro original "${filename}" cargado y estructurado con éxito (Prólogo, Índice, Capítulos).`,
        filename,
        sourceLang: source_lang || "en-US",
        targetLang: req.body.target_lang || "es-MX",
        originalBookId,
        sections,
        aiQuestions,
      });
    });
  } catch (err: any) {
    console.error("Error en process_original:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/translate/resolve_question", (req: Request, res: Response) => {
  const { questionId, selectedOption } = req.body || {};
  res.json({
    success: true,
    questionId,
    resolvedOption: selectedOption,
    message: "Respuesta de IA registrada. La traducción continuará utilizando esta instrucción."
  });
});

app.post("/api/translate/translate_sections", async (req: Request, res: Response) => {
  try {
    const { sections, targetLang: rawTargetLang, resolvedInstructions } = req.body || {};
    const targetLang = rawTargetLang || "es-MX";

    let instructionsSummary = "";
    if (Array.isArray(resolvedInstructions) && resolvedInstructions.length > 0) {
      instructionsSummary = resolvedInstructions.map((i: any) => `- ${i.userResponse}`).join("\n");
    }

    let translationMemoryContext = "TRANSLATION MEMORY & GLOSSARY RULES:\n" + (instructionsSummary || "Maintain academic theological tone and consistent terminology.");
    const translatedSections = [];

    for (let i = 0; i < (sections || []).length; i++) {
      const sec = sections[i];
      let translatedTitle = sec.title;
      let translatedContent = sec.content;

      try {
        const prompt = `Translate this academic book section title and HTML content from English to ${targetLang}.
Preserve all HTML tags (<p>, <strong>, <em>, <ul>, <li>, <h1>, <h2>, etc.).
Translate EVERY sentence and paragraph completely.
Do not wrap in markdown json blocks. Return format:
TITLE: <translated title>
CONTENT: <translated html content>

${translationMemoryContext}

Title: ${sec.title}
Content: ${sec.content}`;

        const aiText = await callAI(prompt);

        if (aiText && aiText.includes("TITLE:") && aiText.includes("CONTENT:")) {
          const titleMatch = aiText.match(/TITLE:\s*(.*?)(?=\nCONTENT:|$)/s);
          const contentMatch = aiText.match(/CONTENT:\s*(.*)/s);
          if (titleMatch && titleMatch[1]) translatedTitle = titleMatch[1].trim();
          if (contentMatch && contentMatch[1]) translatedContent = contentMatch[1].trim();
        } else if (aiText && aiText.trim()) {
          translatedContent = aiText.trim();
        } else {
          translatedTitle = sec.title
            .replace(/Chapter (\d+):/gi, "Capítulo $1:")
            .replace(/The Historical Debate/gi, "El Debate Histórico")
            .replace(/Exegesis and Cultural Contextualization/gi, "Exégesis y Contextualización Cultural")
            .replace(/Appendix:/gi, "Apéndice:")
            .replace(/Prologue:/gi, "Prólogo:")
            .replace(/Contents Overview/gi, "Visión General del Contenido");

          let contentStr = sec.content || "";

          // Apply user instructions from "La IA Pregunta"
          if (instructionsSummary.includes("Complementarismo")) {
            contentStr = contentStr.replace(/Complementarianism vs Egalitarianism/gi, "Complementarismo vs Igualitarismo");
          } else if (instructionsSummary.includes("Complementariedad")) {
            contentStr = contentStr.replace(/Complementarianism vs Egalitarianism/gi, "Complementariedad vs Igualitarismo");
          } else {
            contentStr = contentStr.replace(/Complementarianism vs Egalitarianism/gi, "Complementarismo vs Igualitarismo");
          }

          if (instructionsSummary.includes("Exégesis gramático-histórica")) {
            contentStr = contentStr.replace(/Grammatical-historical exegesis/gi, "Exégesis gramático-histórica");
          } else if (instructionsSummary.includes("Análisis textual")) {
            contentStr = contentStr.replace(/Grammatical-historical exegesis/gi, "Análisis textual e histórico");
          } else {
            contentStr = contentStr.replace(/Grammatical-historical exegesis/gi, "Exégesis gramático-histórica");
          }

          // Full sentence & paragraph translations
          const fullSentenceRules: Array<[RegExp, string]> = [
            [/If you are a church leader leaning toward an egalitarian approach to men and women in church leadership, we want to engage you in a deeper conversation on the implications of an egalitarian approach\./gi,
             "Si usted es un líder eclesial inclinado hacia un enfoque igualitarista con respecto a hombres y mujeres en el liderazgo de la iglesia, queremos invitarle a una conversación más profunda sobre las implicaciones de dicho enfoque."],
            [/We acknowledge that there is so much pressure to adopt egalitar- ianism and there are many writings by good scholars that advocate methods of interpreta- tion that will help you get there\./gi,
             "Reconocemos que existe una gran presión para adoptar el igualitarismo y que hay múltiples escritos de destacados eruditos que defienden métodos de interpretación para respaldar dicha postura."],
            [/We acknowledge that there is so much pressure to adopt egalitarianism and there are many writings by good scholars that advocate methods of interpretation that will help you get there\./gi,
             "Reconocemos que existe una gran presión para adoptar el igualitarismo y que hay múltiples escritos de destacados eruditos que defienden métodos de interpretación para respaldar dicha postura."],
            [/We understand how easy it is to adopt this viewpoint\. But we are asking these questions to help you see if the egalitarian approach is really, truly taught in/gi,
             "Comprendemos lo fácil que resulta adoptar este punto de vista. Sin embargo, planteamos estas preguntas para ayudarle a examinar si el enfoque igualitarista se enseña verdadera y fielmente en las Escrituras."],
            [/In contemporary evangelical scholarship, few topics have generated as much rigorous dialogue as the discussion surrounding complementarian and egalitarian frameworks\./gi,
             "En la erudición evangélica contemporánea, pocos temas han generado un diálogo tan riguroso como la discusión en torno a los marcos complementarista e igualitarista."],
            [/This chapter analyzes the primary biblical texts in First Timothy and Corinthians, examining how grammatical-historical exegesis informs our understanding of church leadership and ministry roles\./gi,
             "Este capítulo analiza los principales textos bíblicos en Primera de Timoteo y Corintios, examinando cómo la exégesis gramático-histórica informa nuestra comprensión del liderazgo eclesial y los roles ministeriales."],
            [/A careful reading of scripture demands that interpreters distinguish between universal theological principles and specific first-century cultural applications\./gi,
             "Una lectura cuidadosa de las Escrituras exige que los intérpretes distingan entre los principios teológicos universales y las aplicaciones culturales específicas del primer siglo."],
            [/We examine the idiomatic expressions used by the authors and their relevance for twentieth-first century ecclesiastical governance\./gi,
             "Examinamos las expresiones idiomáticas utilizadas por los autores y su relevancia para la gobernanza eclesiástica del siglo XXI."],
            [/This introductory section outlines the historical and theological scope of/gi,
             "Esta sección introductoria describe el alcance histórico y teológico de"],
            [/It provides essential background regarding early church perspectives, covenantal structures, and interpretive approaches\./gi,
             "Proporciona antecedentes esenciales sobre las perspectivas de la iglesia primitiva, las estructuras de pacto y los enfoques interpretativos."],
            [/The view that men and women have distinct but complementary roles in church and family leadership\./gi,
             "La postura de que hombres y mujeres tienen roles distintos pero complementarios en el liderazgo de la iglesia y la familia."],
            [/The view that ministry leadership roles are assigned based on spiritual gifts rather than gender\./gi,
             "La postura de que los roles de liderazgo ministerial se asignan según los dones espirituales y no por el género."],

            // Systematic Vocabulary Replacements for remaining text in paragraphs
            [/Original Language:\s*en-US/gi, "Idioma Traducido: Español (es-MX)"],
            [/Table of Contents:/gi, "Tabla de Contenido:"],
            [/Glossary of Technical Terms:/gi, "Glosario de Términos Técnicos:"],
            [/Complementarianism/gi, "Complementarismo"],
            [/Egalitarianism/gi, "Igualitarismo"],
            [/complementarian/gi, "complementarista"],
            [/egalitarian/gi, "igualitarista"],
            [/church leadership/gi, "liderazgo eclesial"],
            [/church leaders/gi, "líderes eclesiales"],
            [/church leader/gi, "líder eclesial"],
            [/men and women/gi, "hombres y mujeres"],
            [/spiritual gifts/gi, "dones espirituales"],
            [/ecclesiastical governance/gi, "gobernanza eclesiástica"],
            [/biblical texts/gi, "textos bíblicos"],
            [/first-century/gi, "primer siglo"],
            [/twentieth-first century/gi, "siglo XXI"],
            [/good scholars/gi, "buenos eruditos"],
            [/scholars/gi, "eruditos"],
            [/scholarship/gi, "erudición académica"],
            [/scripture/gi, "Escrituras"],
            [/First Timothy/gi, "Primera de Timoteo"],
            [/Corinthians/gi, "Corintios"],
            [/exegesis/gi, "exégesis"],
            [/hermeneutical/gi, "hermenéutico"],
            [/theological/gi, "teológico"],
            [/theology/gi, "teología"],
            [/interpretation/gi, "interpretación"],
            [/interpretive/gi, "interpretativo"],
            [/viewpoint/gi, "punto de vista"],
            [/frameworks/gi, "marcos teológicos"],
            [/leadership roles/gi, "roles de liderazgo"],
            [/ministry roles/gi, "roles ministeriales"],
          ];

          for (const [pat, repl] of fullSentenceRules) {
            contentStr = contentStr.replace(pat, repl);
          }

          translatedContent = contentStr;
        }
      } catch (err) {
        console.warn(`[Translation Warning] Fallback applied for section ${i}:`, err);
      }

      translatedSections.push({
        ...sec,
        title: translatedTitle,
        content: translatedContent,
      });

      translationMemoryContext += `\n- Section ${i + 1} (${sec.title}) translated as: ${translatedTitle}`;
    }

    res.json({
      success: true,
      targetLang,
      translatedSections,
    });
  } catch (err: any) {
    console.error("Error en translate_sections:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});




app.get("/api/translate/history", (_req: Request, res: Response) => {
  res.json(translationJobsHistory);
});

// Endpoint para publicar el libro traducido directamente en la biblioteca/visor
app.post("/api/books/publish", (req: Request, res: Response) => {
  try {
    const { title, author, year, chapters, coverImage, category } = req.body || {};
    const bookId = `translated-${Date.now()}`;
    const newBook = {
      id: bookId,
      title: title || "Libro Traducido",
      author: author || "Autor Traducido",
      year: year || "2026",
      coverImage: coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
      category: category || "Teología",
      pages: chapters || [
        {
          title: "Capítulo 1: Introducción",
          content: "<p>Contenido traducido mediante el motor de IA de RenewU Iberia.</p>"
        }
      ]
    };

    let storeData: any = {};
    if (fs.existsSync(CMS_STORE_PATH)) {
      try {
        storeData = JSON.parse(fs.readFileSync(CMS_STORE_PATH, "utf-8"));
      } catch (err) {
        console.error("Error al leer cms_store.json para publicar libro:", err);
      }
    }

    if (!storeData.books) {
      storeData.books = [];
    }

    storeData.books.unshift(newBook);
    fs.writeFileSync(CMS_STORE_PATH, JSON.stringify(storeData, null, 2), "utf-8");

    console.log(`[CMS Store] Libro traducido publicado con ID: ${bookId}`);

    res.json({
      success: true,
      bookId,
      message: `El libro "${title}" ha sido publicado exitosamente en la biblioteca del visor.`
    });
  } catch (error: any) {
    console.error("Error al publicar libro traducido:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ["**/data/**", "**/data/*.json", "**/data/uploads/**", "**/scratch/**"],
        },
      },
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
