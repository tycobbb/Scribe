Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound'
})

Router.route('/', {name: 'home'});

Router.onBeforeAction('dataNotFound'); //{only: somePage} to default to notFound Template in the case of a non existing parameter story/123

