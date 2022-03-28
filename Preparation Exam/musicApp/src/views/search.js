import { getAlbumByName } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../util.js";


const searchTemplate = (onSearch, albums) => html`
<section id="searchPage">
            <h1>Search by Name</h1>
            <div class="search">
                <input id="search-input" type="text" name="search" placeholder="Enter desired albums's name">
                <button @click=${onSearch} class="button-list">Search</button>
            </div>
            <h2>Results:</h2>
            <!--Show after click Search button-->
            <div class="search-result">
            ${albums 
            ? albums.length > 0 
                ? albums.map(singleAlbum) 
                : html`<p class="no-result">No result.</p>` 
            : null}
            </div>
</section>`

const singleAlbum = (album) => html`
<div class="card-box">
                    <img src=${album.imgUrl}>
                    <div>
                        <div class="text-center">
                            <p class="name">Name: ${album.name}</p>
                            <p class="artist">Artist: ${album.artist}</p>
                            <p class="genre">Genre: ${album.genre}</p>
                            <p class="price">Price: $${album.price}</p>
                            <p class="date">Release Date: ${album.releaseDate}</p>
                        </div>
                    ${(getUserData())
                    ? html`<div class="btn-group">
                        <a href="/details/${album._id}" id="details">Details</a>
                    </div>`
                    : null}
                    </div>
</div>`

export async function searchPage(ctx) {
    ctx.render(searchTemplate(onSearch))


    async function onSearch() {
        let name = document.getElementById('search-input')

        try {
            if(name.value == '') {
                throw new Error('Enter valid name!')
            }

            const albums = await getAlbumByName(name.value)

            ctx.render(searchTemplate(onSearch, albums))
            name.value=""
        } catch (err) {
            ctx.render(searchTemplate(onSearch))
            name.value=""

            alert(err.message)
        }
        

    }
}