import { deleteGame, getGameById, getAllComments, createComment } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../util.js";

const detailsTemplate = (game, isOwner, onDelete, comments, showCommentForm, onComment) => html`
<section id="game-details">
            <h1>Game Details</h1>
            <div class="info-section">

                <div class="game-header">
                    <img class="game-img" src=${game.imageUrl} />
                    <h1>Title: ${game.title}</h1>
                    <span class="levels">MaxLevel: ${game.maxLevel}</span>
                    <p class="type">${game.category}</p>
                </div>
                <p class="text">
                ${game.summary}
                </p>
                <div class="details-comments">
                    <h2>Comments:</h2>
                    <ul>
                        ${comments.length > 0
                        ? comments.map(commentTemplate)
                    : html`<p class="no-comment">No comments.</p>`}
                    </ul>
                </div>

                ${isOwner
                ? html`<div class="buttons">
                    <a href="/edit/${game._id}" class="button">Edit</a>
                    <a @click=${onDelete} href="javascript:void(0)" class="button">Delete</a>
                </div>`
                : null}
            </div>

            ${showCommentForm
            ? html` <article class="create-comment">
                <label>Add new comment:</label>
                <form @submit=${onComment} class="form">
                    <textarea id="comment" name="comment" placeholder="Comment......"></textarea>
                    <input class="btn submit" type="submit" value="Add Comment">
                </form>
            </article>`
            : null}
        </section>`;


const commentTemplate = (comment) => html`
    <li class="comment">
        <p>Content: ${comment.comment}</p>
    </li>`


export async function detailsPage(ctx) {
    const userData = getUserData();
    let [game, comments] = await Promise.all([
        getGameById(ctx.params.id),
        getAllComments(ctx.params.id),
    ]);
   
    const isOwner = userData && userData.id == game._ownerId;
    const showCommentForm = userData != null && isOwner== false;

    ctx.render(detailsTemplate(game, isOwner, onDelete, comments, showCommentForm, onComment));

    async function onDelete(){
        const choice = confirm(`Are you sure you want to delete ${game.title}`);
try{
        if (choice){
            await deleteGame(ctx.params.id);
            ctx.page.redirect('/');
        }
    }catch (err) {
        alert(err.message)
    }
    }

    async function onComment(ev){
       ev.preventDefault();
       let comment = document.getElementById('comment').value;
try{
        await createComment(ctx.params.id, comment);
        ctx.page.redirect('/details/' + ctx.params.id);

        let comments = await getAllComments(ctx.params.id);
        ctx.render(detailsTemplate(game, isOwner, onDelete, comments, showCommentForm, onComment))

        ev.target.reset();
}catch(err){
    alert(err.message);
}

    }
}