import { getEventById, deleteEvent, getlikesByEventId, getMyLikesByEventId, likeEvent } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../util.js";


const detailsTemplate = (event, userData, onDelete, likes, hasLike, onLike) => html`
<section id="detailsPage">
            <div id="detailsBox">
                <div class="detailsInfo">
                    <h1>Title: ${event.title}</h1>
                    <div>
                        <img src=${event.imageUrl} />
                    </div>
                </div>

                <div class="details">
                    <h3>Theater Description</h3>
                    <p>${event.description}</p>
                    <h4>Date: ${event.date}</h4>
                    <h4>Author: ${event.author}</h4>
                    <div class="buttons">
                        ${userData.id == event._ownerId
                        ? html`
        <a @click=${onDelete} class="btn-delete" href="javascript:void(0)">Delete</a>
        <a class="btn-edit" href="/edit/${event._id}">Edit</a>`
        : null}                        
                        ${userData && userData.id != event._ownerId && hasLike == false
                        ? html`<a @click=${onLike} class="btn-like" href="javascript:void(0)">Like</a>`
                    : null}
                        
                    </div>
                    <p class="likes">Likes: ${likes}</p>
                </div>
            </div>
        </section>`



export async function detailsPage(ctx) {
    const eventId = ctx.params.id
    const userData = getUserData();
    let [event, likes, hasLike] = await Promise.all([
        getEventById(eventId),
        getlikesByEventId(eventId),
        userData ? getMyLikesByEventId(ctx.params.id, userData.id) : 0
    ]);
   
    //const isOwner = userData  && userData.id == event._ownerId;
    //const isUser = userData && userData.id != event._ownerId && hasLike == false;

    ctx.render(detailsTemplate(event, userData, onDelete, likes, hasLike, onLike));

    async function onDelete(){
        const choice = confirm(`Are you sure you want to delete ${event.title}`);

        if (choice){
            await deleteEvent(eventId);
            ctx.page.redirect('/profile');
        }
    }

    async function onLike(){
       try{
        await likeEvent(eventId);
        //hasLike = await getMyLikesByEventId(eventId, userData.id)
        //likes = await getlikesByEventId(eventId)
        //ctx.render(detailsTemplate(event, onDelete, likes, hasLike, onLike));
        
       }catch(err){
           alert(err.message)
       }

       ctx.page.redirect('/details/' + eventId);
    }
}