import Content from "../models/Content.js";

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
