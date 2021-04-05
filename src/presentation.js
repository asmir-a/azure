import pptxgen from "pptxgenjs";

let myHeader = new Headers();
  myHeader.append('Ocp-Apim-Subscription-Key', 'db6fc8db768c405180cd1440d4905ff7');

let myInit = {
    method : 'GET',
    headers : myHeader,
    cache : 'default'
}

async function searchImageUrl(searchTerm) {
  if (searchTerm.trim().indexOf(' ') == -1){
      const request = new Request(`https://api.bing.microsoft.com/v7.0/images/search?q=${searchTerm}`, myInit);
      const resp = await fetch(request);
      const data = await resp.json();
      console.log(data);
      return data.value[0].thumbnailUrl;
  } else {
      let processedSearchTerms = searchTerm.match(/\b(\w+)\b/g);
      let finalSearchTerms = '';
      for (let term of processedSearchTerms){
          finalSearchTerms = finalSearchTerms + "+" + term.toLowerCase();
      }
      const request = new Request(`https://api.bing.microsoft.com/v7.0/images/search?q=${finalSearchTerms}`, myInit);
      const resp = await fetch(request);
      const data = await resp.json();
      return data.value[0].thumbnailUrl;
  }
}

export async function createPresentation(slideKeyWords, slideEntities) {
  let slideKeyWordsCapitalLetter = slideKeyWords.map(string => string.toUpperCase());
  let numOfSlides = slideKeyWords.length;
  let entitiesAll = parseEntities(slideEntities);

  let pptx = new pptxgen();

  for (let i = 0; i < numOfSlides; i++){
    let entitiesPerSlide = entitiesAll[i];
    let slide = pptx.addSlide();
    console.log(entitiesPerSlide);
    
    let valuesForChart = [];
    let numOfEntitiesPerSlide = entitiesPerSlide.countQuantityAr;
    for (let j = 0; j < numOfEntitiesPerSlide; j++){
      valuesForChart.push(entitiesPerSlide.slideQuantitiesAr[j]);
    }

    let labels = [];
    for (let j = 0; j < numOfEntitiesPerSlide; j++){
      labels[j] = '';
    }

    let name = slideKeyWordsCapitalLetter[i];

    let dataChart = [{
      name : name,
      labels : labels,
      values : valuesForChart
    }];

    if (entitiesPerSlide.percentagePresent){
      slide.addChart(pptx.ChartType.pie, dataChart, {x : 2, y : 2, w : '55%', h : '55%'});
    }else if (numOfEntitiesPerSlide > 1) {
      slide.addChart(pptx.ChartType.line, dataChart, {x : 2, y : 2, w : '55%', h : '55%'});
    } else {
      slide.addChart(pptx.ChartType.bar, dataChart, {x : 2, y : 2, w : '55%', h : '55%'});
    }

    if (entitiesPerSlide.currencyPresent) {
      slide.addText("$$$", {x : 8.5, y : 3, fontSize : 36, bold : true, color : '006400'});
    }

    if (entitiesPerSlide.dateTime) {
      slide.addText(entitiesPerSlide.dateTime, {x : 7, y : 3, fontSize : 20, italic : true});
    }

    slide.addText(slideKeyWordsCapitalLetter[i], {x: "42%", y : "10%", bold : true});
    let imageUrl = await searchImageUrl(name);
    slide.addImage({path : imageUrl, x : 7, y: 2, w : '30%', h : '30%'});
  }

  pptx.writeFile("Your Presentation.pptx");
}


function parseEntities(entities){
  let returnArray = [];

  for (let entity of entities){//entity represents an object for each slide
    let countQuantity = 0;
    let arrayOfQuantitiesAr = [];
    let dateTime = '';
    let percentagePresent = false;
    let currencyPresent = false;
    let datePresent = false;

    for (let entityElement of entity.slideEntities){
      if (entityElement.subCategory === "DateRange") {//this should be handled separately
        datePresent = true;
        dateTime = entityElement.text;
      }
      if (entityElement.subCategory === "Percentage"){
        percentagePresent = true;
      }
      if (entityElement.subCategory === "Currency") {
        currencyPresent = true;
      }
      if (entityElement.category === "Quantity") {
        let quantity = entityElement.text.match(/\d/g);
        if (!quantity) continue;
        quantity = parseInt(quantity.join(""));
        arrayOfQuantitiesAr.push(parseInt(quantity));
        arrayOfQuantitiesAr[countQuantity] = quantity;
        countQuantity = countQuantity + 1;
      }
    }
    let tempObj = {};
    tempObj.slideQuantitiesAr = [...arrayOfQuantitiesAr];
    tempObj.dateTime = dateTime;
    tempObj.datePresent = datePresent;
    tempObj.currencyPresent = currencyPresent;
    tempObj.percentagePresent = percentagePresent;
    tempObj.countQuantityAr = arrayOfQuantitiesAr.length;
    returnArray.push(tempObj);
  }
  return returnArray;
} 
