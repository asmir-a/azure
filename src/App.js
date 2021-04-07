import './App.css';
import React, {useState} from 'react';
import * as textProcessing from './textProcessing';
import * as azureTextSemantics from './azureTextSemantics';
import * as presentation from './presentation';
import SpeechButtons from './SpeechButtons';

/*
  App.js is the main outlook of the application.
  azureTextSemantics.js is responsible for setting up the text processing APIs.
  presentation.js is responsible for processing the API results and creating a presentation out of it
  SpeechButtons.js is a components that manages the microphone input.
  textProcessing.js contains functions for text processing.
*/  


//component for displaying the input text
function DisplayTextArea({storedReportText}) {
  return (
    <div>
      <textarea readOnly 
        value = {storedReportText}
        rows = "25"
        cols = "50"
        className = "displayTextArea">
      </textarea>
    </div>
  )
}
//component whose role is to get the input from the user and send it to the input processing components
function InputForm({storeReportText, updateResultsEntities, updateResultsKeyWords}) {
  const [InputFormText, setInputFormText] = useState("");
  //function that updates the state responsible for keeping the input from the user when recording
  const updateInputFormTextWithMic = (currentSpeechText) => {
    const newInputFormText = InputFormText + currentSpeechText;
    setInputFormText(newInputFormText);
  }

  const handleSubmit = e => {

    e.preventDefault();
    if (!InputFormText) return;
    storeReportText(InputFormText);
    console.log(textProcessing.divideIntoSentences(InputFormText));
    //azure APIs for keywords generation and for entity identification
    let keyPhrasesPromise = azureTextSemantics.keyPhraseExtraction(textProcessing.divideIntoSentences(InputFormText));
    let entitiesPromise = azureTextSemantics.entityRecognition(textProcessing.divideIntoSentences(InputFormText));
    //send the result of Azure APIS to the presentation creator component
    Promise.all([keyPhrasesPromise, entitiesPromise]).then((twoResults) => {
      const dataFromPromise1 = twoResults[0];
      const dataFromPromise2 = twoResults[1];
      console.log(dataFromPromise1);
      console.log(dataFromPromise2);
      let allKeyWords = [];
      let allEntities = [];
      dataFromPromise1.forEach((result, index) =>{
        allKeyWords.push(result.keyPhrases[0]);
      });
      dataFromPromise2.forEach((result, index) => {
        allEntities.push({slideIndex : index, slideEntities : result.entities});
      });
      
      //the following two updates states might be used in the parent component later on
      updateResultsEntities(allEntities);
      updateResultsKeyWords(allKeyWords);
      
      presentation.createPresentation(allKeyWords, allEntities);
    });

    setInputFormText("");
  }

  return (
    <div className = "fullInputWindow">
      <form onSubmit = {handleSubmit} className = "inputTextForm">
        <textarea
          rows = "25"
          cols = "50"
          className = "inputTextArea"
          value = {InputFormText}
          onChange = {e => setInputFormText(e.target.value)}
        ></textarea>
        <div className = "submitContainer">
          <p>Press Submit to get your presentation 📊</p>
          <input type = "submit" className = "submitButton" value = "SUBMIT"/>
        </div>
      </form>
      <SpeechButtons updateInputFormTextWithMic = {updateInputFormTextWithMic}/>
    </div>
  );
}


function App() {
  const [reportText, setReportText] = useState("Initial Screen");
  
  function updateReportText(text){
    setReportText(text);
  }

  const [resultsKeyWords, setResultsKeyWords] = useState([]);
  const [resultsEntities, setResultsEntities] = useState([]);

  const updateResultsKeyWords = (results) => {
    setResultsKeyWords(results);
  }

  const updateResultsEntities = (results) => {
    setResultsEntities(results);
  }

  return (
    <div className = "app">
      <InputForm storeReportText = {updateReportText} updateResultsKeyWords = {updateResultsKeyWords} updateResultsEntities = {updateResultsEntities}/>
      <DisplayTextArea storedReportText = {reportText} />
    </div>
  );
}

export default App;



