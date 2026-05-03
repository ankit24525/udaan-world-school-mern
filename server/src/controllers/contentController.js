import cloudinary from "../config/cloudinary.js";
import Content from "../models/Content.js";

function normalizeCloudinaryDocumentUrl(url = "") {
  return String(url || "")
    .trim()
    .replace(/\/upload\/(?:[^/]+,)*fl_attachment,?/i, "/upload/")
    .replace(/\/upload\/fl_attachment\//i, "/upload/")
    .replace(/([^:]\/)\/+/g, "$1");
}

function buildCloudinaryDocumentCandidates(url = "") {
  const normalized = normalizeCloudinaryDocumentUrl(url);
  const candidates = [
    normalized,
    normalized.replace("/image/upload/", "/raw/upload/"),
    normalized.replace("/raw/upload/", "/image/upload/"),
    String(url || "").trim(),
  ].filter(Boolean);

  return [...new Set(candidates)];
}

async function fetchDocumentCandidate(url) {
  return fetch(url, {
    headers: {
      "User-Agent": "UdaanWorldSchool/1.0",
      Accept: "*/*",
    },
  });
}

export async function listContent(req, res) {
  const filter = {};

  if (req.query.type) filter.type = req.query.type;
  if (req.query.key) filter.key = req.query.key;
  if (req.query.published === "true") filter.published = true;

  const items = await Content.find(filter).sort({ updatedAt: -1, createdAt: -1 });
  res.json(items);
}

export async function getContent(req, res) {
  const item = await Content.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ message: "Content not found" });
  res.json(item);
}

export async function downloadContentFile(req, res) {
  try {
    const rawUrl = String(req.query.url || "").trim();
    const publicId = String(req.query.publicId || "").trim();
    const resourceType = String(req.query.resourceType || "raw").trim() || "raw";
    const downloadName = String(req.query.name || "document").trim() || "document";

    let sourceUrl = rawUrl;

    if (publicId) {
      try {
        const asset = await cloudinary.api.resource(publicId, {
          resource_type: resourceType,
          type: "upload",
        });
        sourceUrl = asset?.secure_url || sourceUrl;
      } catch (error) {
        console.error("cloudinary resource lookup failed:", error?.message || error);
      }
    }

    if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
      return res.status(400).json({ message: "A valid file source is required" });
    }

    const candidates = buildCloudinaryDocumentCandidates(sourceUrl);
    let upstream = null;
    let lastStatus = 502;

    for (const candidate of candidates) {
      upstream = await fetchDocumentCandidate(candidate);
      lastStatus = upstream.status;
      if (upstream.ok) break;
    }

    if (!upstream?.ok) {
      return res.status(lastStatus).json({ message: "Unable to fetch document" });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${downloadName.replace(/"/g, "")}"`
    );
    res.send(buffer);
  } catch (error) {
    console.error("downloadContentFile error:", error);
    res.status(500).json({ message: "Document download failed" });
  }
}

export async function createContent(req, res) {
  if (req.body?.type === "page" && req.body?.key) {
    const item = await Content.findOneAndUpdate(
      { type: "page", key: req.body.key },
      req.body,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(201).json(item);
  }

  const item = await Content.create(req.body);
  res.status(201).json(item);
}

export async function updateContent(req, res) {
  const item = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
}

export async function deleteContent(req, res) {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ message: "Content deleted" });
}
export async function getContentById(req, res) {
  const item = await Content.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(item);
}
export async function getSingleContent(req, res) {
  const data = await Content.findById(req.params.id);
  res.json(data);
}
