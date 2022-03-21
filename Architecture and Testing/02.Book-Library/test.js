const { chromium } = require('playwright-chromium')
const { expect } = require('chai')

let host = 'http://localhost:5500';
const mockData = {
    "d953e5fb-a585-4d6b-92d3-ee90697398a0":{
        "author":"J.K.Rowling",
        "title":"Harry Potter and the Philosopher's Stone"
    },
    "d953e5fb-a585-4d6b-92d3-ee90697398a1":{ 
        "author":"Svetlin Nakov",
        "title":"C# Fundamentals"
    }};


    describe('Tests', async function () {
        this.timeout(6000);

        let browser, page;

        before(async () => {
            const browser = await chromium.launch();
        });

        after(async () => {
            await browser.close();
        });

        beforeEach(async () => {
            page = await browser.newPage();
        });

        afterEach(async () => {
            page.close();
        });
        it('loads all books', async () => {
            await page.route('**/jsonstore/collections/books', (route, request) => {
                console.log('intercepted request')
                route.fulfill({
                    body: JSON.stringify({ mockData }),
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    }
                })
            });

            await page.goto(host);

            await page.click('text=Load all books');
            await page.waitForSelector('text=Harry Potter');
            const rowData = await page.$$eval('tbody tr', rows => rows.map(r => r.textContent));

            expect(rowData[0]).to.contains('Harry Potter');
            expect(rowData[0]).to.contains('Rowling');
            expect(rowData[1]).to.contains('C# Fundamentals');
            expect(rowData[1]).to.contains('Nakov');

        });
        it('can create book', async () => {
            await page.goto('http://localhost:5500');
    
            await page.fill('form#createForm >> input[name="title"]', 'Title');
            await page.fill('form#createForm >> input[name="author"]', 'Author');
    
            const [request] = await Promise.all([
                page.waitForRequest(request => request.method() == 'POST'),
                page.click('form#createForm >> text=Submit')
            ]);
    
            const data = JSON.parse(request.postData());
            expect(data.title).to.equal('Title');
            expect(data.author).to.equal('Author');
        });
    
        it('can edit book', async () => {
            await page.goto('http://localhost:5500');
    
            await page.click('text=Load All Books');
    
            page.click('tbody >> text=Edit')
    
            page.waitForSelector('form');
    
            await page.fill('form#editForm >> input[name="title"]', 'Title 2');
            await page.fill('form#editForm >> input[name="author"]', 'Author 2');
    
            const [request] = await Promise.all([
                page.waitForRequest(request => request.method() == 'PUT'),
                page.click('form#editForm >> text=Save')
            ]);
    
            const data = JSON.parse(request.postData());
            expect(data.title).to.equal('Title 2');
            expect(data.author).to.equal('Author 2');
        });
    
        it('can delete book', async () => {
            await page.goto('http://localhost:5500',);
    
            await page.click('text=Load All Books');
    
            await page.waitForSelector('text=Svetlin Nakov');
    
            await page.on('dialog', async dialog => await dialog.accept());
    
            const [request] = await Promise.all([
                page.waitForRequest(r => r),
                page.click('tbody >> text=Delete')
            ]);
    
            expect(request.method()).to.equal('DELETE');
        });
    });