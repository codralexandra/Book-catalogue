$(document).ready(function(){
    var item, title, author, publisher, bookLink, bookImg;
    var outputList = document.getElementById('list-output');
    var bookUrl = "https://openlibrary.org/search.json?q=";
    var placeHldr = '<img src="./assets/placeholder.jpg" alt="Book Cover">';
    var searchData;

    $("#search").click(function(){
        outputList.innerHTML = "";
        searchData = $("#search-box").val();

        if(searchData === "" || searchData === null){
            displayError();
        }
        else{
            $.ajax({
                url: bookUrl + searchData + "&limit=10",
                dataType: "json",
                success: function(response){
                    console.log(response);
                    if(response.num_found === 0){
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

    function displayResults(response) {
        const docs = response.docs;
        for (let i = 0; i < docs.length; i += 2) {
            let item1 = docs[i];
            let title1 = item1.title || "No Title Available";
            let author1 = item1.author_name ? item1.author_name.join(", ") : "Unknown Author";
            let publisher1 = item1.publisher ? item1.publisher.join(", ") : "Unknown Publisher";
            let bookLink1 = "https://openlibrary.org" + item1.key || "#";
            let bookImg1 = item1.cover_i 
                            ? `https://covers.openlibrary.org/b/id/${item1.cover_i}-M.jpg` 
                            : placeHldr;

            let title2, author2, publisher2, bookLink2, bookImg2;
            if (i + 1 < docs.length) {
                let item2 = docs[i + 1];
                title2 = item2.title || "No Title Available";
                author2 = item2.author_name ? item2.author_name.join(", ") : "Unknown Author";
                publisher2 = item2.publisher ? item2.publisher.join(", ") : "Unknown Publisher";
                bookLink2 = "https://openlibrary.org" + item2.key || "#";
                bookImg2 = item2.cover_i 
                            ? `https://covers.openlibrary.org/b/id/${item2.cover_i}-M.jpg` 
                            : placeHldr;
            } else {
                title2 = author2 = publisher2 = bookLink2 = "N/A";
                bookImg2 = placeHldr;
            }

            outputList.innerHTML += '<div class="row mt-4">' +
                                    formatOutput(bookImg1, title1, author1, publisher1, bookLink1) +
                                    formatOutput(bookImg2, title2, author2, publisher2, bookLink2) +
                                    '</div>';
        }
    }

    function formatOutput(bookImg, title, author, publisher, bookLink) {
        var placeholder = './assets/images/placeholder.jpeg';
        var imageSrc = bookImg || placeholder;
    
        var htmlCard = `<div class="col-lg-6">
              <div class="card">
                <div class="row no-gutters">
                  <div class="col-md-4">
                    <img src="${imageSrc}" class="card-img" alt="Book Cover">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text">Author: ${author}</p>
                      <p class="card-text">Publisher: ${publisher}</p>
                      <a target="_blank" href="${bookLink}" class="btn btn-secondary">View Book</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
        return htmlCard;
    }

    function displayError() {
        alert("Search term cannot be empty!");
    }
});
