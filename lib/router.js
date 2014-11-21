//
// Setup
//

Router.configure({
  controller: 'ApplicationController', 
});

// {only: somePage} to default to notFound Template in the case of a non existing parameter story/123
Router.onBeforeAction('dataNotFound'); 

//
// Routes
//

Router.route('/', {
  name: 'home',
});

Router.route('/signin', {
  name: 'signin'
});

Router.route('/intro', { 
  name: 'intro',
  controller: 'IntroController'
});

Router.route('/browse', {
  name: 'browse',
  controller: 'BrowseController'
});

Router.route('/story/new', {
  name: 'create',
  controller: 'CreateController'  
});

Router.route('/story/:id', 
  name: 'story',
  controller: 'StoryController'
});

