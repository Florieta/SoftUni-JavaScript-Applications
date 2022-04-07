import * as api from './api.js'

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function getAllAnimals() {
    return api.get('/data/pets?sortBy=_createdOn%20desc&distinct=name');
}
export async function createAnimal(animal) {
    return api.post('/data/pets', animal);
}

export async function getAnimalById(id) {
    return api.get('/data/pets/' + id);
}
export async function deleteAnimal(id) {
    return api.del('/data/pets/' + id);
}

export async function editAnimal(id, animal) {
    return api.put('/data/pets/' + id, animal);
}

export async function makeDonate(petId) {
    return api.post('/data/donation', {
        petId
    });
}

export async function getdonationsByAnimalId(petId) {
    return api.get(`/data/donation?where=petId%3D%22${petId}%22&distinct=_ownerId&count`);
}


export async function getMyDonationByAnimalId(petId, userId) {
    return api.get(`/data/donation?where=petId%3D%22${petId}%22%20and%20_ownerId%3D%22${userId}%22&count`);
}