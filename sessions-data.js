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
//   - Galerie                          -> zeigt alle (immer 2 nebeneinander;
//                                         bei ungerader Anzahl wird das letzte
//                                         Foto automatisch über die volle Breite)
//
// Felder:
//   date        Sortier-Datum, IMMER im Format JJJJ-MM-TT (z.B. "2026-06-05")
//   dateText    so wird das Datum angezeigt (z.B. "5. Juni 2026")
//   title       Titel des Events
//   description kurzer Beschreibungstext
//   image       Vorschaubild (Pfad ab dem Hauptordner, IMMER mit .jpg am Ende!)
//   imagePos    (optional) Bildausschnitt, z.B. "center 40%". Weglassen = automatisch.
//   link        Link zur Detailseite der Session (IMMER mit .html am Ende!)
// ============================================================
window.SESSIONS = [

    {
        date:        "2026-07-17",
        dateText:    "17. Juli 2026",
        title:       "SV Ried - Rot-Weiss Essen",
        description: "Testspiel - BWT Arena - 3:0",
        image:       "bilder/sessions/ried_rwe_17_07_2026/Dardari.jpg",
        imagePos:    "center 58%",
        link:        "sessions/ried-rwe-1.html"
    },

    {
        date:        "2026-06-05",
        dateText:    "5. Juni 2026",
        title:       "Österreich - Slowenien",
        description: "WM 2027 Qualifikation - Wiener Sport-Club Platz - 1:0",
        image:       "bilder/highlights/Kathi Naschenweng.jpg",
        link:        "sessions/fussball-1.html"
    },

    {
        date:        "2026-06-01",
        dateText:    "1. Juni 2026",
        title:       "Walter Rosenkranz bei PolEdu",
        description: "PolEdu Podiumsdiskussion mit Walter Rosenkranz (FPÖ)",
        image:       "bilder/sessions/rosenkranz_bei_poledu_01_06_2026/1M3A9920.jpg",
        link:        "sessions/rosenkranz-1.html"
    },

    {
        date:        "2026-05-28",
        dateText:    "28. Mai 2026",
        title:       "Podiumsdiskussion: Neutralität",
        description: "Bei PolEdu diskutierten Christian Schandor (FPÖ) und Veit Dengler (NEOS) mit 100 Jugendlichen über Österreichs Neutralität.",
        image:       "bilder/sessions/neutralitaet_28_05_2026/1M3A9048.jpg",
        link:        "sessions/neutralitaet_28_05_2026.html"
    },

    {
        date:        "2026-04-26",
        dateText:    "26. April 2026",
        title:       "Sturm - Austria Wien",
        description: "Bundesliga 25/26 29. Runde - Merkur Arena - 1:1",
        image:       "bilder/sessions/sturm_austriawien_26_04_2026/1M3A4645.jpg",
        link:        "sessions/sturm-austria-1.html"
    },

    {
        date:        "2026-04-20",
        dateText:    "20. April 2026",
        title:       "Christian Stocker bei PolEdu",
        description: "PolEdu Podiumsdiskussion mit Christian Stocker (ÖVP)",
        image:       "bilder/sessions/session-politik-2/1M3A3845.jpg",
        imagePos:    "center 80%",
        link:        "sessions/politik-2.html"
    },

    {
        date:        "2026-03-08",
        dateText:    "8. März 2026",
        title:       "Ried - Austria Wien",
        description: "Bundesliga 25/26 22. Runde - BWT Oberösterreichische Arena - 0:2",
        image:       "bilder/sessions/ried_austriawien_08_03_2026/1M3A2890.jpg",
        link:        "sessions/ried-austria-1.html"
    },

    {
        date:        "2026-01-12",
        dateText:    "12. Januar 2026",
        title:       "Beate Meinl-Reisinger bei PolEdu",
        description: "PolEdu Podiumsdiskussion mit Beate Meinl-Reisinger (NEOS)",
        image:       "bilder/sessions/session-politik-1/20260112_4545.jpg",
        link:        "sessions/politik-1.html"
    },

    {
        date:        "2026-01-10",
        dateText:    "10. Jänner 2026",
        title:       "Austria Wien – Donaufeld",
        description: "Testspiel – Austria Akademie – 5:1",
        image:       "bilder/sessions/austriawien_donaufeld_10_01_2026/1M3A8342.jpg",
        imagePos:    "center 20%",
        link:        "sessions/austria-donaufeld-1.html"
    }

];
