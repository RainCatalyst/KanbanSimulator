
// first 2 numbers - analytic dep
// next 3 numbers - development dep
// last 2 numbers - test dep
var current_effort = [];

$(function() {
    $('.players').draggable({revert: 'invalid'});
});

// functions which tells to server that the given character changed its position
function moveCharacter(role, card_id){
    data = {"team_id": team_id,
            "role": role,
            "card_id": card_id}
    $.ajax({
        type: "POST",
        url: "move_player",
        data: data,
        success: function(response){
            current_version += 1;
        }
    })
}

// function which place character at specified card
function placeCharacterAtSpecifiedCard(character, card_id){
    var card_string_id = '#kb_card_' + card_id;
    $(card_string_id).append(character);
}

// returns the number which is code for specific character role
function characterDistinguish(player){
    switch(player.attr("id")){
        case "anl_player1":
            return 0;
        case "anl_player2":
            return 1;
        case "dev_player1":
            return 2;
        case "dev_player2":
            return 3;
        case "dev_player3":
            return 4;
        case "test_player1":
            return 5;
        case "test_player2":
            return 6;
        default:
            return -1;
    }
}