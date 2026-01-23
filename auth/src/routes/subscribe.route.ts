import { Router } from "express";
import webpush from "web-push";

const router = Router();

let savedSubscription: any = null;
let scheduledJobs: NodeJS.Timeout[] = [];

router.post("/subscribe", (req, res) => {
  savedSubscription = JSON.parse(req.body.data);
  res.json({ success: true });
});

router.post("/schedule", (req, res) => {
  const { title, body, sendAt } = JSON.parse(req.body.data);

  if (!savedSubscription) {
    return res.status(400).json({ error: "No subscription" });
  }

  const delay = new Date(sendAt).getTime() - Date.now();

  if (delay <= 0) {
    return res.status(400).json({ error: "Time must be in future" });
  }

  const job = setTimeout(async () => {
    try {
      await webpush.sendNotification(
        savedSubscription,
        JSON.stringify({ title, body })
      );
    } catch (err) {
      console.error("Scheduled push failed", err);
    }
  }, delay);

  scheduledJobs.push(job);

  res.json({ success: true });
});

export default router;
