const mongoose = require('mongoose');

/**
 * Security Schema
 */
const SecuritySchema = new mongoose.Schema(
  {
    lock: {
      type: Boolean,
      required: true
    }
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
module.exports = mongoose.model('Security', SecuritySchema);
