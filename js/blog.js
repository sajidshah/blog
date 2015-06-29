$(function() {
 
 	Parse.$ = jQuery;
 	Parse.initialize("Lq5Zm85l4riMmHE91tLDRAeOQJBDPumnRCo0AZgE", "X61Y1Had1Rx7bqlp7vzMsaUqx6IRq8ozUihJtvJZ");
	
	/*
		var TestObject = Parse.Object.extend("TestObject");
	    var testObject = new TestObject();
	    testObject.save({foo: "bar"}).then(function(object) {
	      alert("yay! it worked");
	    });
    */
   
    var Blog = Parse.Object.extend("Blog");
    var Blogs = Parse.Collection.extend({
	    model: Blog
	});
	var blogs = new Blogs();
	
	var BlogsView =  Parse.View.extend({
	    template: Handlebars.compile($('#blogs-tpl').html()),
	    render: function(){ 
	        var collection = { blog: this.collection.toJSON() };
	        this.$el.html(this.template(collection));
	    }
	    
	    
	});
	
	blogs.fetch({
	    success: function(blogs) {
		    var blogsView = new BlogsView({ collection: blogs });
		    blogsView.render();
		    $('.main-container').html(blogsView.el);
		},
	    error: function(blogs, error) {
	        console.log(error);
	    }
	});
	
	
 
});