/*
  get a random employee via randomuser API
    if successful, call function to insert into the gallery
*/
function getAnotherEmployee() {
  $.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json'
  })
  .success(displayEmployeeInGallery);
}

/*
  get a random employee via randomuser API
    if successful, call function to insert into the gallery
*/
function getSpecificEmployee(seed) {
  $.ajax({
    url: 'https://randomuser.me/api/?seed=' + seed,
    dataType: 'json'
  })
  .success(displayEmployeeInModal);
}

function createModalData(data) {
  return {
    picture: data.picture.thumbnail,
    first_name: data.name.first,
    last_name: data.name.last,
    email: data.email,
    phone: data.phone,
    street: data.location.street,
    city: data.location.city,
    state: data.location.state,
    postcode: data.postcode,
    birthday: data.dob.date
  }
}

/*
  Create the html for an employee and insert into galley element
  parameter {http response} response
*/
function displayEmployeeInGallery(response) {
  let e = response.results[0];
  let html = `
    <div class="card-img-container">
      <img class="card-img" src="${e.picture.thumbnail}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${e.name.first} ${e.name.last}</h3>
      <p class="card-text">${e.email}</p>
      <p class="card-text cap">${e.location.city}, ${e.location.state}</p>
    </div>
    <seed style="display: none;">${response.info.seed}</seed>
  `  // end html literal
  let d = document.createElement('div');
  d.className = 'card';
  d.innerHTML = html;
  document.getElementById("gallery").appendChild(d);
}

/*
  Create the html for an employee and insert into modal element
  parameter {http response} response
*/
function displayEmployeeInModal(response) {
  let e = response.results[0];
  let bd = new Date(e.dob.date);
  let bd_formated = bd.getMonth() + '/' + bd.getDate() + '/' + bd.getFullYear();
  let html = `
    <img class="modal-img" src="${e.picture.medium}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${e.name.first} ${e.name.last}</h3>
    <p class="modal-text">${e.email}</p>
    <p class="modal-text cap">${e.location.city}</p>
    <hr>
    <p class="modal-text">${e.phone}</p>
    <p class="modal-text">${e.location.street}, ${e.location.city}, ${e.location.state} ${e.location.postcode}</p>
    <p class="modal-text">Birthday: ${bd_formated}</p>
  `  // end html literal
  document.getElementsByClassName('modal-info-container')[0].innerHTML = html;
}

/*
  Create an modal getElement
    element is hidden and does not have data
*/
function createModalElement() {
  let html = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">

      </div>
    </div>

    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  `  // end html literal
  let d = document.createElement('div');
  d.className = 'modal-container';
  d.style.display = 'none';
  d.innerHTML = html;
  document.getElementsByTagName('body')[0].appendChild(d);
}

function displayModal(show_modal) {
  let val = show_modal ? '' : 'none';
  document.getElementsByClassName('modal-container')[0].style.display= val;
}

/*
  Create and hide the modal
*/
createModalElement();
//displayModal(false);

/*
  Display all employees
*/
for (i = 1; i <= 12; i++) {
  getAnotherEmployee();
}
