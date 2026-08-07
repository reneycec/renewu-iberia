import React, { useState } from "react";
import { ViewMode } from "../types";
import { Dictionary } from "../data/translations";
import { GraduationCap, ShieldCheck, Heart, Users, BookOpen, CheckCircle2, Globe, HelpCircle, ArrowRight, ExternalLink, Award, Sparkles, BookMarked, Compass } from "lucide-react";

interface AboutRenewUProps {
  onViewChange: (view: ViewMode) => void;
  t?: Dictionary;
}

export const AboutRenewU: React.FC<AboutRenewUProps> = ({ onViewChange, t }) => {
  const [selectedFacultyLang, setSelectedFacultyLang] = useState<"es" | "en">("es");

  const facultyMembers = [
    {
      id: "bobby-harrington",
      name: "Dr. Bobby Harrington",
      role: "Lead Executive Director & RENEW.org Point-Leader",
      specialty: "Biblical Theology, Church History & Disciple Making",
      bioEs: `Bobby Harrington es el líder principal de RENEW.org y Discipleship.org, ambas organizaciones colaborativas enfocadas en el discipulado cristiano. Es el pastor fundador y principal de Harpeth Christian Church (en las cercanías del río Harpeth, cerca de Nashville, TN). Posee una maestría M.A.R. y M.Div. de Harding School of Theology y un Doctorado en Ministerio (D.Min.) por el Southern Baptist Theological Seminary. Es autor de más de 12 libros sobre discipulado, incluidos 'Discipleshift' (junto a Jim Putman y Robert Coleman), 'The Disciple Maker’s Handbook' (con Josh Patrick) y 'Becoming a Disciple Maker: The Pursuit of Level 5 Disciple Making' (con Greg Weins). Vive en la zona metropolitana de Nashville con su esposa, cerca de sus hijos y nietos.`,
      bioEn: `Bobby Harrington is the point-leader of RENEW.org and Discipleship.org, both collaborative, disciple making organizations. He is the founding and lead pastor of Harpeth Christian Church (by the Harpeth River, just outside of Nashville, TN). He has an M.A.R. and an M.Div. from Harding School of Theology and a Doctor of Ministry degree from the Southern Baptist Theological Seminary. He is the author of more than 12 books on discipleship, including Discipleshift (with Jim Putman and Robert Coleman), The Disciple Maker’s Handbook (with Josh Patrick) and Becoming a Disciple Maker: The Pursuit of Level 5 Disciple Making (with Greg Weins). He lives in the greater Nashville area with his wife and near his children and grandchildren.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Bobby-Harrington-Headshot.jpg"
    },
    {
      id: "david-young",
      name: "Dr. David Young",
      role: "Dean of Theological Studies",
      specialty: "Jesus and the Gospels, Acts & Paul, Biblical Theology",
      bioEs: `Nacido en Tennessee, David Young es cofundador de New Day Resources y miembro de la junta directiva de Renew Network. Inició su trabajo ministerial a los 16 años predicando en su congregación local. A lo largo de su carrera ha servido en iglesias de Missouri, Kansas y Tennessee; ha impartido cátedra de Nuevo Testamento en diversas universidades y ha viajado extensamente predicando y enseñando. Fue ministro principal en North Boulevard Church of Christ en Murfreesboro, Tennessee durante 26 años. Es autor de libros como 'King Jesus and the Beauty of Obedience-Based Discipleship' (Zondervan), 'A Grand Illusion' (Renew.org), 'The Rhetoric of Jesus in the Gospel of Mark' (Fortress Press) y 'A New Day: Restoring the Revolutionary Mission of Christ’s Church'. Posee un B.A. de Freed-Hardeman University, M.A. de Harding School of Theology, y M.A. y Ph.D. en Nuevo Testamento por Vanderbilt University.`,
      bioEn: `A Tennessee native, David Young is a founder of New Day Resources and a board member of the Renew Network. He began ministry work at the age of 16 by preaching for his local congregation, and throughout his career, he has worked for churches in Missouri, Kansas, and Tennessee; taught New Testament at several universities; and has traveled widely teaching and preaching. He was a teaching and senior minister at the North Boulevard church of Christ in Murfreesboro, Tennessee for twenty-six years. He is also the author of several books including King Jesus and the Beauty of Obedience-Based Discipleship (Zondervan), A Grand Illusion (Renew.org), and A New Day (New Day Resources). David holds a B.A. from Freed-Hardeman University, an M.A. from Harding School of Theology, and an M.A. and Ph.D. in New Testament from Vanderbilt University.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/David-Young-Headshot.jpg"
    },
    {
      id: "josh-branham",
      name: "Josh Branham",
      role: "Professor of Spiritual Formation",
      specialty: "Spiritual Formation & Youth Leadership",
      bioEs: `Josh Branham es el pastor principal de Hill City Church en Boise, Idaho. Originalmente de Fairbanks, Alaska, se mudó a Boise para estudiar predicación en Boise Bible College y más tarde obtuvo una Maestría en Artes en Ministerio Cristiano en Grand Canyon University. Josh y su esposa, Shaina, tienen tres hijas. En su tiempo libre disfruta correr, andar en bicicleta, esquiar y pasar tiempo con sus dos perros. Es autor del libro 'What Are You Waiting For? A Young Leader’s Guide to Changing the World'. Conoce más en joshuabranham.com.`,
      bioEn: `Josh Branham is the Lead Pastor of Hill City Church in Boise, Idaho. Originally from Fairbanks, Alaska, he moved to Boise to study preaching at Boise Bible College and later earned a Master of Arts in Christian Ministry from Grand Canyon University. Josh and his wife, Shaina, have three daughters. In his free time, he enjoys running, biking, skiing, and spending time with his two dogs. He is the author of What Are You Waiting For? A Young Leader’s Guide to Changing the World. Learn more at joshuabranham.com.`,
      image: "https://renewuniversity.org/wp-content/uploads/2026/05/JoshuaBranhamHeadshot-1024x1024.jpg"
    },
    {
      id: "zach-breitenbach",
      name: "Dr. Zach Breitenbach",
      role: "Professor of Christian Evidences",
      specialty: "Christian Evidences & Worldview",
      bioEs: `El Dr. Zach Breitenbach es el Director del Worldview Center en Connection Pointe en Brownsburg, IN y ex Vicedirector de Room For Doubt. Se graduó con honores (GPA 4.0 Valedictorian) en Ciencias de la Computación en North Carolina State University, donde también obtuvo 3 reconocimientos Academic All-American como luchador de la División I de la NCAA. Obtuvo su MBA en NC State y trabajó para American Airlines en Dallas. Estudió su Maestría en Apologética Cristiana en Lincoln Christian University con los máximos honores. En 2019 completó su Ph.D. en Teología y Apologética en Liberty University. Ha publicado en el Journal of the Evangelical Theological Society, Southeastern Theological Review y Themelios. En 2021 publicó el libro 'Slipping Through the Cracks'.`,
      bioEn: `Dr. Zach Breitenbach is the Director of the Worldview Center at Connection Pointe in Brownsburg, IN and the former Associate Director of Room For Doubt. Zach graduated with a BS in Computer Science from North Carolina State University (Valedictorian, 4.0 GPA), earning Academic All-American honors three times as an NCAA Division I wrestler. He earned his MBA at NC State and worked for American Airlines. He received an MA in Christian Apologetics with highest honors from Lincoln Christian University, and in 2019 completed a PhD in Theology & Apologetics from Liberty University. Author of 'Slipping Through the Cracks'.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Zach-Breitenbach-Headshot.jpg"
    },
    {
      id: "jeff-duerler",
      name: "Jeff Duerler",
      role: "Professor of Old Testament Studies",
      specialty: "Overview of the Old Testament",
      bioEs: `Jeff Duerler nació en Indonesia (sus padres eran misioneros médicos) y creció en Ohio. Se graduó de Toccoa Falls Bible College en Georgia y obtuvo su Maestría en Divinidad (M.Div.) en Alliance Theological Seminary en Nueva York. Realizó su Ph.D. en Hebrew Union College – Jewish Institute of Religion en Ohio. En 2008 ayudó a ser pionero de LifeSpring en Harrison, OH, asumiendo el rol de Pastor Senior en 2016. Se desempeña además como profesor adjunto en línea en Nyack College – Alliance Theological Seminary. Su pasión es ayudar a otros a conocer, amar y servir a Jesús en una vida abundante y valiente.`,
      bioEn: `Jeff Duerler grew up in Ohio but was born in Indonesia to medical missionary parents. He earned his M.Div. from Alliance Theological Seminary in New York and his Ph.D. at Hebrew Union College – Jewish Institute of Religion. In 2008, Jeff helped pioneer LifeSpring in Harrison, OH, transitioning into the Senior Pastor role in 2016. He also serves as an adjunct online professor with Nyack College – Alliance Theological Seminary. His passion today is to help others know, love, and serve Jesus.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Jeff-Duerler-Headshot.jpg"
    },
    {
      id: "orpheus-heyward",
      name: "Dr. Orpheus J. Heyward",
      role: "Professor of Biblical Exposition",
      specialty: "The Bible: Canon, Inspiration, Hermeneutics",
      bioEs: `El Dr. Orpheus J. Heyward es un reconocido experto en Exposición Bíblica y Ministro de Renaissance Church en Atlanta, Georgia, una de las iglesias afroamericanas de Cristo más grandes. Cuenta con 18 años de experiencia pastoral. Posee una Licenciatura en Estudios Bíblicos, Maestría en Teología, segunda Maestría en Estudios Bíblicos y Doctorado en Exégesis Teológica. Se encuentra completando un Ph.D. en Exposición Bíblica. Es Profesor Afiliado de Predicación Expositiva y Liderazgo Cristiano en Lipscomb University.`,
      bioEn: `Dr. Orpheus J. Heyward is a noted expert in Biblical Exposition and the Minister to the Renaissance Church in Atlanta, Georgia. Dr. Heyward has been involved with pastoral work for 18 years. He earned a Bachelor’s in Biblical Studies, a Master’s in Theology, a second Master’s in Biblical Studies, and a Doctorate Degree in Theological Exegesis, completing a PhD in Biblical Exposition. He is a Faculty Affiliate Professor at Lipscomb University.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Orpheus-Heyward-Headshot.jpg"
    },
    {
      id: "rowlie-hutton",
      name: "Rowlie Hutton",
      role: "Chief Development Officer",
      specialty: "Development & Pastoral Ministry",
      bioEs: `Rowlie dedicó más de 35 años a la predicación y ministerio pastoral en Las Dakotas, Montana y Nebraska. Es graduado de Dakota Bible College y Montana State University-Northern. Mientras ejercía su pastorado en Havre, MT, sirvió una sesión en el Senado del Estado de Montana enfocado en proyectos de ley para la Santidad de la Vida. Disfruta compartir con amigos con un café cargado, leer grandes libros e invertir en la próxima generación de jóvenes líderes.`,
      bioEn: `Rowlie spent over 35 years preaching in The Dakotas, Montana, and Nebraska. He is a graduate of Dakota Bible College and Montana State University-Northern. Rowlie served one session in the Montana State Senate focusing on the Sanctity of Life Bills. Rowlie enjoys reading good books and pouring into the next generation of young guns.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Rowlie-Hutton-Headshot.jpg"
    },
    {
      id: "jason-ishmael",
      name: "Jason Ishmael",
      role: "Professor of New Testament Exegesis",
      specialty: "The Book of Romans & Church History",
      bioEs: `Jason fue llamado al ministerio a los 12 años. Se graduó de St. Louis Christian College con un B.A. en Predicación y posteriormente de Lincoln Christian University con una Maestría M.A. en Historia de la Iglesia y Teología Histórica. Jason sirve como Pastor Principal en Antioch Christian Church, una iglesia multicampus en el centro de Iowa. Le apasiona entregarse al máximo en el ministerio y formar líderes eclesiales sólidos.`,
      bioEn: `Jason was called to ministry at 12 and is doing exactly what he loves to do the most. He graduated from St. Louis Christian College with a B.A. in Preaching and later from Lincoln Christian University with an M.A. in Church History/Historical Theology. Jason serves as the Lead Pastor for the Antioch Christian Church, a multi-site mega church in central Iowa.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/04/Jason-Ishmael-Headshot.jpg"
    },
    {
      id: "reggie-rice",
      name: "Dr. Reggie Rice",
      role: "Professor of Christian Leadership",
      specialty: "Christian Leadership and Ministry",
      bioEs: `El Dr. Reggie Rice se desempeña como Director del CCV Leadership Institute en Christ’s Church of the Valley en Phoenix, AZ. Con más de 20 años de experiencia en ministerio vocacional, plantación de iglesias, formación de discípulos y capacitación de personal, le apasiona desarrollar pastores y multiplicar líderes en la iglesia local. Posee una Maestría M.A.R. de Liberty University y un Ph.D. de Johnson University, y sirve como profesor adjunto en Abilene Christian University y Grand Canyon University.`,
      bioEn: `Dr. Reggie Rice serves as Director of the CCV Leadership Institute at Christ’s Church of the Valley in Phoenix, AZ. With more than 20 years of vocational ministry experience in church planting, disciple-making, and staff training, he holds an M.A.R. from Liberty University and a Ph.D. from Johnson University, serving as an adjunct professor at Abilene Christian University and Grand Canyon University.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/11/Reggie-Rice-1024x998.jpeg"
    },
    {
      id: "kelvin-teamer",
      name: "Dr. Kelvin Teamer",
      role: "Professor of Pastoral Care & Counseling",
      specialty: "Introduction to Crisis Counseling",
      bioEs: `El Dr. Kelvin E. Teamer es el Ministro de Adultos en North Boulevard Church of Christ en Murfreesboro, Tennessee. Anteriormente fue Ministro Principal y Evangelista en Church of Christ at Bouldercrest en Atlanta, Georgia. Se graduó en Marketing en Southern Illinois University en 1996, y posteriormente en Georgia School of Preaching en 2005. Obtuvo su Maestría en Divinidad (M.Div.) en Terapia Matrimonial y Familiar en 2009 y su Doctorado en Ministerio (D.Min.) en 2016 en Amridge University, donde hoy es Profesor Adjunto de Teología. Es autor de 'Kingdom Life: Experiencing God’s Reign Through Love and Holiness'.`,
      bioEn: `Dr. Kelvin E. Teamer serves as the Adults Minister at the North Boulevard Church of Christ in Murfreesboro, Tennessee. Prior to laboring in this capacity, he served as the Senior Minister at Bouldercrest church in Atlanta. Kelvin graduated from Southern Illinois University, Georgia School of Preaching, and earned his M.Div. in Marriage and Family Therapy and Doctor of Ministry degree from Amridge University. Author of 'Kingdom Life'.`,
      image: "https://renewuniversity.org/wp-content/uploads/2025/11/Untitled-design-3-1-1024x1024.png"
    }
  ];

  const faqList = [
    {
      q: "¿Qué tipo de certificación otorga Renew University?",
      a: "Otorgamos el 'Certificado en Teología y Discipulado Cristiano', respaldado por Renew.org e instituciones socias. Es un diploma no acreditado académicamente por agencias estatales para mantener la matrícula accesible ($59 por curso), pero con estándares de rigor universitarios."
    },
    {
      q: "¿Cómo se accede a las clases una vez pagada la matrícula?",
      a: "El Portal de Registro genera automáticamente tus credenciales y te inscribe vía la REST API de Moodle. Recibirás un correo inmediato con tu usuario/contraseña y podrás ingresar a campus.renewuniversity.org o directamente desde esta plataforma."
    },
    {
      q: "¿Puedo tomar los cursos a mi propio ritmo?",
      a: "Sí. Aunque cada materia tiene fechas de inicio y cierre de cohorte para promover la interacción comunitaria y tareas con profesores, todo el material audiovisual y lecturas están disponibles 24/7 en Moodle."
    },
    {
      q: "¿Existen descuentos para grupos de iglesias o líderes?",
      a: "Sí, la opción de suscripción al Programa Completo ($709 USD) ofrece un ahorro del 20%. Además, las iglesias aliadas pueden solicitar códigos de beca o convenios de grupo enviándonos un mensaje."
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-8 px-4 md:px-10 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-[#1A1A19] text-white rounded-2xl p-8 md:p-12 shadow-xl border-b-4 border-[#D6B858] relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D6B858]/20 border border-[#D6B858]/40 text-[#D6B858] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Acerca de Renew University (renewuniversity.org)</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Formando Líderes y Discípulos según el <span className="text-[#D6B858]">Diseño Bíblico</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Renew University es la iniciativa educativa oficial de Renew.org Network (organización 501(c)(3) sin fines de lucro) dedicada a brindar formación teológica rigurosa, accesible e integradamente conectada con Moodle LMS.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onViewChange("courses")}
              className="bg-[#D6B858] hover:bg-[#c3a447] text-[#1A1A19] font-black text-xs md:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Ver Catálogo de 12 Cursos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange("enrollment")}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all border border-white/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Solicitar Inscripción</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mission & Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6B858]/20 text-[#725c00] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1A1A19]">Teología Bíblica Rigurosa</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Enseñanza fuertemente anclada en la inerrancia e inspiración de las Escrituras, explorando el Antiguo y Nuevo Testamento con hermenéutica contextual.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6B858]/20 text-[#725c00] flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1A1A19]">Discipulado Transformativo</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            No buscamos meramente acumulación de conocimiento intelectual, sino la transformación del carácter y la multiplicación de discípulos en la iglesia local.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6B858]/20 text-[#725c00] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1A1A19]">Accesibilidad Económica</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Eliminamos las barreras financieras tradicionales de los seminarios. Ofrecemos formación universitaria a un costo de solo $59 USD por materia.
          </p>
        </div>
      </div>

      {/* Leadership & Faculty Council - Premium Canvas Showcase */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 space-y-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D6B858]/20 text-[#725c00] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-[#D6B858]" />
              <span>Cuerpo Docente Oficial & Consejo Académico (renewuniversity.org/about/faculty)</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A19] tracking-tight">
              Profesorado y Catedráticos de Renew University
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">
              Conoce a los 10 reconocidos profesores y teólogos que dirigen el programa académico de RenewU con sus retratos y biografías completas.
            </p>
          </div>

          {/* Language Switcher for Bios */}
          <div className="flex items-center gap-2 shrink-0 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-500 px-2 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#D6B858]" /> Idioma Bio:
            </span>
            <button
              onClick={() => setSelectedFacultyLang("es")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFacultyLang === "es"
                  ? "bg-[#1A1A19] text-[#D6B858] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🇪🇸 Español
            </button>
            <button
              onClick={() => setSelectedFacultyLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFacultyLang === "en"
                  ? "bg-[#1A1A19] text-[#D6B858] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🇺🇸 English Original
            </button>
          </div>
        </div>

        {/* Faculty Grid - Premium Styled Cards Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facultyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white border-2 border-gray-100 hover:border-[#D6B858] rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo Canvas Frame with Gold Accent Overlay */}
                <div className="relative h-72 md:h-80 w-full overflow-hidden bg-gradient-to-t from-[#1A1A19] via-[#1A1A19]/30 to-transparent">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating Canvas Badges & Header Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A19] via-[#1A1A19]/20 to-transparent flex flex-col justify-end p-6">
                    <span className="bg-[#D6B858] text-[#1A1A19] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full self-start mb-2 shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{member.specialty}</span>
                    </span>
                    
                    <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                      {member.name}
                    </h3>
                    
                    <p className="text-xs font-bold text-[#D6B858] mt-0.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>{member.role}</span>
                    </p>
                  </div>
                </div>

                {/* Detailed Bio Section */}
                <div className="p-6 md:p-8 space-y-4 bg-white">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookMarked className="w-4 h-4 text-[#D6B858]" />
                    <span className="text-xs font-extrabold text-[#725c00] uppercase tracking-wider">
                      Biografía Académica & Trayectoria
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal">
                    {selectedFacultyLang === "en" ? member.bioEn : member.bioEs}
                  </p>
                </div>
              </div>

              {/* Card Footer Badge */}
              <div className="px-6 pb-6 pt-2 bg-white flex items-center justify-between border-t border-gray-50 text-[11px] text-gray-500">
                <span className="flex items-center gap-1 font-medium">
                  <Compass className="w-3.5 h-3.5 text-[#D6B858]" /> Renew University Faculty
                </span>
                <span className="font-bold text-[#725c00]">renewuniversity.org</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#725c00] font-bold text-xs uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4 text-[#D6B858]" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A19]">Respuestas Rápidas sobre el Programa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqList.map((faq, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-[#1A1A19] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D6B858] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Links Footer Bar */}
      <div className="bg-[#1A1A19] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#D6B858]">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#D6B858]" />
          <div className="text-xs">
            <span className="font-bold text-white block">Sitio Oficial Renew.org Network</span>
            <span className="text-gray-400">https://renewuniversity.org</span>
          </div>
        </div>

        <a
          href="https://renewuniversity.org/about/faculty"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#D6B858] hover:underline font-bold flex items-center gap-1 bg-white/5 px-4 py-2.5 rounded-xl border border-[#D6B858]/30 transition-all hover:bg-white/10"
        >
          <span>Visitar Facultad en Portal Oficial Externo</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

