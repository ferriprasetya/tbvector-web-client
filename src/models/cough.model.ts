import mongoose, { Document, Schema, Types } from 'mongoose'

// Interface for the nested detectionResult object
export interface IDetectionResult {
  isTBCough: boolean
  confidenceScore: number
}

// Interface for the nested notes array
interface INote {
  author: Types.ObjectId // Reference to the User model
  content: string
  createdAt?: Date
}

// Interface for the CoughEvent document
export interface ICoughEvent extends Document {
  id: string // UUID from the edge device
  user: Types.ObjectId // Reference to the User model
  device: Types.ObjectId // Reference to the Device model
  timestamp: Date
  directionOfArrival?: number
  audioPath: string // Path to the audio file in object storage
  status: 'POSITIVE_TB' | 'NEGATIVE_TB' | 'ANALYZING'
  detectionResult: IDetectionResult
  notes: INote[]
  acknowledgedBy?: Types.ObjectId // Reference to the User model
  acknowledgedAt?: Date
}

export interface CreateCoughEventDto {
  nama: string
}

const NoteSchema: Schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const DetectionResultSchema: Schema = new Schema(
  {
    isTBCough: {
      type: Boolean,
      required: true, // This is required ONLY IF the detectionResult object exists.
    },
    confidenceScore: {
      type: Number,
      required: true, // This is also required ONLY IF the detectionResult object exists.
    },
  },
  { _id: false },
) // _id: false prevents Mongoose from creating an ObjectId for the sub-document.

const CoughEventSchema: Schema = new Schema<ICoughEvent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: false,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    directionOfArrival: {
      type: Number,
    },
    audioPath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['POSITIVE_TB', 'NEGATIVE_TB', 'ANALYZING'],
      default: 'ANALYZING',
    },
    detectionResult: {
      type: DetectionResultSchema,
      required: false,
    },
    notes: [NoteSchema],
    acknowledgedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false, // Disables the __v field
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        // Remove _id and id from notes[].author if populated
        if (Array.isArray(ret.notes)) {
          ret.notes = ret.notes.map((note) => {
            if (
              note.author &&
              typeof note.author === 'object' &&
              note.author !== null
            ) {
              // Remove _id and id from author
              const { _id, id: _achievedId, ...authorRest } = note.author
              return { ...note, author: authorRest } as INote
            }
            return note
          })
        }
        const { _id, ...object } = ret
        return object
      },
    },
  },
)

// mongoose.set('toJSON', )

export const CoughEvent = mongoose.model<ICoughEvent>(
  'CoughEvent',
  CoughEventSchema,
)
