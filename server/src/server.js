import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import ClassConfig from "./models/ClassConfig.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// 🔥 CONNECT DB
await connectDB();

// 🔥 SEED DEFAULT CLASSES (ONLY ONCE)
async function seedClasses() {
  const count = await ClassConfig.countDocuments();

  if (count === 0) {
    await ClassConfig.insertMany([
      { name: "Playgroup", sections: ["A"], isDefault: true },
      { name: "Nursery", sections: ["A"], isDefault: true },
      { name: "LKG", sections: ["A"], isDefault: true },
      { name: "UKG", sections: ["A"], isDefault: true },

      ...Array.from({ length: 12 }, (_, i) => ({
        name: `${i + 1}`,
        sections: ["A", "B"],
        isDefault: true,
      })),
    ]);

    console.log("✅ Default classes seeded");
  } else {
    console.log("ℹ️ Classes already exist");
  }
}

await seedClasses();

// 🔥 START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});