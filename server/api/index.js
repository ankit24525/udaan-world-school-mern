import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import ClassConfig from "../src/models/ClassConfig.js";

let seedPromise = globalThis.__udaanClassSeedPromise || null;

async function ensureDefaultClasses() {
  if (!seedPromise) {
    seedPromise = (async () => {
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
        console.log("Default classes seeded");
      }
    })();

    globalThis.__udaanClassSeedPromise = seedPromise;
  }

  return seedPromise;
}

export default async function handler(req, res) {
  await connectDB();
  await ensureDefaultClasses();
  return app(req, res);
}
