# ADR-001: GitHub Pages statt Hetzner-Static-Hosting, kein Login/Backend

**Datum:** 2026-08-16
**Status:** aktiv
**Projekt:** Pool Einwintern

## Problem

Josef wollte eine PWA analog zu OrgKompass, aber mit Ziel/Inhalt „Anleitung zum Pool Einwintern" – eine reine Checkliste, kein Lerncontent. Umgesetzt aus einer Claude-Code-Session, die direkt auf dem Hetzner-Server (`claudecode`-User) läuft, nicht vom Mac aus. Dieser User hat bewusst kein `sudo`/root (Sicherheitsdesign des Claude-Code-Hetzner-Setups) – direktes Deployment nach `/opt/...` oder nginx-Config-Änderungen (wie beim `/verkehr/`- oder `/qg-ts-report/`-Pattern) sind aus dieser Session heraus nicht möglich.

## Entscheidung

1. **Kein Login/Backend** – reine statische PWA (Single-File `index.html` + `manifest.json` + `sw.js` + Icons), Fortschritt nur clientseitig in `localStorage`.
2. **Hosting via GitHub Pages** statt Hetzner-Static – vollständig aus dieser Session heraus deploybar (`gh` CLI, bereits als `sEppofaz` authentifiziert), kein root/SSH-Zugriff nötig.

## Begründung

- Inhalt ist eine reine Wartungsanleitung ohne sensible Daten (im Gegensatz zu OrgKompass, wo Login primär dem Schutz vor unkontrollierten Claude-API-Kosten diente) – kein Login-Zweck vorhanden.
- Kein Claude-API-Einsatz (kein Quiz, keine Frage-Funktion) – kein Backend nötig, keine laufenden Kosten.
- GitHub Pages ist der in `BKM/PWA-Standards.md` dokumentierte Standardweg für backend-lose PWAs und funktioniert ohne Server-Rechte.

## Verworfen

| Alternative | Warum verworfen |
|---|---|
| 1:1-Kopie der OrgKompass-Architektur (Flask-Backend, Login, Hetzner) | Unnötiger Aufwand ohne Claude-API-Nutzung oder sensible Daten; von Josef per `AskUserQuestion` explizit gegen Login entschieden |
| Hetzner-Static-Hosting wie `/verkehr/`/`/qg-ts-report/` | Nicht möglich aus dieser Session – `claudecode`-User hat kein root, kann `/opt/...` und nginx nicht anfassen |
| 3-Abschnitte-Einzelseite statt Tab-Bar | Von Josef per `AskUserQuestion` explizit gegen die einfachere Variante entschieden – 3 Tabs analog OrgKompass gewünscht |

## Gilt unter

Gilt solange die App inhaltlich eine reine (nicht-sensible) Checkliste ohne API-Anbindung bleibt. Käme z. B. eine Claude-API-gestützte Funktion hinzu, wäre die Login-/Backend-Frage neu zu bewerten (analog OrgKompass-ADR-002).

## Konsequenzen

- Deployment ausschließlich über `git push` auf `main` (kein manuelles Server-Deployment, kein `SOPs`/`Server-Deployment.md`-Flow nötig).
- Live-URL ist öffentlich ohne Zugriffsschutz erreichbar: `https://seppofaz.github.io/PoolEinwintern/`.
- Kein Eintrag in Project-Insight-App-`data/`-Schema mit Server-Metadaten (Port, systemd-Service) nötig – reine statische Seite.
