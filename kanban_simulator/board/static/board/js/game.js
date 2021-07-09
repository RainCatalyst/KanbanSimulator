var current_version = 0;
var team_id = 1;
var current_day = 1;
var player_collaboration_day = 5;
var limits = [4, 4, 4];

// arrays of days
var analytic_completed_tasks = [];
var developer_completed_tasks = [];
var test_completed_tasks = [];

function backLogInitialPopulation(){
    $.ajax({
        type: 'POST',
        url: "populate_backlog",
        // data: {room: "0", team: team_id},
        data: {team: team_id},
        success: function (response){
            var cards = JSON.parse(response["cards"]);
            current_effort = JSON.parse(response["team_effort"]);

            var board_info = JSON.parse(response["board_info"]);
            current_day = board_info["Age"];
            $('#day_num_title').text("День #" + current_day);
            limits[0] = board_info["Wip1"];
            limits[1] = board_info["Wip2"];
            limits[2] = board_info["Wip3"];

            for (var i = 0; i < cards.length; i++){
                // cards[i]['row_number'] = i;
                //cards[i]['column_number'] = 0;
                //console.log("BV: " + cards[i]['business_value']);
                if (cards[i]['business_value'] == null){
                    cards[i]['business_value'] = 10;
                }

                var card_element = createCardTemplate(cards[i]);
                switch (cards[i]["column_number"]){
                    case 0:
                        document.getElementById("backlog_container").innerHTML += card_element;
                        break;
                    case 1:
                        document.getElementById("analytic_in_process_container").innerHTML += card_element;
                        var new_card_elem = document.getElementById("kb_card_" + cards[i]['pk']);
                        //new_card_elem.removeClass("no_droppable_card");
                        //new_card_elem.addClass("droppable_anl_proc");
                        break;
                    case 2:
                        document.getElementById("analytic_completed_container").innerHTML += card_element;
                        break;
                    case 3:
                        document.getElementById("devop_in_process_container").innerHTML += card_element;
                        break;
                    case 4:
                        document.getElementById("devop_completed_container").innerHTML += card_element;
                        break;
                    case 5:
                        document.getElementById("test_in_process_container").innerHTML += card_element;
                        break;
                    case 6:
                        document.getElementById("test_completed_container").innerHTML += card_element;
                        break;
                    case 7:
                        document.getElementById("finish_container").innerHTML += card_element;
                        break;
                }

                card_list.push(cards[i]);
            }

            $('.draggable').draggable({revert: 'invalid',
                    stop: function(event){
                    $(this).removeAttr("style");
                    }});

            droppableAbility();


    }});
}


// in process...
function start_new_day(){

    if (window.confirm("Do you really want to start new day?")) {
        console.log("Start new day");
        var data = {"team": team_id};

        var anl_comp = 0;
        var dev_comp = 0;
        var test_comp = 0;

        var changed_cards = [];
        for (var j = 0; j < players_list.length; j++){
            var character_position = players_list[j];
            if (character_position != -1){
                var card_id = getIndexOfArrayCardById(character_position);
                if (!changed_cards.includes(card_id)) {
                    changed_cards.push(card_id);
                }
                if (card_list[card_id]["develop_completed"] >= card_list[card_id]["develop_remaining"] && (card_list[card_id]["blocked"] == null || !card_list[card_id]["blocked"])){
                    card_list[card_id]["test_completed"] += current_effort[j] + (j == 5 || j == 6 ? 0 : -1);
                    if (card_list[card_id]["test_completed"] >= card_list[card_id]["test_remaining"]){
                        card_list[card_id]["blocked"] = true;
                    }
                }else if (card_list[card_id]["analytic_completed"] >= card_list[card_id]["analytic_remaining"] && (card_list[card_id]["blocked"] == null || !card_list[card_id]["blocked"])){
                    card_list[card_id]["develop_completed"] += current_effort[j] + (j == 2 || j == 3 || j == 4 ? 0 : -1);
                    if (card_list[card_id]["develop_completed"] >= card_list[card_id]["develop_remaining"]){
                        card_list[card_id]["blocked"] = true;
                    }
                }else if(card_list[card_id]["blocked"] == null || !card_list[card_id]["blocked"]){
                    card_list[card_id]["analytic_completed"] += current_effort[j] + (j == 0 || j == 1 ? 0 : -1);
                    if (card_list[card_id]["analytic_completed"] >= card_list[card_id]["analytic_remaining"]){
                        card_list[card_id]["blocked"] = true;
                    }
                }
            }
        }

        for (var j = 0; j < players_list.length; j++){
            var character_position = players_list[j];
            if (character_position != -1){
                var card_id = getIndexOfArrayCardById(players_list[j]);
                if (card_list[card_id]["blocked"] != null && card_list[card_id]["blocked"]){
                    players_list[j] = -1;
                }
            }
        }
        var first_empty_row_anl_comp = getNumberOfChildNodesById("analytic_completed_container");
        var first_empty_row_dev_comp = getNumberOfChildNodesById("devop_completed_container");
        var first_empty_row_test_comp = getNumberOfChildNodesById("test_completed_container");

        for (var i = 0; i < changed_cards.length; i++){
            if (card_list[changed_cards[i]]["blocked"] != null && card_list[changed_cards[i]]["blocked"]){
                if (card_list[changed_cards[i]]["test_completed"] >= card_list[changed_cards[i]]["test_remaining"]){
                    test_comp += 1;
                    card_list[changed_cards[i]]["ready_day"] = current_day;
                    card_list[changed_cards[i]]["column_number"] += 1;
                    card_list[changed_cards[i]]["row_number"] = first_empty_row_test_comp;
                    first_empty_row_test_comp += 1;
                    test_completed_tasks.push(current_day);
                }else if (card_list[changed_cards[i]]["develop_completed"] >= card_list[changed_cards[i]]["develop_remaining"]){
                    dev_comp += 1;
                    card_list[changed_cards[i]]["column_number"] += 1;
                    card_list[changed_cards[i]]["row_number"] = first_empty_row_dev_comp;
                    first_empty_row_dev_comp += 1;
                    developer_completed_tasks.push(current_day);
                }else if (card_list[changed_cards[i]]["analytic_completed"] >= card_list[changed_cards[i]]["analytic_remaining"]){
                    anl_comp += 1;
                    card_list[changed_cards[i]]["column_number"] += 1;
                    card_list[changed_cards[i]]["row_number"] = first_empty_row_anl_comp;
                    first_empty_row_anl_comp += 1;
                    analytic_completed_tasks.push(current_day);
                }
            }
        }

        var last_column = 7;
        for (var k = 0; k < card_list.length; k ++){
            if (card_list[k]["column_number"] != last_column && card_list[k]["column_number"] != 0){
                card_list[k]["age"] += 1;
            if (card_list[k]["is_expedite"]){
                if (card_list[k]["age"] >= 5){
                    card_list[k]["business_value"] = 0;
                }
            }else{
                if (card_list[k]["age"] == 8 || card_list[k]["age"] == 9){
                    card_list[k]["business_value"] = Math.round(card_list[k]["business_value"] * 0.5);
                }else if (card_list[k]["age"] > 9){
                    card_list[k]["business_value"] = 0;
            }

            }
            }
        }

        data["current_day"] = current_day;
        data["anl_completed"] = anl_comp;
        data["dev_completed"] = dev_comp;
        data["test_completed"] = test_comp;
        data["cards"] = JSON.stringify(card_list);
        data["characters"] = players_list;

        $.ajax({
            type: "POST",
            url: "start_day",
            data: data,
            dataType : "json",
            success: function(response){
                var syn = JSON.parse(response["SYN"]);
                if (syn){
                    current_day = JSON.parse(response["day_num"]);
                    current_effort = JSON.parse(response["team_effort"]);
                    $('#day_num_title').text("День #" + current_day);
                }

            }
        });

     current_day ++;
    }
}

$(function() {
    // description of droppable property of the header(initial place for characters)
    updateCharacterConfiguration();

    $('#day_num_title').text("День #" + current_day);
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
                current_day = board_info["Age"];
                $('#day_num_title').text("День #" + current_day);


                removeAllChildNodes('backlog_container');
                removeAllChildNodes('analytic_in_process_container');
                removeAllChildNodes('analytic_completed_container');
                removeAllChildNodes('devop_in_process_container');
                removeAllChildNodes('devop_completed_container');
                removeAllChildNodes('test_in_process_container');
                removeAllChildNodes('test_completed_container');
                removeAllChildNodes('finish_container');
                removeAllChildNodes('header_container');

                cards = cards.sort(compare_cards);

                card_list = cards;

                // card_positioning
                for (var i = 0; i < cards.length; i++){
                    var card = cards[i];

                    var card_column_number = card["column_number"];
                    //console.log("Card#" + card["pk"] + " column number: " + card_column_number);
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
                    }else if (card_column_number == 7){
                        addCardToParent('finish_container', card);
                    }
                }

                // character_positioning
                for (var j = 0; j < characters.length; j ++){
                    var character_template = createCharacterTemplate(characters[j]["role"]);
                    var column_number = 0;
                    var card_index = getIndexOfArrayCardById(characters[j]["card_id"]);
                    players_list[j] = characters[j]["card_id"];
                    placeCharacterAtSpecifiedCard(character_template,
                        characters[j]["card_id"], card_index == -1 ? 0 :card_list[card_index]["column_number"]);
                }
                updateCharacterConfiguration();
            }
            setTimeout(performVersionCheck, 1000);
        }
    });
}

// remove all content inside specified column
function removeAllChildNodes(parent) {
    document.getElementById(parent).innerHTML = "";
}

// needed for adding updated (from server) cards to parent column
function addCardToParent(parent, card){
    if (card["is_expedite"]){
        document.getElementById(parent).innerHTML += createExpediteCardTemplate(card);
    }else{
        document.getElementById(parent).innerHTML += createCardTemplate(card);
    }

    card_template = document.getElementById('kb_card_' + card["pk"]);
    addDraggableAbility(card, card_template);
    if (card["column_number"] % 2 == 1 && card["column_number"] != 7){
        abilityToAddCharacters($(card_template));
    }
}

// needed for comparing two cards (the first one - smallest row, the last one - the biggest row)
function compare_cards(card_a, card_b) {
  if (card_a["row_number"] > card_b["row_number"]) return 1;
  else if (card_a["row_number"] < card_b["row_number"]) return -1;

  return 0;
}

function getNumberOfChildNodesById(id){
    return document.getElementById(id).childElementCount;
}

function call(){
    $('#AlertCardsModal').modal('toggle');
}

