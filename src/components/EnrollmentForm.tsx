import React, { useState } from "react";
import { User, Church, School, Mail, MapPin, Phone, CheckCircle2, Sparkles, Send } from "lucide-react";
import { StudentEnrollment } from "../types";
import { Dictionary } from "../data/translations";

interface EnrollmentFormProps {
  onSubmitSuccess: (student: StudentEnrollment) => void;
  t: Dictionary;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSubmitSuccess, t }) => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    isOver18: "yes",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "España",
    postalCode: "",
    localChurch: "",
    isBeliever: true,
    isActiveMember: true,
    educationalBackground: "",
    churchExperience: "",
    references: "",
    ministryInvolvement: "",
    referralSource: "",
    partnershipOptIn: "opt_in",
    smsConsent: true,
    marketingConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAutofillDemo = () => {
    setFormData({
      firstName: "Gabriel",
      lastName: "Ríos",
      gender: "m",
      isOver18: "yes",
      email: "gabriel.rios@ejemplo.com",
      phone: "+34 654 321 098",
      address: "Paseo de la Castellana 120",
      city: "Madrid",
      state: "Madrid",
      country: "España",
      postalCode: "28046",
      localChurch: "Iglesia Esperanza Viva Madrid",
      isBeliever: true,
      isActiveMember: true,
      educationalBackground: "Grado en Filosofía y Literatura, Universidad de Barcelona.",
      churchExperience: "Líder de grupo de jóvenes por 4 años, colaborador en escuela dominical y equipo de alabanza.",
      references: "Pastor Samuel Fernández (samuel@esperanzaviva.org), Hno. Roberto Silva (+34 600 111 222, Diácono).",
      ministryInvolvement: "Servicio activo en el ministerio de discipulado de adultos jóvenes y coordinación de misiones locales.",
      referralSource: "Recomendado por un graduado de Renew University",
      partnershipOptIn: "opt_in",
      smsConsent: true,
      marketingConsent: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMsg("Por favor complete los campos obligatorios (*)");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (resData.success) {
        onSubmitSuccess(resData.student);
      } else {
        setErrorMsg(resData.error || "Error al registrar la solicitud.");
      }
    } catch (err: any) {
      console.error(err);
      // Fallback local creation if offline
      const mockStudent: StudentEnrollment = {
        id: `enr-${Date.now().toString().slice(-6)}`,
        moodleUsername: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}${Math.floor(Math.random() * 89 + 10)}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        isOver18: formData.isOver18,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        localChurch: formData.localChurch,
        isBeliever: formData.isBeliever,
        isActiveMember: formData.isActiveMember,
        educationalBackground: formData.educationalBackground,
        churchExperience: formData.churchExperience,
        references: formData.references,
        ministryInvolvement: formData.ministryInvolvement,
        referralSource: formData.referralSource,
        partnershipOptIn: formData.partnershipOptIn as any,
        smsConsent: formData.smsConsent,
        marketingConsent: formData.marketingConsent,
        submittedAt: new Date().toISOString(),
        paymentStatus: "pending",
        paymentPlan: "full_program",
        paymentAmount: 709,
        currency: "USD",
        moodleSyncStatus: "pending",
        moodleCourseId: 101,
      };
      onSubmitSuccess(mockStudent);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner Hero */}
      <section className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#D6B858]/15 text-[#725c00] px-4 py-1.5 rounded-full font-semibold text-xs mb-3 border border-[#D6B858]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inscripciones Abiertas para el Año Académico 2026</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A19] tracking-tight mb-6">
          ¡Bienvenido al Programa de Certificado en Teología de Renew University!
        </h1>

        {/* Course Info Card (Black Banner matching image) */}
        <div className="bg-[#1A1A19] text-white p-6 md:p-8 rounded-xl text-left max-w-4xl mx-auto shadow-xl border-l-4 border-[#D6B858]">
          <h2 className="text-xl font-bold text-[#D6B858] mb-3 flex items-center justify-between">
            <span>El próximo curso comienza el 27 de julio de 2026.</span>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-xs bg-[#D6B858] hover:bg-[#c3a447] text-white px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Datos Demo</span>
            </button>
          </h2>
          <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <p>
              Hay doce cursos en el programa, cada uno de seis semanas de duración. Cada curso cuesta $59, o $709 por el programa completo. El programa de Renew University ofrece créditos universitarios acreditados en asociación con colegios y universidades.
            </p>
            <p>
              Para inscribirse, complete esta solicitud. Se le darán instrucciones sobre cómo comenzar el programa. Los pagos de la matrícula vencen al comienzo de cada nuevo curso. La matrícula incluye todas las conferencias en línea, tareas y cohorte, pero no incluye libros de texto. Será necesario el acceso a Internet.
            </p>
          </div>
        </div>
      </section>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#D6B858] rounded-xl p-6 sm:p-10 shadow-sm space-y-10">
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Section 1: Datos Personales */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#1A1A19] border-b border-gray-200 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-[#D6B858]" />
            <span>Datos Personales</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Nombre *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Apellido *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
                required
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Género
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="m">Masculino</option>
                <option value="f">Femenino</option>
                <option value="o">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                ¿Eres mayor de 18 años? (No obligatorio para inscripción)
              </label>
              <select
                name="isOver18"
                value={formData.isOver18}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none bg-white"
              >
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@email.com"
                  required
                  className="w-full border border-gray-300 rounded-md p-3 pl-10 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(000) 000-0000"
                  className="w-full border border-gray-300 rounded-md p-3 pl-10 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
              Dirección Completa
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Buscar dirección (Calle, número, piso)"
                className="w-full border border-gray-300 rounded-md p-3 pl-10 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Antecedentes Eclesiásticos */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-[#1A1A19] border-b border-gray-200 pb-3 flex items-center gap-2">
            <Church className="w-5 h-5 text-[#D6B858]" />
            <span>Antecedentes Eclesiásticos</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Ciudad *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ciudad"
                required
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Estado / Provincia *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Estado / Provincia"
                required
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                País *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none bg-white"
              >
                <option value="España">España</option>
                <option value="México">México</option>
                <option value="Colombia">Colombia</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="Perú">Perú</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Otro">Otro país</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Código Postal *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Código Postal"
                required
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                ¿A qué iglesia local asistes?
              </label>
              <input
                type="text"
                name="localChurch"
                value={formData.localChurch}
                onChange={handleChange}
                placeholder="Nombre de la congregación"
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold text-[#1A1A19]">
                ¿Eres tú? (No obligatorio para inscripción):
              </p>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isBeliever"
                  checked={formData.isBeliever}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#D6B858] border-gray-300 rounded focus:ring-[#D6B858]"
                />
                <span className="text-sm text-gray-700">Un creyente en Jesucristo</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isActiveMember"
                  checked={formData.isActiveMember}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#D6B858] border-gray-300 rounded focus:ring-[#D6B858]"
                />
                <span className="text-sm text-gray-700">Un miembro activo en una congregación local</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Formación Educativa y Experiencia */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-[#1A1A19] border-b border-gray-200 pb-3 flex items-center gap-2">
            <School className="w-5 h-5 text-[#D6B858]" />
            <span>Formación Educativa y Experiencia</span>
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Antecedentes Educativos (escuelas asistidas, títulos obtenidos, etc.):
              </label>
              <textarea
                name="educationalBackground"
                value={formData.educationalBackground}
                onChange={handleChange}
                rows={3}
                placeholder="Describe tu trayectoria académica..."
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Explique brevemente su experiencia en la iglesia, nombrando las iglesias recientes a las que ha asistido y describiendo cualquier área de servicio en la que haya participado:
              </label>
              <textarea
                name="churchExperience"
                value={formData.churchExperience}
                onChange={handleChange}
                rows={3}
                placeholder="Tu experiencia ministerial e historia de servicio..."
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Indique los nombres de dos personas de referencia a las que podamos contactar para conocerle: (Indique nombres, direcciones, correos electrónicos, números de teléfono y relación)
              </label>
              <textarea
                name="references"
                value={formData.references}
                onChange={handleChange}
                rows={3}
                placeholder="Referencia 1 y Referencia 2 (Nombre, Email, Teléfono, Relación)..."
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
                Participación en la iglesia/ministerio (nombre y ubicación de la congregación local, actividades de servicio, funciones ministeriales, etc.):
              </label>
              <textarea
                name="ministryInvolvement"
                value={formData.ministryInvolvement}
                onChange={handleChange}
                rows={3}
                placeholder="Detalles de tu servicio ministerial actual..."
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none resize-y"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Referral & Opt-in box */}
        <div className="bg-gray-50 border-l-4 border-[#D6B858] p-6 rounded-lg space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A19] mb-1.5">
              ¿Cómo te enteraste de Renew University?
            </label>
            <input
              type="text"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              placeholder="Redes sociales, un amigo, pastor, publicidad..."
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none bg-white"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-600 italic leading-relaxed">
              Como estudiante del Programa de Certificación de RenewU, puede recibir créditos universitarios y comunicaciones de nuestras universidades y colegios asociados. Esto requiere que RenewU comparta su nombre y dirección de correo electrónico con nuestras escuelas asociadas. Si desea excluirse de esta asociación con otras escuelas, haga clic en el botón de exclusión a continuación.
            </p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="partnershipOptIn"
                  value="opt_in"
                  checked={formData.partnershipOptIn === "opt_in"}
                  onChange={handleChange}
                  className="text-[#D6B858] focus:ring-[#D6B858]"
                />
                <span className="text-sm font-semibold text-gray-800">Optar por participar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="partnershipOptIn"
                  value="opt_out"
                  checked={formData.partnershipOptIn === "opt_out"}
                  onChange={handleChange}
                  className="text-[#D6B858] focus:ring-[#D6B858]"
                />
                <span className="text-sm font-semibold text-gray-800">Optar por no participar</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="smsConsent"
                checked={formData.smsConsent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-[#D6B858] border-gray-300 rounded focus:ring-[#D6B858]"
              />
              <span className="text-xs text-gray-600">
                Doy mi consentimiento para recibir notificaciones por SMS y alertas de <strong>Renew University</strong>. La frecuencia de los mensajes varía. Pueden aplicarse cargos por mensajes y datos. Envíe HELP al (615) 527-8844 para recibir ayuda. Responda STOP para cancelar la suscripción en cualquier momento.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-[#D6B858] border-gray-300 rounded focus:ring-[#D6B858]"
              />
              <span className="text-xs text-gray-600">
                Al marcar esta casilla, acepto recibir mensajes de marketing ocasionales de <strong>Renew University</strong>.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-2/3 md:w-1/2 bg-[#D6B858] hover:bg-[#c3a447] text-white text-lg font-bold py-4 rounded-lg shadow-lg active:scale-98 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Procesando Solicitud...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Enviar Solicitud</span>
              </>
            )}
          </button>

          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-[#D6B858] underline">Política de Privacidad</a>
            <span>|</span>
            <a href="#" className="hover:text-[#D6B858] underline">Términos de Servicio</a>
          </div>
        </div>

      </form>
    </div>
  );
};
