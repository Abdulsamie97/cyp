# Cypress Test Generator mit DSL

Ein DSL-basiertes Framework zur Generierung von Cypress-Tests aus einer domänenspezifischen Sprache (DSL).  
Ermöglicht es, Tests deklarativ zu schreiben und automatisch ausführbaren JavaScript-Code für Cypress zu erzeugen.

---

## 📦 Projektstruktur

```
cypress_test_generator/
├── src/
│   ├── cli/
│   │   └── main.ts            # Einstiegspunkt für den Generator
│   ├── generator/
│   │   ├── generator.ts       # Codegenerierung
│   │   ├── selectors.ts       # Selector-Mapping
│   │   └── cli-util.ts        # CLI-Hilfsfunktionen
│   └── language/
│       ├── CypressTestGenerator.langium # DSL-Grammatik
│       ├── cypress-test-generator-validator.ts # Custom Validation
│       └── generated/         # Langium generierter Code
├── test/
│   └── dsl/
│       └── login.testdsl      # Beispielhafte DSL-Testdefinition
├── out/generated/             # Generierter Cypress-Testcode
├── cypress.config.js          # Cypress Konfiguration
├── package.json
└── README.md
```

---

## ✅ Voraussetzungen & Abhängigkeiten

### Software benötigt

- [Node.js](https://nodejs.org/) >= **18.x**
- [npm](https://www.npmjs.com/) >= **9.x**
- [Cypress](https://www.cypress.io/) (wird über npm installiert)
- [Langium](https://langium.org/) (als Dev-Abhängigkeit)

### Installation der Abhängigkeiten

```bash
npm install
```

> Bei Änderungen an der Grammatik:  
```bash
npx langium generate
```

---

## ✍️ DSL Syntax (Beispiel)

```dsl
TEST testLogin
  NAVIGATE TO "/"
  FILL loginuser WITH "meinBenutzer"
  FILL loginpass WITH "meinPasswort"
  CLICK loginButton
  EXPECT TEXT "Login erfolgreich"
```

> Die Werte wie `loginuser`, `loginpass`, `loginButton` werden durch ein Mapping (`selectors.ts`) in echte CSS-Selektoren umgewandelt.

---

## ⚙️ Selektor-Mapping

Datei: `src/generator/selectors.ts`

```ts
export const selectorMap: Record<string, string> = {
    loginuser: '.loginuser',
    loginpass: '.loginpass',
    loginButton: '#submitLogin',
};
```

---

## 🚀 Code generieren

```bash
npm run generate
```

Dieser Befehl:

- lädt die DSL-Datei (`.testdsl`)
- prüft sie mithilfe deiner Validatoren
- generiert eine `.cy.js`-Datei im Ordner `out/generated/`

---

## 🧪 Cypress ausführen

```bash
npx cypress open
```

Oder headless:

```bash
npx cypress run
```

Stelle sicher, dass in deiner `cypress.config.js` der `specPattern` korrekt gesetzt ist:

```js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'out/generated/**/*.cy.js',
  },
  baseUrl: "https://lsf.htw-berlin.de",
});
```

---

## ✅ Schritte zur Inbetriebnahme

1. Projekt initialisiert mit Langium:
   ```bash
   npx langium init
   ```
2. DSL-Grammatik geschrieben in `CypressTestGenerator.langium`
3. AST-Typen generiert mit:
   ```bash
   npx langium generate
   ```
4. Validierungsregeln hinzugefügt (`checkTestHasSteps`, `checkNavigateHasURL`, `checkFillNotEmpty`)
5. Custom Code Generator implementiert (`generator.ts`)
6. Selektor-Mapping erstellt (`selectors.ts`)
7. Cypress eingerichtet (`cypress.config.js`)
8. Tests generiert via `npm run generate`
9. Testlauf mit `npx cypress open` oder `npx cypress run`

---

## 🔁 Optional: Auto-Watch bei Änderungen

```bash
npm install --save-dev nodemon
```

In `package.json` ergänzen:

```json
"scripts": {
  "watch": "nodemon --watch src --ext ts --exec \"npm run generate\""
}
```

Dann ausführen:

```bash
npm run watch
```

---

## 👨‍💻 Autor / Mitwirkende

Entwickelt als Beispielprojekt für einen domänenspezifischen Test-Generator mit Langium + Cypress.

---

## 📝 Lizenz

MIT License
