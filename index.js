var categoryWeights = {
  'environment': 45,
  'social': 20,
  'political': 10,
  'economic': 25
};

var subCategoryGroups = {
  'environment': ['nOfUnicorns', 'innovRanking', 'vcDealAmt', 'noOfFinTechStartups', 'wifiPercent', 'intAccess'],
  'social': ['techJobGrowth', 'livableCities'],
  'political': ['taxRate', 'taxIncentives'],
  'economic': ['finTechJobCount', 'gfci']
};

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

var defaultCW = Object.assign({}, categoryWeights);
var defaultSCW = Object.assign({}, sCW);

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
$('#tableContainer').height( windowHeight - headerHeight - 35);
$('#weightsBar').height( windowHeight - headerHeight - 35);
// $('#myModal').modal('show');
// $('#myModal').modal({ show: false});

function categoryWeightUpdated(id, elem) {
  const newValue = elem.value;
  categoryWeights[id] = (parseFloat(newValue) || 0);
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
    generateTable();
  });
}

getData();

var filterNumbers = ['first', 'second', 'fourth', 'third'];

var categoryNames = {
  'first': 'environment',
  'second': 'social',
  'third': 'political',
  'fourth': 'economic'
}

// Show/Hide for subcategories based on category checks
filterNumbers.forEach(function( v,i ) {
  var checkBox = $('#' + v + 'CategoryCheckBox');
  var container = $('#' + v + '-category-container');

  checkBox.on('click', function() {
    if($(this).is(':checked')) {
      container.slideDown( "slow", function() {
      });
      // container.show();
    } else {
      // Call function to make category 0 and remove the calculation
      setCategoryToZero(categoryNames[v]);
      container.slideUp( "slow", function() {
      });
      // container.hide();
    }
  });
});

function setCategoryToZero(category) {
  categoryWeights[category] = 0;
  // update UI element
  $('#' + category)[0].value = 0;

}

function calculateRankings() {
  // Check sum of weights
  var categorySum = 0;
  var categorySumError = false;
  var subCategorySumError = [];
  // Check for sum of category weights and the subcategories of each category
  for (var key in categoryWeights) {
    if (categoryWeights.hasOwnProperty(key)) {
      categorySum += categoryWeights[key];
      if (categoryWeights[key] !== 0) {
        var subCategorySum = 0;
        // Find sum of all the subCategories for this category
        subCategoryGroups[key].forEach(function(subCategory,i ) {
          subCategorySum += sCW[subCategory];
        });
        if (subCategorySum > 100 || subCategorySum < 100) {
          subCategorySumError.push(key)
        }
      }
    }
  }

  // Show flag for sum error in subCategories
  if (categorySum > 100 || categorySum < 100) {
    categorySumError = true;
    // $('#categoryErrorMessage').show();
    $('#categoryErrorModal').modal('show');
  }

  // Show flag for sum error in subCategories
  if (subCategorySumError.length !== 0) {
    $('#subCategoryErrorModal').modal('show');
    $('#subCategoryErrorPlaceholder').text(' for the following categories: ' + subCategorySumError.join(', '));
  }

  // Only run the calculations if the sum of all category and subcategory weights are correct
  if (!categorySumError && subCategorySumError.length < 1) {

    for (var key in mainData) {
      const nObj = mainData[key];
      mainData[key].Score = categoryWeights.environment*(parseFloat(nObj['# of Unicorn'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation Ranking'])*sCW.innovRanking/100);
      mainData[key].Score += categoryWeights.environment*(parseFloat(nObj['VC deal $ amount'])*sCW.vcDealAmt/100 + parseFloat(nObj['Number of FinTech Startups'])*sCW.noOfFinTechStartups/100);
      mainData[key].Score += categoryWeights.environment*(parseFloat(nObj['Internet Access'])*sCW.intAccess/100 + parseFloat(nObj['Wifi (% of time spent connected to wifi networks)'])*sCW.wifiPercent/100);
      mainData[key].Score += categoryWeights.social*(parseFloat(nObj["Tech Jobs Growth Rate % (06'-16')"])*sCW.techJobGrowth/100 + parseFloat(nObj['Most Liveable Cities'])*sCW.livableCities/100);
      mainData[key].Score += categoryWeights.political*(parseFloat(nObj["Effective State Corporate Tax Rate 2017"])*sCW.taxRate/100 + parseFloat(nObj['Tax Incentives'])*sCW.taxIncentives/100);
      mainData[key].Score += categoryWeights.economic*(parseFloat(nObj["Fintech Job Count"])*sCW.finTechJobCount/100 + parseFloat(nObj['GFCI'])*sCW.gfci/100);
      mainData[key].Score = (mainData[key].Score/100).toFixed(2);
    }
    mainData.sort(function(a, b){
      return b.Score-a.Score;
    });
    generateTable();
  }

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

function restoreToDefaultWeights() {

  categoryWeights = Object.assign({}, defaultCW);
  sCW = Object.assign({}, defaultSCW);
  updateUIWeights();
}

function updateUIWeights() {
  for (var key in categoryWeights) {
    $('#' + key)[0].value  = categoryWeights[key];
    if (!$('input[name=' + key + ']').is(':checked')) {
        $('input[name=' + key + ']').trigger('click');
    }
  }

  for (var key in sCW) {
    $('#' + key)[0].value  = sCW[key];
  }
}
