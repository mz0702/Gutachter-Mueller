# Sachverständigenbüro Arne Müller — Alternative: "Dark Cinematic"

Vollständig eigenständige, alternative Website (zweite Variante neben der hellen Editorial-Seite im übergeordneten Ordner). **Dark-Cinematic-Look**: warmes Anthrazit, großflächige Fotografie mit Verlauf, edler Amber-/Gold-Akzent, moderne Typografie (Sora + Hanken Grotesk).

## Vorschau
```bash
cd "Gutachter Müller"
python3 -m http.server 8000     # → http://localhost:8000/alternative/
```
Eigenständig & statisch — der Ordner `alternative/` enthält alles (eigene Bilder, Fonts, CSS, JS). Dateien 1:1 hochladen.

## Inhalt
- `index.html` — Startseite (Hero, Vorteile, Leistungen, Ablauf, Über mich, Bewertungen, FAQ, Kontakt)
- `impressum.html`, `datenschutz.html` — Rechtstexte wortgenau
- `assets/` — css, js, fonts (selbstgehostet, DSGVO), img, og-image
- `robots.txt`, `sitemap.xml`

## Hinweise
- Kontaktformular: `mailto`-Fallback + WhatsApp/Telefon; für Backend `data-endpoint` am `<form>` setzen (Honeypot ist drin).
- Keine externen Aufrufe (Fonts lokal, kein Analytics/Maps) → kein Cookie-Banner nötig.
- Impressum/Datenschutz wie bei der Hauptseite; ggf. USt-IdNr. ergänzen, Datenschutztext an genutzte Dienste anpassen.
