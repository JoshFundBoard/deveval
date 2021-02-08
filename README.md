## FundBoard Async Challenge

This is a (hopefully) fun, short development challenge intended to gauge your experience level with the kind of code we use every day at FundBoard. If you complete it, we will send you a $50 gift card of your choice.

The primary skills we're testing, in addition to core HTML, CSS and JavaScript, are:
- React
- Redux
- ES6

This project does use Sagas and the Airtable API, but working example code has been provided. You should be able to modify it without much trouble.

React Bootstrap is included in this file, but you should be able to complete the challenge using only the provided example components. FontAwesome icons are also provided, but not used. You are free to explore and use either or both.

### The Challenge

You should *fork this project in your own GitHub directory. Do not submit PRs to this one.*

Use a **private** project so other candidates aren't influenced by your work.

Code is already in place to pull a menu of possible desserts from Airtable. You should do the following with it:

1. Create a button for each dessert, in alphabetical order.
2. Make sure to only use valid data! At least one of the results from Airtable isn't usable.
3. When a button is clicked, change it to a selected state (an example is provided).
4. Allow the user to select up to 3 buttons. If they try to select a 4th button, show an error message instead. You can position the error message anywhere, at the top or bottom of the dessert buttons would be good.
5. Add code so the input for collecting a user's name works.
6. When the user clicks the save button their choices should be recorded in Airtable. The saga file already has a postChoices function for this, you just need to write the saga code to listen for the Redux action to trigger it, as well as the reducer code for it.
7. Show a message for the current status of the save, any errors, and whether it succeeded. This can go wherever you like, next to the save button is fine.

You're not being tested on your design skills, an example layout screenshot is provided in the imgs folder. But if you enjoy design feel free to add your own enhancements.

### Going Farther

The above requirements are all we need to see for this challenge, but you might notice there are areas in the code that could use some improvement. If you see one, by all means fix it up! 

### Submitting and Evaluation

Once your private personal fork of this repo is ready for review, invite us as a collaborator and contact us with the link to it. Details on how long you have to complete the challenge, and who to contact should be in the email you received with the link to this challenge.
