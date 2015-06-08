_.mixin({
  'compactObject' : function(obj) {
     var copy = _.clone(obj || {});
     _.each(copy, function(value, key) {
       if(!value) {
         delete copy[key];
       }
     });
     return _.chain(copy);
  }
});