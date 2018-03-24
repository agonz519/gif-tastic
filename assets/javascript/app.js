
var movies = ["The Matrix", "Fight Club", "Princess Mononoke", "BladeRunner 2049", "Interstellar", "Black Panther", "Thor Ragnarok", "Batman Begins", "The Dark Knight", "Serenity", "Star Wars", "The Dark Knight Rises", "300"];
var main = $("body");
var btns = main.find("#movieButtons");
var favImage;



movies.sort();

//FOR LOOP TO CREATE BUTTONS FOR MOVIES==================================
function createButtons() {
	for (var i = 0; i < movies.length; i++) {
		var movieBtn = $("<button type='button' class='btn btn-outline-dark'>");
		movieBtn.addClass("movie-button movie movie-button-color");
		movieBtn.attr("data-movie", movies[i]);
		movieBtn.text(movies[i]);
		btns.append(movieBtn);
	}
} //=====================================================================

//BUTTON CLICKS & AJAX CALL TO GIPHY API & IMG CREATION==================
function ajaxCall() {
	$("button").on("click", function () {
		event.preventDefault();
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
				var p = $("<h5>").text("Rating: " + rating);
				var downloadBtn = $("<button type='button' class='btn btn-outline-dark download'>").text("Download");
				var favoritesBtn = $("<button type='button' class='btn btn-outline-dark favorites' data-fav-status='false'>").text("Favorite");
				var movieImage = $("<img>");
				movieImage.addClass("gif");
				movieImage.attr("src", results[i].images.fixed_height_still.url);
				movieImage.attr("data-still", results[i].images.fixed_height_still.url);
				movieImage.attr("data-animate", results[i].images.fixed_height.url);
				movieImage.attr("data-state", "still");

				gifDiv.prepend("<br><br>");
				gifDiv.prepend(favoritesBtn);
				gifDiv.prepend(downloadBtn);
				gifDiv.prepend("<br>");
				gifDiv.prepend(movieImage);
				gifDiv.prepend(p);

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

//ADD GIFS TO FAVORITES===================================================
$(document).on("click", ".favorites", function () {
	var state = $(this).attr("data-fav-status");
	if (state === "false") {
		$(this).text("Remove");
		$(this).attr("data-fav-status", "true");
		favImage = $(this).prev().prev().prev().clone();
		console.log(favImage);
		console.log(favImage[0].dataset.animate)
		var newFav = localStorage.setItem('favoriteGif' + favImage[0].src, favImage[0].dataset.animate);
		$('#favs-appear-here').append(favImage);
	} else if (state === "true") {
		$(this).text("Favorite");
		$(this).attr("data-fav-status", "false");
	}
}); //====================================================================

for (var i = 0; i < localStorage.length; i++){
	$('#favs-appear-here').append("<img src='" + localStorage.getItem(localStorage.key(i)) + "'>");
	$('#favs-appear-here').append("<br>");
}


//TAKE USER INPUT AND ADD A NEW BUTTON TO THE TOP=========================
$("#addMovie").on("click", function(event) {
	event.preventDefault();
	var newMovie = $("#movie-input").val().trim();
	$("#movie-form").trigger("reset");
	if (newMovie ==! "" || (movies.includes(newMovie) === false)) {
		movies.push(newMovie);
		movies.sort();
		btns.empty();
		createButtons();
		ajaxCall();
	}
});
