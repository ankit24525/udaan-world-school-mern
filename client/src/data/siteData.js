import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  School,
  Sparkles,
  Star,
  Trophy,
  User,
  Utensils,
  X,
} from "lucide-react";

export const Icons = {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  School,
  Sparkles,
  Star,
  Trophy,
  User,
  Utensils,
  X,
};

export const links = {
  home: "/",
  enquiry: "/admission-enquiry",
  admission: "/admission-enquiry",
  procedure: "/admission-procedure",
  about: "/about-us",
  contact: "/contact-us",
  disclosure: "/mandatory-public-disclosure",
};

export const navItems = [
  { label: "Home", href: links.home },
  {
    label: "About Us",
    items: [
      { label: "About School", href: links.about },
      { label: "Founders", href: "/founders" },
      { label: "Chairman Message", href: "/chairman-message" },
      { label: "Principal Desk", href: "/principal-desk" },
      { label: "Senior Leader Team", href: "/senior-leader-team" },
      { label: "Mandatory Public Disclosure", href: links.disclosure },
      { label: "Events", href: "/events" },
    ],
  },
  {
    label: "Admissions",
    items: [
      { label: "Admission Procedure", href: links.procedure },
      { label: "Fee Structure", href: "/fee-structure" },
      { label: "Admission Enquiry", href: links.admission },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "Curriculum", href: "/academics" },
      { label: "Results", href: "/results" },
      { label: "Smart Classes", href: "/smart-classes" },
      { label: "Labs", href: "/labs" },
    ],
  },
  {
    label: "Facilities",
    items: [
      { label: "Sports Facilities", href: "/sports-facilities" },
      { label: "Library", href: "/library" },
      { label: "Transport", href: "/transport" },
      { label: "Hostel", href: "/hostel" },
      { label: "Cafeteria", href: "/cafeteria" },
    ],
  },
  {
    label: "Gallery",
    items: [
      { label: "Photo Gallery", href: "/photo-gallery" },
      { label: "Video Gallery", href: "/video-gallery" },
      { label: "Events Gallery", href: "/events-gallery" },
    ],
  },
  { label: "Careers", href: "/careers" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact us", href: links.contact },
];

export const images = {
  logo: "/udaan-world-logo.jpeg",
  hero1: "/images/people/director.jpeg",
  hero2: "/images/people/principal.jpeg",
  join: "/udaan-world-logo.jpeg",
  champions: "/images/people/founder.jpeg",
  chairman: "/images/people/director.jpeg",
  sport1: "/images/people/director.jpeg",
  sport2: "/images/people/principal.jpeg",
  sport3: "/images/people/founder.jpeg",
  sport4: "/udaan-world-logo.jpeg",
};

export const featureCards = [
  {
    title: "Academic Excellence:",
    image: "/images/people/principal.jpeg",
    text: "Academic brilliance is a way of life. Our innovative curriculum builds critical thinking, problem-solving skills, and a lifelong love for learning.",
  },
  {
    title: "Healthy Meal Program:",
    image: "/udaan-world-logo.jpeg",
    text: "Balanced meals with fresh, locally sourced ingredients help students develop healthy eating habits and stronger concentration.",
  },
  {
    title: "Liberation",
    image: "/images/people/director.jpeg",
    text: "A library revolution program that encourages students to explore potential, creativity, mentorship, and independent thinking.",
  },
  {
    title: "STEM Lab",
    image: "/images/people/founder.jpeg",
    text: "Our STEM Lab by Rancho Labs gives students hands-on projects in robotics, coding, engineering, and real-world problem solving.",
  },
  {
    title: "Personality Development Program:",
    image: "/images/people/principal.jpeg",
    text: "With Wonder Brains, students build communication, confidence, leadership, public speaking, teamwork, and emotional intelligence.",
  },
  {
    title: "Akshayapatra:",
    image: "/udaan-world-logo.jpeg",
    text: "Students share essentials on birthdays for people in need, nurturing empathy, social responsibility, compassion, and generosity.",
  },
];

export const partnerLogos = [
  "/udaan-world-logo.jpeg",
  "/udaan-world-logo.jpeg",
  "/udaan-world-logo.jpeg",
  "/udaan-world-logo.jpeg",
  "/udaan-world-logo.jpeg",
];

export const testimonials = [
  {
    name: "Amit Gupta",
    text: "Udaan World School has transformed my child's learning experience. The caring teachers and innovative teaching methods ensure holistic growth.",
  },
  {
    name: "Nisha Sharma",
    text: "The school's emphasis on values and academics is exceptional. My daughter has grown confident and excels in her studies.",
  },
  {
    name: "Ravi Mehra",
    text: "Udaan nurtures young minds with the perfect blend of discipline, creativity, and extracurricular activities.",
  },
  {
    name: "Suman Verma",
    text: "I am impressed with the personalized attention given to each student. My child's academic and social skills have improved immensely at Udaan.",
  },
  {
    name: "Manoj Singh",
    text: "Udaan focuses on overall development, blending academics with extracurriculars seamlessly. My son has become more confident.",
  },
];

export const schoolInfo = {
  name: "Udaan World School",
  address: "Tewari's Richolla Farm, Baheri, Bareilly, U.P. 243201",
  website: "www.udaanworldschool.com",
  email: "udaanworldschool@gmail.com",
  phone: ["8650105946", "7351171361"],
  schoolCode: "61328",
};

export const documents = [
  { title: "Admission Form", href: "/documents/admission-form.docx", type: "DOCX" },
  { title: "Affiliation Letter", href: "/documents/affiliation-letter.pdf", type: "PDF" },
  { title: "Affiliation Letter Alternate", href: "/documents/affiliation-letter-alt.pdf", type: "PDF" },
  { title: "Recognition Certificate", href: "/documents/recognition-certificate.pdf", type: "PDF" },
  { title: "Trust Certificate", href: "/documents/trust-certificate.pdf", type: "PDF" },
  { title: "Teacher List", href: "/documents/teacher-list.xlsx", type: "XLSX" },
];

export const feeRows = [
  ["Form Fees", "600"],
  ["Admission Fee", "5000"],
  ["Annual Charges", "2600"],
  ["Exam Fee", "2000"],
  ["N.C", "1300"],
  ["L.K.G", "1400"],
  ["U.K.G", "1450"],
  ["I", "1550"],
  ["II", "1650"],
  ["III", "1700"],
  ["IV", "1750"],
  ["V", "1850"],
  ["VI", "1900"],
  ["VII", "1980"],
  ["VIII", "2030"],
  ["IX", "2500"],
  ["X", "2500"],
  ["XI (Commerce)", "3100"],
  ["XI (Science)", "3300"],
  ["XII (Commerce)", "3500"],
  ["XII (Science)", "3700"],
];

export const teachers = [
  ["Naina Sidharth Tewari", "Director"],
  ["Balwant Singh", "Principal"],
  ["Simerjeet Kaur", "Co-ordinator"],
  ["Shurabh Singh", "Accountant"],
  ["Sakshi Chaudhary", "PRT"],
  ["Sumaira Khan", "PRT"],
  ["Gabrial Michal Vikas", "PGT English"],
  ["Sangeeta", "PGT Hindi"],
  ["Sourabh Chugh", "PGT Accounts"],
  ["Manpreet Kaur", "PRT"],
  ["Ram Avtar", "PGT Math"],
  ["Gurjeet Kaur", "PRT"],
  ["Nida Syed", "TGT SST"],
  ["Mahefooj", "PGT Biology"],
  ["Mohd Izhar Zafri", "PGT IT"],
  ["Amit Sharma", "TGT Hindi"],
  ["Pradeep", "TGT Science"],
  ["Hemendra Kumar", "PGT Chemistry"],
  ["Darshan Singh", "PTI"],
  ["Arjun Chauhan", "PGT Physics"],
  ["Harvinder Singh", "TGT English"],
  ["Suresh Pal", "Transport Incharge"],
];

export const leadership = [
  {
    name: "Naina Sidharth Tewari",
    role: "Director",
    image: "/images/people/director.jpeg",
    message: "Our aim is to give every child the confidence to take flight through strong academics, creativity, discipline, and care.",
  },
  {
    name: "Balwant Singh",
    role: "Principal",
    image: "/images/people/principal.jpeg",
    message: "A school becomes meaningful when students feel safe, challenged, supported, and inspired every day.",
  },
];
