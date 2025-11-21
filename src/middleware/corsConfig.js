/**
 * src/middleware/corsConfig.js
 * Uso: app.use(cors(corsConfig));
 */
export default {
  origin: function(origin, callback) {
    const allowed = [process.env.FRONTEND_URL || "http://localhost:3000"];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error("CORS: origin not allowed"));
  },
  credentials: true,
};
