$(function() {
 
 	Parse.$ = jQuery;
 	Parse.initialize("Lq5Zm85l4riMmHE91tLDRAeOQJBDPumnRCo0AZgE", "X61Y1Had1Rx7bqlp7vzMsaUqx6IRq8ozUihJtvJZ");
	
	var LoginView = Parse.View.extend({
	    template: Handlebars.compile($('#login-tpl').html()),
	    events: {
	        'submit .form-signin': 'login'
	    },
	    login: function(e) {
	 
	        // Prevent Default Submit Event
	        e.preventDefault();
	 
	        // Get data from the form and put them into variables
	        var data = $(e.target).serializeArray(),
	            username = data[0].value,
	            password = data[1].value;
	 
	        // Call Parse Login function with those variables
	        Parse.User.logIn(username, password, {
			    // If the username and password matches
			    success: function(user) {
			        blogRouter.navigate('admin', { trigger: true });
			    },
			    // If there is an error
			    error: function(user, error) {
			        console.log(error);
			    }
			});
	    },
	        render: function(){
	        this.$el.html(this.template());
	    }
	}),
    WelcomeView = Parse.View.extend({
	    template: Handlebars.compile($('#welcome-tpl').html()),
	    events: {
	        'click .add-blog': 'add'
	    },
	    add: function(){
	        blogRouter.navigate('add', { trigger: true });
	    },
	    render: function(){
	        var attributes = this.model.toJSON();
	        this.$el.html(this.template(attributes));
	    }
	});
    
    
    var loginView = new LoginView();
	loginView.render();
	$('.main-container').html(loginView.el);
	
	var AddBlogView = Parse.View.extend({
	    template: Handlebars.compile($('#add-tpl').html()),
	    render: function(){
	        this.$el.html(this.template());
	    },
	    events: {
	        'submit .form-add': 'submit'
	    },
	    submit: function(e){
	        // Prevent Default Submit Event     
		    e.preventDefault();
		    // Take the form and put it into a data object
		    var data = $(e.target).serializeArray(),
		    // Create a new instance of Blog
		        blog = new Blog();
		    // Call .create()
		    blog.create(data[0].value, data[1].value);
	    },
	});
	
	/*
	*/
	
	//var Blog = Parse.Object.extend("Blog");
	var Blog = Parse.Object.extend('Blog', {
	    create: function(title, content) {
	        this.set({
	            'title': title,
	            'content': content,
	            'author': Parse.User.current(),
	            'authorName': Parse.User.current().get('username'),
			    'time': new Date().toDateString()
	        }).save(null, {
	            success: function(blog) {
	                alert('You added a new blog: ' + blog.get('title'));
	            },
	            error: function(blog, error) {
	                console.log(blog);
	                console.log(error);
	            }
	        });
	    }
	});
	
	
	
	var Blogs = Parse.Collection.extend({
        model: Blog
    }),
    BlogsAdminView = Parse.View.extend({
        template: Handlebars.compile($('#blogs-admin-tpl').html()),
        render: function() {
            var collection = { blog: this.collection.toJSON() };
            this.$el.html(this.template(collection));
        }
    });
    
    
    
    
    var BlogRouter = Parse.Router.extend({
         
        // Here you can define some shared variables
        initialize: function(options){
            this.blogs = new Blogs();
        },
         
        // This runs when we start the router. Just leave it for now.
        start: function(){
            Parse.history.start({pushState: true});     },
             
        // This is where you map functions to urls.
        // Just add '{{URL pattern}}': '{{function name}}'
        routes: {
            'admin': 'admin',
            'login': 'login',
            'add': 'add',
            'edit/:url': 'edit'
        },
         
        admin: function() {
		    // This is how you can current user in Parse
		    var currentUser = Parse.User.current();
		 
		    if ( !currentUser ) {
		        // This is how you can do url redirect in JS
		        blogRouter.navigate('login', { trigger: true });
		 
		    } else {
		 
		        var welcomeView = new WelcomeView({ model: currentUser });
		        welcomeView.render();
		        $('.main-container').html(welcomeView.el);
		 
		        // We change it to this.blogs so it stores the content for other Views
		        // Remember to define it in BlogRouter.initialize()
		        this.blogs.fetch({
		            success: function(blogs) {
		                var blogsAdminView = new BlogsAdminView({ collection: blogs });
		                blogsAdminView.render();
		                $('.main-container').append(blogsAdminView.el);
		            },
		            error: function(blogs, error) {
		                console.log(error);
		            }
		        });
		    }
		},
        login: function() {
		    var loginView = new LoginView();
		    loginView.render();
		    $('.main-container').html(loginView.el);
		},
        add: function() {
            var addBlogView = new AddBlogView();
            addBlogView.render();
            $('.main-container').html(addBlogView.el);
        },
        edit: function(url) {},
        
	    start: function(){
		    Parse.history.start({pushState: true});
		    this.navigate('admin', { trigger: true });
		} 
        
         
    }),
    blogRouter = new BlogRouter();
 
	blogRouter.start();
	
});
