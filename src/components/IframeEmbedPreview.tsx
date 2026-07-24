import React, { useState, useEffect } from "react";
import { Layout, Code, Monitor, ExternalLink, Copy, Check, MessageSquare } from "lucide-react";

export const IframeEmbedPreview: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [postMessageLogs, setPostMessageLogs] = useState<string[]>([
    `[moodle-parent] Init listener for window.postMessage from RenewU iframe`,
    `[renewu-app] Target origin ready: https://moodle.renew.edu`,
  ]);

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://app.renew.edu";

  const embedCodeSnippet = `<!-- Código de Integración para Moodle LMS (Etiqueta HTML o Bloque Personalizado) -->
<div id="renewu-moodle-container" style="width: 100%; max-width: 1200px; margin: 0 auto;">
  <iframe
    id="renewu-iframe"
    src="${currentOrigin}?embed=moodle"
    width="100%"
    height="850px"
    style="border: 1px solid #D6B858; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
    allow="payment; camera; microphone"
  ></iframe>
</div>

<script>
  // Listener para capturar evento de matriculación finalizada desde RenewU
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'RENEWU_ENROLLMENT_SUCCESS') {
      console.log('Moodle detectó matricula exitosa:', event.data.student);
      // Redirigir automáticamente al aula virtual de Moodle
      // window.location.href = '/course/view.php?id=' + event.data.student.moodleCourseId;
    }
  });
</script>`;

  const apiCurlSnippet = `# Ejemplo de llamada API personalizada desde tu LLM / Servidor Moodle
curl -X POST "${currentOrigin}/api/llm/chat" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "¿Cuáles son los requisitos de acreditación para el Certificado en Teología?",
    "conversationHistory": []
  }'`;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white border border-[#D6B858] p-6 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#D6B858]/15 text-[#725c00] text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Layout className="w-3.5 h-3.5 text-[#D6B858]" />
            <span>Moodle LMS & Custom API Compatibility Suite</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A19]">
            Simulador de Iframe y Documentación API
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Integra esta aplicación en Moodle mediante iFrame o comunica tu propio modelo LLM con nuestra API REST.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Moodle Visual Frame Simulation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#1A1A19] flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[#D6B858]" />
              <span>Vista Previa Dentro de Moodle LMS</span>
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Live Responsive Frame
            </span>
          </div>

          {/* Fake Moodle Outer LMS Container */}
          <div className="border-4 border-gray-800 rounded-xl overflow-hidden bg-gray-100 shadow-xl">
            {/* Moodle Header Bar */}
            <div className="bg-[#0f6cbf] text-white p-3 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded font-black text-white text-[11px] flex items-center justify-center">m</div>
                <span>Moodle LMS Campus Virtual RenewU</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] opacity-90">
                <span>Mis Cursos</span>
                <span>•</span>
                <span>Certificado Teología</span>
                <span>•</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">Estudiante Demo</span>
              </div>
            </div>

            {/* Simulated Iframe Shell */}
            <div className="p-4 bg-white min-h-[500px]">
              <iframe
                src="/?embed=true"
                title="RenewU Embedded Form"
                className="w-full h-[550px] border border-[#D6B858] rounded-lg shadow-inner"
              ></iframe>
            </div>
          </div>

          {/* postMessage Event Terminal */}
          <div className="bg-[#1A1A19] text-[#D6B858] p-4 rounded-xl font-mono text-xs space-y-2 border border-[#D6B858]/30">
            <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-[#D6B858]" />
                Event Log: window.postMessage Bridge
              </span>
              <span className="text-[10px] text-emerald-400">● Listener Activo</span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {postMessageLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Snippets & Custom API Docs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Snippet 1: Moodle Iframe Code */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1A1A19] flex items-center gap-2">
                <Code className="w-4 h-4 text-[#D6B858]" />
                <span>Código HTML Iframe para Moodle</span>
              </h3>
              <button
                onClick={() => handleCopyCode(embedCodeSnippet)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded font-semibold flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "¡Copiado!" : "Copiar"}</span>
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Pega este fragmento en una página HTML o bloque lateral en tu servidor Moodle para integrar el portal completo.
            </p>
            <pre className="bg-gray-900 text-gray-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-56">
              {embedCodeSnippet}
            </pre>
          </div>

          {/* Snippet 2: Custom LLM API Docs */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1A1A19] flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#D6B858]" />
                <span>API REST para LLM Personalizado</span>
              </h3>
              <button
                onClick={() => handleCopyCode(apiCurlSnippet)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded font-semibold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar cURL</span>
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Puedes llamar a nuestra API desde el LLM que construiste utilizando la siguiente ruta de comunicación en formato JSON:
            </p>
            <pre className="bg-gray-900 text-emerald-400 p-3 rounded-lg text-[11px] font-mono overflow-x-auto">
              {apiCurlSnippet}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
