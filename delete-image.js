import { deleteThumb } from "./aws-manager";

export async function deleteImage(req, res) {
  const { url } = req.query;

  await deleteThumb(url);
  res.json({ ok: true });
}
