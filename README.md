# Invoice Generator PWA

An offline-first, highly robust Progressive Web Application built for professional invoice creation. Manage multiple firms, clients, and catalog items instantly, and generate perfectly formatted PDF tax invoices that can map directly to different firm identities.

## ✨ Features

- **Multi-Firm Management**: Manage several firm identities in one place. Each firm profile can have its own dedicated logo, bank/UPI details, and default PDF styling template.
- **Smart Analytics & Auto-Numbering**: The application automatically tracks the last invoice sequencing and intelligently computes the next auto-incrementing invoice number using your firm initials and current year (e.g., `INITIALS-YYXXXXX`), without breaking upon manual overrides!
- **State-of-the-Art PDF Engine**: Uses `@react-pdf/renderer` exclusively down to the DOM to guarantee sharp, native PDF layouts with zero HTML-printing quirks.
- **5 Distinct PDF Themes**: Includes highly varied template designs tailored for any industry:
  - *Standard Corporate*: Traditional boxed styling standard for Indian formal invoicing.
  - *Modern Minimal*: Asymmetrical, clean, highly spacious structure.
  - *Creative Accent*: Colorful block layouts.
  - *Elegant Serif*: Times-Roman centric classic consultancy look.
  - *Bold Dark*: Deep, high-contrast blocky structural heading.
- **Local Persistence & PWA**: Data is 100% strictly yours and operates offline. Data syncs locally to IndexedDB using `idb-keyval` paired with `Zustand`. Install the app to your desktop or mobile phone like a native application!
- **Taxation Engine**: Integrated with complex calculation graphs for mapping Interstate vs Intrastate tax logics directly against item lines instantly.
- **Data Portability**: Full JSON system import/export capabilities, allowing you to instantly back-up or transition your state to another locally installed device.

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Storage**: [idb-keyval](https://github.com/jakearchibald/idb-keyval)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠 Setup, Build, & Deployment

To run this application locally, ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Local Development
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run Development Server:**
   ```bash
   npm run dev
   ```

### Production Build & Hosting
Because this app relies entirely on frontend client-side technologies without any expensive backend databases, you can host it for free indefinitely on static hosts.

1. **Build the Application:**
   ```bash
   npm run build
   ```
   This compiles the React app and `@react-pdf` engine into an optimized set of static files found in the generated `dist/` folder. The command also automatically injects the PWA `manifest.webmanifest` and Workbox `sw.js` files into `dist/` allowing it to handle offline installations flawlessly.

2. **Test the Build Locally:**
   ```bash
   npm run preview
   ```
   This serves the optimized `dist` folder precisely as it appears on live hosting.

3. **Deploy (Free Services):**
   You can drag, drop, or connect your repository directly via Github to the following services using `dist` as your publish folder:
   - **Vercel**
   - **Netlify**
   - **Cloudflare Pages**
   - **GitHub Pages**

## 📦 Core Workflows

1. Run the application and open **Settings** from the sidebar. 
2. Register your "Firms" first (Logo and details). Select them as active!
3. Add frequently billed "Clients" into your Address Book.
4. Add frequently sold services or items into your "Items Catalog".
5. Navigate back to "Dashboard" and click "New Invoice". The application computes your numbers, pulls your settings, and generates a live-updating PDF instantly as you assemble your item lines. Click "Save Completed" and "Download PDF" to exit workflow!
