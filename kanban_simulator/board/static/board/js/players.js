
// first 2 numbers - analytic dep
// next 3 numbers - development dep
// last 2 numbers - test dep
var current_effort = [];

// positions of the players
var players_list = [-1, -1, -1, -1, -1, -1, -1];


// html template creation function
function createCharacterTemplate(role, card_id){
    var template = "";
    var class_name = "players";
    switch(role){
        case 0:
            template = '<div class="anl_player players" id="anl_player0"></div>';
            break;
        case 1:
            template = '<div class="anl_player players" id="anl_player1"></div>';
            break;
        case 2:
            template = '<div class="dev_player players" id="dev_player2"></div>';
            break;
        case 3:
            template = '<div class="dev_player players" id="dev_player3"></div>';
            break;
        case 4:
            template = '<div class="dev_player players" id="dev_player4"></div>';
            break;
        case 5:
            template = '<div class="tst_player players" id="tst_player5"></div>';
            break;
        case 6:
            template = '<div class="tst_player players" id="tst_player6"></div>';
            break;
    }

    return template;
}


$(function() {
    updateCharacterConfiguration();
});

function updateCharacterConfiguration(){
    updateCharacterDraggable();
    updateHeaderDroppable();
}

function updateCharacterDraggable(){
    $('.players').draggable({revert: 'invalid'});
}

function updateHeaderDroppable(){
    $("#header_container").droppable({
        accept: '.players',
        drop: function(event, ui){
            $(this).append(ui.draggable[0]);
            var child = $(this).children().last();
            child.removeAttr("style");
            child.css("position", "relative");
            var role = characterDistinguish(child);
            moveCharacter(role, -1);
        }
    });
}

// functions which tells to server that the given character changed its position
function moveCharacter(role, card_id){
    players_list[role] == card_id;
    data = {"team_id": team_id,
            "role": role,
            "card_id": card_id};
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
    if (card_id != -1){
        var card_string_id = '#kb_card_' + card_id;
        $(card_string_id).append(character);
    }else{
        $("#header_container").append(character);
    }
}

// returns the number which is code for specific character role
function characterDistinguish(player){
    switch(player.attr("id")){
        case "anl_player0":
            return 0;
        case "anl_player1":
            return 1;
        case "dev_player2":
            return 2;
        case "dev_player3":
            return 3;
        case "dev_player4":
            return 4;
        case "tst_player5":
            return 5;
        case "tst_player6":
            return 6;
        default:
            return -1;
    }
}
