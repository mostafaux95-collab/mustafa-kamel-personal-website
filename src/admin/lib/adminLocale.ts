// Admin dashboard UI-chrome translations. Scoped separately from the
// public site's src/locales/*.ts — this covers the dashboard's own
// interface strings (nav, buttons, statuses), not the bilingual content
// fields already editable per-entity (those stay EN/AR input pairs
// regardless of which language the admin UI itself is displayed in).
export const adminEn = {
  nav: {
    dashboard: "Dashboard",
    projects: "Projects",
    testimonials: "Testimonials",
    clients: "Clients",
    services: "Services",
    skills: "Skills",
    experience: "Experience",
  },
  layout: {
    admin: "Admin",
    theme: "Theme",
    signOut: "Sign out",
    language: "العربية",
  },
  login: {
    title: "Mustafa Kamel",
    subtitle: "Sign in to the admin dashboard",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    genericError: "Something went wrong. Try again.",
  },
  dashboard: {
    welcome: "Welcome back",
    subtitle: "Here's what's happening with your site.",
    comingSoon:
      "Case Studies, Blog, Media Library, Contact inbox, and Analytics land here as Phase 2 continues.",
  },
  common: {
    new: "New",
    total: "total",
    loading: "Loading…",
    empty: "Nothing here yet.",
    delete: "Delete",
    deleteConfirm: "Delete this item?",
    status: "Status",
    draft: "Draft",
    published: "Published",
    featured: "Featured",
    sortOrder: "Sort order",
    save: "Save changes",
    saving: "Saving…",
    cancel: "Cancel",
    search: "Search…",
  },
};

export type AdminLocale = typeof adminEn;

export const adminAr: AdminLocale = {
  nav: {
    dashboard: "الرئيسية",
    projects: "المشاريع",
    testimonials: "آراء العملاء",
    clients: "العملاء",
    services: "الخدمات",
    skills: "المهارات",
    experience: "الخبرات",
  },
  layout: {
    admin: "الإدارة",
    theme: "المظهر",
    signOut: "تسجيل الخروج",
    language: "English",
  },
  login: {
    title: "مصطفى كامل",
    subtitle: "سجّل الدخول إلى لوحة التحكم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ تسجيل الدخول…",
    genericError: "حدث خطأ ما، حاول مرة أخرى.",
  },
  dashboard: {
    welcome: "أهلاً بعودتك",
    subtitle: "إليك آخر مستجدات موقعك.",
    comingSoon:
      "دراسات الحالة، المدونة، مكتبة الوسائط، صندوق الرسائل، والتحليلات ستُضاف هنا مع استمرار المرحلة الثانية.",
  },
  common: {
    new: "جديد",
    total: "الإجمالي",
    loading: "جارٍ التحميل…",
    empty: "لا يوجد شيء هنا بعد.",
    delete: "حذف",
    deleteConfirm: "هل تريد حذف هذا العنصر؟",
    status: "الحالة",
    draft: "مسودة",
    published: "منشور",
    featured: "مميز",
    sortOrder: "الترتيب",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ…",
    cancel: "إلغاء",
    search: "بحث…",
  },
};
