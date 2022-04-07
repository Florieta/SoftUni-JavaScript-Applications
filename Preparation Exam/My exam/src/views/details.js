import { deleteAnimal, getAnimalById, getdonationsByAnimalId, getMyDonationByAnimalId, makeDonate } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../util.js";

const detailsTemplate = (animal, isOwner, onDelete, isUser, donations, onDonate) => html`
<section id="detailsPage">
    <div class="details">
        <div class="animalPic">
            <img src=${animal.image}>
        </div>
        <div>
            <div class="animalInfo">
                <h1>Name: ${animal.name}</h1>
                <h3>Breed: ${animal.breed}</h3>
                <h4>Age: ${animal.age}</h4>
                <h4>Weight: ${animal.weight}</h4>
                <h4 class="donation">Donation: ${donations}$</h4>
            </div>

            <div class="actionBtn">
                ${isOwner
? html`<a href="/edit/${animal._id}" class="edit">Edit</a>
                <a @click=${onDelete} href="javascript:void(0)" class="remove">Delete</a>`
: null}
                ${isUser
? html`<a @click=${onDonate} href="javascript:void(0)" class="donate">Donate</a>`
: null}
            </div>
        </div>
    </div>
</section>`;



export async function detailsPage(ctx) {
    const userData = getUserData();
    let [animal, donations, hasDonate] = await Promise.all([
        getAnimalById(ctx.params.id),
        getdonationsByAnimalId(ctx.params.id),
        userData ? getMyDonationByAnimalId(ctx.params.id, userData.id) : 0
    ]);

    const isOwner = userData && userData.id == animal._ownerId;
    const isUser = userData != null && isOwner == false && hasDonate == false;
donations = donations * 100;
    ctx.render(detailsTemplate(animal, isOwner, onDelete, isUser, donations, onDonate));

    async function onDelete() {
        const choice = confirm(`Are you sure you want to delete ${animal.name}`);

        if (choice) {
            await deleteAnimal(ctx.params.id);
            ctx.page.redirect('/');
        }
    }

    async function onDonate() {
        let donationValue = document.querySelector('.donation');
        const petId = ctx.params.id;
        try {
            await makeDonate(petId);
            donationValue.textContent = `Donation: ${donations + 100}$`

        } catch (err) {
            alert(err.message)
        }

        ctx.page.redirect('/details/' + petId);
    }
}