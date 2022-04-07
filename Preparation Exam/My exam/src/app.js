import {page, render} from './lib.js';
import { registerPage } from './views/register.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { getUserData } from './util.js';
import { logout } from './api/api.js';
import { catalogPage } from './views/catalog.js';
import { editPage } from './views/edit.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';



const root = document.getElementById('content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page('/index.html', homePage)
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/catalog', catalogPage);

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
        [...document.querySelectorAll('.user')].forEach(a => a.style.display = 'inline-block');
        [...document.querySelectorAll('.guest')].forEach(a => a.style.display = 'none');
    }else {
        [...document.querySelectorAll('.user')].forEach(a => a.style.display = 'none');
        [...document.querySelectorAll('.guest')].forEach(a => a.style.display = 'inline-block');
    }
}

function onLogout(e) {
    e.preventDefault()
    logout();
    updateUserNav();
    page.redirect('/');
}