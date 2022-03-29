import {page, render} from './lib.js';
import { registerPage } from './views/register.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { logout } from './api/api.js';
import { editPage } from './views/edit.js';
import { catalogPage } from './views/catalog.js';
import { getUserData } from './util.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { profilePage } from './views/my-listings.js';
import { searchPage } from './views/search.js';



const root = document.getElementById('site-content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page("/index.html", homePage)
page('/login', loginPage);
page('/register', registerPage);
page('/listings', catalogPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/my-listings', profilePage);
page('/search', searchPage);

updateUserNav();
page.start();

function decorateContext(ctx,next){
    ctx.updateUserNav = updateUserNav;
    ctx.render = (content) => render(content, root);
    

    next();
}
function updateUserNav() {
    const userData = getUserData();

    if (userData) {
        document.getElementById('profile').style.display = 'block';
        document.getElementById('guest').style.display = 'none';
        document.querySelector("div#profile > a").textContent = `Welcome, ${userData.username}`;
    }else {
        document.getElementById('profile').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}

function onLogout() {
    logout();
    updateUserNav();
    page.redirect('/');
}