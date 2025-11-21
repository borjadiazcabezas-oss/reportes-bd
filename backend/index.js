const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Activity = require('./models/activity');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- CONFIGURACIÓN DE CONEXIONES ---
const atlasURI = 'TU_ATLAS_URI';
const localURI = 'mongodb://127.0.0.1:27017/produccion_local';

// Conexión local
mongoose.connect(localURI)
  .then(()=>console.log('✅ Conectado a MongoDB local'))
  .catch(err=>console.error(err));

// --- SINCRONIZACIÓN DESDE ATLAS ---
const syncFromAtlas = async () => {
  const atlasConn = await mongoose.createConnection(atlasURI, { useNewUrlParser:true, useUnifiedTopology:true });
  const AtlasActivity = atlasConn.model('Activity', Activity.schema);

  const datosAtlas = await AtlasActivity.find({});
  console.log(`📥 ${datosAtlas.length} registros traídos desde Atlas`);

  for(const act of datosAtlas){
    const exists = await Activity.findOne({ operario: act.operario, startTime: act.startTime });
    if(!exists) await Activity.create(act.toObject());
  }

  console.log('✅ Sincronización completa');
};

app.get('/api/sync', async (req,res)=>{
  try{
    await syncFromAtlas();
    res.json({status:'ok'});
  }catch(err){
    console.error(err);
    res.status(500).json({error:err.message});
  }
});

app.get('/api/activities', async (req,res)=>{
  try{
    const data = await Activity.find({}).sort({startTime:-1});
    res.json(data);
  }catch(err){
    res.status(500).json({error: err.message});
  }
});

const PORT = 3000;
app.listen(PORT, ()=>console.log(`🚀 Server corriendo en http://localhost:${PORT}`));
