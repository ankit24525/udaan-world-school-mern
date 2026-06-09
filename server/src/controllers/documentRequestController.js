import DocumentRequest, { DocumentType } from "../models/DocumentRequest.js";
import Student from "../models/Student.js";

const ADMIN_REQUEST_RETENTION_MS = 30 * 60 * 1000;

const defaultDocumentTypes = [
  "Transfer Certificate",
  "Bonafide Certificate",
  "Character Certificate",
  "Fee Receipt",
  "Marks Sheet",
  "Admission Letter",
];

function normalize(value = "") {
  return String(value || "").trim();
}

function normalizeDate(value = "") {
  const raw = normalize(value);
  if (!raw) return "";

  const excelNumber = Number(raw);
  if (Number.isFinite(excelNumber) && excelNumber > 20000 && excelNumber < 80000) {
    const excelEpoch = Date.UTC(1899, 11, 30);
    return new Date(excelEpoch + excelNumber * 86400000).toISOString().slice(0, 10);
  }

  const compact = raw.replace(/[./]/g, "-");
  const parts = compact.split("-").map((part) => part.trim()).filter(Boolean);

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const [year, month, day] = parts;
      return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
    }

    const [day, month, year] = parts;
    if (year?.length === 4) {
      return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
    }
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return raw;
}

function escapeRegex(value = "") {
  return normalize(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function ensureDefaultDocumentTypes() {
  const count = await DocumentType.countDocuments();
  if (count > 0) return;

  await DocumentType.insertMany(
    defaultDocumentTypes.map((name) => ({
      name,
      description: `${name} request`,
      active: true,
    }))
  );
}

async function findStudentByRegistrationAndDob(registrationNo, dob) {
  const cleanRegistration = normalize(registrationNo);
  const cleanDob = normalizeDate(dob);

  if (!cleanRegistration || !cleanDob) return null;

  const registrationRegex = new RegExp("^\\s*" + escapeRegex(cleanRegistration) + "\\s*$", "i");
  const possibleStudents = await Student.find({
    $or: [
      { studentId: registrationRegex },
      { admissionNo: registrationRegex },
      { rollNumber: registrationRegex },
    ],
  });

  return possibleStudents.find((student) => normalizeDate(student.dob) === cleanDob) || null;
}

async function attachApprovedDocumentToStudent(request) {
  if (!request.student || !request.fileUrl) return;

  const student = await Student.findById(request.student);
  if (!student) return;

  const documents = Array.isArray(student.documents) ? student.documents : [];
  const alreadyExists = documents.some(
    (document) => document.fileUrl === request.fileUrl || document.requestId === String(request._id)
  );

  if (alreadyExists) return;

  documents.push({
    name: request.fileName || request.documentType || "Approved Document",
    size: "",
    date: new Date().toISOString().slice(0, 10),
    type: request.documentType || request.resourceType || "Document",
    fileUrl: request.fileUrl,
    requestId: String(request._id),
  });

  student.documents = documents;
  await student.save();
}

export async function getDocumentTypes(req, res) {
  await ensureDefaultDocumentTypes();
  const filter = req.query.all === "true" ? {} : { active: true };
  const types = await DocumentType.find(filter).sort({ name: 1 });
  res.json(types);
}

export async function createDocumentType(req, res) {
  const name = normalize(req.body?.name);
  if (!name) {
    return res.status(400).json({ message: "Document name is required" });
  }

  const type = await DocumentType.create({
    name,
    description: normalize(req.body?.description),
    active: req.body?.active !== false,
  });

  res.status(201).json(type);
}

export async function updateDocumentType(req, res) {
  const type = await DocumentType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!type) {
    return res.status(404).json({ message: "Document type not found" });
  }

  res.json(type);
}

export async function deleteDocumentType(req, res) {
  await DocumentType.findByIdAndDelete(req.params.id);
  res.json({ message: "Document type deleted" });
}

export async function createDocumentRequest(req, res) {
  const registrationNo = normalize(req.body?.registrationNo);
  const dob = normalizeDate(req.body?.dob);
  const documentType = normalize(req.body?.documentType);

  if (!registrationNo || !dob || !documentType) {
    return res.status(400).json({
      message: "Registration number, date of birth, and document type are required",
    });
  }

  const student = await findStudentByRegistrationAndDob(registrationNo, dob);
  if (!student) {
    return res.status(404).json({
      message: "Either DOB or registration number is wrong. Please check and try again.",
    });
  }

  const existingRequest = await DocumentRequest.findOne({
    student: student._id,
    documentType,
    status: { $in: ["pending", "approved"] },
  }).sort({ createdAt: -1 });

  if (existingRequest) {
    return res.status(409).json({
      message: "You have already requested this document. Please use Check Status to view the latest update.",
      requestId: existingRequest._id,
      status: existingRequest.status,
    });
  }

  const request = await DocumentRequest.create({
    student: student._id,
    studentName: student.name,
    registrationNo,
    dob,
    className: student.className,
    documentType,
    notes: normalize(req.body?.notes),
  });

  res.status(201).json({
    message: "Document request submitted successfully",
    requestId: request._id,
    status: request.status,
  });
}

export async function getStudentDocumentRequests(req, res) {
  const student = await findStudentByRegistrationAndDob(
    req.query.registrationNo,
    req.query.dob
  );

  if (!student) {
    return res.status(404).json({
      message: "Either DOB or registration number is wrong. Please check and try again.",
    });
  }

  const requests = await DocumentRequest.find({ student: student._id }).sort({
    createdAt: -1,
  });

  res.json({
    student: {
      name: student.name,
      className: student.className,
      registrationNo: student.studentId || student.admissionNo || student.rollNumber,
    },
    requests,
  });
}

export async function listDocumentRequests(req, res) {
  const hideBefore = new Date(Date.now() - ADMIN_REQUEST_RETENTION_MS);
  const requests = await DocumentRequest.find({
    $or: [
      { status: "pending" },
      { resolvedAt: { $exists: false } },
      { resolvedAt: null },
      { resolvedAt: { $gt: hideBefore } },
    ],
  })
    .populate("student", "name className section studentId admissionNo dob")
    .sort({ createdAt: -1 });

  res.json(requests);
}

export async function updateDocumentRequest(req, res) {
  const request = await DocumentRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Document request not found" });
  }

  const update = {
    status: req.body?.status,
    adminNotes: normalize(req.body?.adminNotes),
    fileUrl: normalize(req.body?.fileUrl),
    fileName: normalize(req.body?.fileName),
    publicId: normalize(req.body?.publicId),
    resourceType: normalize(req.body?.resourceType),
  };

  Object.keys(update).forEach((key) => {
    if (update[key] === undefined || update[key] === "") delete update[key];
  });

  const nextFileUrl = update.fileUrl || request.fileUrl;

  if (update.status === "approved" && !nextFileUrl) {
    return res.status(400).json({
      message: "Upload the approved document before approving this request",
    });
  }

  Object.assign(request, update);

  if (["approved", "rejected"].includes(request.status)) {
    request.resolvedAt = request.resolvedAt || new Date();
  }

  if (request.status === "approved") {
    request.approvedAt = request.approvedAt || new Date();
  }

  await request.save();

  if (request.status === "approved") {
    await attachApprovedDocumentToStudent(request);
  }
  res.json(request);
}
