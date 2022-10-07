let imgs, APIOBJEC;
let navLink = Array.from(document.querySelectorAll('nav .nav-link'))
let currentImg = 0;


getDataAPI('pizza', e => {
    // Creat Element & Put Them into DOM
    createBox(APIOBJEC.recipes);
    // Hold All Images And Attach Event To Them
    attachImages();

});
navLink.forEach(ele => {
    ele.addEventListener('click', e => {
        e.preventDefault();
        getDataAPI(ele.textContent, e => {
            // Creat Element & Put Them into DOM
            createBox(APIOBJEC.recipes);
            // Hold All Images And Attach Event To Them
            attachImages();
        });
    })
})

// Keyboard Key Click Event
document.addEventListener('keydown', e => {
    if (e.code == 'ArrowLeft') {
        sliderLeft();
    }
    else if (e.code == 'ArrowRight') {
        sliderRight();
    }
    else if (e.code == 'Escape') {
        window['pop-up'].classList.add('d-none');
    }

})
document.addEventListener('click', e => {
    if (classListHelper(e.target, 'img', 'content', 'content-p', 'content-h2'))
        // Show Pop Up If Click On One Of The ELement
        window['pop-up'].classList.remove('d-none');

    else if (classListHelper(e.target, 'exit') || classListHelper(e.target.parentElement, 'exit'))
        // classListHelper(e.target.parentElement, 'exit') becuase of We Will Click On Path Tag [Child Of SVG Tag] 
        // Hide if Click On X-mark 
        window['pop-up'].classList.add('d-none');

    else if (classListHelper(e.target, 'angLeft') || classListHelper(e.target.parentElement, 'angLeft')) {
        // classListHelper(e.target.parentElement, 'angLeft') becuase of We Will Click On Path Tag [Child Of SVG Tag] 
        // If User Click Left Arrow |=> Previous
        sliderLeft();
    }
    else if (classListHelper(e.target, 'angRight') || classListHelper(e.target.parentElement, 'angRight')) {
        // classListHelper(e.target.parentElement, 'angRight') becuase of We Will Click On Path Tag [Child Of SVG Tag] 
        // If User Click Right Arrow |=> Next
        sliderRight();
    }
    else if (classListHelper(e.target, 'pop-up', 'container'))
        // If Clicked Any Place Other Than Our Box
        window['pop-up'].classList.add('d-none')
})

// Slider Left 
function sliderLeft() {
    if (currentImg == 0) // Reset Current img counter to first img
        currentImg = imgs.length;

    setImage(imgs[--currentImg]);
}
// Slider Right 
function sliderRight() {
    if (currentImg == imgs.length - 1) // Reset Current img counter to Last img
        currentImg = -1;

    setImage(imgs[++currentImg]);
}
// DOM Images Attach 
function attachImages() {
    imgs = Array.from(document.querySelectorAll('header .container .box'));
    // Add Event To All Boxes We Have
    imgs.forEach((el, index) => {
        el.addEventListener('click', e => {
            setImage(el);
            currentImg = index; // update value of Current Image Shown
        })
    });
}

// Function To Help Detected Which User Click and take Correct Action
function classListHelper(target, ...classname) {
    for (let i = 0; i < classname.length; i++) {
        if (target.classList.contains(classname[i]))
            return true;
    }
    return false;
}

// Function To Set Current Img on Target image
function setImage(el) {
    pop_img.src = el.firstElementChild.src; // set source to pop up image

    window['pop-h2'].textContent = el.lastElementChild.
        firstElementChild.textContent; // set name To Text Content

    window['pop-h2'].setAttribute('title', el.lastElementChild.
        firstElementChild.textContent);// set name To Title Attribute

}

// Get Data From API
function getDataAPI(q, fun) {
    let httpReq = new XMLHttpRequest();
    httpReq.open('get', `https://forkify-api.herokuapp.com/api/search?q=${q}`);
    httpReq.send();

    httpReq.addEventListener('readystatechange', e => {
        if (httpReq.readyState == 4 && httpReq.status == 200) {
            APIOBJEC = JSON.parse(httpReq.response);
            fun();
        }
    })
}

// Create Boxes 
function createBox(boxes) {
    let Boxes = '';

    boxes.forEach(({ publisher, title, image_url }) => {
        Boxes += `
            <div>
                <div class="box position-relative border-0 rounded-3 overflow-hidden">
                    <img src='${image_url}' alt="" class="img img-fluid">
                    <div class="content w-100 text-center position-absolute bottom-0 bg-light bg-opacity-75 p-3">
                        <h2 class="content-h2 text-uppercase text-secondary" title="${title}">${title}</h2>
                        <p class="content-p text-muted mb-0">
                        ${publisher}
                        </p>
                    </div>
                </div>
            </div>  
        `
    })
    document.querySelector('header .container .row').innerHTML = Boxes;
}