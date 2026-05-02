import { documents } from "../data/siteData.js";
import { Icons } from "../data/siteData.js";

export default function DisclosurePage() {
  return (
    <section className="inner-page">
      <div className="section-title">
        <h6>Compliance</h6>
        <h2>Mandatory Public Disclosure</h2>
        <p>School documents provided for public viewing and downloads.</p>
      </div>
      <div className="document-grid">
        {documents.map((doc) => (
          <a href={doc.href} key={doc.title} target="_blank" rel="noreferrer">
            <Icons.BookOpen />
            <span>{doc.title}</span>
            <b>{doc.type}</b>
          </a>
        ))}
      </div>
    </section>
  );
}
