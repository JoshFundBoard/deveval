## FundBoard Dev Test

This is a (hopefully) fun, short development challenge intended to gauge your experience level with the kind of code we use every day at FundBoard.

The primary skills we're testing, in addition to core HTML, CSS and JavaScript, are:
- React
- Redux
- ES6

This project does use Sagas and the Airtable API, but working example code has been provided. You should be able to modify it without much trouble.

React Bootstrap is included in this file, but you should be able to complete the challenge using only the provided example components. FontAwesome icons are also provided, but not used. You are free to explore and use either or both.

### The Challenge

You should *fork this project in your own GitHub directory. Do not submit PRs to this one.*

Code is already in place to pull a menu of possible desserts from Airtable. You should do the following with it:

1. Create a button for each dessert, in alphabetical order.
2. When a button is clicked, change it to a selected state (and example is provided).
3. Allow the user to select up to 3 buttons. If they try to select a 4th button, show an error message instead.
4. Add code so the input for collecting a user's name works.
5. When the user clicks the save button their choices should be recorded in Airtable. The saga file already has a postChoices function for this, you just need to write the saga code to listen for the Redux action to trigger it, as well as the reducer code for it.
6. Show a message for the current status of the save, any errors, and whether it succeeded. This can go wherever you like, next to the save button is fine.

You're not being tested on your design skills, an example layout screenshot is provided in the imgs folder. But if you enjoy design feel free to add your own enhancements.

### Going Farther

The above requirements are minimum we need to see for this challenge. If you would like to go farther, or if you want to demonstrate a higher level of experience, there are several additional steps you can take. These are strictly optional! 

a. Create a reusable status component that can be used to show the status of the get and post calls. It should have a button to dismiss it after success. You may want to use the Alert and Spinner components from React Bootstrap.

b. Add a button to toggle the dessert sorting from alphabetical to use the order field from Airtable. 

c. After the user submits their choice, pop up a modal that shows their choice and the choices of other users. You can do a get from the /results endpoint to get all the results.

### Submitting and Evaluation

Once your personal fork of this repo is ready for review, contact us with the link to it. Details on how long you have to complete the challenge, and who to contact should be in the email you received with the link to this challenge.
