/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/
function filterList(list, query) {
  return list.filter((item)=> {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery)
  })
}

async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); 
  const filterButton = document.querySelector('.filter_button');
  let currentList = []; // This class name needs to be set on your form before you can listen for an event on it
  form.addEventListener('submit', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    submitEvent.preventDefault(); // This prevents your page from going to http://localhost:3000/api even if your form still has an action set on it
    console.log('form submission'); // this is substituting for a "breakpoint"

    /*
      ## GET requests and Javascript
        We would like to send our GET request so we can control what we do with the results
        But this blocks us sending a query string by default - ?resto='' won't exist

        Let's get those form results before sending off our GET request using the Fetch API
    */

    // this is the preferred way to handle form data in JS in 2022
    const formData = new FormData(submitEvent.target); // get the data from the listener target
    const formProps = Object.fromEntries(formData);
    console.log(formProps); // Turn it into an object

    // You can also access all forms in a document by using the document.forms collection
    // But this will retrieve ALL forms, not just the one that "heard" a submit event - less good

    /*
      ## Retrieving information from an API
        The Fetch API is relatively new,
        and is much more convenient than previous data handling methods.
        Here we make a basic GET request to the server using the Fetch method
        to send a request to the routes defined in /server/routes/foodServiceRoutes.js

      // this is a basic GET request
      // It does not include any of your form values, though
    */

    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    currentList = await results.json
    console.table(currentList);
    /*
   ## Get request with query parameters

      const results = await fetch(`/api/foodServicePG?${new URLSearchParams(formProps)}`);

      The above request uses "string interpolation" to include an encoded version of your form values
      It works because it has a ? in the string
      Replace line 37 with it, and try it with a / instead to see what your server console says

      You can check what you sent to your server in your GET request
      By opening the "network" tab in your browser developer tools and looking at the "name" column
      This will also show you how long it takes a request to resolve
    */

    // This changes the response from the GET into data we can use - an "object"
    // const arrayFromJson = await results.json();
    // console.table(arrayFromJson.data); // this is called "dot notation"
    // arrayFromJson.data - we're accessing a key called 'data' on the returned object
    // it initially contains all 1,000 records from your request
  });
  filterButton.addEventListener('click', (event) => { 
    console.log('clicked FilterButton');
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);
    console.log(newList)
  })
}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
