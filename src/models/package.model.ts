import mongoose from "mongoose";


const PaymentSessionSchema = new mongoose.Schema({
  session_id: String,
  amount: Number,
  package_id: { type: mongoose.Schema.Types.ObjectId, ref: "package" },
}, {timestamps:true});

const PaymentCheckoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    expireAt: { type: Date, required: true },
    sessions: [PaymentSessionSchema],
  },
  { timestamps: true }
);



const PackageSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true }, 
    months: { type: Number, default: 0, required:true },     
    years: { type: Number, default: 0, required:true },
    available:{type: Boolean, default:true, required:true}   
},
{ timestamps: true }
);

export const Package = mongoose.model("package", PackageSchema);
export const PaymentCheckout = mongoose.model("paymentCheckout", PaymentCheckoutSchema);
