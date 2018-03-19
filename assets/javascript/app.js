
var movies = ["The Matrix", "Fight Club", "Princess Mononoke", "BladeRunner 2049", "Interstellar", "Black Panther", "Thor Ragnarok", "Batman Begins", "The Dark Knight", "The Dark Knight Rises", "Serenity"];
var main = $("body");
var btns = main.find("#movieButtons");


//FOR LOOP TO CREATE BUTTONS FOR MOVIES==================================
function createButtons() {
	for (var i = 0; i < movies.length; i++) {
		var movieBtn = $("<button>");
		movieBtn.addClass("movie-button movie movie-button-color");
		movieBtn.attr("data-movie", movies[i]);
		movieBtn.text(movies[i]);
		btns.append(movieBtn);
	}
} //=====================================================================

//BUTTON CLICKS & AJAX CALL TO GIPHY API & IMG CREATION==================
function ajaxCall() {
	$("button").on("click", function () {
		$("#gifs-appear-here").empty();
		var movie = $(this).attr("data-movie");
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + movie + "&api_key=bbfAc7Nt5KQyvpe6eD6xsvJkQWPhauAV&limit=10";

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			console.log(response);
			var results = response.data;
			for (var i = 0; i < results.length; i++) {
				var gifDiv = $("<div class='item'>");
				var rating = results[i].rating;
				var p = $("<p>").text("Rating: " + rating);
				var movieImage = $("<img>");
				movieImage.addClass("gif");
				movieImage.attr("src", results[i].images.fixed_height_still.url);
				movieImage.attr("data-still", results[i].images.fixed_height_still.url);
				movieImage.attr("data-animate", results[i].images.fixed_height.url);
				movieImage.attr("data-state", "still");

				gifDiv.prepend(p);
				gifDiv.prepend(movieImage);

				$("#gifs-appear-here").prepend(gifDiv);
			}
		});
	});
} //====================================================================

createButtons();
ajaxCall();

//ANIMATE GIFS WHEN CLICKING ON THEM======================================
$(document).on("click", ".gif", function () {
	var state = $(this).attr("data-state");
	if (state === "still") {
		var animatedUrl = $(this).attr("data-animate");
		$(this).attr("src", animatedUrl);
		$(this).attr("data-state", "animate");
	} else if (state === "animate") {
		var stillUrl = $(this).attr("data-still");
		$(this).attr("src", stillUrl);
		$(this).attr("data-state", "still");
	}
}); //====================================================================

//TAKE USER INPUT AND ADD A NEW BUTTON TO THE TOP=========================
$("#addMovie").on("click", function(event) {
	event.preventDefault();
	var newMovie = $("#movie-input").val();
	movies.push(newMovie);
	$("#movie-form").trigger("reset");
	btns.empty();
	createButtons();
	ajaxCall();
});
