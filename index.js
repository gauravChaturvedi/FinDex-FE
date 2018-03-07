var categoryWeights = {
  'environment': 45,
  'social': 20,
  'political': 10,
  'economic': 25
};

// Env 40
// Social 30
// Political 10
// Eco 20

var sCW = {
  'vcDealAmt': 20,
  'innovRanking': 15,
  'nOfUnicorns': 20,
  'noOfFinTechStartups': 20,
  'intAccess': 12.5,
  'wifiPercent': 12.5,
  'techJobGrowth': 70,
  'livableCities': 30,
  'taxRate': 40,
  'taxIncentives': 60,
  'finTechJobCount': 70,
  'gfci': 30
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
$('#tableContainer').height( windowHeight - headerHeight - 25);

function categoryWeightUpdated(id, elem) {
  const newValue = elem.value;
  // const comparisonObject = Object.assign({}, categoryWeights);
  // comparisonObject[id] = newValue;
  // var sum = 0;
  // for (var key in comparisonObject) {
  //   if (comparisonObject.hasOwnProperty(key)) {
  //     sum += parseFloat(comparisonObject[key]);
  //   }
  // }

  categoryWeights[id] = (parseFloat(newValue) || 0);

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
  sCW[id] = (parseFloat(newValue) || 0);
}

function getData() {
  // $.get("https://findexdata.herokuapp.com/getData", function(data, status){
  $.get("https://nodeupload-196719.appspot.com/getData", function(data, status){
    mainData = JSON.parse(data);
    for (var key in mainData) {
      $("#rankingsTable > tbody").append("<tr><th>" + mainData[key].Ranking + "</th><td>" + mainData[key].Metropolitan + "</td><td>" + (mainData[key].Score).toFixed(2) + "</td>");
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
    // console.log(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100, 'first');
    // console.log(parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100 , 'second');
    // console.log(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100, 'third');
    // console.log(categoryWeights.environment*(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100));
    // dummy = categoryWeights.environment*(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100);
    // console.log(dummy, 'fourth');
    // mainData[key].Score = dummy;
    mainData[key].Score = categoryWeights.environment*(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100);
    // console.log(categoryWeights.environment*(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100));
    // mainData[key].Score = categoryWeights.environment*(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100);
    mainData[key].Score += categoryWeights.environment*(parseFloat(nObj['VC deal $ amount'])*sCW.vcDealAmt/100 + parseFloat(nObj['Number of FinTech Startups'])*sCW.noOfFinTechStartups/100);
    mainData[key].Score += categoryWeights.environment*(parseFloat(nObj['Internet Access'])*sCW.intAccess/100 + parseFloat(nObj['Wifi (% of time spent connected to wifi networks)'])*sCW.wifiPercent/100);
    mainData[key].Score += categoryWeights.social*(parseFloat(nObj["Tech Jobs Growth Rate % (06'-16')"])*sCW.techJobGrowth/100 + parseFloat(nObj['Most Liveable Cities'])*sCW.livableCities/100);
    // mainData[key].Score += categoryWeights.social*(parseFloat(nObj["Tech Jobs Growth Rate % (06'-16')"]) *1);
    // mainData[key].Score += categoryWeights.political*(parseFloat(nObj['Effective State Corporate Tax Rate 2017']) *1);
    mainData[key].Score += categoryWeights.political*(parseFloat(nObj["Effective State Corporate Tax Rate 2017"])*sCW.taxRate/100 + parseFloat(nObj['Tax Incentives'])*sCW.taxIncentives/100);
    mainData[key].Score += categoryWeights.economic*(parseFloat(nObj["Fintech Job Count"])*sCW.finTechJobCount/100 + parseFloat(nObj['GFCI'])*sCW.gfci/100);
    mainData[key].Score = (mainData[key].Score/100).toFixed(2);
  }

  mainData.sort(function(a, b){
    return b.Score-a.Score;
  });
  generateTable();
  // ['# of Unicorn'] Env 60
  // ['Innvation Ranking'] Env 40
  // ['Effective State Corporate Tax Rate 2017'] Pol
  // ['Fintech Job Count'] Economic
  // ['Tech Jobs Growth Rate % (06'+'-16)'] Social

}

function generateTable() {
  $("#rankingsTable > tbody").empty();

  for (var key in mainData) {
    $("#rankingsTable > tbody").append("<tr><th>" + (parseInt(key) +1) + "</th><td>" + mainData[key].Metropolitan + "</td><td>" + mainData[key].Score + "</td>");
  }
}

function filterSlideToggle() {
  $('#weightsBar').toggle('slide', { direction: 'left' }, 500);
}
