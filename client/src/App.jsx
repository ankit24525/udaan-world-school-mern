import { BrowserRouter, Route, Routes } from "react-router-dom";

import About from "./components/About.jsx";
import AuthGuard from "./components/AuthGuard.jsx";
import Chairman from "./components/Chairman.jsx";
import Creativity from "./components/Creativity.jsx";
import Facilities from "./components/Facilities.jsx";
import Hero from "./components/Hero.jsx";
import Partners from "./components/Partners.jsx";
import QuickAccessBand from "./components/QuickAccessBand.jsx";
import SportsFeature from "./components/SportsFeature.jsx";
import StudentStories from "./components/StudentStories.jsx";
import Testimonials from "./components/Testimonials.jsx";
import WhyChooseUs from "./components/WhyChooseUs.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import PublicLayout from "./layout/PublicLayout.jsx";
import AdmissionEnquiryPage from "./pages/AdmissionEnquiryPage.jsx";
import AdminGuidePage from "./pages/AdminGuidePage.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import BlogsPage from "./pages/BlogPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import CareersPage from "./pages/CareersPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import FeeStructurePage from "./pages/FeeStructurePage.jsx";
import StandardPage from "./pages/StandardPage.jsx";
import TeachersPage from "./pages/TeachersPage.jsx";
import AcademicsManagement from "./pages/admin/AcademicsManagement.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdmissionsManagement from "./pages/admin/AdmissionsManagement.jsx";
import Blogs from "./pages/admin/Blogs.jsx";
import ClassManagement from "./pages/admin/ClassManagement";
import ContentManagement from "./pages/admin/ContentManagement.jsx";
import FacilitiesManagement from "./pages/admin/FacilitiesManagement";
import GalleryManagement from "./pages/admin/GalleryManagement.jsx";
import ManageEnquiries from "./pages/admin/ManageEnquiries.jsx";
import PageEditor from "./pages/admin/PageEditor.jsx";
import Settings from "./pages/admin/Settings.jsx";
import StaffManagement from "./pages/admin/StaffManagement";
import StaffProfile from "./pages/admin/StaffProfile.jsx";
import StudentManagement from "./pages/admin/StudentManagement.jsx";
import StudentProfile from "./pages/admin/StudentProfile";

function HomePage() {
  return (
    <>
      <Hero />
      <QuickAccessBand />
      <About />
      <Creativity />
      <SportsFeature />
      <Chairman />
      <WhyChooseUs />
      <StudentStories />
      <Facilities />
      <Partners />
      <Testimonials />
    </>
  );
}

function AdminProtected({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={<AdminProtected><AdminLayout /></AdminProtected>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="admissions" element={<AdmissionsManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="editor/:key" element={<PageEditor />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="staff/:id" element={<StaffProfile />} />
          <Route path="academics" element={<AcademicsManagement />} />
          <Route path="enquiries" element={<ManageEnquiries />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="facilities" element={<FacilitiesManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="blogs" element={<Blogs />} />
        </Route>

        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />

          <Route path="about-us" element={<StandardPage pageKey="about" />} />
          <Route path="day-school" element={<StandardPage pageKey="daySchool" />} />
          <Route path="residential" element={<StandardPage pageKey="residential" />} />
          <Route path="knowledge-partners" element={<StandardPage pageKey="knowledgePartners" />} />
          <Route path="founders" element={<StandardPage pageKey="founders" />} />
          <Route path="director-message" element={<StandardPage pageKey="chairman" />} />
          <Route path="chairman-message" element={<StandardPage pageKey="chairman" />} />
          <Route path="chairmans-message" element={<StandardPage pageKey="chairman" />} />
          <Route path="principal-desk" element={<StandardPage pageKey="principal" />} />
          <Route path="principals-desk" element={<StandardPage pageKey="principal" />} />
          <Route path="senior-leader-team" element={<StandardPage pageKey="seniorLeaderTeam" />} />
          <Route path="events" element={<StandardPage pageKey="events" />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="admission-procedure" element={<StandardPage pageKey="admissionProcedure" />} />
          <Route path="fee-structure" element={<FeeStructurePage />} />
          <Route path="academics" element={<StandardPage pageKey="academics" />} />
          <Route path="results" element={<StandardPage pageKey="results" />} />
          <Route path="smart-classes" element={<StandardPage pageKey="smartClasses" />} />
          <Route path="labs" element={<StandardPage pageKey="labs" />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="academic-facilities" element={<StandardPage pageKey="academicFacilities" />} />
          <Route path="safe-campus" element={<StandardPage pageKey="safeCampus" />} />
          <Route path="holistic-growth" element={<StandardPage pageKey="coCurricular" />} />
          <Route path="co-curricular-facilities" element={<StandardPage pageKey="coCurricular" />} />
          <Route path="scholarships" element={<StandardPage pageKey="scholarships" />} />
          <Route path="sports-facilities" element={<StandardPage pageKey="sportsFacilities" />} />
          <Route path="library" element={<StandardPage pageKey="library" />} />
          <Route path="transport" element={<StandardPage pageKey="transport" />} />
          <Route path="cafeteria" element={<StandardPage pageKey="cafeteria" />} />
          <Route path="photo-gallery" element={<StandardPage pageKey="photoGallery" />} />
          <Route path="video-gallery" element={<StandardPage pageKey="videoGallery" />} />
          <Route path="events-gallery" element={<StandardPage pageKey="eventsGallery" />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="contact-us" element={<ContactPage />} />
          <Route path="admission-enquiry" element={<AdmissionEnquiryPage />} />
          <Route path="mandatory-public-disclosure" element={<StandardPage pageKey="mandatoryDisclosure" />} />
          <Route path="term-of-services" element={<StandardPage pageKey="terms" />} />
          <Route path="privacy-policy" element={<StandardPage pageKey="privacy" />} />
          <Route path="admin-guide" element={<AdminGuidePage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:id" element={<BlogDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
