# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### Before running the code, please type `npm install`

Which installs all the needed libraries and sdks

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Structure of the application:

**App.js** is the main outlook of the application.
**azureTextSemantics.js** is responsible for setting up the text processing APIs.
**presentation.js** is responsible for processing the API results and creating a presentation out of it
**SpeechButtons.js** is a components that manages the microphone input.
**textProcessing.js** contains functions for text processing.

### Notes:

This is a hackathon application so many minor details were omitted. When the application will be ready for public use the followings would be a must:

1. Https certificates would be put. This is necessary because we are using the users microphone to get the input
2. In the future, scripts for the automation of other types like sheets of files would be included. This would serve the purpose of the workflow automation in a company.
3. I know that the application should be written in node and structured as a backend application. However, I started learning react for this hackathon and was afraid that the configuration issues with an express server would take too long. In the future, some of the logic would be transferred to a back-end application. Obviously, api keys cannot be in the client side.

