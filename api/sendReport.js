import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  try {
    const { subject, recipient, html, text } = req.body;

    const msg = {
      to: recipient,
      from: "borjadiazcabezas@gmail.com",
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error enviando email" });
  }
}
