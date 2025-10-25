import { Schema, model, Document } from 'mongoose'

// Interface untuk mendefinisikan tipe data dokumen Device yang kuat (strong-typed)
export interface IDevice extends Document {
  deviceId: string
  name: string
  location?: string // Tanda tanya (?) menandakan field ini opsional
  status: 'ONLINE' | 'OFFLINE'
  lastHeartbeat?: Date
  createdAt: Date
  updatedAt: Date
}

// Skema Mongoose untuk Device
// timestamps: true akan secara otomatis membuat field createdAt dan updatedAt
const deviceSchema = new Schema<IDevice>(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      unique: true,
      trim: true,
      index: true, // Menambahkan index untuk pencarian yang lebih cepat berdasarkan deviceId
    },
    name: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ONLINE', 'OFFLINE'],
      default: 'OFFLINE',
    },
    lastHeartbeat: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Menghilangkan field __v dari dokumen
    toJSON: {
      transform: function (_doc, ret) {
        const { _id, ...object } = ret
        return object
      },
    },
  },
)

// Membuat dan mengekspor model Device
const Device = model<IDevice>('Device', deviceSchema)

export default Device
