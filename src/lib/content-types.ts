// Client-safe content types and utilities
// This file contains only types and pure functions, no Node.js dependencies

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  authorImage?: string;
  date: string;
  tags: string[];
  image?: string;
  content: string;
  body: string; // HTML content for display
  toc: TOCItem[]; // Table of contents
  readingTime: number; // Estimated reading time in minutes
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface Page {
  slug: string;
  title: string;
  content: string;
  body: string;
  lastModified: string;
}

export interface MultiLangText {
  en: string;
  zh: string;
}

export interface HomepageContent {
  hero: {
    badge: MultiLangText;
    title: MultiLangText;
    subtitle: MultiLangText;
    description: MultiLangText;
    primaryButton: {
      text: MultiLangText;
      url: string;
    };
    secondaryButton: {
      text: MultiLangText;
      url: string;
    };
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  features: {
    badge: MultiLangText;
    title: MultiLangText;
    description: MultiLangText;
  };
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  socialMedia: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface PricingPlan {
  id: string;
  name: MultiLangText;
  price: MultiLangText;
  period: MultiLangText;
  description: MultiLangText;
  features: MultiLangText[];
  buttonText: MultiLangText;
  buttonUrl: string;
  popular: boolean;
}

export interface PricingData {
  title: MultiLangText;
  subtitle: MultiLangText;
  plans: PricingPlan[];
  faq?: {
    title: MultiLangText;
    items: Array<{
      question: MultiLangText;
      answer: MultiLangText;
    }>;
  };
}

export interface FAQQuestion {
  id: string;
  question: MultiLangText;
  answer: MultiLangText;
}

export interface FAQCategory {
  id: string;
  name: MultiLangText;
  questions: FAQQuestion[];
}

export interface FAQData {
  title: MultiLangText;
  subtitle: MultiLangText;
  categories: FAQCategory[];
}

// Home page content types
export interface NavigationData {
  logo: {
    text: MultiLangText;
    url: string;
  };
  menuItems: Array<{
    id: string;
    label: MultiLangText;
    href: string;
    type: 'anchor' | 'page';
  }>;
  languageSwitch: {
    enabled: boolean;
    languages: Array<{
      code: string;
      label: string;
      flag: string;
    }>;
  };
  ctaButton: {
    text: MultiLangText;
    href: string;
    style: string;
  };
}

export interface HeroData {
  badge: MultiLangText;
  title: MultiLangText;
  subtitle: MultiLangText;
  description: MultiLangText;
  primaryButton: {
    text: MultiLangText;
    href: string;
    style: string;
  };
  secondaryButton: {
    text: MultiLangText;
    href: string;
    style: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  heroFeatures: Array<{
    id: string;
    icon: string;
    title: MultiLangText;
    description: MultiLangText;
  }>;
  backgroundVideo?: {
    enabled: boolean;
    url: string;
    poster: string;
  };
  backgroundImage?: {
    enabled: boolean;
    url: string;
    alt: string;
  };
}

export interface FeaturesData {
  badge?: MultiLangText;
  sectionTitle: MultiLangText;
  sectionSubtitle: MultiLangText;
  features: Array<{
    id: string;
    icon: string;
    title: MultiLangText;
    description: MultiLangText;
    benefits?: Array<MultiLangText>;
  }>;
  ctaSection?: {
    title: MultiLangText;
    description: MultiLangText;
    button: {
      text: MultiLangText;
      href: string;
    };
  };
}

export interface HomeFAQData {
  sectionTitle: MultiLangText;
  sectionSubtitle: MultiLangText;
  categories: FAQCategory[];
}

export interface FooterData {
  companyInfo: {
    name: string;
    description: MultiLangText;
    logo: {
      text: string;
      url: string;
    };
  };
  links: Array<{
    category: MultiLangText;
    items: Array<{
      label: MultiLangText;
      href: string;
    }>;
  }>;
  socialMedia: Array<{
    platform: string;
    label: string;
    url: string;
    icon: string;
  }>;
  newsletter: {
    title: MultiLangText;
    description: MultiLangText;
    placeholder: MultiLangText;
    buttonText: MultiLangText;
  };
  copyright: {
    text: MultiLangText;
  };
  bottomLinks: Array<{
    label: MultiLangText;
    href: string;
  }>;
}

// Client-safe utility functions
export function getLocalizedText(text: MultiLangText | string, locale: string = 'en'): string {
  if (!text) return '';

  if (typeof text === 'string') {
    return text;
  }

  if (typeof text === 'object' && text !== null) {
    return text[locale as keyof MultiLangText] || text.en || text.zh || '';
  }

  return String(text);
}

export function formatDate(dateString: string, locale: string = 'en'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
