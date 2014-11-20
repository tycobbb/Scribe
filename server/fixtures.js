
Meteor.startup(function() {

  function capitalize(string) { 
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  //
  // Fixtures Helper
  //
   
  var fixtures = {
 
    settings: Meteor.settings.fixtures,
  
    rebuild: function(fixturesModel) {
 
      // collections can be keyed on the global object
      var collectionName  = fixturesModel.collectionName;
      var collection      = global[capitalize(collectionName)];
      
      // verify that we found a colleciton and that we're supposed to build fixtures 
      // for this collection
      if(!collection || !this.settings.collections[collectionName]) {
        return;    
      }
           
      // purge stale data 
      collection.remove({});

      // populate each record with the defaults object (if any) and insert it
      _.each(fixturesModel.records, function(record) {
        record = _.defaults(record, fixturesModel.defaults);
        collection.insert(record);
      });
    }

  }

  // if the rebuild flag is off, then we won't run any fixtures 
  if(!fixtures.settings.rebuild) {
    return;
  }

  // otherwise, we'll conditionally run all our fixtures on a per-collection basis

  /*

  fixtures.rebuild({

    collectionName: 'anthologies',

    records: [{
      title: 'Miscellaneous Anthology'
    }]

  });

  var anthology = Anthologies.findOne();

  //
  //Template.proposals.helpers({ Compositions 
  //

  fixtures.rebuild({

    collectionName: 'compositions',  
    
    records: [{ 
      anthology_id: anthology._id,
      title: 'Hello, Composition!',
    }, { 
      anthology_id: anthology._id,
      title: 'Hello, Composition 2!',
    }]

  });

  //
  // Listings
  //
  
  var composition = Compositions.findOne();
  
  fixtures.rebuild({
    
    collectionName: 'lines', 

    defaults: {
      composition_id: composition._id,
      isProposed:     false,
      isParagraph:    false,
      isVisible:      true,   
    },
    
    records: [{
      text: "This is the sample story, and it's unique in that regard alone.", 
      order: 0,
    },{
      text: "While many other stories exist, few are so devoid of content as the example you see here--glance towards any of your home's many bookshelves to verify.", 
      order: 1,
    },{
      text: "Full of books, right?",
      order: 2,
    },{
      text: "And what a great sample this is! Do it up.",  
      order: 3,
    }],

  });
  
  */

});

