$(document).ready(function(){
    var outputList = document.getElementById('list-output');
    var bookUrl = "https://openlibrary.org/search.json?q=";
    var placeHldr = './assets/images/placeholder.jpeg';
    var searchData;

    $("#search").click(function(){
        outputList.innerHTML = "";
        searchData = $("#search-box").val();

        if(searchData === "" || searchData === null){
            displayError();
        } else {
            $.ajax({
                url: bookUrl + encodeURIComponent(searchData) + "&limit=6",
                dataType: "json",
                success: function(response){
                    if(response.numFound === 0){
                        alert("No results! Try again.");
                    } else {
                        $("#title").animate({'margin-top': '5px'}, 1000);
                        $(".book-list").css("visibility", "visible");
                        displayResults(response);
                    }
                },
                error: function(){
                    alert("Something went wrong...<br>Try again!");
                }
            });
        }
        $("#search-box").val("");
    });

    $("#random-search").click(function() {
        outputList.innerHTML = "";
        var randomGenres = ["Fiction", "Mystery", "Science", "History", "Romance", "Technology", "Biography", "Horror", "Fantasy", "Comedy", "Thriller", "Adventure", "Psychological"];
        var randomGenre = randomGenres[Math.floor(Math.random() * randomGenres.length)];

        $.ajax({
            url: bookUrl + "subject:" + encodeURIComponent(randomGenre) + "&limit=1",
            dataType: "json",
            success: function(response) {
                if (response.numFound === 0) {
                    alert("No results! Try again.");
                } else {
                    $("#title").animate({ 'margin-top': '5px' }, 1000);
                    $(".book-list").css("visibility", "visible");
                    displayResults(response);
                }
            },
            error: function() {
                alert("Something went wrong...<br>Try again!");
            }
        });
    });

    $("#author-search").click(function(){
        outputList.innerHTML = "";
        searchData = $("#search-box").val();

        if(searchData === "" || searchData === null){
            displayError();
        } else {
            $.ajax({
                url: bookUrl + "author:" + encodeURIComponent(searchData) + "&limit=6",
                dataType: "json",
                success: function(response){
                    if(response.numFound === 0){
                        alert("No results! Try again.");
                    } else {
                        $("#title").animate({'margin-top': '5px'}, 1000);
                        $(".book-list").css("visibility", "visible");
                        displayResults(response);
                    }
                },
                error: function(){
                    alert("Something went wrong...<br>Try again!");
                }
            });
        }
        $("#search-box").val("");
    });

    function displayResults(response) {
        const books = response.docs;
        let rowHTML = '';
        for (let i = 0; i < books.length; i++) {
            let book = books[i];
            let title = book.title || "No Title Available";
            let author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
            let publisher = book.publisher ? book.publisher[0] : "Unknown Publisher";
            let bookLink = book.key ? `https://openlibrary.org${book.key}` : "#";
            let bookImg = book.cover_i
                          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                          : placeHldr;

            rowHTML += formatOutput(bookImg, title, author, publisher, bookLink);

            if ((i + 1) % 3 === 0 || i === books.length - 1) {
                outputList.innerHTML += `<div class="row mt-4">${rowHTML}</div>`;
                rowHTML = '';
            }
        }
    }

    function formatOutput(bookImg, title, author, publisher, bookLink) {
        var htmlCard = `<div class="col-lg-4 col-md-6 mb-4">
          <div class="card" id="random-card">
            <div class="card-body d-flex flex-column justify-content-between">
              <img src="${bookImg}" class="card-img-top mx-auto" alt="Book Cover" style="max-width: 200px; margin-bottom: 20px;">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">Author: ${author}</p>
              <p class="card-text">Publisher: ${publisher}</p>
              <a target="_blank" href="${bookLink}" class="btn btn-secondary mt-3">View Book</a>
            </div>
          </div>
        </div>`;
        return htmlCard;
    }

    function displayError() {
        alert("Search term cannot be empty!");
    }
});
