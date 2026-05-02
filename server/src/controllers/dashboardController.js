import Content from "../models/Content.js";
import Enquiry from "../models/Enquiry.js";
import Student from "../models/Student.js";

function timeAgo(date) {
  if (!date) return "Recently";

  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export async function getDashboard(req, res) {
  const [
    totalStudents,
    newAdmissions,
    totalBlogs,
    totalGallery,
    totalEvents,
    totalJobs,
    allEnquiries,
    recentBlogs,
    recentEvents,
    recentStudents,
  ] = await Promise.all([
    Student.countDocuments(),
    Enquiry.countDocuments({ type: "admission" }),
    Content.countDocuments({ type: "blog" }),
    Content.countDocuments({ type: "gallery" }),
    Content.countDocuments({ type: "event", published: true }),
    Content.countDocuments({ type: "career" }),
    Enquiry.find().sort({ updatedAt: -1, createdAt: -1 }).limit(20).lean(),
    Content.find({ type: "blog" }).sort({ updatedAt: -1, createdAt: -1 }).limit(5).lean(),
    Content.find({ type: "event" }).sort({ eventDate: 1, updatedAt: -1 }).limit(5).lean(),
    Student.find().sort({ _id: -1 }).limit(5).lean(),
  ]);

  const careerApplications = allEnquiries.filter((item) => item.type === "career");
  const hiredStaff = careerApplications.filter((item) => ["hired", "approved"].includes(item.status)).length;
  const pendingAdmissions = allEnquiries.filter(
    (item) => item.type === "admission" && ["new", "under_review", "contacted", "test_scheduled"].includes(item.status)
  ).length;
  const pendingCareerApplications = careerApplications.filter((item) =>
    ["new", "under_review", "shortlisted", "interview_scheduled"].includes(item.status)
  ).length;
  const contactEnquiries = allEnquiries.filter((item) => item.type === "contact").length;
  const upcomingEvents = recentEvents.filter((item) => !item.eventDate || new Date(item.eventDate) >= new Date()).length;

  const recentActivity = [
    ...allEnquiries.slice(0, 8).map((item) => ({
      text:
        item.type === "career"
          ? `Teacher application from ${item.fullName || item.studentName || "Unknown applicant"}`
          : item.type === "admission"
            ? `New admission enquiry from ${item.studentName || item.parentName || "Unknown student"}`
            : `Contact message from ${item.fullName || item.parentName || item.studentName || "Visitor"}`,
      time: timeAgo(item.updatedAt || item.createdAt),
      timestamp: item.updatedAt || item.createdAt,
    })),
    ...recentBlogs.slice(0, 4).map((item) => ({
      text: `Blog updated: ${item.title}`,
      time: timeAgo(item.updatedAt || item.createdAt),
      timestamp: item.updatedAt || item.createdAt,
    })),
    ...recentStudents.slice(0, 4).map((item) => ({
      text: `Student profile added: ${item.name || "Unnamed Student"}`,
      time: timeAgo(item.createdAt || item.updatedAt),
      timestamp: item.createdAt || item.updatedAt,
    })),
  ]
    .filter((item) => item.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6)
    .map(({ text, time }) => ({ text, time }));

  const pendingActions = [
    {
      text: "Review Admission Applications",
      count: pendingAdmissions,
      type: pendingAdmissions > 10 ? "high" : pendingAdmissions > 0 ? "medium" : "low",
      href: "/admin/admissions",
    },
    {
      text: "Review Teacher Applications",
      count: pendingCareerApplications,
      type: pendingCareerApplications > 10 ? "high" : pendingCareerApplications > 0 ? "medium" : "low",
      href: "/admin/staff",
    },
    {
      text: "Manage Career Openings",
      count: totalJobs,
      type: totalJobs > 0 ? "low" : "medium",
      href: "/admin/staff",
    },
    {
      text: "Reply To Contact Enquiries",
      count: contactEnquiries,
      type: contactEnquiries > 5 ? "medium" : contactEnquiries > 0 ? "low" : "low",
      href: "/admin/enquiries",
    },
  ];

  res.json({
    stats: {
      totalStudents,
      newAdmissions,
      totalStaff: hiredStaff,
      upcomingEvents,
      totalBlogs,
      totalGallery,
      contactEnquiries,
    },
    recentActivity,
    pendingActions,
  });
}
