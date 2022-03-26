const mongoose = require('mongoose');

// Mongoose is trying to be smart by making your collection name plural.
//  mongoose.pluralize(null) ot disable or add collectionName as third model's argument.

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  richDescription: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String, default: '' }],
  brand: { type: String, default: '' },
  price: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  rating: { type: Number, default: 0 },
  newReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

// Export function to create "productSchema" model class
// module.exports = mongoose.model("products", productSchema);

// or
// Export as object to create "productSchema" model class
exports.Product = mongoose.model('Product', productSchema);
