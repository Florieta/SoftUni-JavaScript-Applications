import { getAlbumById, deleteAlbum } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../util.js";


const detailsTemplate = (album, onDelete, isUser) => html`
<section id="detailsPage">
    <div class="wrapper">
        <div class="albumCover">
            <img src=${album.imgUrl}>
        </div>
        <div class="albumInfo">
            <div class="albumText">
                <h1>Name: ${album.name}</h1>
                <h3>Artist: ${album.artist}</h3>
                <h4>Genre: ${album.genre}</h4>
                <h4>Price: $${album.price}</h4>
                <h4>Date: ${album.releaseDate}</h4>
                <p>Description: ${album.description}</p>
            </div>
            ${isUser
                ? html`<div class="actionBtn">
                <a href="/edit/${album._id}" class="edit">Edit</a>
                <a @click=${onDelete} href="javascript:void(0)" class="remove">Delete</a>
            </div>`
            : null}
        </div>
    </div>
</section>`


export async function detailsPage(ctx) {
    const albumId = ctx.params.id
    const userData = getUserData();
    const album = await getAlbumById(albumId)
    const isUser = userData && userData.id == album._ownerId;
    

    ctx.render(detailsTemplate(album, onDelete, isUser))

    async function onDelete() {
        const choice = confirm(`Are you sure you want to delete ${album.name}`);
        if(choice){
            await deleteAlbum(albumId)
            ctx.page.redirect("/catalog")
        }
        
    }
}