
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);  
};

String.prototype.singularize = function() {
  return this.inflector.inflect(this, this.inflector.singulars);
};

String.prototype.pluralize = function() { 
  return this.inflector.inflect(this, this.inflector.plurals); 
};

String.prototype.inflector = {
  
  inflect: function(string, inflections) {
    if(string.length == 0) {
      return string;
    }
    
    var inflectionsLength = inflections.length;
    for(var index=0 ; index<inflectionsLength ; index++) {
      inflection = inflections[index];   
      if(inflection.matches(string)) {
        return inflection.apply(string);
      }
    }
    
    return string;
  },  

  //
  // inflection rules 
  //

  Inflection: function(pattern, replacement) {
    this.pattern     = pattern;
    this.replacement = replacement; 

    this.matches = function(string) {
      return string.match(this.pattern);
    };

    this.apply = function(string) {
      return string.replace(this.pattern, this.replacement);
    };
  },
 
  addRules: function(rulesLambda) {
    rulesLambda(this);   
  },

  plural: function(pattern, replacement) {
    this.plurals.push(new this.Inflection(pattern, replacement));
  },

  singular: function(pattern, replacement) {
    this.singulars.push(new this.Inflection(pattern, replacement));
  },
   
  plurals:   [ ],
  singulars: [ ],
}

String.prototype.inflector.addRules(function(inflector) {
  inflector.plural(/([^y]*)(y$)/, "$1ies");
  inflector.plural(/(.*)/, "$1s");

  inflector.singular(/([^ies]*)(ies$)/, "$1y");
  inflector.singular(/([^s]*)s$/, "$1"); 
});

