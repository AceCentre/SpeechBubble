var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ENUM = require('../../enum');
var PageBaseSchema = require('./page-base.schema');
var extend = require('mongoose-schema-extend');

var PageSchema = PageBaseSchema.extend({
  slug: {
    type: String,
    index: { unique: true }
  },
  currentRevision: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PageRevision'
  },
  revisions: [PageBaseSchema]
}, { collection: 'pages' });

module.exports = mongoose.model('Page', PageSchema);
