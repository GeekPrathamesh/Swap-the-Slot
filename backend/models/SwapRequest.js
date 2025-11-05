import mongoose from "mongoose";
const swapRequestSchema = new mongoose.Schema({
  mySlot: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  theirSlot: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
});
export default mongoose.model("SwapRequest", swapRequestSchema);
