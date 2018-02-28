var categoryWeights = {
  'environment': 0.4,
  'social': 0.3,
  'political': 0.1,
  'economic': 0.2
};

// Env 40
// Social 30
// Political 10
// Eco 20

var sCW = {
  'innovRanking': 1,
  'nOfUnicorns': 1
};


// Updating UI with default values
for (var key in categoryWeights) {
  $('#' + key)[0].value  = categoryWeights[key];
}

for (var key in sCW) {
  $('#' + key)[0].value  = sCW[key];
}
///////////////////////


var mainData = {};

const windowHeight = $( window ).height();
const headerHeight = $('#headerBar').height()
$('#tableContainer').height( windowHeight - headerHeight );

function categoryWeightUpdated(id, elem) {
  const newValue = elem.value;
  // const comparisonObject = Object.assign({}, categoryWeights);
  // comparisonObject[id] = newValue;
  // var sum = 0;
  // for (var key in comparisonObject) {
  //   if (comparisonObject.hasOwnProperty(key)) {
  //     sum += parseInt(comparisonObject[key]);
  //   }
  // }

  categoryWeights[id] = (parseInt(newValue) || 0)/100;

  // if (sum == 100) {
  //   // categoryWeights[id] = newValue;
  // } else {
  //   // Put up error message
  //   // $('#' + id)[0].value  = categoryWeights[id];
  // }
}

function subCategoryWeightUpdated(id, elem) {
  const newValue = elem.value;
  // const comparisonObject = Object.assign({}, sCW);
  // comparisonObject[id] = newValue;
  sCW[id] = (parseInt(newValue) || 0)/100;
}

function getData() {
  $.get("https://findexdata.herokuapp.com/getData", function(data, status){
    mainData = JSON.parse(data);
    for (var key in mainData) {
      $("#rankingsTable > tbody").append("<tr><th>" + mainData[key].Ranking + "</th><td>" + mainData[key].Metropolitan + "</td><td>" + mainData[key].Score + "</td>");
    }
  });
}

getData();


var firstCategoryCheckBox = $('#firstCategoryCheckBox');
var firstCategoryContainer = $('#first-category-container');
firstCategoryContainer.hide();

firstCategoryCheckBox.on('click', function() {
  if($(this).is(':checked')) {
    firstCategoryContainer.show();
  } else {
    firstCategoryContainer.hide();
  }
});

var secondCategoryCheckBox = $('#secondCategoryCheckBox');
var secondCategoryContainer = $('#second-category-container');
secondCategoryContainer.hide();

secondCategoryCheckBox.on('click', function() {
  if($(this).is(':checked')) {
    secondCategoryContainer.show();
  } else {
    secondCategoryContainer.hide();
  }
});


function calculateRankings() {
  // console.log('Calculating Rankings with these weights', categoryWeights, sCW);
  // Env 40
  // Social 30
  // Political 10
  // Eco 20

  // const cObject = Object.assign({}, mainData);

  for (var key in mainData) {
    const nObj = mainData[key];
    mainData[key].Score = categoryWeights.environment*(parseInt(nObj['# of Unicorn'])*sCW.nOfUnicorns + parseInt(nObj['Innvation Ranking'])*sCW.innovRanking);
    mainData[key].Score += categoryWeights.social*(parseInt(nObj["Tech Jobs Growth Rate % (06'-16')"]) *1);
    mainData[key].Score += categoryWeights.political*(parseInt(nObj['Effective State Corporate Tax Rate 2017']) *1);
    mainData[key].Score += categoryWeights.economic*(parseInt(nObj['Fintech Job Count']) *1);
  }

  mainData.sort(function(a, b){
    return b.Score-a.Score;
  });
  generateTable();
  // ['# of Unicorn'] Env 60
  // ['Innvation Ranking'] Env 40
  // ['Effective State Corporate Tax Rate 2017'] Pol
  // ['Fintech Job Count'] political
  // ['Tech Jobs Growth Rate % (06'+'-16)'] Social

}

function generateTable() {
  $("#rankingsTable > tbody").empty();

  for (var key in mainData) {
    $("#rankingsTable > tbody").append("<tr><th>" + mainData[key].Ranking + "</th><td>" + mainData[key].Metropolitan + "</td><td>" + mainData[key].Score + "</td>");
  }
}
