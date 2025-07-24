# ✨ glow-navbar

> A beautifully animated, gooey-style radial navigation bar built with React, Framer Motion, and Lucide icons. Perfect for modern portfolios, dashboards, or experimental UI projects.

---

## 📦 Installation

Install via NPM:

```bash
npm i glow-navbar
or with Yarn:

bash
Copy
Edit
yarn add glow-navbar
🚀 Quick Start
tsx
Copy
Edit
import React from 'react';
import { GlowNavbar } from 'glow-navbar';
import { Home, User, Mail, Settings } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, href: '#home', angle: 0 },
  { label: 'Profile', icon: User, href: '#profile', angle: 90 },
  { label: 'Messages', icon: Mail, href: '#messages', angle: 180 },
  { label: 'Settings', icon: Settings, href: '#settings', angle: 270 },
];

const App = () => (
  <div style={{ height: '100vh', backgroundColor: '#0f172a' }}>
    <GlowNavbar navItems={navItems} />
  </div>
);

export default App;
🧩 Props
GlowNavbar
Prop	Type	Required	Description
navItems	NavItem[]	✅	Array of nav items with icons and angles

NavItem type
ts
Copy
Edit
interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  angle: number; // Degrees from center (0 = top)
}
🌟 Features
🌀 Gooey blob animation via SVG filters

⚡ Smooth Framer Motion transitions

🧠 Smart radial layout via angle

🎨 Dark theme ready

🛠 Built with TypeScript

🔗 Local Development
To link this component into your own project:

bash
Copy
Edit
cd glow-navbar
npm link

cd your-react-app
npm link glow-navbar
📄 License
MIT © Aditya Mishra

💡 Credits
Built with ❤️ using:

Framer Motion

Lucide Icons

React
