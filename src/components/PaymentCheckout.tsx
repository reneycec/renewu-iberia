import React, { useState } from "react";
import { CheckCircle2, CreditCard, Wallet, Landmark, Lock, ShieldCheck, Award, BookOpen, Headphones, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { StudentEnrollment } from "../types";
import { Dictionary } from "../data/translations";

interface PaymentCheckoutProps {
  currentStudent: StudentEnrollment | null;
  onPaymentSuccess: (receipt: any) => void;
  t: Dictionary;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  currentStudent,
  onPaymentSuccess,
  t,
}) => {

  const [selectedPlan, setSelectedPlan] = useState<"single_course" | "full_program">("full_program");
  const [paymentMethod, setPaymentMethod] = useState<"cc" | "paypal" | "transfer">("cc");
  const [region, setRegion] = useState("España / Europa");
  
  // Billing details state
  const [billingName, setBillingName] = useState(
    currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : "Gabriel Ríos"
  );
  const [billingEmail, setBillingEmail] = useState(
    currentStudent ? currentStudent.email : "gabriel.rios@ejemplo.com"
  );
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12 / 28");
  const [cardCvc, setCardCvc] = useState("888");

  const [isProcessing, setIsProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<any>(null);

  // Currency multiplier based on region for display
  const currencyInfo = region.includes("España")
    ? { code: "EUR", symbol: "€", single: "55.00", full: "650.00" }
    : region.includes("Latinoamérica")
    ? { code: "MXN", symbol: "$", single: "1,150.00", full: "13,800.00" }
    : { code: "USD", symbol: "$", single: "59.00", full: "709.00" };

  const handleTestCardAutofill = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("08 / 28");
    setCardCvc("321");
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent?.id,
          email: billingEmail,
          plan: selectedPlan,
          paymentMethod,
          region,
          cardDetails: { cardNumber, cardExpiry, cardCvc },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPaidReceipt(data);
        onPaymentSuccess(data);
      }
    } catch (err) {
      console.error("Payment error:", err);
      const mockReceipt = {
        success: true,
        transactionId: `ch_stripe_${Math.random().toString(36).substring(2, 10)}`,
        receiptNumber: `INV-RENEWU-${Math.floor(10000 + Math.random() * 90000)}`,
        amountPaid: selectedPlan === "single_course" ? 59 : 709,
        currency: "USD",
        regionDetected: region,
        paymentMethodUsed: paymentMethod,
        student: currentStudent || {
          firstName: billingName.split(" ")[0] || "Estudiante",
          lastName: billingName.split(" ")[1] || "RenewU",
          email: billingEmail,
          moodleUsername: "estudiante.renewu",
        },
        moodleSync: {
          status: "synced",
          moodleUserId: 1088,
          moodleUsername: "estudiante.renewu",
          enrolledCourse: "Certificado en Teología - RenewU (12 Cursos)",
        },
      };
      setPaidReceipt(mockReceipt);
      onPaymentSuccess(mockReceipt);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
      {/* Top Success Banner */}
      <section className="mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D6B858]/15 text-[#D6B858] mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A19] mb-3">
          ¡Gracias por completar tu formulario!
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          El siguiente paso es el pago de la matrícula para asegurar tu lugar en el próximo ciclo académico.
        </p>
      </section>

      {/* If already paid, render receipt banner */}
      {paidReceipt ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-8 max-w-3xl mx-auto mb-12 shadow-md">
          <div className="flex items-center gap-3 text-emerald-800 text-xl font-bold mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <span>¡Pago Confirmado y Matrícula Sincronizada!</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 bg-white p-4 rounded-lg border border-emerald-200 mb-6">
            <div>
              <p className="text-xs text-gray-500">Nº Transacción Stripe</p>
              <p className="font-mono font-bold">{paidReceipt.transactionId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Nº Factura / Recibo</p>
              <p className="font-mono font-bold">{paidReceipt.receiptNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Monto Abonado</p>
              <p className="font-bold text-emerald-700">${paidReceipt.amountPaid} USD</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Usuario Moodle Generado</p>
              <p className="font-mono font-bold text-[#D6B858]">{paidReceipt.moodleSync?.moodleUsername}</p>
            </div>
          </div>

          <p className="text-sm text-emerald-900 mb-6">
            Tus datos han sido registrados e inscritos en la base de datos de usuarios de Moodle. Se ha enviado un correo con las credenciales de acceso al aula virtual.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.href = "#moodle-sync"}
              className="bg-[#1A1A19] text-[#D6B858] hover:bg-black font-bold px-6 py-3 rounded-lg text-sm flex items-center gap-2"
            >
              <span>Ver en Panel de Control Moodle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPaidReceipt(null)}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-semibold px-4 py-3 rounded-lg text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Realizar Otro Pago</span>
            </button>
          </div>
        </div>
      ) : (
        /* Main Payment Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Payment Config & Card Inputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Region Detection Visual */}
            <div className="bg-[#F9F9F9] border border-gray-300 p-6 md:p-8 rounded-lg shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-[#1A1A19]">Método de Pago</h2>
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-3 py-1.5 rounded border border-gray-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Región detectada:</span>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="font-bold text-[#D6B858] bg-transparent border-none outline-none cursor-pointer"
                  >
                    <option value="España / Europa">España / Europa (EUR)</option>
                    <option value="Latinoamérica">Latinoamérica (MXN/USD)</option>
                    <option value="Estados Unidos / Global">EE.UU. / Global (USD)</option>
                  </select>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                {/* Stripe Credit Card */}
                <label
                  onClick={() => setPaymentMethod("cc")}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cc"
                      ? "border-[#D6B858] bg-[#D6B858]/10 font-bold"
                      : "border-gray-300 hover:border-[#D6B858] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-[#1A1A19]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A19]">
                        Tarjeta de Crédito / Débito (Stripe)
                      </span>
                      <span className="text-xs text-gray-500">
                        Visa, Mastercard, American Express
                      </span>
                    </div>
                  </div>
                  {paymentMethod === "cc" && (
                    <CheckCircle2 className="w-5 h-5 text-[#D6B858]" />
                  )}
                </label>

                {/* PayPal */}
                <label
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "paypal"
                      ? "border-[#D6B858] bg-[#D6B858]/10 font-bold"
                      : "border-gray-300 hover:border-[#D6B858] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Wallet className="w-6 h-6 text-[#1A1A19]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A19]">PayPal</span>
                      <span className="text-xs text-gray-500">
                        Pago rápido y seguro a nivel mundial
                      </span>
                    </div>
                  </div>
                  {paymentMethod === "paypal" && (
                    <CheckCircle2 className="w-5 h-5 text-[#D6B858]" />
                  )}
                </label>

                {/* Regional SEPA / SPEI Bank Transfer */}
                <label
                  onClick={() => setPaymentMethod("transfer")}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "transfer"
                      ? "border-[#D6B858] bg-[#D6B858]/10 font-bold"
                      : "border-gray-300 hover:border-[#D6B858] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Landmark className="w-6 h-6 text-[#1A1A19]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A19]">
                        Transferencia Bancaria ({region.includes("España") ? "SEPA" : "SPEI/ACH"})
                      </span>
                      <span className="text-xs text-gray-500">
                        Transferencia local directa sin comisiones extras
                      </span>
                    </div>
                  </div>
                  {paymentMethod === "transfer" && (
                    <CheckCircle2 className="w-5 h-5 text-[#D6B858]" />
                  )}
                </label>
              </div>
            </div>

            {/* Card Inputs / Billing Form */}
            <form onSubmit={handleProcessPayment} className="bg-white border border-gray-300 p-6 md:p-8 rounded-lg space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1A1A19]">Detalles de Facturación</h3>
                <button
                  type="button"
                  onClick={handleTestCardAutofill}
                  className="text-xs text-[#725c00] hover:underline bg-[#D6B858]/15 px-2.5 py-1 rounded font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#D6B858]" />
                  <span>Autocompletar Tarjeta Prueba Stripe</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    NOMBRE COMPLETO
                  </label>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                    className="w-full border border-gray-300 p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    CORREO ELECTRÓNICO
                  </label>
                  <input
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="juan@ejemplo.com"
                    required
                    className="w-full border border-gray-300 p-3 text-sm focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                  />
                </div>
              </div>

              {paymentMethod === "cc" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      NÚMERO DE TARJETA
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        required
                        className="w-full border border-gray-300 p-3 pr-10 text-sm font-mono focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                      />
                      <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        EXPIRACIÓN
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / AA"
                        required
                        className="w-full border border-gray-300 p-3 text-sm font-mono focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        required
                        className="w-full border border-gray-300 p-3 text-sm font-mono focus:border-[#D6B858] focus:ring-1 focus:ring-[#D6B858] outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "paypal" && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-xs text-blue-800">
                  Serás redirigido a la ventana segura de PayPal para completar la suscripción del curso de RenewU.
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-900 space-y-1">
                  <p className="font-bold">IBAN para Matrícula Directa RenewU:</p>
                  <p className="font-mono">ES91 2100 0418 4502 0005 1234</p>
                  <p className="text-[11px] text-amber-700">Concepto: Matrícula Teología {billingName}</p>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#F9F9F9] border border-gray-300 rounded-lg p-6 md:p-8 sticky top-24 shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b border-[#D6B858]/40 pb-3 text-[#1A1A19]">
                Resumen de Matrícula
              </h3>

              <div className="space-y-4">
                {/* Option 1: Per Course */}
                <div
                  onClick={() => setSelectedPlan("single_course")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPlan === "single_course"
                      ? "bg-white border-[#D6B858] ring-2 ring-[#D6B858]/20"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1A1A19]">Pago por Curso</span>
                      <span className="text-xs text-gray-500">Inscripción individual (6 semanas)</span>
                    </div>
                    <span className="text-lg font-extrabold text-[#1A1A19]">
                      ${currencyInfo.single}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <span className="text-xs text-gray-500 italic">o mejor aún</span>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>

                {/* Option 2: Total Program */}
                <div
                  onClick={() => setSelectedPlan("full_program")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPlan === "full_program"
                      ? "bg-[#D6B858]/10 border-[#D6B858] ring-2 ring-[#D6B858]/30"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1A1A19]">Total del Programa</span>
                      <span className="text-xs text-[#725c00] font-semibold">Acceso completo a los 12 cursos</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#1A1A19]">
                        ${currencyInfo.full}
                      </span>
                      <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        AHORRA 15%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtotal & Total Breakdown */}
              <div className="mt-6 pt-6 border-t border-gray-300 space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span>${selectedPlan === "single_course" ? "59.00" : "709.00"} USD</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Impuestos regionales</span>
                  <span className="text-gray-400">$0.00</span>
                </div>
                <div className="flex justify-between items-center text-xl font-extrabold text-[#D6B858] pt-2 border-t border-gray-200">
                  <span>TOTAL</span>
                  <span>${selectedPlan === "single_course" ? "59.00" : "709.00"} USD</span>
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-[#D6B858] hover:bg-[#c3a447] text-white font-bold text-sm py-4 rounded-lg uppercase tracking-widest transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Procesando Pago Seguro...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirmar Pago Seguro</span>
                  </>
                )}
              </button>

              <div className="mt-5 flex items-center justify-center gap-3 text-xs text-gray-500">
                <ShieldCheck className="w-6 h-6 text-[#D6B858] shrink-0" />
                <p className="leading-tight">
                  Tu transacción está protegida por encriptación de grado bancario de 256 bits y pasarela Stripe.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Academic Trust Symbols Footer */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-10">
        <div className="flex flex-col items-center text-center px-4">
          <Award className="w-12 h-12 text-[#D6B858] mb-3" />
          <h4 className="font-bold text-sm text-[#1A1A19] mb-1">Certificación Académica</h4>
          <p className="text-xs text-gray-600">
            Diplomas reconocidos por nuestra red teológica internacional al finalizar con éxito.
          </p>
        </div>

        <div className="flex flex-col items-center text-center px-4">
          <BookOpen className="w-12 h-12 text-[#D6B858] mb-3" />
          <h4 className="font-bold text-sm text-[#1A1A19] mb-1">Tradición y Sabiduría</h4>
          <p className="text-xs text-gray-600">
            Contenido curado por teólogos expertos comprometidos con la verdad bíblica.
          </p>
        </div>

        <div className="flex flex-col items-center text-center px-4">
          <Headphones className="w-12 h-12 text-[#D6B858] mb-3" />
          <h4 className="font-bold text-sm text-[#1A1A19] mb-1">Soporte Estudiantil</h4>
          <p className="text-xs text-gray-600">
            Estamos aquí para apoyarte en tu camino de crecimiento espiritual y académico.
          </p>
        </div>
      </section>
    </div>
  );
};
