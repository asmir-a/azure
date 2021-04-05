const {TextAnalyticsClient, AzureKeyCredential} = require("@azure/ai-text-analytics");


//azure: key-credentials and setup
const key = '6e0e392183db4ed09008cd1d4b5f626c';
const endpoint = 'https://text-sem.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

export async function entityRecognition(sentences) {
  const entityResults = await textAnalyticsClient.recognizeEntities(sentences);
  return entityResults;
}

export async function keyPhraseExtraction(sentences) {
  const keyPhraseResult = await textAnalyticsClient.extractKeyPhrases(sentences);
  return keyPhraseResult;
}


export async function linkedEntityRecognition(sentences) {
    const entityResults = await textAnalyticsClient.recognizeLinkedEntities(sentences);
    console.log(entityResults);
}

