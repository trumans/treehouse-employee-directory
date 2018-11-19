
Treehouse Project 5 - Public API Requests - Employee Directory Webpage

Notes regarding extra credit are at the bottom of this document

Basic Functionality:
- Launching the application displays a list of 'employees'.

- Employees can be filtered by name.

- Clicking on an employee displays additional information in a modal-like
overlay.

- The modal has Next and Previous buttons to navigate to the employee before or
after, respectively.

Implementation details:
- Employee data is randomly generated by the randomuser.me API and is retrieved
using an asynchronous http get request with AJAX.

- The 'additional information modal' is an overlay that covers the entire page
and is semi-transparent except for the box containing the selected employee's
information, resulting in user interaction is restricted to the buttons on the
modal box.

- The JS script creates html for each employee card and inserts it into a gallery
element. The script also creates the html for the search form and the modal
overlay.

- The JS script updates the html in the modal to display the selected employee
and update the Previous and Next buttons with references to relevant employees.

- The employee filter uses a form which suppresses page reload and updates the
gallery element by hiding or showing employees based on the filter.

=================================

The following features relate to extra credit

- Employees can be filtered by name using the search box in the upper right
corner.

- The API call that retrieves employees includes nationalities that use the
English alphabet but might include accent marks.

- The modal overlay has a Previous and Next button which display the adjacent
visible employee in the gallery (i.e. filter-sensitive). A button is disabled
when there is no adjacent visible card.  

CSS changes

- Added the class gray-btn for when the modal Previous and Next buttons are
disabled.

- The employee picture in the modal has a halo by using a box shadow.
