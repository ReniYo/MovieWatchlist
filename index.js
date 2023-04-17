const searchEl = document.getElementById("search")
const searchBtn = document.getElementById("search-btn")
const searchList = document.getElementById("search-list")
const myWatchlistEl = document.getElementById("my-watchlist")
const moviesFromLocalStorage = JSON.parse(localStorage.getItem("myWatchlist"))
let myWatchlist = []
let searchListArr = []
let searchImdbIds = []


if (moviesFromLocalStorage) {
    myWatchlist = moviesFromLocalStorage
    renderWatchList()   
}

document.addEventListener("click", function(e){
    if(e.target.dataset.watchlist){
        handleWatchlistClick(e.target.dataset.watchlist)
        document.getElementById(`added${e.target.dataset.watchlist}`).style.display = "inline"
    }else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    }else if(e.target.dataset.add){
        window.location.replace ("/index.html")
    }
})

if(searchBtn){
    searchBtn.addEventListener("click", handleSearchClick)
}

function handleSearchClick(){
    if(searchEl.value){
        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=86d788a5&s=${searchEl.value}`)
            .then(res => res.json())
            .then(data => {
            if(data.Response === "True"){
                for(let item of data.Search){
                        searchImdbIds.push(item.imdbID)
                    }
                renderSearchList()
                searchImdbIds = []
            }else {
                errorMessage()
            }  
        })
}else{
        errorMessage()
    }
}

function renderSearchList() {
    if(searchImdbIds){
        let html = ``
            for(let id of searchImdbIds){
            fetch(`https://www.omdbapi.com/?i=${id}&apikey=86d788a5&`)
            .then(res => res.json())
            .then(data => {
                searchListArr.push(data)
                // Object.assign(this, data)
                html += `
                <div class="movie-info">
                    <img src="${data.Poster}">
                    <div class="movie-details">
                        <div class="movie-main-details">
                            <h3>${data.Title}</h3>
                            <i class="fa-solid fa-star" style="color: #fec654;"></i>
                            <p>${data.imdbRating}</p>
                        </div>
                        <div class="movie-secondary-details">
                                <p>${data.Runtime}</p>
                                <p>${data.Genre}</p>
                                <i class="fa-sharp fa-solid fa-circle-plus" style="color: #111827" data-watchlist="${data.imdbID}"></i>
                                <p data-watchlist="${data.imdbID}">Watchlist</p>
                                <p id="added${data.imdbID}" class="added" style="display: none">Added</p>
                        </div>
                        <div>
                            <p>${data.Plot}</p>
                        </div>
                    </div>
                </div>
                `
                if(searchList){
                    searchList.innerHTML = html
                }
                
            })
        }
        
    }
}

function errorMessage(){
    if(searchList){
        searchList.innerHTML = `<div class="no-list">
                                    <h3>Unable to find what you’re looking for. Please try another search.</h3>
                                </div>`
        searchImdbIds = []
    }     
}

function handleWatchlistClick(id){    
    for( let i = 0; i < searchListArr.length; i++) {
            if(searchListArr[i].imdbID === id){
                if(myWatchlist.length < 1){
                    myWatchlist.push(searchListArr[i])
                }else{
                    let inInTheArr = []
                    for(let item of myWatchlist){
                        if(item.imdbID != searchListArr[i].imdbID){
                            inInTheArr.push("not")    
                        }else{
                            inInTheArr.push("yes")
                        }
                    } 
                    if(!inInTheArr.includes("yes")){
                        myWatchlist.push(searchListArr[i])
                    }
                } 
            }
        }
    localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist))
}

function handleRemoveClick(id){
    for(let item of myWatchlist){
            if(item.imdbID === id){
                const index = myWatchlist.indexOf(item)
                const newArr = myWatchlist.splice(index,1)
            }
        }

    localStorage.clear()
    localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist))
    renderWatchList()
}

function renderWatchList() {
    let html = ``
    if(myWatchlist.length < 1){
        html =  `
            <div class="no-list">
                <h3>Your watchlist is looking a little empty...</h3>
                <div class="watchlist-add-movies-btn">
                    <i class="fa-sharp fa-solid fa-circle-plus" data-add="add"></i>
                    <h4 data-add="add">Let’s add some movies!</h4>
                </div>
            </div>
            `
        }else{
            
            for(let item of myWatchlist){
                // console.log(myWatchlist)
        
            html += `
                <div class="movie-info">
                    <img src="${item.Poster}">
                    <div class="movie-details">
                        <div class="movie-main-details">
                            <h3>${item.Title}</h3>
                            <i class="fa-solid fa-star" style="color: #fec654;"></i>
                            <p>${item.imdbRating}</p>
                        </div>
                        <div class="movie-secondary-details">
                                <p>${item.Runtime}</p>
                                <p>${item.Genre}</p>
                                <i class="fa-solid fa-circle-minus" style="color: #111827;" data-remove="${item.imdbID}"></i>
                                <p data-remove="${item.imdbID}">Remove</p>
                        </div>
                        <div>
                            <p>${item.Plot}</p>
                        </div>
                    </div>
                </div>
                `
            }
        }
    
     if(myWatchlistEl){
         myWatchlistEl.innerHTML = html
     }
}





