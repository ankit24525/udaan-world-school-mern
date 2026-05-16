import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { splitParagraphs } from "../utils/publicContent.js";
import { attachLiveRefresh } from "../utils/liveUpdates";

export default function EventDetailPage() {
  const { slug } = useParams();
  const [eventItem, setEventItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchEvent() {
      try {
        const res = await api.get("/content", {
          params: { type: "event" },
        });

        const rows = Array.isArray(res.data) ? res.data : [];
        const match = rows.find(
          (item) =>
            item.published !== false &&
            (item.slug === slug || item._id === slug)
        );

        if (active) {
          setEventItem(match || null);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setEventItem(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchEvent();
    const cleanup = attachLiveRefresh(fetchEvent);

    return () => {
      active = false;
      cleanup();
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="overflow-hidden bg-white">
        <section className="relative min-h-[58vh] bg-slate-950 px-0 py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F4D] via-[#0FA4C6] to-[#1D4ED8]" />
          <div className="containerx relative z-10">
            <div className="shadow-shimmer-line h-11 w-40 bg-white/20" />
            <div className="mt-10 max-w-4xl space-y-4">
              <div className="shadow-shimmer-line h-16 w-full max-w-3xl bg-white/20" />
              <div className="shadow-shimmer-line h-16 w-full max-w-2xl bg-white/20" />
              <div className="shadow-shimmer-line h-5 w-full max-w-2xl bg-white/20" />
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="containerx grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="shadow-shimmer-line h-5 w-full" />
              ))}
            </div>
            <div className="shadow-shimmer-card p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="shadow-shimmer-line h-32 rounded-[24px]" />
                <div className="shadow-shimmer-line h-32 rounded-[24px]" />
                <div className="shadow-shimmer-line col-span-2 h-5 w-full" />
                <div className="shadow-shimmer-line col-span-2 h-5 w-4/5" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!eventItem) {
    return <div className="containerx py-20 text-sm text-slate-500">Event not found.</div>;
  }

  const paragraphs = splitParagraphs(eventItem.body, [eventItem.excerpt].filter(Boolean));
  const gallery = Array.isArray(eventItem.meta?.gallery)
    ? eventItem.meta.gallery.filter(Boolean)
    : [];
  const eventDate = eventItem.eventDate
    ? new Date(eventItem.eventDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const fallbackEventImage =
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop";

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative flex min-h-[68vh] items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventItem.imageUrl || fallbackEventImage})` }}
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="containerx relative z-10 text-white">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            {eventItem.title}
          </h1>
          {eventItem.excerpt ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{eventItem.excerpt}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-6 text-white/85">
            {eventDate ? (
              <div className="inline-flex items-center gap-2">
                <CalendarDays size={18} />
                {eventDate}
              </div>
            ) : null}
            {eventItem.location ? (
              <div className="inline-flex items-center gap-2">
                <MapPin size={18} />
                {eventItem.location}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="containerx grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph}-${index}`} className="text-lg leading-8 text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="overflow-hidden rounded-[30px] bg-slate-100 shadow-2xl">
            {eventItem.videoUrl ? (
              <video src={eventItem.videoUrl} controls className="h-full w-full object-cover" />
            ) : (
              <img
                src={eventItem.imageUrl || fallbackEventImage}
                alt={eventItem.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {gallery.length ? (
        <section className="pb-24">
          <div className="containerx">
            <h2 className="text-4xl font-black text-slate-900">Event Gallery</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((url, index) => (
                <div key={`${url}-${index}`} className="overflow-hidden rounded-[26px] shadow-xl">
                  <img
                    src={url}
                    alt={`${eventItem.title} gallery ${index + 1}`}
                    className="h-72 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
