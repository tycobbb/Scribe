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
  name: 'signin',
});

Router.route('/intro', { 
  name: 'intro',
});

Router.route('/browse', {
  name: 'browse',
});

Router.route('/story/new', {
  name: 'create',
});

Router.route('/story/:_id', {
  name: 'story',
});

