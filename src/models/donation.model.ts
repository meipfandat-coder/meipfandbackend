import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    number_of_bottles: { type: Number, required: true, min: 0 },
    type_of_bottles: {
      type: String,
      enum: ["glass", "plastic", "metal", "milk", "soda"],
      required: true,
    },
    pickup_address: { type: String, required: true },
    pickup_address_cords: {
      type: {
        lng: { type: String, required: true },
        lat: { type: String, required: true },
      },
      required: true,
    },
    preferred_pickup_date: { type: Date, required: true },
    preferred_pickup_time: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    preferred_contact_method: {
      type: String,
      enum: ["phone", "email", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "completed"],
      required: true,
      default: "pending",
    },
    accepted_by: { type: mongoose.Types.ObjectId, ref: "User" },
    created_by: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    instructions: { type: String },
  },
  { timestamps: true }
);

export const Donation =
  mongoose.models.Donation || mongoose.model("Donation", donationSchema);
