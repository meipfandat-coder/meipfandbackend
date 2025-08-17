import { Schema, Types, model } from "mongoose";

// Sub-schema for points_logs with timestamps
const pointsLogSchema = new Schema(
  {
    fk_donation_id: {
      type: Types.ObjectId,
      ref: 'donation',
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const pointsSchema = new Schema(
  {
    total_points: {
      type: Number,
      required: true,
      default: 0,
    },
    current_points: {
      type: Number,
      required: true,
      default: 0,
    },
    fk_user_id: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
    },
    points_logs: [pointsLogSchema],
  },
  {
    timestamps: true,
  }
);

export const Point = model('points', pointsSchema);
