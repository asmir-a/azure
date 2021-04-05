import './App.css';
import React, {useState} from 'react';
import * as textProcessing from './textProcessing';
import * as azureTextSemantics from './azureTextSemantics';
import * as presentation from './presentation';
import SpeechButtons from './SpeechButtons';

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

function InputForm({storeReportText, updateResultsEntities, updateResultsKeyWords}) {
  const [InputFormText, setInputFormText] = useState("");

  const updateInputFormTextWithMic = (currentSpeechText) => {
    const newInputFormText = InputFormText + currentSpeechText;
    setInputFormText(newInputFormText);
  }

  const handleSubmit = e => {

    e.preventDefault();
    if (!InputFormText) return;
    storeReportText(InputFormText);
    console.log(textProcessing.divideIntoSentences(InputFormText));

    let keyPhrasesPromise = azureTextSemantics.keyPhraseExtraction(textProcessing.divideIntoSentences(InputFormText));
    let entitiesPromise = azureTextSemantics.entityRecognition(textProcessing.divideIntoSentences(InputFormText));

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



