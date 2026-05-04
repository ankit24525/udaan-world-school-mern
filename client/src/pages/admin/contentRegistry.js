import { pageContent } from "../pageContent.js";

export const managedPageSections = [
  { key: "homeHero", title: "Home Hero", group: "Homepage" },
  { key: "homeAbout", title: "Home About", group: "Homepage" },
  { key: "homeCreativity", title: "Home Creativity", group: "Homepage" },
  { key: "homeSportsFeature", title: "Home Sports", group: "Homepage" },
  { key: "homeChairman", title: "Director Message", group: "Homepage" },
  { key: "homeWhyChooseUs", title: "Home Why Choose Us", group: "Homepage" },
  { key: "homeStories", title: "Home Student Stories", group: "Homepage" },
  { key: "homeFacilities", title: "Home Campus Highlights", group: "Homepage" },
  { key: "homePartners", title: "Home Knowledge Partners", group: "Homepage" },
  { key: "homeTestimonials", title: "Home Testimonials", group: "Homepage" },
  { key: "homeQuickAccessBand", title: "Home Quick Access Band", group: "Homepage" },
  { key: "footerSocialBand", title: "Footer Social Banner", group: "Footer" },
  ...Object.entries(pageContent).map(([key, page]) => ({
    key,
    title: page.title,
    group: "Pages",
  })),
];

export function getManagedSectionConfig(key) {
  return managedPageSections.find((item) => item.key === key);
}
