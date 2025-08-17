import  { Schema, Types, model } from 'mongoose';

const buyTicketSchema = new Schema(
  {
    fk_user_id: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
    },
    fk_ticket_id: {
      type: Types.ObjectId,
      ref: 'ticket',
      required: true,
    },
    buying_points: {
      type: Number,
      required: true,
    },
    reference_number:{
      type:String,
      required:true
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    winner: {
      type: Boolean,
      default: false,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const ticketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    points: {
      type: Number,
      default:0,
      required: true,
    },
    available:{
        type:Boolean,
        default:true,
        required:true,
    }
  },
  {
    timestamps: true,
  }
);

export const Ticket = model('ticket', ticketSchema);
export const BuyTicket = model('buyTicket', buyTicketSchema);
