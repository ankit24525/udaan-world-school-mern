const guideSections = [
  {
    title: "1. Start With The Dashboard",
    text: "Use the dashboard first to check new admissions, teacher applications, recent updates and pending actions. It gives the fastest overview of what needs attention today.",
  },
  {
    title: "2. Manage Website Content",
    text: "Open Pages when you want to update page text, section headings, cards, images, CTAs and structured layouts like About, Director Message, Events, Academics and Facilities pages.",
  },
  {
    title: "3. Use Gallery Management For Media",
    text: "Use Gallery Management for photo, video and events gallery items. Use Pages for page text and layout, but use Gallery Management for the actual gallery media library.",
  },
  {
    title: "4. Manage Students Carefully",
    text: "Open Student Management to search students, filter by class and open full profiles. Inside a student profile you can now upload the student photo, upload documents and update key profile details.",
  },
  {
    title: "5. Staff & Careers Workflow",
    text: "Use Staff & Careers to create job openings, review teacher applications and maintain real staff profiles. Staff members can now be added manually and opened as full profiles similar to student profiles.",
  },
  {
    title: "6. Settings Control Public Details",
    text: "Use Settings to update school name, contact details, social media links and admin password. The saved school email and social links are now used by the public footer.",
  },
];

const quickActions = [
  "Update school email and social links from Settings",
  "Add events from Content -> Events",
  "Upload gallery media from Gallery Management",
  "Edit public page sections from Content -> Pages",
  "Review admission enquiries from Admissions",
  "Review teacher applications from Staff & Careers",
];

export default function AdminGuidePage() {
  return (
    <main className="bg-white overflow-hidden">
      <section className="relative min-h-[58vh] flex items-center bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-900 text-white">
        <div className="containerx py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">Admin Guide</p>
          <h1 className="mt-6 text-5xl md:text-7xl font-black">How To Use The Admin Panel</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-white/85">
            A practical guide for school admins so daily tasks like content updates, admissions, galleries, staff profiles and settings feel much easier to manage.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="containerx grid gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {guideSections.map((section) => (
              <article key={section.title} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl">
                <h2 className="text-3xl font-black text-slate-900">{section.title}</h2>
                <p className="mt-4 text-slate-600 leading-8 text-lg">{section.text}</p>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl">
              <h3 className="text-2xl font-black">Quick Tasks</h3>
              <div className="mt-5 space-y-4">
                {quickActions.map((item) => (
                  <div key={item} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white/80">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-cyan-50 p-6 shadow-lg ring-1 ring-slate-200">
              <h3 className="text-2xl font-black text-slate-900">Important Tip</h3>
              <p className="mt-4 text-slate-600 leading-8">
                If you want to change how a public page looks, first check whether that page is controlled from Pages, Gallery Management, Events, Blogs, Facilities or Staff & Careers. This avoids editing the wrong section.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
