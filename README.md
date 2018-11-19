
Treehouse Unit 5 project - employee directory app using public API

Notes regarding extra credit are at the bottom.

Basic Functionality:
- Launching the application displays a list of 'employees'.

- Employees can be filtered by name.

- Clicking on an employee displays additional information in a 'modal'.

- The modal has a Next and Previous button to navigate to the employee before or
after, respectively.

Implementation details:
- Employee data is randomly generated from the randomuser.me API and retrieved
using an asynchronous http get request with AJAX.

- The 'additional information modal' is an overlay that covers the entire page
and is semi-transparent except for a box containing the selected employee's
information. The result is that user interaction is restricted to the buttons on
the modal box.

- The JS script creates html for each employee card and inserts into a gallery
element. It also creates the html for search form and the modal overlay.

- The JS script updates the html in the modal to display a selected employee and
update the Previous and Next buttons.

- The filter uses a form which suppresses page reload and then updates the page
by hiding or showing employee card elements based on the filter.

=================================

The following features relate to extra credit

- Employees can be filtered by name using the search box in the upper right
corner.

- The modal overlay has a Previous and Next button which displays the related
adjacent employee card, displaying employees currently displayed on the gallery
(i.e. are sensitive to filtering). The buttons are disabled when an employee
card does not have a visible adjacent card.  

CSS changes

- Added the class gray-btn for when the modal next and previous buttons are
disabled.

- Added a halo around the employee picture in the modal.
