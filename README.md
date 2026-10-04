# 🔍 DocuLens - AI-Powered Multi-Document Evidence & Investigation Platform

> **DocuLens** is an advanced, domain-aware document intelligence and evidentiary investigation enclave designed for deep multi-document cross-examination, domain-specific NLP synthesis (ML/AI research papers, rulebooks, financial records, and legal filings), interactive knowledge graph visualization, and audit-ready PDF executive report generation.

---

## 🚨 Problem Addressed

Traditional document management tools, PDF readers, and generic chatbot interfaces suffer from critical bottlenecks when handling complex technical, financial, and legal case files:

1. **Information Silos & Single-Document Tunnel Vision**: Existing AI Q&A tools process documents in isolation. Investigators cannot cross-examine multiple case files simultaneously or synthesize comparative insights across multiple technical papers or rulebooks.
2. **Hallucination & Lack of Auditable Citations**: Generic LLM assistants frequently output unverified assertions without explicit line-by-line page numbers, section headers, or exact verbatim text quotes from source files.
3. **Domain Agnosticism**: Standard summarizers treat a deep Machine Learning paper (with mathematical backpropagation equations and learning rate dynamics) identically to a legal contract, omitting critical domain metrics, hyperparameter formulations, or compliance clauses.
4. **Unpersistent State & Disappearing Selections**: File selections and active evidence sets reset on navigation or refresh, forcing analysts to re-upload and re-select documents repeatedly.
5. **Lack of Audit-Ready Reporting**: Exporting investigation findings requires manual copy-pasting, producing unstructured text rather than formal, branded PDF executive summaries with verified citation tables.
6. **UI Contrast & Readability Flaws**: Dark mode implementations in existing tools suffer from low-contrast badges, unreadable white-on-white text, or broken layouts.

---

## 💡 Solution

**DocuLens** addresses these challenges by delivering an enterprise-grade, privacy-first evidentiary investigation workbench featuring:

- **Simultaneous Multi-Document Synthesis Engine**: Ingest and query multiple case files concurrently. Cross-examine technical algorithms, rulebook constraints, or event timelines across an entire file enclave.
- **Domain-Aware NLP Classifier & Summarizer**: Dynamically categorizes documents (e.g., *Technical / Machine Learning Research*, *Financial & Tax Filings*, *Legal & Corporate Rulebooks*) and extracts domain-specific parameters (e.g., neural architecture, loss functions, learning rate schedules, gradient equations, compliance clauses).
- **100% Auditable Citations & Confidence Scoring**: Every AI response includes quantitative confidence metrics (e.g., `99% Verified`) and expandable citation cards showing exact document titles, page numbers, section headers, and verbatim quotes.
- **Persistent Local Database Enclave**: Built-in encrypted storage enclave (`localStorage` & IndexedDB pattern) preserving document indices, user sessions, active document selections (`doculens_selected_docs_v1`), and bookmarked evidence findings across page reloads.
- **Interactive SVG Knowledge Graph & Entity Index**: Visualizes relationships between named entities, neural network models, financial figures, and document nodes on an interactive SVG canvas.
- **Case Chronology Timeline**: Automatically reconstructs event sequences from document ingestion, OCR parsing, and execution timestamps.
- **Executive PDF Report Generator**: One-click generation of formal PDF executive summaries with structured findings, citation tables, and domain metrics, automatically formatted for print/export (with left sidebar hidden).
- **Cyber Obsidian Dark Mode (`theme-cyber-dark`)**: Permanent, sleek dark theme crafted with high-contrast text (`#38BDF8` cyan, `#A855F7` purple, `#1E293B` navy background) ensuring 100% legibility across all components.

---

## ✨ Key Features

| Component | Description |
| :--- | :--- |
| **🏠 Command Portal Dashboard** | Personalized investigator welcome header (`"Welcome back, [Name]! What would you like to do today?"`), one-click suggested query chips, and quick-launch task cards. |
| **📁 Evidence Vault** | Secure archived repository with document search, category filtering (*Technical / Research*, *Legal / Contract*, *Financial*, *Rulebook*), multi-file selection checkboxes, and document reader modals. |
| **💬 Multi-Doc AI Workspace** | Dual-pane investigation workspace with persistent document selection drawers, quick-action mode bars (*Ask*, *Compare*, *Timeline*, *Summarize*, *Investigate*), and evidentiary bookmarking. |
| **🕸️ Evidence Graph Network** | Interactive SVG knowledge graph visualizing entity nodes, technical dependencies, financial flows, and document cross-links. |
| **⏱️ Case Chronology Timeline** | Chronological stream detailing file ingestion, OCR parsing events, audit timestamps, and key milestone logs. |
| **🏷️ Smart Entity Index** | Automatic NLP extraction of named entities (models, algorithms, people, organizations, financial figures, document IDs) with frequency metrics. |
| **📊 Analytics Insights** | Quantitative metrics dashboard featuring document category distribution charts, entity node density, and RAG vector performance metrics. |
| **🔖 Saved Findings Manager** | Curated evidentiary bookmark collection with full-text quotes, citation badges, and quick export to PDF. |
| **📄 Executive Report Generator** | Audit-ready PDF report builder rendering executive summaries, verified quote tables, domain metrics, and signature blocks. |

---

## 🛠️ Tech Stack & Architecture

### **Frontend & Framework**
- **React 18** (Functional components, custom Hooks, state persistence)
- **Vite 8** (Lightning-fast HMR and optimized production bundling)
- **Tailwind CSS v4** (Utility-first styling with custom Cyber Obsidian dark mode palette)
- **Lucide React** (Modern SVG icons)

### **PDF Generation & Export**
- **jspdf & html2canvas**: High-resolution client-side canvas rendering and multi-page PDF compilation with print media query rules (`@media print`).

### **Persistence & Local Database**
- **Custom Local Database Enclave (`src/services/dbService.js`)**: Isolated local storage service enforcing mandatory authentication sessions, document enclave storage, bookmark persistence, and theme selection.

---

## 📦 External APIs, Datasets, Libraries & AI Tools Used

| Dependency / Tool | Category | Usage & Purpose |
| :--- | :--- | :--- |
| `react` & `react-dom` | UI Framework | Core reactive UI component architecture |
| `vite` | Build Tool / Dev Server | Fast bundling, HMR, and asset resolution |
| `tailwindcss` | CSS Framework | Modern styling, dynamic grid layouts, and custom dark mode themes |
| `lucide-react` | Iconography | Crisp vector icons across all dashboard and workspace views |
| `jspdf` | PDF Engine | Programmatic client-side PDF document creation |
| `html2canvas` | DOM Capture | High-fidelity canvas rendering of report components for PDF compilation |
| **Antigravity AI Pair Programmer** | AI Tool | AI-assisted development, architectural refactoring, and automated testing |

---

## 🚀 Quick Start & Installation

### **Prerequisites**
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### **1. Clone the Repository**
```bash
git clone https://github.com/SanjanaTech19/DocuLens.git
cd DocuLens
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start Development Server**
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### **4. Build for Production**
```bash
npm run build
```
The optimized production build will be generated in the `dist/` directory.

---

## 🔒 Security & Privacy

- **Local Enclave Processing**: All document parsing, entity indexing, and session data remain securely within the user's browser storage enclave (`localStorage` / memory).
- **Zero Third-Party Data Leakage**: No sensitive case files or user documents are uploaded to external third-party servers.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
