// ============================================================
// SESSIONS — die EINZIGE Liste aller Aufnahmen / Events.
//
// NEUES EVENT HINZUFÜGEN:
//   Kopiere einen { ... }-Block und füge ihn irgendwo in die Liste ein.
//   Die REIHENFOLGE IST EGAL – sortiert wird automatisch nach "date".
//
// Daraus entstehen automatisch:
//   - Startseite "Neueste Aufnahmen"  -> zeigt die 3 neuesten
//   - Seite "Alle Aufnahmen"          -> zeigt alle
//
// Felder:
//   date        Sortier-Datum, IMMER im Format JJJJ-MM-TT (z.B. "2026-06-05")
//   dateText    so wird das Datum angezeigt (z.B. "5. Juni 2026")
//   category    Kategorie vor dem Titel (z.B. "Fußball", "Politik") – darf leer "" sein
//   title       Titel des Events
//   description kurzer Beschreibungstext
//   image       Vorschaubild (Pfad ab dem Hauptordner)
//   imagePos    (optional) Bildausschnitt, z.B. "center 40%". Weglassen = automatisch.
//   link        Link zur Detailseite der Session
// ============================================================
window.SESSIONS = [

    {
        date:        "2026-06-05",
        dateText:    "5. Juni 2026",
        category:    "Fußball",
        title:       "Österreich Frauen vs. Slowenien Frauen",
        description: "Wiener Sport-Club Platz. Schreib hier ein paar Sätze über dieses Spiel.",
        image:       "bilder/sessions/session-fussball-1/1M3A0504.jpg",
        link:        "sessions/fussball-1.html"
    },

    {
        date:        "2026-04-20",
        dateText:    "20. April 2026",
        category:    "Politik",
        title:       "Christian Stocker bei PolEdu",
        description: "Schreib hier ein paar Sätze über diese Veranstaltung.",
        image:       "bilder/sessions/session-politik-2/1M3A3845.jpg",
        imagePos:    "center 80%",
        link:        "sessions/politik-2.html"
    },

    {
        date:        "2026-01-12",
        dateText:    "12. Januar 2026",
        category:    "Politik",
        title:       "Beate Meinl-Reisinger bei PolEdu",
        description: "Schreib hier ein paar Sätze über diese Veranstaltung.",
        image:       "bilder/sessions/session-politik-1/20260112_4545.jpg",
        link:        "sessions/politik-1.html"
    },

    {
        date:        "2026-01-10",
        dateText:    "10. Jänner 2026",
        category:    "Fußball",
        title:       "Austria Wien – Donaufeld",
        description: "Testspiel – Austria Akademie – 5:1",
        image:       "bilder/sessions/austriawien_donaufeld_10_01_2026/1M3A8342.jpg",
        link:        "sessions/austria-donaufeld-1.html"
    }

];
