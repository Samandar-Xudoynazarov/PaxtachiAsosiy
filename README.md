# 🌾 Paxtachi — Qishloq Xo'jaligi Boshqaruv Paneli

Zamonaviy, professional qishloq xo'jaligi boshqaruv tizimi.

## 🚀 Loyihani ishga tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Development serverini ishga tushirish
npm run dev

# 3. Build qilish
npm run build
```

## 🔧 Sozlash

`src/services/api.ts` faylida `BASE_URL` ni o'zgartiring:

```ts
const BASE_URL = 'http://localhost:8080'  // Backend URL
```

## 📁 Loyiha strukturasi

```
src/
├── components/
│   └── ui/           # Reusable UI components (Table, Modal, StatCard, ...)
├── layouts/
│   └── DashboardLayout.tsx   # Sidebar + Navbar layout
├── pages/
│   ├── auth/         # Login sahifasi
│   ├── dashboard/    # Asosiy dashboard + chartlar
│   ├── farmers/      # Fermerlar CRUD
│   ├── cadastre/     # Kadastr yozuvlari CRUD
│   ├── agro/         # Agro texnikalar CRUD
│   ├── greenhouse/   # Issiqxona CRUD
│   ├── pump/         # Nasos stansiyalari
│   ├── land/         # Yer balansi
│   ├── contours/     # Yer konturlari
│   ├── representatives/ # Fermer vakillari
│   ├── specializations/ # Ixtisosliklar
│   ├── users/        # Foydalanuvchilar
│   ├── excel/        # Excel import
│   └── settings/     # Sozlamalar
├── services/
│   └── api.ts        # Barcha API chaqiruvlari (Axios)
├── types/
│   └── index.ts      # TypeScript interfacelari
└── utils/
    ├── AuthContext.tsx  # Auth holati
    ├── useCrud.ts       # Universal CRUD hook
    └── helpers.ts       # Yordamchi funksiyalar
```

## ✨ Asosiy imkoniyatlar

- 🔐 Token-based autentifikatsiya (JWT)
- 📊 Interaktiv grafiklar (Recharts)
- 📋 CRUD operatsiyalar (yaratish, o'qish, yangilash, o'chirish)
- 🔍 Qidiruv va filtr
- 📄 Pagination
- 📤 Excel import
- 📱 Responsive dizayn (mobile, tablet, desktop)
- 🎨 Yashil-ko'k gradient dizayn
- ⚡ Loading skeleton va error states

## 🎨 Dizayn tizimi

| Rang | Vazifa |
|------|--------|
| `#16a34a` (green-600) | Asosiy brend rangi |
| `#2563eb` (blue-600)  | Accent va statistika |
| `#f8fafc` | Fon rangi |
| `#0f172a` | Matn rangi |

## 🛠 Texnologiyalar

- **React 18** + TypeScript
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Axios** — HTTP requests
- **React Router v6** — routing
- **Recharts** — grafiklar
- **Lucide React** — iconlar
