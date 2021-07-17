import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String
    },
    status: {
      type: String,
      default: 'PENDING'
    },
    ROLE: {
      type: String,
      default: 'EXECUTIVE'
    },
    firebaseUserId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', userSchema)
