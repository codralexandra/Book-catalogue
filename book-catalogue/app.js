$(document).ready(function(){
    var item, title, author, publisher, bookLink, bookImg;
    var outputList = document.getElementById('list-output');
    var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
    var placeHldr = './assets/images/placeholder.jpeg';
    var searchData;

    $("#search").click(function(){
        outputList.innerHTML = "";
        searchData = $("#search-box").val();

        if(searchData === "" || searchData === null){
            displayError();
        }
        else{
            $.ajax({
                url: bookUrl + encodeURIComponent(searchData) + "&maxResults=6&langRestrict=en",
                dataType: "json",
                success: function(response){
                    console.log(response);
                    if(response.totalItems === 0){
                        alert("No results! Try again.");
                    }
                    else{
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
        console.log("Random search clicked");
        outputList.innerHTML = "";
    
        var randomGenres = ["Fiction", "Mystery", "Science", "History", "Romance", "Technology", "Biography", "Horror", "Fantasy", "Comedy", "Thriller", "Adventure", "Psychological"];
        var randomGenre = randomGenres[Math.floor(Math.random() * randomGenres.length)];
    
        var previouslyShownBooks = [];
    
        $.ajax({
            url: bookUrl + "subject:" + encodeURIComponent(randomGenre) + "&maxResults=1&langRestrict=en",
            dataType: "json",
            success: function(response) {
                if (response.totalItems === 0) {
                    alert("No results! Try again.");
                } else {
                    var uniqueResults = response.items.filter(function(book) {
                        return !previouslyShownBooks.includes(book.id);
                    });
    
                    if (uniqueResults.length > 0) {
                        $("#title").animate({ 'margin-top': '5px' }, 1000);
                        $(".book-list").css("visibility", "visible");
                        previouslyShownBooks.push(...uniqueResults.map(function(book) {
                            return book.id;
                        }));
                        displayResults({ items: uniqueResults, totalItems: uniqueResults.length });
                    } else {
                        alert("All results have been shown. Please try again.");
                    }
                }
            },
            error: function() {
                alert("Something went wrong...<br>Try again!");
            }
        });
    });

    function displayResults(response) {
        const books = response.items;
        let rowHTML = '';
        for (let i = 0; i < books.length; i++) {
            let book = books[i].volumeInfo;
            let title = book.title || "No Title Available";
            let author = book.authors ? book.authors.join(", ") : "Unknown Author";
            let publisher = book.publisher || "Unknown Publisher";
            let bookLink = book.infoLink || "#";
            let bookImg = book.imageLinks && book.imageLinks.thumbnail
                          ? book.imageLinks.thumbnail
                          : placeHldr;
    
            // Append the card to the rowHTML
            rowHTML += formatOutput(bookImg, title, author, publisher, bookLink);
    
            // Every 3 books or at the end of the list, close the row and append to outputList
            if ((i + 1) % 3 === 0 || i === books.length - 1) {
                outputList.innerHTML += `<div class="row mt-4">${rowHTML}</div>`;
                rowHTML = ''; // Reset for the next row
            }
        }
    }

    function formatOutput(bookImg, title, author, publisher, bookLink) {
        var placeholder = './assets/images/placeholder.jpeg';
        var imageSrc = bookImg || placeholder;

        var htmlCard = `<div class="col-lg-4 col-md-6 mb-4"> <!-- col-lg-4 for 3 items per row -->
          <div class="card">
            <div class="card-body d-flex flex-column justify-content-between"> <!-- Use flexbox for consistent layout -->
              <!-- Book Image -->
              <img src="${imageSrc}" class="card-img-top mx-auto" alt="Book Cover" style="max-width: 200px; margin-bottom: 20px;">
              <!-- Title -->
              <h5 class="card-title">${title}</h5>
              <!-- Author -->
              <p class="card-text">Author: ${author}</p>
              <!-- Book Link Button -->
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