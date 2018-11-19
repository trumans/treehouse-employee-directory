
var apiRootUrl =
  'https://randomuser.me/api/?nat=AU,CA,CH,DE,DK,ES,FI,FR,GB,IE,NO,NL,NZ,TR,US';
var employeeCount = '12';
var employees;  // the employees returned by the API

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
  document.getElementsByTagName('form')[0]
    .addEventListener('submit', handleSearchSubmit);
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
      <button type="button" id="modal-close-btn" class="modal-close-btn"
              onclick="displayModal(false)">
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

  document.getElementById('modal-prev')
    .addEventListener('click', handleAdjacentButtonClick);
  document.getElementById('modal-next')
    .addEventListener('click', handleAdjacentButtonClick);
}

/*
  Get a random employee with http request
    if successful, call function to insert into the gallery
*/
function getAllEmployees() {
  $.ajax({
    url: apiRootUrl + '&results='+employeeCount,
    dataType: 'json'
  })
  .success(function(response) {
    employees = response.results;
    for ( let idx in employees ) {
      displayEmployeeInGallery(employees[idx], idx)
    }}
  );  // end success()
}

/*
  Create the html for an employee and insert into gallery element
    parameter e {json} - employee in json format from http response
    parameter idx {integer} - index into array of employees

    the idx attribute on the card is the index into the employees array
*/
function displayEmployeeInGallery(emp, idx) {
  // create div element and attributes
  let d = document.createElement('div');
  d.className = 'card';
  d.onclick = handleClickOnCard;
  let s = document.createAttribute('idx');
  s.value = idx;
  d.setAttributeNode(s);

  // create html containing employee info
  d.innerHTML = `
    <div class="card-img-container">
      <img class="card-img" src="${emp.picture.thumbnail}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${emp.name.first} ${emp.name.last}</h3>
      <p class="card-text">${emp.email}</p>
      <p class="card-text cap">${emp.location.city}, ${emp.location.state}</p>
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
      $(this).find('#name').text().includes(searchTerm)
        ? $(this).show() : $(this).hide();
    }
  );  // end each()
}

/*
  Handle click on a card to display the employee in the modal
    parameter event {click event}
*/
function handleClickOnCard(event) {
  let idx = event.currentTarget.getAttribute('idx');
  displayEmployeeInModal(idx);
  updateAdjacentButtons($(this));
}

/*
  Create the html for an employee and insert into modal
    parameter idx {integer} - index into the employees array
*/
function displayEmployeeInModal(idx) {
  let e = employees[idx];
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
    <p class="modal-text">${e.cell}</p>
    <p class="modal-text cap">${loc.street}, ${loc.city}, ${loc.state} ${loc.postcode}</p>
    <p class="modal-text">Birthday: ${bd_formated}</p>
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
  Handle the click on the modal previous or next button
  1. Display the employee in the button's idx attribute
  2. Update the previous and next buttons' idx attribute

    parameter event {click event}
*/
function handleAdjacentButtonClick(event) {
  let idx = $(this).attr('idx');
  displayEmployeeInModal(idx);
  // find the corresponding gallery card for the employee in the modal...
  $('.card').each( function() {
    // ... and update the previous & next buttons
    if ( $(this).attr('idx') === idx ) { updateAdjacentButtons($(this)) }
  });
}

/*
  On modal previous and next buttons update the idx attribute with the index of
    the first visible button before or after, respectively, the parameter.

    parameter card {jQuery object of an employee card}
*/
function updateAdjacentButtons($card) {
  let $p = $card;
  // find the first visible card before 'card'
  //   card element has a length of 1.
  //   length is 0 when prev does not return a card.
  do { $p = $p.prev() } while ( $p.length && !$p.is(':visible') );
  if ( $p.length ) {
    //  update the button idx attribute if card was found
    enableModalButton('#modal-prev', $p.attr('idx'))
  } else {
    //  disable the button is no card was found.
    disableModalButton('#modal-prev');
  }

  let $n = $card;
  // find the first visible card after 'card'
  do { $n = $n.next() } while ( $n.length && !$n.is(':visible') );
  if ( $n.length ) {
    enableModalButton('#modal-next', $n.attr('idx'));
  } else {
    disableModalButton('#modal-next');
  }
}

/*
  Enable the modal previous or next button
  Set the idx attribute on the button
    parameter selector {string} - selector for the button
    parameter idx {string} - button's idx attribute (employee it references)
*/
function enableModalButton(selector, idx) {
  $(selector).attr('idx', idx);
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
getAllEmployees();
