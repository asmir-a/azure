import {useState} from 'react';

const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speechConfig = sdk.SpeechConfig.fromSubscription("b0735fa8814d46aba05bc45d90b3c551", "koreacentral");




speechConfig.speechRecognitionLanguage = "en-US";
const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

export default function SpeechButtons({updateInputFormTextWithMic}) {
    function handleStartRecordingButton() {
        recognizer.startContinuousRecognitionAsync(() => console.log("Started Recognition"));
    }
    function handleStopRecordingButton() {
        recognizer.stopContinuousRecognitionAsync(() => console.log("Stopped Recognition"));
    }

    recognizer.recognized = (r, event) => {
        console.log(event.result);
        if (event.result.privText !== undefined){
            updateInputFormTextWithMic(event.result.privText);
        }
    }

    return (
        <div className = "buttonsContainer">
            <p>Press Start to start recording 🎤 ✅</p>
            <p>Press Stop to stop recording 🎤 🛑</p>
            <div className = "speechButtonsHolder">
                <input type = "button" onClick = {handleStartRecordingButton} value = "Start" className = "micButton"/>
                <input type = "button" onClick = {handleStopRecordingButton} value = "Stop" className = "micButton"/>
            </div>
        </div>
    )
}