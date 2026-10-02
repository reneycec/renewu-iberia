/**
 * Moodle REST API Service for RenewU Iberia
 * Connects to campus.renewu-iberia.com (/webservice/rest/server.php)
 */

export interface MoodleCourse {
  id: number;
  shortname: string;
  fullname: string;
  displayname?: string;
  summary?: string;
  idnumber?: string;
  categoryid?: number;
}

export interface MoodleUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  department?: string;
  firstaccess?: number;
  lastaccess?: number;
  auth?: string;
  city?: string;
  country?: string;
}

export interface MoodleSyncResult {
  studentId: string;
  moodleUserId: number;
  moodleUsername: string;
  email: string;
  moodleCourseId: number;
  enrolled: boolean;
  isNewUser: boolean;
  error?: string;
}

// Exact ID mapping for courses hosted in campus.renewu-iberia.com
export const MOODLE_COURSE_MAPPING: Record<string, number> = {
  // Numeric and shortname mappings
  "101": 3,   // 101 Jesús y los Evangelios (Moodle ID 3)
  "201": 4,   // 201 Evidencias cristianas (Moodle ID 4)
  "301": 6,   // 301 La Biblia, el canon, la inspiración, la hermenéutica (Moodle ID 6)
  "401": 5,   // 401 Panorama del Antiguo Testamento (Moodle ID 5)
  "501": 7,   // 501 Hechos y el apóstol Pablo (Moodle ID 7)
  "601": 8,   // 601 La Epístola a los Romanos (Moodle ID 8)
  "701": 9,   // 701 Teología bíblica (Moodle ID 9)
  "801": 10,  // 801 La historia de la iglesia y la búsqueda de la fe bíblica (Moodle ID 10)
  "901": 11,  // 901 Ministerio y liderazgo cristianos (Moodle ID 11)
  "1001": 12, // 1001 Formación espiritual (Moodle ID 12)
  "1002": 13, // 1002 Introducción al asesoramiento en situaciones de crisis (Moodle ID 13)
  "1003": 14, // 1003 Hacer discípulos: La misión central de la Iglesia (Moodle ID 14)

  // Curriculum codes from RenewU
  "B101": 6,  // Hermenéutica -> 301
  "B102": 5,  // Panorama del Antiguo Testamento -> 401
  "S101": 9,  // Introducción a la Teología -> 701
  "M101": 11, // Liderazgo y Discipulado -> 901
  "M102": 4,  // Apologética -> 201
  "M103": 12, // Formación espiritual -> 1001
  "M1002": 13, // Asesoramiento en crisis -> 1002
  "M1003": 14, // Hacer discípulos -> 1003
};

export const DEFAULT_MOODLE_COURSE_ID = 3; // Curso 101 Jesús y los Evangelios

/**
 * Returns active Moodle REST URL and Token from environment or defaults
 */
export function getMoodleCredentials() {
  const url = process.env.MOODLE_URL || "https://campus.renewu-iberia.com/webservice/rest/server.php";
  const token = process.env.MOODLE_WS_TOKEN || "23249f3647d12df422b98e3ee56e6201";
  return { url, token };
}

/**
 * Low-level HTTP POST request to Moodle REST API
 */
export async function callMoodleWs(wsfunction: string, params: Record<string, any> = {}): Promise<any> {
  const { url, token } = getMoodleCredentials();

  const bodyParams = new URLSearchParams({
    wstoken: token,
    wsfunction: wsfunction,
    moodlewsrestformat: "json",
    ...params,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  if (!response.ok) {
    throw new Error(`Moodle HTTP Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (data && typeof data === "object" && (data.exception || data.errorcode)) {
    throw new Error(`Moodle API Exception [${data.errorcode}]: ${data.message || data.exception}`);
  }

  return data;
}

/**
 * Test live connection to Moodle
 */
export async function testMoodleConnection(): Promise<{ success: boolean; coursesCount: number; message: string }> {
  try {
    const courses = await getMoodleCourses();
    return {
      success: true,
      coursesCount: courses.length,
      message: `Conexión exitosa con campus.renewu-iberia.com. Se encontraron ${courses.length} cursos activos.`,
    };
  } catch (err: any) {
    return {
      success: false,
      coursesCount: 0,
      message: `Error al conectar con Moodle: ${err.message}`,
    };
  }
}

/**
 * Get all available courses from Moodle (excluding site root course ID 1)
 */
export async function getMoodleCourses(): Promise<MoodleCourse[]> {
  const data = await callMoodleWs("core_course_get_courses");
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .filter((c: any) => c.id !== 1) // Exclude site home
    .map((c: any) => ({
      id: c.id,
      shortname: c.shortname,
      fullname: c.fullname,
      displayname: c.displayname,
      summary: c.summary,
      idnumber: c.idnumber,
      categoryid: c.categoryid,
    }));
}

/**
 * Find user by email in Moodle
 */
export async function getMoodleUserByEmail(email: string): Promise<MoodleUser | null> {
  try {
    const users = await callMoodleWs("core_user_get_users_by_field", {
      field: "email",
      "values[0]": email.trim().toLowerCase(),
    });

    if (Array.isArray(users) && users.length > 0) {
      return users[0];
    }
    return null;
  } catch (err) {
    console.error("Error checking Moodle user by email:", err);
    return null;
  }
}

/**
 * Get courses a user is actively enrolled in
 */
export async function getUserEnrolledCourses(userId: number): Promise<any[]> {
  try {
    const courses = await callMoodleWs("core_enrol_get_users_courses", {
      userid: userId,
    });
    return Array.isArray(courses) ? courses : [];
  } catch (err) {
    console.error("Error retrieving Moodle user enrolled courses:", err);
    return [];
  }
}

/**
 * Create a new user in Moodle
 */
export async function createMoodleUser(userData: {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  city?: string;
  country?: string;
}): Promise<{ id: number; username: string; isNew: boolean }> {
  // Check if user already exists first
  const existing = await getMoodleUserByEmail(userData.email);
  if (existing) {
    return {
      id: existing.id,
      username: existing.username,
      isNew: false,
    };
  }

  // Sanitize username (lowercase, only letters, numbers, dot, underscore, dash)
  let cleanUsername = userData.username
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]/g, "");

  if (!cleanUsername) {
    cleanUsername = userData.email.split("@")[0].replace(/[^a-z0-9._-]/g, "");
  }

  // Ensure password meets standard Moodle requirements (8+ chars, upper, lower, digit, special)
  const securePassword = userData.password || "RenewU2026!*";

  const payload: Record<string, string> = {
    "users[0][username]": cleanUsername,
    "users[0][password]": securePassword,
    "users[0][firstname]": userData.firstname || "Estudiante",
    "users[0][lastname]": userData.lastname || "RenewU",
    "users[0][email]": userData.email.trim().toLowerCase(),
    "users[0][city]": userData.city || "Madrid",
    "users[0][country]": (userData.country || "ES").substring(0, 2).toUpperCase(),
    "users[0][auth]": "manual",
  };

  const response = await callMoodleWs("core_user_create_users", payload);

  if (Array.isArray(response) && response.length > 0) {
    return {
      id: response[0].id,
      username: response[0].username,
      isNew: true,
    };
  }

  throw new Error("No se pudo obtener el ID del usuario creado en Moodle");
}

/**
 * Enroll user into a Moodle Course (role 5 = student)
 */
export async function enrollMoodleUser(userId: number, courseId: number, roleId = 5): Promise<boolean> {
  const payload: Record<string, any> = {
    "enrolments[0][roleid]": roleId,
    "enrolments[0][userid]": userId,
    "enrolments[0][courseid]": courseId,
  };

  // Moodle returns null / empty object on success
  await callMoodleWs("enrol_manual_enrol_users", payload);
  return true;
}

/**
 * Resolve target Moodle Course ID from student or course code
 */
export function resolveMoodleCourseId(courseIdentifier?: string | number): number {
  if (typeof courseIdentifier === "number") {
    // If it's already one of the actual Moodle IDs (3, 4, 5, 6, 7, 8, 9, 10, 11, 12), use it directly
    const validIds = Object.values(MOODLE_COURSE_MAPPING);
    if (validIds.includes(courseIdentifier)) {
      return courseIdentifier;
    }
  }

  if (courseIdentifier) {
    const key = String(courseIdentifier).trim();
    if (MOODLE_COURSE_MAPPING[key]) {
      return MOODLE_COURSE_MAPPING[key];
    }
  }

  return DEFAULT_MOODLE_COURSE_ID;
}

/**
 * End-to-end sync for a student:
 * 1. Find or create user in Moodle
 * 2. Enroll user into designated Moodle course
 */
export async function syncStudentToMoodle(student: {
  id: string;
  moodleUsername: string;
  email: string;
  firstName: string;
  lastName: string;
  city?: string;
  country?: string;
  moodleCourseId?: number;
  courseCode?: string;
}): Promise<MoodleSyncResult> {
  const targetCourseId = resolveMoodleCourseId(student.moodleCourseId || student.courseCode);

  // 1. Create or retrieve user
  const userResult = await createMoodleUser({
    username: student.moodleUsername,
    email: student.email,
    firstname: student.firstName,
    lastname: student.lastName,
    city: student.city,
    country: student.country,
  });

  // 2. Enroll in course
  let enrolled = false;
  try {
    enrolled = await enrollMoodleUser(userResult.id, targetCourseId, 5);
  } catch (err: any) {
    console.warn(`[Moodle Enrolment Warning for user ${userResult.id} in course ${targetCourseId}]:`, err.message);
  }

  return {
    studentId: student.id,
    moodleUserId: userResult.id,
    moodleUsername: userResult.username,
    email: student.email,
    moodleCourseId: targetCourseId,
    enrolled,
    isNewUser: userResult.isNew,
  };
}
