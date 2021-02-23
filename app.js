const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const input = document.getElementById('search');
const duration = document.getElementById('duration');

// selected image 
let sliders = [];

//initial value
let setDuration = 0;



// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-effect img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  })

  toggleSpinner();

}

const getImages = (query) => {
  toggleSpinner();
  dangerInfo(false);

  imagesArea.style.display = 'none';
  const url = (`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if ((data.hits).length > 0) {

        showImages(data.hits);
      }
      else {
        imagesArea.style.display = 'none';
        dangerInfo(true);
        toggleSpinner();

      }

    })
    .catch(err => dangerInfo(true))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
  element.classList.remove('img-effect')

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // sliders.pop(img);
    sliders.splice(item, 1);
    element.classList.toggle("added");
    element.classList.toggle('img-effect')
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  if (duration <= 400) {
    duration = 1000;
    if (confirm("slider duration will set to 1s default")) {
      sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
        src="${slide}"
        alt="">`;
        sliderContainer.appendChild(item)
      })
      changeSlide(0)
      timer = setInterval(sliderMoverCallback, duration);
      lastSetDuration = duration;


    }
    else {
      imagesArea.style.display = 'block';

    }

  }

  else {

    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(sliderMoverCallback, duration);
    lastSetDuration = duration;

  }

}

const sliderMoverCallback = () => {
  changeSlide(++slideIndex);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

function getInputValue() {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
}

const triggerSearchBtn = input.addEventListener('keypress', function (event) {

  if (event.key === 'Enter') {
    getInputValue();
  }

})

duration.addEventListener('keypress', function (event) {

  if (event.key === 'Enter') {
    createSlider()
  }
})


const toggleSpinner = () => {
  const spinner = document.getElementById('spinner');
  spinner.classList.toggle('d-flex');
}

const dangerInfo = (show) => {
  const error = document.getElementById('error');

  if (show) {
    error.classList.add('d-flex');
  }
  else {
    error.classList.remove('d-flex');
  }

}


sliderContainer.addEventListener('mouseenter', e => {
  clearInterval(timer);
  timer = undefined;
});

sliderContainer.addEventListener('mouseleave', e => {
  if (timer === undefined) {
    timer = setInterval(sliderMoverCallback, lastSetDuration);
  }
});