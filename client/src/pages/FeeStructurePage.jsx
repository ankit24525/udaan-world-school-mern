import { documents, feeRows, schoolInfo } from "../data/siteData.js";

export default function FeeStructurePage() {
  return (
    <section className="inner-page">
      <div className="section-title reveal-up">
        <h6>Admissions</h6>
        <h2>Fee Structure</h2>
        <p>{schoolInfo.name} fee details as provided by the school. Final fee confirmation should always be done through the school office.</p>
      </div>

      <div className="fee-wrap reveal-up">
        <table className="fee-table">
          <thead>
            <tr>
              <th>Class / Head</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {feeRows.map(([label, amount]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>Rs. {amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="download-band">
        <h2>Useful Downloads</h2>
        <a className="document-pill" href={documents[0].href} target="_blank" rel="noreferrer">Download Admission Form</a>
      </div>
    </section>
  );
}
