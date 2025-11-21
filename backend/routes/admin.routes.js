// backend/routes/admin.routes.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// GET /api/admin/downloadDB
router.get('/downloadDB', async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'backup.json');
    if (!fs.existsSync(filePath)) return res.status(404).json({ ok:false, message:'No backup found' });
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

// DELETE /api/admin/clearDB  (mantén confirmación en body)
router.delete('/clearDB', async (req, res) => {
  try {
    // Implementa borrado seguro: requiere { confirm: true }
    const { confirm } = req.body;
    if (!confirm) return res.status(400).json({ ok:false, message: 'Missing confirm flag' });

    // Aquí haz el borrado controlado, e.g. importar modelos y ejecutar deleteMany con cuidado.
    // await Activity.deleteMany({});
    res.json({ ok:true, message: 'Borrado simulado. Implementar borrado real con cuidado.' });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

export default router;
