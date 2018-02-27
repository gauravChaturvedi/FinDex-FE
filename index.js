var categoryWeights = {
  'firstCategoryWeight': 20,
  'secondCategoryWeight': 20,
  'thirdCategoryWeight': 20,
  'fourthCategoryWeight': 20
};

var subCategoryWeights = {
  'firstCategory': [0, 0, 0],
  'secondCategory': [0, 0, 0],
  'thirdCategory': [0, 0, 0],
  'fourthCategory': [0, 0, 0]
};

const windowHeight = $( window ).height();
const headerHeight = $('#headerBar').height()
console.log(windowHeight - headerHeight);
$('#tableContainer').height( windowHeight - headerHeight );

function categoryWeightUpdated(id, elem) {
  const newValue = elem.value;
  const comparisonObject = Object.assign({}, categoryWeights);
  comparisonObject[id] = newValue;
  var sum = 0;
  for (var key in comparisonObject) {
    if (comparisonObject.hasOwnProperty(key)) {
      sum += parseInt(comparisonObject[key]);
    }
  }

  categoryWeights[id] = newValue;

  if (sum == 100) {
    // categoryWeights[id] = newValue;
  } else {
    // Put up error message
    // $('#' + id)[0].value  = categoryWeights[id];
  }
}

function getData() {
  $.get("https://findexdata.herokuapp.com/getData", function(data, status){
    var mainData = JSON.parse(data);
    for (var key in mainData) {
      $("#rankingsTable > tbody").append("<tr><th>" + mainData[key].Ranking + "</th><td>" + mainData[key].Metropolitan + "</td><td>" + mainData[key].Score + "</td>");
    }
  });
}

getData();

var itemOneCheckBox = $('#itemOneCheckBox');
var itemOne = $('#first-category-container');
itemOne.hide();

itemOneCheckBox.on('click', function() {
  if($(this).is(':checked')) {
    itemOne.show();
  } else {
    itemOne.hide();
  }
});

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
