import { getAllAnimals } from "../api/data.js";
import { html } from "../lib.js";

const catalogTemplate = (animals) => html`<section id="dashboard">
    <h2 class="dashboard-title">Services for every animal</h2>
    <div class="animals-dashboard">
        ${animals.length > 0
            ? animals.map(animalPreview)
                : html`<div>
            <p class="no-pets">No pets in dashboard</p>
        </div>`}
    </div>
</section>`;

const animalPreview = (animal) => html`<div class="animals-board">
    <article class="service-img">
        <img class="animal-image-cover" src=${animal.image}>
    </article>
    <h2 class="name">${animal.name}</h2>
    <h3 class="breed">${animal.breed}</h3>
    <div class="action">
        <a class="btn" href="/details/${animal._id}">Details</a>
    </div>
</div>`;

export async function catalogPage(ctx) {
    const animals = await getAllAnimals();
    ctx.render(catalogTemplate(animals));

}