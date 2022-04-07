import { html } from '../lib.js';
import { editAnimal, getAnimalById } from '../api/data.js';


const editTemplate = (animal, onSubmit) => html`<section id="editPage">
    <form @submit=${onSubmit} class="editForm">
        <img src=${animal.image}>
        <div>
            <h2>Edit PetPal</h2>
            <div class="name">
                <label for="name">Name:</label>
                <input name="name" id="name" type="text" .value=${animal.name}>
            </div>
            <div class="breed">
                <label for="breed">Breed:</label>
                <input name="breed" id="breed" type="text" .value=${animal.breed}>
            </div>
            <div class="Age">
                <label for="age">Age:</label>
                <input name="age" id="age" type="text" .value=${animal.age}>
            </div>
            <div class="weight">
                <label for="weight">Weight:</label>
                <input name="weight" id="weight" type="text" .value=${animal.weight}>
            </div>
            <div class="image">
                <label for="image">Image:</label>
                <input name="image" id="image" type="text" .value=${animal.image}>
            </div>
            <button class="btn" type="submit">Edit Pet</button>
        </div>
    </form>
</section>`;

export async function editPage(ctx) {
    const animal = await getAnimalById(ctx.params.id)
    ctx.render(editTemplate(animal, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const name = formData.get('name').trim();
        const breed = formData.get('breed').trim();
        const age = formData.get('age').trim();
        const weight = formData.get('weight').trim();
        const image = formData.get('image').trim();


        try {
            if (name == '' || breed == '' || age == '' || weight == '' || image == '') {
                return alert('Please fill all fields!');
            }


            await editAnimal(ctx.params.id, {
                name,
                breed,
                age,
                weight,
                image

            })

            ctx.page.redirect('/details/' + ctx.params.id);
        }catch(err){
            alert(err.message)
        }
    }
}