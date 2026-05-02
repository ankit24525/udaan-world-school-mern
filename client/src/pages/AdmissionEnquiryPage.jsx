import { useState } from "react";
import { documents, schoolInfo } from "../data/siteData.js";
import api from "../services/api.js";

export default function AdmissionEnquiryPage() {
  const [form, setForm] = useState({
    studentName: "",
    className: "",
    parentName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Submitting...");

    try {
      await api.post("/enquiries", {
        type: "admission",
        studentName: form.studentName,
        parentName: form.parentName,
        className: form.className,
        phone: form.phone,
        email: form.email,
        message: form.message,
      });

      setStatus("Admission enquiry submitted successfully.");

      setForm({
        studentName: "",
        className: "",
        parentName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatus("Something went wrong. Please check backend is running.");
    }
  }

  return (
    <section className="inner-page">
      <div className="section-title">
        <h6>Admissions</h6>
        <h2>Admission Enquiry</h2>
        <p>
          Fill this form and the enquiry will be saved into the school admin
          database.
        </p>
      </div>

      <form className="site-form wide-form" onSubmit={handleSubmit}>
        <input
          name="studentName"
          placeholder="Student name"
          value={form.studentName}
          onChange={handleChange}
        />

        <input
          name="className"
          placeholder="Class applying for"
          value={form.className}
          onChange={handleChange}
        />

        <input
          name="parentName"
          placeholder="Parent name"
          value={form.parentName}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Address / message"
          rows="5"
          value={form.message}
          onChange={handleChange}
        />

        <button type="submit">Submit Admission Enquiry</button>

        {status ? <p>{status}</p> : null}
      </form>

      <div className="download-band">
        <h2>School Details</h2>
        <p>{schoolInfo.address}</p>
        <p>School Code: {schoolInfo.schoolCode}</p>
        <a
          className="document-pill"
          href={documents[0].href}
          target="_blank"
          rel="noreferrer"
        >
          Download Admission Form
        </a>
      </div>
    </section>
  );
}
