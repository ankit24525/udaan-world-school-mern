import {
  Award,
  BadgeCheck,
  Beaker,
  BedDouble,
  Brain,
  BookOpen,
  BriefcaseBusiness,
  BusFront,
  CalendarDays,
  CircleCheck,
  CirclePlay,
  Clock3,
  Cpu,
  CreditCard,
  Dumbbell,
  Eye,
  FileText,
  FlaskConical,
  Goal,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Lightbulb,
  Mail,
  MapPin,
  Medal,
  Microscope,
  MonitorSmartphone,
  PenTool,
  Phone,
  School,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  UtensilsCrossed,
  UserCheck,
  Users,
  Wifi,
} from "lucide-react";

export const publicIconMap = {
  Award,
  BadgeCheck,
  Beaker,
  BedDouble,
  Brain,
  BookOpen,
  BriefcaseBusiness,
  BusFront,
  CalendarDays,
  CircleCheck,
  CirclePlay,
  Clock3,
  Cpu,
  CreditCard,
  Dumbbell,
  Eye,
  FileText,
  FlaskConical,
  Goal,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Lightbulb,
  Mail,
  MapPin,
  Medal,
  Microscope,
  MonitorSmartphone,
  PenTool,
  Phone,
  School,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  UtensilsCrossed,
  UserCheck,
  Users,
  Wifi,
};

export function splitParagraphs(value, fallback = []) {
  if (Array.isArray(value)) {
    const cleaned = value.map((item) => String(item).trim()).filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }

  if (typeof value === "string") {
    const cleaned = value
      .split(/\n\s*\n|\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }

  return fallback;
}

export function splitLines(value, fallback = []) {
  if (Array.isArray(value)) {
    const cleaned = value.map((item) => String(item).trim()).filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }

  if (typeof value === "string") {
    const cleaned = value
      .split(/\n|,|•/)
      .map((item) => item.trim())
      .filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }

  return fallback;
}

export function ensureArray(value, fallback = []) {
  return Array.isArray(value) && value.length ? value : fallback;
}

export function pickImage(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function resolveIcon(iconName, fallback = Sparkles) {
  return publicIconMap[iconName] || fallback;
}

export function getInitials(name = "") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return "UW";
  return parts.map((part) => part[0].toUpperCase()).join("");
}
