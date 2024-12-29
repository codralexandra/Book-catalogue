$(document).ready(function(){
    var item, title, author, publisher, bookLink, bookImg
    var outputList = document.getElementById('list-output')
    var bookUrl = "https://www.googleapis.com/books/v1/volumes?q="
    var placeHldr = '<img src="https://via.placeholder.com/150">'
    var searchData;

    //Listener for Search Button
    $("#search").click(function(){
        outputList.innerHTML = ""
        searchData = $("#search-box").val();

        //Empty search input
        if(searchData === "" || searchData === null){
            displayError();
        }
        else{
            $.ajax({
                url: bookUrl + searchData,
                dataType: "json",
                success: function(response){
                    console.log(response)
                    if(response.totalItem === 0){
                        alert("No results! Try again.")
                    }
                    else{
                        $("#title").animate({'margin-top': '5px'}, 1000);
                        $(".book-list").css("visibility", "visible");
                        displayResults(response);
                    }
                },
                error: function(){
                    alert("Something went wrong...<br>Try again!")
                }
            })
        }
        $("#search-box").val("");
    })

    function displayResults(response) {
        for (var i = 0; i < response.items.length; i += 2) {
            item = response.items[i];
            title1 = item.volumeInfo.title || "No Title Available";
            author1 = item.volumeInfo.authors || "Unknown Author";
            publisher1 = item.volumeInfo.publisher || "Unknown Publisher";
            bookLink1 = item.volumeInfo.previewLink || "#";
            bookIsbn1 = (item.volumeInfo.industryIdentifiers && item.volumeInfo.industryIdentifiers[1]) 
                        ? item.volumeInfo.industryIdentifiers[1].identifier 
                        : "ISBN Not Available";
            bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;
    
            // Check if there's a second item in the pair
            if (i + 1 < response.items.length) {
                item2 = response.items[i + 1];
                title2 = item2.volumeInfo.title || "No Title Available";
                author2 = item2.volumeInfo.authors || "Unknown Author";
                publisher2 = item2.volumeInfo.publisher || "Unknown Publisher";
                bookLink2 = item2.volumeInfo.previewLink || "#";
                bookIsbn2 = (item2.volumeInfo.industryIdentifiers && item2.volumeInfo.industryIdentifiers[1]) 
                            ? item2.volumeInfo.industryIdentifiers[1].identifier 
                            : "ISBN Not Available";
                bookImg2 = (item2.volumeInfo.imageLinks) ? item2.volumeInfo.imageLinks.thumbnail : placeHldr;
            } else {
                // Empty placeholders for the second column if no more items
                title2 = author2 = publisher2 = bookLink2 = bookIsbn2 = "N/A";
                bookImg2 = placeHldr;
            }
    
            outputList.innerHTML += '<div class="row mt-4">' +
                                    formatOutput(bookImg1, title1, author1, publisher1, bookLink1, bookIsbn1) +
                                    formatOutput(bookImg2, title2, author2, publisher2, bookLink2, bookIsbn2) +
                                    '</div>';
        }
    }
    

     function formatOutput(bookImg, title, author, publisher, bookLink, bookIsbn) {
        var viewUrl = 'book.html?isbn='+bookIsbn;
        var htmlCard = `<div class="col-lg-6">
          <div class="card" style="">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="${bookImg}" class="card-img" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">Author: ${author}</p>
                  <p class="card-text">Publisher: ${publisher}</p>
                  <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
                </div>
              </div>
            </div>
          </div>
        </div>`
        return htmlCard;
      }
   
      //handling error for empty search box
      function displayError() {
        alert("Search term can not be empty!")
      }
   
});
