import { Schema, Document, Types, model } from 'mongoose'

export interface ICoughNotification extends Document {
  type: 'POSITIVE_TB_RESULT'
  message: string
  coughEvent: Types.ObjectId
  readBy?: Types.ObjectId
  readAt?: Date
}

const CoughNotificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['POSITIVE_TB_RESULT'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    coughEvent: {
      type: Schema.Types.ObjectId,
      ref: 'CoughEvent',
      required: true,
    },
    readBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    readAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        const { _id, ...object } = ret
        return object
      },
    },
  },
)

export default model<ICoughNotification>(
  'CoughNotification',
  CoughNotificationSchema,
)
