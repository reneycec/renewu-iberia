/**
 * BookCatalogService Class (Object-Oriented Design)
 * Manages fetching, updating, uploading, and filtering course books from the server
 * with built-in fallbacks and library content for RenewU.
 */

import { BookItem } from "../types";

export class BookCatalogService {
  private static instance: BookCatalogService | null = null;
  private apiEndpoint: string = "/api/books";

  private constructor() {}

  public static getInstance(): BookCatalogService {
    if (!BookCatalogService.instance) {
      BookCatalogService.instance = new BookCatalogService();
    }
    return BookCatalogService.instance;
  }

  /**
   * Fetch all course books (via API or default catalog)
   */
  public async fetchBooks(): Promise<BookItem[]> {
    try {
      const response = await fetch(this.apiEndpoint);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.books) && data.books.length > 0) {
          return data.books;
        }
      }
    } catch (error) {
      console.warn("Could not fetch books from server API, using local course library catalog.", error);
    }
    return this.getDefaultSampleCatalog();
  }

  /**
   * Save or upload a new book
   */
  public async saveBook(book: BookItem): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book }),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return { success: false, message: error.message || "Error al conectar con el servidor." };
    }
  }

  /**
   * Delete a book by ID
   */
  public async deleteBook(bookId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/${bookId}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, message: error.message || "Error al eliminar libro." };
    }
  }

  /**
   * Default sample course books and classical literature catalog
   */
  public getDefaultSampleCatalog(): BookItem[] {
    return [
      {
        id: "book-quijote",
        title: "Don Quijote de la Mancha",
        subtitle: "El ingenioso hidalgo Don Quijote de la Mancha",
        author: "Miguel de Cervantes",
        year: "1605",
        category: "Literatura Clásica",
        accessRule: "registered_only",
        publishedAt: "1605-01-16",
        totalPages: 5,
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        description: "Obra cumbre de la literatura española escrita por Miguel de Cervantes Saavedra.",
        chapters: [
          {
            id: "quijote-1",
            number: 1,
            title: "Prólogo",
            subtitle: "Al desocupado lector",
            estimatedReadTimeMinutes: 5,
            content: `Desocupado lector: sin juramento me podrás creer que quisiera que este libro, como hijo del entendimiento, fuera el más hermoso, el más gallardo y el más discreto que pudiera imaginarse.\n\nMas no he podido yo contravenir a la orden de naturaleza; que en ella cada cosa engendra su semejante.`,
          },
          {
            id: "quijote-2",
            number: 2,
            title: "Capítulo I — De la condición del hidalgo",
            subtitle: "Lanza en astillero, adarga antigua, rocín flaco",
            estimatedReadTimeMinutes: 8,
            content: `En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.\n\nUna olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.\n\nEl resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino.`,
          },
          {
            id: "quijote-3",
            number: 3,
            title: "Capítulo II — Que trata de la primera salida",
            subtitle: "La armadura de sus antepasados",
            estimatedReadTimeMinutes: 10,
            content: `Hechas, pues, estas prevenciones, no quiso aguardar más tiempo a poner en efecto su pensamiento, apretándole a ello la falta que él pensaba que hacía en el mundo su tardanza, según eran los agravios que pensaba deshacer.\n\nY así, sin dar parte a persona alguna de su intención, una mañana, antes del día, que era uno de los calurosos del mes de julio, se armó de todas sus armas.\n\nEncajóse la celada, que le pareció a Sancho que no era bien hecha sino a modo de jícaro; luego se aseguró la espada, subió sobre Rocinante, y salió a la puerta de la venta.`,
          },
          {
            id: "quijote-4",
            number: 4,
            title: "Capítulo III — Donde se cuenta la graciosa manera",
            subtitle: "El ventero y la vela de las armas",
            estimatedReadTimeMinutes: 10,
            content: `Y así, fatigado deste pensamiento, abrevió su venteril comida, que, a lo que Sancho Panza llamó cena, no fue otra cosa un poco de bacalao y un pedazo de pan.\n\nY en esto se halló el ventero, que le preguntó qué era lo que quería. Don Quijote le respondió que no quería otra cosa sino que le despertase a la madrugada.\n\nEl ventero le prometió que le despertaría, y se fue a acostar; y don Quijote se fue a acostar también, en el pajar, como queda dicho.`,
          },
          {
            id: "quijote-5",
            number: 5,
            title: "Capítulo IV — De lo que le sucedió a nuestro caballero",
            subtitle: "Al salir de la venta",
            estimatedReadTimeMinutes: 8,
            content: `Despertóse el caballero y, acordándose de su desgracia, volvió los ojos a todas partes, y vio que estaba en el mismo pajar donde había quedado dormido.\n\nY luego, volviendo la vista a la ventana por donde había salido, vio a sus dos nuevos camaradas que le estaban mirando.\n\nLevantóse, y lo primero que hizo fue ir a ver si estaba sana y salva su adarga, y halló que no le faltaba nada de ella.`,
          },
        ],
      },
      {
        id: "book-soledad",
        title: "Cien Años de Soledad",
        subtitle: "La epopeya de la familia Buendía en Macondo",
        author: "Gabriel García Márquez",
        year: "1967",
        category: "Literatura Clásica",
        accessRule: "registered_only",
        publishedAt: "1967-06-05",
        totalPages: 5,
        coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
        description: "Obra maestra del realismo mágico y Premio Nobel de Literatura.",
        chapters: [
          {
            id: "soledad-1",
            number: 1,
            title: "Capítulo 1 — El mundo era tan reciente",
            subtitle: "Frente al pelotón de fusilamiento",
            estimatedReadTimeMinutes: 12,
            content: `Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.\n\nMacondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos.\n\nEl mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo.`,
          },
          {
            id: "soledad-2",
            number: 2,
            title: "Capítulo 2 — Úrsula Iguarán",
            subtitle: "Los inventos de Melquíades y los gitanos",
            estimatedReadTimeMinutes: 10,
            content: `Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos.\n\nPrimero llevaron el imán. Un gitano corpulento, de barba montaraz y manos de gorrión, que se presentó con el nombre de Melquíades, hizo una truculenta demostración pública de lo que él mismo llamaba la octava maravilla de los sabios alquimistas de Macedonia.`,
          },
          {
            id: "soledad-3",
            number: 3,
            title: "Capítulo 3 — La aldea creció",
            subtitle: "La prosperidad de Macondo",
            estimatedReadTimeMinutes: 10,
            content: `La aldea creció con la rapidez con que se levantaban las casas de los recién llegados. En pocos años Macondo fue tan ordenada y laboriosa como cualquiera de las aldeas fundadas por los españoles.\n\nSe convirtió en un lugar próspero con casas de paredes de cal y techos de tejas rojas, y se estableció en ella una calle de comerciantes turcos que vendían al contado y al fiado.`,
          },
          {
            id: "soledad-4",
            number: 4,
            title: "Capítulo 4 — La guerra civil",
            subtitle: "El coronel Aureliano Buendía",
            estimatedReadTimeMinutes: 12,
            content: `Aureliano Buendía se había vuelto un hombre taciturno, absorto en sus pensamientos. La guerra civil lo había transformado. Había pasado de ser el joven soñador que fabricaba peces de oro a un coronel endurecido por la violencia.\n\nHabía participado en treinta y dos levantamientos armados y había sobrevivido a todos. Había visto morir a sus hijos, a sus amigos, a sus enemigos.`,
          },
          {
            id: "soledad-5",
            number: 5,
            title: "Capítulo 5 — La lluvia de cuatro años",
            subtitle: "El diluvio en Macondo",
            estimatedReadTimeMinutes: 15,
            content: `La lluvia empezó poco después de que el coronel Aureliano Buendía fuera fusilado. Duró cuatro años, once meses y dos días. Macondo quedó sumergida en un diluvio que parecía no tener fin.\n\nLas calles se convirtieron en ríos de lodo y las casas empezaron a desmoronarse. Los animales se ahogaban y las cosechas se perdían.\n\nÚrsula Iguarán, ya ciega, se mantenía en pie gracias a un instinto sobrenatural, organizando la casa con una precisión que asombraba a todos.`,
          },
        ],
      },
      {
        id: "book-principito",
        title: "El Principito",
        subtitle: "Le Petit Prince",
        author: "Antoine de Saint-Exupéry",
        year: "1943",
        category: "Literatura Clásica",
        accessRule: "registered_only",
        publishedAt: "1943-04-06",
        totalPages: 5,
        coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
        description: "Cuento poético sobre la amistad, el amor y la naturaleza humana.",
        chapters: [
          {
            id: "principito-1",
            number: 1,
            title: "Capítulo I — El dibujo número uno",
            subtitle: "La serpiente boa tragándose a una fiera",
            estimatedReadTimeMinutes: 5,
            content: `Cuando yo tenía seis años vi en un libro sobre la selva virgen que se titulaba «Historias vividas», una magnífica lámina. Representaba una serpiente boa que se tragaba a una fiera.\n\nEn el libro se afirmaba: «La serpiente boa se traga toda la presa entera, sin masticarla. Luego ya no puede moverse y duerme durante los seis meses que dura su digestión».\n\nYo entonces pensé mucho en las aventuras de la jungla, y a mi vez logré trazar con un lápiz de colores mi primer dibujo. Mi dibujo número uno era así.`,
          },
          {
            id: "principito-2",
            number: 2,
            title: "Capítulo II — El principito aparece",
            subtitle: "Avería en el desierto del Sahara",
            estimatedReadTimeMinutes: 7,
            content: `Viví así, solo, nadie con quien poder hablar verdaderamente, hasta cuando hace seis años tuve una avería en el desierto de Sahara. Algo se había roto en mi motor.\n\nY como no tenía conmigo ni mecánico ni pasajeros, me dispuse a realizar, solo, una reparación difícil. Era para mí cuestión de vida o muerte, pues apenas tenía agua de beber para ocho días.`,
          },
          {
            id: "principito-3",
            number: 3,
            title: "Capítulo III — El planeta del principito",
            subtitle: "El asteroide B 612",
            estimatedReadTimeMinutes: 6,
            content: `Fue así como conocí al principito. Durante mucho tiempo viví solo sin nadie con quien hablar, y hasta que se estrelló en el desierto no había conocido a nadie que entendiera mis dibujos.\n\nEl principito venía del asteroide B 612, un asteroide no más grande que una casa. Los astrónomos de Turquía lo habían avistado una vez a través de un telescopio.`,
          },
          {
            id: "principito-4",
            number: 4,
            title: "Capítulo IV — La rosa",
            subtitle: "La flor vanidosa y caprichosa",
            estimatedReadTimeMinutes: 8,
            content: `En su planeta había una rosa. Era una rosa muy vanidosa. Se pasaba el día pidiéndole al principito que la cuidara, que la protegiera del viento, que le pusiera una campana de cristal.\n\nEl principito, aunque la amaba, se cansó de sus caprichos y decidió irse de viaje. Dejó la rosa sola en el asteroide B 612, con sus tres volcanes y sus baobabs.`,
          },
          {
            id: "principito-5",
            number: 5,
            title: "Capítulo V — El zorro",
            subtitle: "Crear lazos y lo esencial es invisible a los ojos",
            estimatedReadTimeMinutes: 10,
            content: `— Por favor —dijo el zorro—, doméstame. — ¿Qué significa domesticar? —preguntó el principito. — Significa crear lazos. Para mí, tú no eres todavía más que un niño igual a otros cien mil niños.\n\nY no te necesito. Y tú tampoco me necesitas. No soy para ti más que un zorro igual a otros cien mil zorros. Pero si me domésticas, entonces tendremos necesidad el uno del otro.\n\nTú serás para mí único en el mundo. Yo seré para ti único en el mundo.`,
          },
        ],
      },
      {
        id: "book-odisea",
        title: "La Odisea",
        subtitle: "El épico viaje de regreso de Ulises a Ítaca",
        author: "Homero",
        year: "~800 a.C.",
        category: "Literatura Clásica",
        accessRule: "registered_only",
        publishedAt: "0800-01-01",
        totalPages: 5,
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        description: "Poema épico griego compuesto por 24 cantos atribuido a Homero.",
        chapters: [
          {
            id: "odisea-1",
            number: 1,
            title: "Canto I — La ira de Poseidón",
            subtitle: "Los dioses decretan el retorno de Ulises",
            estimatedReadTimeMinutes: 10,
            content: `Canta, oh diosa, la ira del Pelida Aquiles, funesta, que causó infinitos males a los aqueos, y precipitó al Hades muchas almas valerosas de héroes, a quienes hizo presa de perros y pasto de aves.\n\nCumplíase así la voluntad de Zeus, desde que por primera vez se separaron disputando el Atrida, rey de hombres, y el divino Aquiles.\n\n¿Cuál de los dioses los juntó en discordia para contender? El hijo de Leto y de Zeus; pues airado con el rey, suscitó en el ejército maligna pestilencia, y los hombres perecían.`,
          },
          {
            id: "odisea-2",
            number: 2,
            title: "Canto II — La asamblea en Ítaca",
            subtitle: "Telémaco convoca a los pretendedores",
            estimatedReadTimeMinutes: 10,
            content: `Después que la Aurora, de rosados dedos, hubo aparecido, el divino Ulises se levantó de la cama y vistió sus ropas. En torno al hombro echó la espada adornada de clavos de plata.\n\nSalió de su palacio semejante en todo a un dios inmortal, y fue a sentarse junto a los que le aconsejaban, los cuales le preguntaban por muchas cosas.`,
          },
          {
            id: "odisea-3",
            number: 3,
            title: "Canto III — El palacio de Menelao",
            subtitle: "Telémaco busca noticias de su padre",
            estimatedReadTimeMinutes: 10,
            content: `Llegaron a Lacedemonia, tierra de ondas, y fueron al palacio del rubio Menelao. Halláronlo celebrando un banquete nupcial para su hijo y para su hija.\n\nDaba su hija al hijo del quebrantador de huestes, Aquiles, pues en Troya prometió y otorgó su palabra. Y a Megapentes, su hijo, la hija de Alector.`,
          },
          {
            id: "odisea-4",
            number: 4,
            title: "Canto IV — La cueva de Calipso",
            subtitle: "La ninfa retiene al héroe en Ogigia",
            estimatedReadTimeMinutes: 10,
            content: `Allí permanecía el héroe, afligido, en la isla de Ogigia, en la morada de la ninfa Calipso, que con mucho empeño le retenía para que fuese su esposo.\n\nPero cuando el año llegó a su término, en que los dioses habían determinado que volviera a Ítaca, aunque no libre de trabajos, entonces discutieron en consejo.`,
          },
          {
            id: "odisea-5",
            number: 5,
            title: "Canto V — El regreso a Ítaca",
            subtitle: "Ulises besa la tierra natal",
            estimatedReadTimeMinutes: 12,
            content: `Así habló, y el héroe de muchos ardides se alegró, y reconociendo la tierra natal, besó la tierra fecundísima, y alzando las manos a las ninfas, dijo:\n\n«¡Ninfas, hijas de Zeus! No pensaba que os vería ya. Aceptadme ahora con propicia voluntad, y yo os daré ofrendas como antes, si el que lleva la égida, Zeus, me permite vivir y mi hijo llegue a la edad viril.»\n\nY así diciendo, la ninfa Calipso, la de hermosas trenzas, le respondió con palabras aladas.`,
          },
        ],
      },
      {
        id: "book-101",
        title: "Hermenéutica Bíblica: Principios e Interpretación",
        subtitle: "Guía académica y práctica para la exégesis del Texto Sagrado",
        author: "Dr. Roberto C. Sproul & Equipo Académico RenewU",
        year: "2026",
        category: "Estudios Bíblicos",
        courseId: "BIB-101",
        courseName: "Introducción a la Hermenéutica Bíblica",
        accessRule: "registered_only",
        publishedAt: "2026-01-15",
        totalPages: 180,
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        description: "Texto fundamental de estudio para el curso de Hermenéutica Bíblica en RenewU Iberia. Explora las reglas gramático-históricas de interpretación y el trasfondo histórico del Antiguo y Nuevo Testamento.",
        chapters: [
          {
            id: "chap-101-1",
            number: 1,
            title: "Capítulo 1: Fundamentos de la Interpretación Gramático-Histórica",
            subtitle: "Definición, necesidad e historia de la hermenéutica",
            estimatedReadTimeMinutes: 15,
            content: `La hermenéutica bíblica es la ciencia y el arte de interpretar el texto de las Sagradas Escrituras. Se denomina ciencia porque posee reglas lógicas y metodológicas objetivas, y se denomina arte porque requiere discernimiento espiritual, práctica y sensibilidad al contexto histórico y cultural.\n\n## 1.1 La Necesidad de la Hermenéutica\n¿Por qué necesitamos interpretar la Biblia? En primer lugar, existe una distancia temporal, cultural y lingüística entre los autores bíblicos originales y los lectores contemporáneos.\n\n1. Distancia Histórica: Los libros del Antiguo y Nuevo Testamento fueron redactados a lo largo de más de 1,500 años.\n2. Distancia Lingüística: El texto sagrado fue inspirado en hebreo, arameo y griego koiné.\n3. Distancia Cultural: Las costumbres agrícolas, políticas, familiares y religiosas del mundo bíblico difieren de nuestra sociedad.`,
          },
          {
            id: "chap-101-2",
            number: 2,
            title: "Capítulo 2: Análisis del Contexto Histórico y Cultural",
            subtitle: "Reconstruyendo el mundo bíblico para entender el mensaje",
            estimatedReadTimeMinutes: 20,
            content: `Para escuchar la voz de Dios tal como resonó originalmente, el estudiante de RenewU debe aprender a transportarse al contexto histórico de los autores y receptores.\n\nPreguntas fundamentales de investigación exegética:\n- ¿Quién fue el autor?\n- ¿Quiénes fueron los destinatarios?\n- ¿Cuándo se escribió la obra?\n- ¿Cuál fue la ocasión o motivo?`,
          },
        ],
      },
    ];
  }
}
