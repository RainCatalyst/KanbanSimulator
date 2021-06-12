function change_color(){
alert("Ok");
document.getElementById("main_title").css('color', '#0f0');
/*var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        alert("Ok");

    }
}*/

}

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
}});
}


function addCardToColumn(column_num, card_model){
    var card_element = "<p id=card" + card_model["pk"] + ">" + card_model["fields"]["title"] +"</p>";
    document.getElementById("backlog_container").innerHTML += card_element;
    console.log(column_num);
    console.log(card_model);
}

