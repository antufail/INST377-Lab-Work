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

    const formData = new FormData(submitEvent.target); // get the data from the listener target
    const formProps = Object.fromEntries(formData);
    console.log(formProps); // Turn it into an object

    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    currentList = await results.json
    console.table(currentList);
    
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
