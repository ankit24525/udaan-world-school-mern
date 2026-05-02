import { pageContent } from "../pageContent.js";

export const managedPageSections = [
  { key: "homeHero", title: "Homepage Hero", group: "Homepage" },
  { key: "homeAbout", title: "About Section", group: "Homepage" },
  { key: "homeCreativity", title: "Creativity Banner", group: "Homepage" },
  { key: "homeSportsFeature", title: "Sports Feature", group: "Homepage" },
  { key: "homeChairman", title: "Chairman Message", group: "Homepage" },
  { key: "homeWhyChooseUs", title: "Why Choose Us Cards", group: "Homepage" },
  { key: "homeStories", title: "Student Stories", group: "Homepage" },
  { key: "homeFacilities", title: "Campus Highlights", group: "Homepage" },
  { key: "homePartners", title: "Knowledge Partners", group: "Homepage" },
  { key: "homeTestimonials", title: "Parent Testimonials", group: "Homepage" },
  ...Object.entries(pageContent).map(([key, page]) => ({
    key,
    title: page.title,
    group: "Website Pages",
  })),
];

export function getManagedSectionConfig(key) {
  return managedPageSections.find((item) => item.key === key);
}
