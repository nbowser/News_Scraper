$(document).ready(function() {
	$(".navbar-burger").on("click", function() {
		$(".navbar-burger").toggleClass("is-active");
		$(".dropdown").toggle();
		$(".dropdown").toggleClass("is-open");
	});

	//Articles
	$.getJSON("/articles", function(data) {
	  for (var i = 0; i < data.length; i++) {
	  	if (data[i].saved === true) {
	   		$("#saved-results").append("<div class='saved-div'><p class='saved-text'>" + data[i].title + "<br>" + data[i].description +
  																	"</p><a class='unsave-button button is-danger is-medium' data-id='" +
																		data[i]._id + "'>Delete</a><a class='comments-button button is-warning is-medium' data-id='" + data[i]._id +
																		"'>Note</a></div>");
	  	}
	  }
	});

	$(document).on("click", ".comments-button", function() {
		$(".modal").toggleClass("is-active");
		var articleID = $(this).attr("data-id");
	  $.ajax({
	    method: "GET",
	    url: "/articles/" + articleID
	  }).done(function(data) {
	  	$("#comments-header").html("NOTE(S):");
	  	if (data.comments.length !== 0) {
	  		$("#comments-list").empty();
	  		for (i = 0; i < data.comments.length; i++) {
					$("#comments-list").append("<div class='comment-div'><p class='comment'>" + data.comments[i].body + "</p></div>");
	  		}
	  	}
	  	$("footer.modal-card-foot").html("<button id='save-comment' class='button is-warning' data-id='" + data._id + "'>Save</button>")
	  });
	});

	$(document).on("click", ".delete", function() {
		$(".modal").toggleClass("is-active");
		$("#comments-list").html("<p>Write the first comment for this article.</p>");
	});

	// Comments
	$(document).on("click", "#save-comment", function() {
	  var articleID = $(this).attr("data-id");
	  $.ajax({
	    method: "POST",
	    url: "/comment/" + articleID,
	    data: {
	      body: $("#new-comment-field").val()
	    }
	  }).done(function(data) {
      console.log("data: ", data);
		});

	  $("#new-comment-field").val("");
	  $(".modal").toggleClass("is-active");
	});

	// Delete Comments
	$(document).on("click", ".delete-comment", function() {
	});

	// Delete Saved Articles
	$(document).on("click", ".unsave-button", function() {
		var articleID = $(this).attr("data-id");
		console.log(articleID);
	  $.ajax({
	    method: "POST",
	    url: "/unsave/" + articleID,
	    data: {
	      saved: false
	    }
	  });
	});

});
