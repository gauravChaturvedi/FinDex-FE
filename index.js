var categoryWeights = {
  'environment': 45,
  'social': 20,
  'political': 10,
  'economic': 25
};

var subCategoryGroups = {
  'environment': ['nOfUnicorns', 'innovRanking', 'vcDealAmt', 'noOfFinTechStartups', 'intAccess'],
  'social': ['techJobGrowth', 'livableCities'],
  'political': ['taxRate', 'taxIncentives'],
  'economic': ['finTechJobCount', 'gfci']
};

var sCW = {
  'vcDealAmt': 25,
  'innovRanking': 15,
  'nOfUnicorns': 25,
  'noOfFinTechStartups': 25,
  'intAccess': 10,
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
var percentileData = {};

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
  sCW[id] = (parseFloat(newValue) || 0);
}

function getData() {
  // $.get("https://nodeupload-196719.appspot.com/getData", function(data, status){
  // $.get("https://findexdata.herokuapp.com/getData", function(data, status){
  $.get("https://findex-data-findex-data.193b.starter-ca-central-1.openshiftapps.com/getData", function(data, status){
    mainData = JSON.parse(data);
    generateTable();
  }).fail(function() {
    // $('#apiErrorModal').modal('show');
    console.log('Unable to get main data');
});;
}

function getPercentileData() {
  // $.get("https://nodeupload-196719.appspot.com/getPercentileData", function(data, status){
  // $.get("https://findex-data.appspot.com/getPercentileData", function(data, status){
  $.get("https://findex-data-findex-data.193b.starter-ca-central-1.openshiftapps.com/getPercentileData", function(data, status){
  // $.get("https://findexdata.herokuapp.com/getPercentileData", function(data, status){
    // $.get("https://findex-data-findex-data.193b.starter-ca-central-1.openshiftapps.com/getPercentileData", function(data, status){
    percentileData = JSON.parse(data);
  }).fail(function() {
    // $('#apiErrorModal').modal('show');
    console.log('Unable to get percentile data');
});;
}

getData();
getPercentileData();

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
      mainData[key].Score = categoryWeights.environment*(parseFloat(nObj['Unicorns (#)'])*sCW.nOfUnicorns/100 + parseFloat(nObj['Innovation '])*sCW.innovRanking/100);
      mainData[key].Score += categoryWeights.environment*(parseFloat(nObj['VC Funding ($)'])*sCW.vcDealAmt/100 + parseFloat(nObj['Number of FinTech Startups'])*sCW.noOfFinTechStartups/100);
      mainData[key].Score += categoryWeights.environment*(parseFloat(nObj['Household Internet Access (%)'])*sCW.intAccess/100);
      mainData[key].Score += categoryWeights.social*(parseFloat(nObj["Tech Jobs Growth Rate (Historical)"])*sCW.techJobGrowth/100 + parseFloat(nObj['Livability'])*sCW.livableCities/100);
      mainData[key].Score += categoryWeights.political*(parseFloat(nObj["Corporate Tax Rate"])*sCW.taxRate/100 + parseFloat(nObj['Digital Currency Regulation'])*sCW.taxIncentives/100);
      mainData[key].Score += categoryWeights.economic*(parseFloat(nObj["New FinTech Jobs (Projected #)"])*sCW.finTechJobCount/100 + parseFloat(nObj['Global Financial Center (Y/N)'])*sCW.gfci/100);
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

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.appendChild(document.createTextNode(parseInt(key) +1))
    tr.appendChild(th);
    var td = document.createElement("td");
    td.appendChild(document.createTextNode(mainData[key].Metropolitan))
    tr.appendChild(td);
    var td1 = document.createElement("td");
    td1.appendChild(document.createTextNode(parseFloat(mainData[key].Score).toFixed(2)))
    tr.appendChild(td1);
    var cityName = mainData[key].Metropolitan;
    tr.onclick = function () {
      generateCityDetails($(this).find('td:eq(0)').text());
    };
    delete cityName;
    $("#rankingsTable > tbody").append(tr);

    // $("#rankingsTable > tbody").append("<tr onClick='generateCityDetails(" + mainData[key].Metropolitan + ")'" + "><th>" + (parseInt(key) +1) + "</th><td>" + mainData[key].Metropolitan + "</td><td>" + parseFloat(mainData[key].Score).toFixed(2) + "</td>");
  }
}

function generatePercentileTable(cityName) {
  $("#percentile-table > tbody").empty();
  $('#city-details-modal-title').text(cityName);
  $('#city-details-modal-title').append("<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
  // SORTING THE KEYS
  // convert object into array

  var selectedCity = percentileData.filter(function(v, i) {
    return v.Metropolitan === cityName;
  })[0];

	var sortable=[];
	for(var key in selectedCity) {
    if(selectedCity.hasOwnProperty(key))
      sortable.push([key, selectedCity[key]]); // each item is an array in format [key, value]
  }

	// sort items by value
	sortable.sort(function(a, b)
	{
	  return a[1]-b[1]; // compare numbers
	});

  sortable.forEach(function (v,i) {
    var className = '';
    if (v[0] !== 'Metropolitan' && v[0] !== '') {
      var percentileValue = (parseFloat(v[1])*100).toFixed(2);
      if (percentileValue <33) {
        className = 'alert-danger';
      } else if(percentileValue > 33 && percentileValue <67) {
        className = 'alert-warning';
      } else {
        className = 'alert-success';
      }
      $("#percentile-table > tbody").append("<tr class=" + className + "><th>" + (v[0]) + "</th><td>" + percentileValue + "</td>");
    }
  });
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

function generateCityDetails(cityName) {
  generatePercentileTable(cityName);
  $('#city-details-modal').modal('show');
}
