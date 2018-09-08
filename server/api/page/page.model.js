var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');
var PageBase = require('./page-base.model');

var PageSchema = new Schema({
  slug: {
    type: String,
    index: { unique: true }
  },
  currentRevision: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PageRevision'
  },
  // revisions: [PageBaseSchema]
});

module.exports = PageBase.discriminator('Page', PageSchema);
