import { getUserEvents } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../util.js";


const profileTemplate = (events, email) => html`
 <section id="profilePage">
            <div class="userInfo">
                <div class="avatar">
                    <img src="./images/profilePic.png">
                </div>
                <h2>${email}</h2>
            </div>
            <div class="board">
                ${events.length > 0
                ? events.map(singleEvent)
            : html `<div class="no-events">
                    <p>This user has no events yet!</p>
                </div>`}
            </div>
        </section>`


const singleEvent = (event) => html`
<div class="eventBoard">
                    <div class="event-info">
                        <img src=${event.imageUrl}>
                        <h2>${event.title}</h2>
                        <h6>${event.date}</h6>
                        <a href="/details/${event._id}" class="details-button">Details</a>
                    </div>
                </div>`



export async function profilePage(ctx) {
    const userData = getUserData();

    const events = await getUserEvents(userData.id)
const email = userData.email;
    ctx.render(profileTemplate(events, email))
}