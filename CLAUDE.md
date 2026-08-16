# Pool Einwintern

Statische PWA – jährliche Checkliste für die Winterfestmachung des Pools, in drei Phasen (Einwintern / Während dessen / Danach). Kein Backend, kein Login, kein Claude-API-Einsatz.

## Live

- **URL:** https://seppofaz.github.io/PoolEinwintern/
- **Repo:** `sEppofaz/PoolEinwintern` (public), Branch `main`
- **Hosting:** GitHub Pages (Branch `main`, Pfad `/`)

## Architektur

- Single-File `index.html` (HTML+CSS+JS inline), `manifest.json`, `sw.js`, Icons
- 3 Tabs (Bottom-Tab-Bar Variante A): Einwintern / Während dessen / Danach
- Checkbox-Zustand pro Punkt in `localStorage` (`pew_state`), Fortschrittsbalken oben
- Dark/Light: automatisch per `prefers-color-scheme` + manueller Umschalter im Info-Sheet (`pew_theme` in `localStorage`)
- Kein Login, kein Backend – bewusst abweichend vom OrgKompass-Pattern, da kein Claude-API-Einsatz und keine sensiblen Daten

## Warum GitHub Pages statt Hetzner-Static (ADR-001)

Gebaut aus einer Claude-Code-Session, die direkt auf dem Hetzner-Server läuft (`claudecode`-User). Dieser User hat bewusst **kein root/sudo** – kann also weder `/opt/...` noch nginx-Configs anfassen. GitHub Pages ist der BKM-Standardweg für backend-lose PWAs und lässt sich komplett aus dieser Session heraus deployen (`gh` CLI, bereits als `sEppofaz` authentifiziert). Siehe `ADR/ADR-001-github-pages-statt-hetzner.md`.

## Deployment

```bash
# lokal ändern, committen, pushen – GitHub Pages baut automatisch neu
git add <datei>
git commit -m "..."
git push
```

Kein Cache-Bump bei `index.html`-Änderungen nötig (network-first). Bei Icon-/Manifest-/`sw.js`-Änderungen: `CACHE`-Konstante in `sw.js` hochzählen (`pool-einwintern-v1` → `v2`).

## Icon-Erstellung

Lucide `snowflake`, Hintergrund `#0a5fa8`, weiße Striche. Erstellt via ImageMagick `convert` (nicht `qlmanage`/`sips` – Linux-Server, kein macOS; auch nicht `cairosvg`, da keine Server-seitige/dynamische Generierung nötig ist – reine statische PNGs im Repo):

```bash
convert -background none -density 300 icon.svg -resize 512x512 icon-512.png
convert -background none -density 300 icon.svg -resize 192x192 icon-192.png
convert -background none -density 300 icon.svg -resize 180x180 apple-touch-icon.png
```

## Inhalt pflegen

Alle Checklisten-Punkte liegen im `DATA`-Array in `index.html` (id, text je Punkt, gruppiert nach den 3 Phasen). Neue/geänderte Punkte dort eintragen; bestehende `id`s nicht ändern, sonst geht der gespeicherte Haken-Zustand bestehender Nutzer für diesen Punkt verloren.

## Pitfalls

- Branch-Name: `git init` auf diesem Server erzeugt standardmäßig `master`, nicht `main` – vor `gh api .../pages` auf `main` umbenannt (`git branch -m master main`, GitHub-Default-Branch per `gh api ... -X PATCH -f default_branch=main` umgestellt), sonst zeigt Pages auf den falschen/fehlenden Branch.
