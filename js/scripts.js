
var ApiRootUrl = 'https://randomuser.me/api/?nat=AU,CA,GB,IE,NZ,US';

/*
  Get a random employee with http request
    if successful, call function to insert into the gallery
*/
function getAnotherEmployee() {
  $.ajax({
    url: ApiRootUrl,
    dataType: 'json'
  })
  .success(displayEmployeeInGallery);
}

/*
  Get a specific employee with http request
    parameter seed {string} - seed that will return the employee
    if successful, inserts employee at end of gallery
*/
function getSpecificEmployee(seed) {
  $.ajax({
    url: ApiRootUrl + '&seed=' + seed,
    dataType: 'json'
  })
  .success(displayEmployeeInModal);
}

/*
  Create the html for an employee and insert into galley element
    parameter response {http response} - http response containing an employee
*/
function displayEmployeeInGallery(response) {
  let e = response.results[0];
  let name = e.name;
  let loc = e.location;
  let d = document.createElement('div');
  d.className = 'card';
  d.onclick = handleClickOnCard;
  d.innerHTML = `
    <div class="card-img-container">
      <img class="card-img" src="${e.picture.thumbnail}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
      <p class="card-text">${e.email}</p>
      <p class="card-text cap">${loc.city}, ${loc.state}</p>
    </div>
    <seed data=${response.info.seed}></seed>
  `;  // end html literal
  document.getElementById("gallery").appendChild(d);
}

/*
  Create the html for an employee and insert into modal
    parameter response {http response} - http response containing an employee
*/
function displayEmployeeInModal(response) {
  let e = response.results[0];
  let name = e.name;
  let loc = e.location;
  let bd = new Date(e.dob.date);
  let bd_formated = bd.getMonth() + '/' + bd.getDate() + '/' + bd.getFullYear();
  document.getElementsByClassName('modal-info-container')[0].innerHTML = `
    <img class="modal-img" src="${e.picture.medium}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
    <p class="modal-text">${e.email}</p>
    <p class="modal-text cap">${loc.city}</p>
    <hr>
    <p class="modal-text">${e.phone}</p>
    <p class="modal-text">${loc.street}, ${loc.city}, ${loc.state} ${loc.postcode}</p>
    <p class="modal-text">Birthday: ${bd_formated}</p>
  `;  // end html literal
  displayModal(true);
}

/*
  Create search element
*/
function createSearchElement() {
  let f = document.createElement('form');
  let a = document.createAttribute("action");
  a.value = '#';
  f.setAttributeNode(a);
  let m = document.createAttribute("method");
  m.value = 'get';
  f.setAttributeNode(m);
  f.innerHTML = `
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
  `;   // end of html literal
  document.getElementsByClassName('search-container')[0].appendChild(f);
  document.getElementsByTagName('form')[0].addEventListener('submit', handleSearchSubmit);
}

/*
  Create an modal getElement
    element is hidden and does not have employee data
*/
function createModalElement() {
  let d = document.createElement('div');
  d.className = 'modal-container';
  d.style.display = 'none';
  d.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn" onclick="displayModal(false)">
        <strong>X</strong>
      </button>
      <div class="modal-info-container">

      </div>
    </div>

    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  `;  // end html literal
  document.getElementsByTagName('body')[0].appendChild(d);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchTerm = document.getElementById('search-input').value;
  console.log('search submitted ' + searchTerm);
}

/*
  Display or hide modal
    parameter show_modal {boolean} - true to display modal, false to hide it
*/
function displayModal(show_modal) {
  let val = show_modal ? '' : 'none';
  document.getElementsByClassName('modal-container')[0].style.display = val;
}

/*
  Handle click on a card and display the employee in the modal
    parameter event {click event}
*/
function handleClickOnCard(event) {
  let seed = event.currentTarget
    .getElementsByTagName('seed')[0].getAttribute('data');
  getSpecificEmployee(seed);
}

/*
  Code when page loads
*/
createSearchElement();
createModalElement();
// Display the employees
for (i = 1; i <= 12; i++) {
  getAnotherEmployee();
}
