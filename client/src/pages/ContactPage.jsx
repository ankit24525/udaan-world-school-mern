import { useState } from "react";
import { Icons, schoolInfo } from "../data/siteData.js";
import api from "../services/api.js";

export default function ContactPage() {
  const [form, setForm] = useState({
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
        type: "contact",
        parentName: form.parentName,
        phone: form.phone,
        email: form.email,
        message: form.message,
      });

      setStatus("Message submitted successfully.");

      setForm({
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
      <div className="inner-hero contact-layout">
        <div>
          <span>Contact</span>
          <h1>Get In Touch</h1>
          <p>
            Visit the campus, call the admission office, or send an enquiry for
            admissions and school information.
          </p>

          <div className="contact-cards">
            <article>
              <Icons.MapPin />
              <b>Address</b>
              <p>{schoolInfo.address}</p>
            </article>

            <article>
              <Icons.Phone />
              <b>Phone</b>
              <p>{schoolInfo.phone.join(", ")}</p>
            </article>

            <article>
              <Icons.Mail />
              <b>Email</b>
              <p>{schoolInfo.email}</p>
            </article>
          </div>
        </div>

        <form className="site-form" onSubmit={handleSubmit}>
          <input
            name="parentName"
            placeholder="Your name"
            value={form.parentName}
            onChange={handleChange}
            required
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
            placeholder="Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
          />

          <button type="submit">Submit Enquiry</button>

          {status ? <p>{status}</p> : null}
        </form>
      </div>
    </section>
  );
}
