import Mongoose from 'mongoose';

/**
 * Security Schema
 */
const SecuritySchema = new Mongoose.Schema(
  {
    lock: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true, collection: 'security' }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
SecuritySchema.method({});

/**
 * Statics
 */
SecuritySchema.statics = {};

/**
 * @typedef Security
 */
export default Mongoose.model('Security', SecuritySchema);
