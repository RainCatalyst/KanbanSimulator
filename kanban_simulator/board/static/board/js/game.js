var current_version = 0;
var team_id = 1;

function backLogInitialPopulation(){
    $.ajax({
        type: 'POST',
        url: "populate_backlog",
        data: {room: "0", team: "1"},
        success: function (response){
            var cards = JSON.parse(response["cards"]);
            console.log(cards);
            current_effort = JSON.parse(response["team_effort"]);
            current_day = 0;
            for (var i = 0; i < cards.length; i++){
                addCardToColumn(0, i, cards[i]);
            }

            $('.draggable').draggable({revert: 'invalid'});


    }});
}

$(function() {
    // description of droppable property of the header(initial place for characters)
    $("#header_container").droppable({
        accept: '.players',
        drop: function(event, ui){
            $(this).append(ui.draggable[0]);
            var child = $(this).children().last();
            var role = characterDistinguish(child);
            console.log("Role: " + role);
            moveCharacter(role, -1);
        }
    });

    performVersionCheck();
});

// function for inter-player synchronization
function performVersionCheck(){
    $.ajax({
        type: "POST",
        url: "version_check",
        data: {'team_id': team_id,
                'version': current_version},
        success: function(response){
            var syn = JSON.parse(response["SYN"]);
            if (!syn){
            var cards = JSON.parse(response["cards"]);
            var characters = JSON.parse(response["characters"]);
            var board_info = JSON.parse(response["board_info"]);

            current_version = board_info["version"];

            removeAllChildNodes('backlog_container');
            removeAllChildNodes('analytic_in_process_container');
            removeAllChildNodes('analytic_completed_container');
            removeAllChildNodes('devop_in_process_container');
            removeAllChildNodes('devop_completed_container');
            removeAllChildNodes('test_in_process_container');
            removeAllChildNodes('test_completed_container');

            cards.sort(compare_cards);

            card_list = cards;

            // card_positioning
            for (var i = 0; i < cards.length; i++){
                card = cards[i];

                var card_column_number = card["column_number"];
                if (card_column_number == 0){
                    addCardToParent('backlog_container', card);
                }else if (card_column_number == 1){
                    addCardToParent('analytic_in_process_container', card);
                }else if (card_column_number == 2){
                    addCardToParent('analytic_completed_container', card);
                }else if (card_column_number == 3){
                    addCardToParent('devop_in_process_container', card);
                }else if (card_column_number == 4){
                    addCardToParent('devop_completed_container', card);
                }else if (card_column_number == 5){
                    addCardToParent('test_in_process_container', card);
                }else if (card_column_number == 6){
                    addCardToParent('test_completed_container', card);
                }
            }

            // character_positioning
            for (character in characters){
                var character_template;
                switch (character["role"]){
                    case 0:
                        character_template = $('#anl_player1');
                        break;
                    case 1:
                        character_template = $('#anl_player2');
                        break;
                    case 2:
                       character_template = $('#dev_player1');
                       break;
                    case 3:
                       character_template = $('#dev_player2');
                       break;
                    case 4:
                       character_template = $('#dev_player3');
                       break;
                    case 5:
                       character_template = $('#test_player1');
                       break;
                    case 6:
                       character_template = $('#test_player2');
                       break;
                }
                placeCharacterAtSpecifiedCard(character_template, character["card_id"]);
            }


            }


            setTimeout(performVersionCheck, 5000);
        }
    });
}

// remove all content inside specified column
function removeAllChildNodes(parent) {
    document.getElementById(parent).innerHTML = "";
}

// needed for adding updated (from server) cards to parent column
function addCardToParent(parent, card){
    document.getElementById(parent).innerHTML += createCardTemplate(card);
    card_template = document.getElementById('kb_card_' + card["pk"]);
    addDraggableAbility(card, card_template);
}

// needed for comparing two cards (the first one - smallest row, the last one - the biggest row)
function compare_cards(card_a, card_b) {
  if (card_a["row_number"] > card_b["row_number"]) return 1;
  if (card_a["row_number"] > card_b["row_number"]) return -1;

  return 0;
}

