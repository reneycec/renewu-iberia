import React, { useState, useEffect } from "react";
import { Database, RefreshCw, Download, Settings, CheckCircle2, AlertCircle, ExternalLink, Key, Server, UserCheck, Shield, FileSpreadsheet, ArrowUpRight, Globe, HardDrive, BookOpen, Edit3, Save, RotateCcw, Calendar, Clock, DollarSign } from "lucide-react";
import { StudentEnrollment, MoodleConfig, Course } from "../types";
import { getStoredCourses, saveStoredCourses, resetStoredCourses } from "../data/coursesData";

export const MoodleAdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseSaveStatus, setCourseSaveStatus] = useState<string>("");

  const [config, setConfig] = useState<MoodleConfig>({
    moodleUrl: "https://moodle.renew.edu/webservice/rest/server.php",
    wsToken: "wstoken_demo_renewu_9876543210",
    autoSyncOnPayment: true,
    defaultCourseId: 101,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "courses" | "config" | "fields" | "hosting">("users");
  const [selectedUserPayload, setSelectedUserPayload] = useState<any | null>(null);

  useEffect(() => {
    setCourses(getStoredCourses());
  }, []);

  const handleSaveCourse = (updatedCourse: Course) => {
    const newCourses = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    setCourses(newCourses);
    saveStoredCourses(newCourses);
    setEditingCourse(null);
    setCourseSaveStatus(`Curso "${updatedCourse.title}" y sus fechas actualizadas exitosamente.`);
    setTimeout(() => setCourseSaveStatus(""), 4000);
  };

  const handleResetCourses = () => {
    if (window.confirm("¿Está seguro de restaurar el catálogo de cursos a sus textos y fechas predeterminadas?")) {
      const defaultData = resetStoredCourses();
      setCourses(defaultData);
      setCourseSaveStatus("Catálogo de cursos restaurado a los valores predeterminados de RenewU.");
      setTimeout(() => setCourseSaveStatus(""), 4000);
    }
  };


  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/enrollments");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/moodle/config");
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchConfig();
  }, []);

  const handleSyncToMoodle = async (studentIds?: string[]) => {
    setIsLoading(true);
    setSyncStatusMsg("");
    try {
      const res = await fetch("/api/moodle/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatusMsg(data.message);
        fetchStudents();
      }
    } catch (err: any) {
      setSyncStatusMsg(`Error al conectar con Moodle: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/moodle/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatusMsg("Configuración de Moodle guardada exitosamente.");
      }
    } catch (err: any) {
      setSyncStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="moodle-sync" className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="bg-[#1A1A19] text-white p-6 rounded-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-[#D6B858] shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#D6B858] font-bold text-xs uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Moodle REST WebService Integration Engine v2.4</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Sincronización Moodle LMS & Portal de Usuarios
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-2xl">
            Gestión en tiempo real para crear usuarios en Moodle (<code className="text-[#D6B858]">core_user_create_users</code>), inscribir en cursos teológicos y mapear campos personalizados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/moodle/export-csv"
            download
            className="bg-[#D6B858] hover:bg-[#c3a447] text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV Moodle</span>
          </a>
          <button
            onClick={() => handleSyncToMoodle()}
            disabled={isLoading}
            className="bg-white text-[#1A1A19] hover:bg-gray-100 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all border border-gray-300 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#D6B858] ${isLoading ? "animate-spin" : ""}`} />
            <span>Sincronizar Todos</span>
          </button>
        </div>
      </div>

      {syncStatusMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-lg mb-6 flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "users"
              ? "border-[#D6B858] text-[#725c00]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Estudiantes ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "courses"
              ? "border-[#D6B858] text-[#725c00]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Gestión Cursos & Fechas ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("config")}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "config"
              ? "border-[#D6B858] text-[#725c00]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>REST API Moodle</span>
        </button>

        <button
          onClick={() => setActiveTab("fields")}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "fields"
              ? "border-[#D6B858] text-[#725c00]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Mapeo Campos</span>
        </button>

        <button
          onClick={() => setActiveTab("hosting")}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "hosting"
              ? "border-[#D6B858] text-[#725c00]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Servidor & Hostinger VPS</span>
        </button>
      </div>

      {/* Tab 1: Students Table */}
      {activeTab === "users" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-bold tracking-wider">
                  <th className="p-4">Estudiante</th>
                  <th className="p-4">Usuario Moodle</th>
                  <th className="p-4">Ubicación / Iglesia</th>
                  <th className="p-4">Estado Pago</th>
                  <th className="p-4">Sincronización Moodle</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#1A1A19]">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-xs bg-gray-100 text-[#725c00] px-2.5 py-1 rounded border border-gray-200 font-bold">
                        {student.moodleUsername}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-xs font-semibold text-gray-800">{student.city}, {student.country}</div>
                      <div className="text-xs text-gray-500">{student.localChurch || "Sin especificar"}</div>
                    </td>

                    <td className="p-4">
                      {student.paymentStatus === "paid_full" ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Programa Completo ($709)
                        </span>
                      ) : student.paymentStatus === "paid_single" ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          1 Curso ($59)
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          Pendiente Pago
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {student.moodleSyncStatus === "synced" ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded w-fit inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Sincronizado (ID #{student.moodleUserId})
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1">
                            {new Date(student.moodleSyncedAt || "").toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded w-fit inline-flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Pendiente de Moodle
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUserPayload(student)}
                          className="text-xs text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded font-semibold transition-all"
                        >
                          Ver JSON
                        </button>
                        <button
                          onClick={() => handleSyncToMoodle([student.id])}
                          className="text-xs bg-[#1A1A19] hover:bg-black text-[#D6B858] font-bold px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Sync Moodle</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JSON Payload Inspector Modal */}
      {selectedUserPayload && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-gray-300">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-[#1A1A19]">
                Moodle REST API Payload: {selectedUserPayload.firstName} {selectedUserPayload.lastName}
              </h3>
              <button
                onClick={() => setSelectedUserPayload(null)}
                className="text-gray-500 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Estructura exacta que se envía a la función <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[#D6B858]">core_user_create_users</code> de Moodle:
            </p>
            <pre className="bg-[#1A1A19] text-[#D6B858] p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96">
{JSON.stringify({
  users: [{
    username: selectedUserPayload.moodleUsername,
    password: "RenewU2026!ChangeMe",
    firstname: selectedUserPayload.firstName,
    lastname: selectedUserPayload.lastName,
    email: selectedUserPayload.email,
    city: selectedUserPayload.city,
    country: selectedUserPayload.country,
    customfields: [
      { type: "church", value: selectedUserPayload.localChurch },
      { type: "faith_status", value: selectedUserPayload.isBeliever ? "Creyente" : "Buscador" },
      { type: "payment_status", value: selectedUserPayload.paymentStatus }
    ]
  }]
}, null, 2)}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUserPayload(null)}
                className="bg-[#1A1A19] text-white px-4 py-2 rounded text-sm font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Courses & Dates Editor */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#725c00] font-bold text-xs uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Administrador del Catálogo Académico</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1A1A19]">Edición de Textos, Fechas de Cohorte e IDs Moodle</h3>
              <p className="text-xs text-gray-600 mt-1">
                Modifica directamente los títulos, descripciones, fechas de inicio y cierre, catedráticos e ID de curso en Moodle. Todos los cambios se reflejan inmediatamente en el portal de la web.
              </p>
            </div>

            <button
              onClick={handleResetCourses}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Restaurar Predeterminados</span>
            </button>
          </div>

          {courseSaveStatus && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{courseSaveStatus}</span>
            </div>
          )}

          {/* Courses List Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#1A1A19] text-[#D6B858] font-bold border-b border-gray-800">
                    <th className="p-3">Código</th>
                    <th className="p-3">Título del Curso</th>
                    <th className="p-3">Moodle ID</th>
                    <th className="p-3">Inicio Clases</th>
                    <th className="p-3">Cierre Inscripción</th>
                    <th className="p-3">Catedrático</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#1A1A19]">
                        <span className="bg-amber-100 text-[#725c00] px-2 py-0.5 rounded text-xs">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[#1A1A19]">{c.title}</div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">{c.category} • {c.credits} cr.</div>
                      </td>
                      <td className="p-3 font-mono text-gray-700">
                        <span className="bg-gray-100 border border-gray-300 px-2 py-0.5 rounded font-bold">
                          #{c.moodleCourseId}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#D6B858]" />
                          <span>{c.startDate}</span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-red-700">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-red-600" />
                          <span>{c.registrationDeadline}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">{c.instructor}</td>
                      <td className="p-3 font-black text-[#1A1A19]">${c.priceSingle} USD</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setEditingCourse({ ...c })}
                          className="px-3 py-1.5 bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-bold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 border border-gray-200 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <span className="bg-[#D6B858] text-[#1A1A19] font-bold text-xs px-2.5 py-0.5 rounded uppercase mr-2">
                  {editingCourse.code}
                </span>
                <h3 className="text-xl font-black text-[#1A1A19] inline">Editar Curso y Fechas</h3>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="text-gray-400 hover:text-gray-800 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCourse(editingCourse);
              }}
              className="space-y-4 text-xs md:text-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Título del Curso</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-[#D6B858] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Categoría Teológica</label>
                  <select
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value as any })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-[#D6B858] outline-none"
                  >
                    <option value="Estudios Bíblicos">Estudios Bíblicos</option>
                    <option value="Teología Sistemática">Teología Sistemática</option>
                    <option value="Ministerio Práctico">Ministerio Práctico</option>
                    <option value="Historia y Apologética">Historia y Apologética</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Descripción del Curso</label>
                <textarea
                  rows={3}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-[#D6B858] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-bold text-[#725c00] mb-1">Fecha Inicio Clases</label>
                  <input
                    type="date"
                    value={editingCourse.startDate}
                    onChange={(e) => setEditingCourse({ ...editingCourse, startDate: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#725c00] mb-1">Fecha Fin de Curso</label>
                  <input
                    type="date"
                    value={editingCourse.endDate}
                    onChange={(e) => setEditingCourse({ ...editingCourse, endDate: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-red-800 mb-1">Cierre de Inscripción</label>
                  <input
                    type="date"
                    value={editingCourse.registrationDeadline}
                    onChange={(e) => setEditingCourse({ ...editingCourse, registrationDeadline: e.target.value })}
                    className="w-full p-2 bg-white border border-red-300 rounded-lg font-bold text-red-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Catedrático / Profesor</label>
                  <input
                    type="text"
                    value={editingCourse.instructor}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Precio Curso ($ USD)</label>
                  <input
                    type="number"
                    value={editingCourse.priceSingle}
                    onChange={(e) => setEditingCourse({ ...editingCourse, priceSingle: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">ID Curso Moodle (REST)</label>
                  <input
                    type="number"
                    value={editingCourse.moodleCourseId}
                    onChange={(e) => setEditingCourse({ ...editingCourse, moodleCourseId: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-mono font-bold text-[#D6B858] bg-[#1A1A19]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Config Settings */}
      {activeTab === "config" && (
        <form onSubmit={handleSaveConfig} className="bg-white border border-gray-200 rounded-xl p-8 max-w-3xl space-y-6 shadow-xs">
          <div className="border-b pb-3">
            <h3 className="text-lg font-bold text-[#1A1A19]">Parámetros de Conexión WebService Moodle</h3>
            <p className="text-xs text-gray-500">Configura el endpoint REST y el token de acceso generado en Administración del sitio Moodle.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                URL ENDPOINT MOODLE WEBSERVICE REST
              </label>
              <div className="relative">
                <Server className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={config.moodleUrl}
                  onChange={(e) => setConfig({ ...config, moodleUrl: e.target.value })}
                  placeholder="https://moodle.miinstitucion.edu/webservice/rest/server.php"
                  required
                  className="w-full border border-gray-300 rounded p-3 pl-10 text-sm font-mono focus:border-[#D6B858] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                TOKEN DE SERVICIO MOODLE (wstoken)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={config.wsToken}
                  onChange={(e) => setConfig({ ...config, wsToken: e.target.value })}
                  placeholder="wstoken_1234567890abcdef"
                  required
                  className="w-full border border-gray-300 rounded p-3 pl-10 text-sm font-mono focus:border-[#D6B858] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ID CURSO PREDETERMINADO EN MOODLE
                </label>
                <input
                  type="number"
                  value={config.defaultCourseId}
                  onChange={(e) => setConfig({ ...config, defaultCourseId: parseInt(e.target.value) || 101 })}
                  className="w-full border border-gray-300 rounded p-3 text-sm font-mono focus:border-[#D6B858] outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="autoSync"
                  checked={config.autoSyncOnPayment}
                  onChange={(e) => setConfig({ ...config, autoSyncOnPayment: e.target.checked })}
                  className="w-5 h-5 text-[#D6B858] rounded"
                />
                <label htmlFor="autoSync" className="text-sm font-bold text-gray-800 cursor-pointer">
                  Sincronizar automáticamente al confirmar pago
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#D6B858] hover:bg-[#c3a447] text-white font-bold text-sm px-6 py-3 rounded-lg uppercase tracking-wider transition-all"
          >
            Guardar Configuración Moodle
          </button>
        </form>
      )}

      {/* Tab 3: Custom Field Mapping */}
      {activeTab === "fields" && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-4xl space-y-6 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A19]">Mapeo de Campos de Inscripción hacia Moodle User Profile</h3>
            <p className="text-xs text-gray-500">Mapeo automático de los campos de la solicitud a la base de datos de Moodle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 border rounded-lg space-y-1">
              <span className="text-xs text-gray-400 font-mono">renewu_firstname</span>
              <p className="font-bold text-[#1A1A19]">Nombre del Estudiante → <code className="text-[#D6B858]">firstname</code></p>
            </div>
            <div className="p-4 bg-gray-50 border rounded-lg space-y-1">
              <span className="text-xs text-gray-400 font-mono">renewu_lastname</span>
              <p className="font-bold text-[#1A1A19]">Apellido → <code className="text-[#D6B858]">lastname</code></p>
            </div>
            <div className="p-4 bg-gray-50 border rounded-lg space-y-1">
              <span className="text-xs text-gray-400 font-mono">renewu_email</span>
              <p className="font-bold text-[#1A1A19]">Correo Electrónico → <code className="text-[#D6B858]">email</code></p>
            </div>
            <div className="p-4 bg-gray-50 border rounded-lg space-y-1">
              <span className="text-xs text-gray-400 font-mono">renewu_church</span>
              <p className="font-bold text-[#1A1A19]">Iglesia Local → <code className="text-[#D6B858]">customfield_church</code></p>
            </div>
            <div className="p-4 bg-gray-50 border rounded-lg space-y-1">
              <span className="text-xs text-gray-400 font-mono">renewu_references</span>
              <p className="font-bold text-[#1A1A19]">Referencias → <code className="text-[#D6B858]">customfield_references</code></p>
            </div>
            <div className="p-4 bg-gray-50 border rounded-lg space-y-1">
              <span className="text-xs text-gray-400 font-mono">renewu_payment</span>
              <p className="font-bold text-[#1A1A19]">Estado de Pago → <code className="text-[#D6B858]">customfield_payment_status</code></p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Hosting & Infrastructure Analysis */}
      {activeTab === "hosting" && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-5xl space-y-8 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-[#725c00] font-bold text-xs uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" />
              <span>Arquitectura de Despliegue y Dominios</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#1A1A19]">Guía de Servidor: Hostinger vs Ubuntu VPS + Nginx</h3>
            <p className="text-sm text-gray-600 mt-1">
              Análisis técnico sobre la mejor infraestructura para alojar el Portal de Registro (Node.js/Express) y el Campus Moodle (PHP/MySQL).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hostinger Shared Hosting */}
            <div className="border border-red-200 bg-red-50/50 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-900 text-base">Hostinger Shared Web Hosting</span>
                <span className="bg-red-200 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">NO RECOMENDADO</span>
              </div>
              <p className="text-xs text-red-800 leading-relaxed">
                El plan básico de hosting compartido de Hostinger está optimizado casi exclusivamente para PHP (WordPress/Moodle estándar).
              </p>
              <ul className="text-xs text-red-900 space-y-1.5 list-disc list-inside font-medium">
                <li>No permite ejecutar procesos en segundo plano como <code className="bg-red-100 px-1 py-0.5 rounded">node server.js</code> con PM2.</li>
                <li>Incompatible con peticiones asíncronas de la API de Gemini y Webhooks de Stripe en tiempo real.</li>
                <li>Moodle puede ponerse muy lento si hay muchos estudiantes concurrentes.</li>
              </ul>
            </div>

            {/* Ubuntu VPS + Nginx */}
            <div className="border border-emerald-300 bg-emerald-50/50 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-base">Hostinger VPS / Ubuntu + Nginx</span>
                <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">ALTAMENTE RECOMENDADO</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Un Servidor Privado Virtual (VPS en Hostinger, DigitalOcean, Hetzner o AWS) corriendo <strong>Ubuntu Linux con Nginx</strong>.
              </p>
              <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside font-medium">
                <li><strong>Nginx</strong> como Reverse Proxy redirige el tráfico web a Node.js en el puerto 3000 y a Moodle (PHP-FPM/MySQL).</li>
                <li>Soporte nativo para certificados SSL gratuitos con <strong>Certbot / Let's Encrypt</strong>.</li>
                <li>Permite correr PM2 para reinicio automático de la API de inscripciones e integración con Stripe.</li>
              </ul>
            </div>
          </div>

          {/* Domain & Subdomain Strategy */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
            <h4 className="font-bold text-base text-[#1A1A19] flex items-center gap-2">
              <Server className="w-5 h-5 text-[#D6B858]" />
              <span>Estrategia de Dominios Oficiales ({`renewu-espanol.com + .org + .online`})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="font-bold text-[#725c00] text-sm">1. Dominio Principal (Portal & Pagos)</div>
                <p className="text-gray-600">
                  <code className="bg-gray-100 text-black font-bold px-2 py-1 rounded">https://renewu-espanol.com</code>
                </p>
                <p className="text-gray-500">
                  Aquí corre la aplicación actual de inscripciones, pagos Stripe/PayPal, pasarela multi-región y tutor de IA. Los dominios <code className="font-mono">.org</code> y <code className="font-mono">.online</code> se configuran con redirección 301 CNAME hacia el <code className="font-mono">.com</code>.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="font-bold text-[#725c00] text-sm">2. Subdominio Recomendado para Moodle</div>
                <p className="text-gray-600">
                  <code className="bg-gray-100 text-black font-bold px-2 py-1 rounded">https://campus.renewu-espanol.com</code> o <code className="bg-gray-100 text-black font-bold px-2 py-1 rounded">https://moodle.renewu-espanol.com</code>
                </p>
                <p className="text-gray-500">
                  Subdominio limpio donde vive el LMS Moodle. Los usuarios pagan en el dominio principal y son redirigidos transparentemente al campus con sus credenciales ya creadas por la REST API.
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Logo Guide */}
          <div className="bg-[#1A1A19] text-white rounded-xl p-6 space-y-3 border-l-4 border-[#D6B858]">
            <h4 className="font-bold text-base text-[#D6B858]">Integración Transparente de Logos Oficiales de RenewU</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Para asegurar una experiencia 100% limpia y sin marcas visibles de Moodle antes del pago, simplemente guarda los archivos PNG/SVG originales de RenewU en la carpeta pública:
            </p>
            <div className="bg-black/50 p-3 rounded font-mono text-xs text-[#D6B858] border border-gray-800">
              /public/renewu-logo.png &nbsp;&nbsp;(Fondo transparente, resolución recomendada: 600x180 px)<br />
              /public/renewu-logo.svg &nbsp;&nbsp;(Vectorial para nitidez máxima en pantallas Retina)
            </div>
            <p className="text-xs text-gray-400">
              La cabecera (<code className="text-[#D6B858]">Header.tsx</code>) detecta automáticamente la imagen y la adapta tanto sobre fondos oscuros como claros.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
