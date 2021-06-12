

function backLogInitialPopulation(){
$.ajax({
type: 'POST',
url: "populate_backlog",
data: {room: "0", team: "1"},
success: function (response){
var cards = JSON.parse(response["cards"]);
console.log(cards);
for (var i = 0; i < cards.length; i++){
    addCardToColumn(0, cards[i])
}

$(function() {$('.draggable').draggable();});
}});
}


function addCardToColumn(column_num, card_model){
    var card_element = createCardTemplate(card_model)
    document.getElementById("backlog_container").innerHTML += card_element;
    console.log(column_num);
    console.log(card_model);
}

function createCardTemplate(card_model){
var card_element = '<div class="card kanban_card draggable" style="width: 18rem;" >' +
  '<div class="card-body">' +
    '<h5 class="card-title">' + card_model["fields"]["title"] + '</h5>' +
    '<p class="card-text"></p>' +
  '</div>' +
'</div>';
    return card_element;
}

