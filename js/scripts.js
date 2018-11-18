
var ApiRootUrl = 'https://randomuser.me/api/?nat=AU,CA,GB,IE,NZ,US';

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
      <button type="button" id="modal-next" class="modal-next btn"">Next</button>
    </div>
  `;  // end html literal
  document.getElementsByTagName('body')[0].appendChild(d);

  document.getElementById('modal-prev').addEventListener('click', handleAdjacentButtonClick);
  document.getElementById('modal-next').addEventListener('click', handleAdjacentButtonClick);
}

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
function getSpecificEmployee(seed, prev_seed, next_seed) {
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
  let s = document.createAttribute('seed');
  s.value = response.info.seed;
  d.setAttributeNode(s);
  d.innerHTML = `
    <div class="card-img-container">
      <img class="card-img" src="${e.picture.thumbnail}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
      <p class="card-text">${e.email}</p>
      <p class="card-text cap">${loc.city}, ${loc.state}</p>
    </div>
  `;  // end html literal
  document.getElementById("gallery").appendChild(d);
}

/*
  Filter gallery based on search form
    parameter event {submit event}
*/
function handleSearchSubmit(event) {
  event.preventDefault();
  let searchTerm = $('#search-input').val().toLowerCase();
  $('.card').each(
    function(card) {
      $(this).find('#name').text().includes(searchTerm) ? $(this).show() : $(this).hide();
    }
  );  // end each()
}

/*
  Handle click on a card and display the employee in the modal
    parameter event {click event}
*/
function handleClickOnCard(event) {
  let seed = event.currentTarget.getAttribute('seed');
  getSpecificEmployee(seed);
  updateAdjacentButtons($(this));
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
    <p class="modal-text cap">${loc.street}, ${loc.city}, ${loc.state} ${loc.postcode}</p>
    <p class="modal-text">Birthday: ${bd_formated}</p>
    <seed data=${response.info.seed}></seed>
  `;  // end html literal
  displayModal(true);
}

/*
  Display or hide modal
    parameter show_modal {boolean} - true to display modal, false to hide it
*/
function displayModal(show_modal) {
  show_modal ? $('.modal-container').show() : $('.modal-container').hide();
}

/*
  Handle the click on the modal Previous or Next button
  1. Display the employee in the button's seed attribute
  2. Update the previous and next buttons' seed attribute
     or disable a button if it doesn't have a seed
    parameter event {click event}
*/
function handleAdjacentButtonClick(event) {
  let seed = $(this).attr('seed');
  getSpecificEmployee(seed);
  // find the corresponding gallery card for newly displayed employee
  $('.card').each( function() {
    // update the previous & next buttons
    if ( $(this).attr('seed') === seed ) { updateAdjacentButtons($(this)) }
  });
}

/*
  Update modal Previous and Next buttons seed attribute
    parameter card {jQuery object of an employee card}
*/
function updateAdjacentButtons(card) {

  let $prev = card;
  // find the first visible card before 'card'
  do { $prev = $prev.prev() } while ( $prev.length && !$prev.is(':visible') );
  if ( $prev.length ) {
    enableModalButton('#modal-prev', $prev.attr('seed'))
  } else {
    disableModalButton('#modal-prev');
  }

  let $next = card;
  // find the first visible card after 'card'
  do { $next = $next.next() } while ( $next.length && !$next.is(':visible') );
  if ( $next.length ) {
    enableModalButton('#modal-next', $next.attr('seed'));
  } else {
    disableModalButton('#modal-next');
  }
}

/*
  Enable the modal previous or next button
  Set the seed attribute on the button
    parameter selector {string} - selector for the button
    parameter seed {string} - value to add into the button's seed attribute
*/
function enableModalButton(selector, seed) {
  $(selector).attr('seed', seed);
  $(selector).prop( "disabled", false );
  $(selector).removeClass( 'gray-btn' );
}

/*
  Disable the modal previous or next button
    parameter selector {string} - selector for the button
*/
function disableModalButton(selector) {
  $(selector).prop( "disabled", true );
  $(selector).addClass( 'gray-btn' );
}

/*
  Code when page loads
*/
createSearchElement();
createModalElement();
// Display the employees
for (let i = 1; i <= 12; i++) {
  getAnotherEmployee();
}
