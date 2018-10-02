$(document).ready(function() {
	
	// Navigation
	$(".navbar-burger").on("click", function() {
		$(".navbar-burger").toggleClass("is-active");
		$(".dropdown").toggle();
		$(".dropdown").toggleClass("is-open");
	});

	// Add articles to page
	$.getJSON("/articles", function(data) {
	  for (var i = 0; i < data.length; i++) {
	    $("#scrape-results").prepend("<div class='result-div'><p class='result-text'>" +data[i].title + "<br>" + data[i].description +
	    	"</p><button class='save-article button is-info is-medium' data-id='" + data[i]._id + "'>Save</button></div>");
	  }
	});

	$(document).on("click", ".save-article", function() {
		var articleID = $(this).attr("data-id");
		console.log(articleID);
	  $.ajax({
	    method: "POST",
	    url: "/save/" + articleID,
	    data: {
	      saved: true
	    }
	  }).done(function(data) {
      console.log("data: ", data);
		});
	});
});
