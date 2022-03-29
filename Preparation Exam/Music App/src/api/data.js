import * as api from './api.js'

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function createAlbum(album) {
    return api.post('/data/albums', album);
}
export async function getAlbums() {
    return api.get('/data/albums?sortBy=_createdOn%20desc&distinct=name');
}
export async function getAlbumByName(name) {
    return api.get(`/data/albums?where=name%20LIKE%20%22${name}%22`);
}

export async function getAlbumById(id) {
    return api.get('/data/albums/' + id);
}

export async function deleteAlbum(id) {
    return api.del('/data/albums/' + id);
}

export async function editAlbum(id, album) {
    return api.put('/data/albums/' + id, album);
}

/**
export async function createCar(car) {
    return api.post('/data/cars', car);
}





export async function getUserCars(id) {
    return await api.get(`/data/cars?where=_ownerId%3D%22${id}%22&sortBy=_createdOn%20desc`)
}

export async function getCarsByYear(year) {
    return await api.get(`/data/cars?where=year%3D${year}`)
}**/