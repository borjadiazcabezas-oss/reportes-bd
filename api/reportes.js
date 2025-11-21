import { MongoClient } from "mongodb";

const uri = "mongodb+srv://borjadiazcabezas_db_user:rsn4wgxM0HNiTUky@cluster0.0s9pf.mongodb.net/Project0?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  try {
    await client.connect();
    const db = client.db("Project0");
    const collection = db.collection("reportes");

    const data = req.body;
    await collection.insertOne(data);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando en DB" });
  }
}
