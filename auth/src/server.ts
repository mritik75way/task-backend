import app from "./app";
import { connectDB } from "./config/db";

connectDB();

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
}); 