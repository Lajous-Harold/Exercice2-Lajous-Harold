import { connectDB } from "../config/mongo.js";
import { Task as MongoTask } from "../models/taskModel.js";

function toPublic(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description ?? "",
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.(),
  };
}

export default {
  async init() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn("MONGODB_URI manquant — basculer vers memory avec USE_MEMORY=true si besoin.");
      throw new Error("MONGODB_URI is required for DB_CLIENT=mongo");
    }
    await connectDB(uri);
  },
  async list() {
    const docs = await MongoTask.find().sort({ createdAt: -1 });
    return docs.map(toPublic);
  },
  async add({ title, description = "" }) {
    const doc = await MongoTask.create({ title, description });
    return toPublic(doc);
  },
  async remove(id) {
    const doc = await MongoTask.findByIdAndDelete(id);
    return doc ? toPublic(doc) : null;
  },
};
