var card_list = [];


// html template creation function
function createCardTemplate(card_model){
    /*var card_element = '<div class="card kanban_card draggable no_droppable_card" id="kb_card_' + card_model["pk"] +'">' +
    '<div class="card-body">' +
        '<h5 class="card-title">' + card_model["title"] + '</h5>' +
        '<p class="card-text"></p>' +
    '</div>' +
    '</div>';*/

    var card_element = '<div class="card border-success mb-3 kanban_card draggable no_droppable_card" id="kb_card_' + card_model["pk"] + '">' +
                            '<h6 class="card-header border-success text-start">' + card_model["title"] + '</h6>' +
                            '<div class="card-body p-1 text-start">' +
                               '<div class="row">' +
                                   '<div class="col-8">' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: ' + getPercentage(card_model["analytic_remaining"], card_model["analytic_completed"]) + '%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">' + getProportion(card_model["analytic_remaining"], card_model["analytic_completed"]) + '</div>' +
                                        '</div>' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-primary" role="progressbar" style="width: ' + getPercentage(card_model["develop_remaining"], card_model["develop_completed"]) + '%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">' + getProportion(card_model["develop_remaining"], card_model["develop_completed"]) + '</div>' +
                                        '</div>' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ' + getPercentage(card_model["test_remaining"], card_model["test_completed"]) + '%;" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100">' + getProportion(card_model["test_remaining"], card_model["test_completed"]) + '</div>' +
                                        '</div>' +

                                   '</div>' +
                                   '<div class="col-4">' +
                                        '<div class="for_players"></div>' +
                                   '</div>' +
                               '</div>' +
                            '</div>' +
                            '<div class="card-footer border-success text-end p-1 pe-2">День #'+ card_model["age"] +'</div>' +
                        '</div>';
    return card_element;
}

// droppable behavior for sub_containers
$(function() {
    $('.droppable_anl_proc').droppable({
        accept: '.draggable',
        drop: function(event, ui){
            $(this).append(ui.draggable[0]);
            var child = $(this).children().last();
            child.removeAttr("style");
            child.removeClass("draggable");

            var id = getIdByCardModel(child);
            var column_num = 1;
            var row_num = $(this).children().length - 1;
            moveCard(column_num, row_num, id);
            abilityToAddCharacters(child);
            //disableDrag(child);
        }
    });

    $('.droppable_dev_proc').droppable({
        accept: '.draggable_to_dev',
        drop: function(event, ui){
            $(this).append(ui.draggable[0]);
            var child = $(this).children().last();
            child.removeAttr("style");
            child.removeClass("draggable_to_dev");

            var id = getIdByCardModel(child);
            var column_num = 3;
            var row_num = $(this).children().length - 1;
            moveCard(column_num, row_num, id);
            abilityToAddCharacters(child);
            //disableDrag(child);
        }
    });

    $('.droppable_test_in_proc ').droppable({
        accept: '.draggable_to_test',
        drop: function(event, ui){
            $(this).append(ui.draggable[0]);
            var child = $(this).children().last();
            child.removeAttr("style");
            child.removeClass("draggable_to_test");

            var id = getIdByCardModel(child);
            var column_num = 5;
            var row_num = $(this).children().length - 1;
            moveCard(column_num, row_num, id);
            abilityToAddCharacters(child);
            //disableDrag(child);
        }
    });

    $('#finish_container').droppable({
        accept: '.draggable_to_finish',
        drop: function(event, ui){
            $(this).append(ui.draggable[0]);
            var child = $(this).children().last();
            child.removeAttr("style");
            child.removeClass("draggable_to_finish");
            child.addClass("no_draggable");

            var id = getIdByCardModel(child);
            var column_num = 7;
            var row_num = $(this).children().length - 1;
            moveCard(column_num, row_num, id);
            //disableDrag(child);
        }
    });
});

// function which calls after moving card to the given position (server interaction)
function moveCard(column_number, row_number, id){
    console.log("Card #" + id + " was moved on col:" + column_number + " row: " + row_number);
    changePositionInList(id, column_number, row_number);
    data = {"col_num": column_number,
            "row_num": row_number,
            "id": id,
            "team_id": team_id};
    $.ajax({
        type: "POST",
        url: "move_card",
        data: data,
        success: function(response){
            current_version += 1;
            console.log("New version: " + current_version);
        },error: function(xhr, status, error) {
            alert("Error");
        }
    });

}

// function which adds to card an ability to 'accept' characters
function abilityToAddCharacters(card){
    card.removeClass("no_droppable_card");
    card.addClass("droppable_card");

    $('.droppable_card').droppable({
        accept: '.players',
        drop: function(event, ui){
            $(this).append(ui.draggable[0]);
            var child = $(this).children().last();
            child.removeAttr("style");
            child.css("position", "relative");

            var card_id = getIdByCardModel($(this));
            var role = characterDistinguish(child);
            if (players_list[role] != card_id){
                moveCharacter(role, card_id);
                players_list[role] = card_id;
            }

    }});
}

// function which is need for adding specific draggable classes to card,
// since card initially created with just 'draggable' class
function addDraggableAbility(card, card_template){
    $(card_template).removeClass("draggable");
    if (card["test_completed"] >= card["test_remaining"]){
        $(card_template).addClass("draggable_to_finish");
    }else if (card["develop_completed"] >= card["develop_remaining"]){
        $(card_template).addClass("draggable_to_test");
        //abilityToAddCharacters($(card_template))
    }else if (card["analytic_completed"] >= card["analytic_remaining"]){
        $(card_template).addClass("draggable_to_dev");
        //abilityToAddCharacters($(card_template))
    }else if (card["analytic_completed"] == 0 && card["column_number"] != 0){
        //$(card_template).addClass("draggable_anl");

    }else{
        $(card_template).addClass("draggable");
    }

    $('.draggable_to_dev').draggable({revert: 'invalid'});
    $('.draggable_to_test').draggable({revert: 'invalid'});
    $('.draggable_to_finish').draggable({revert: 'invalid'});
    $('.draggable').draggable({revert: 'invalid'});

}

// function which is responsible for changing the row position of the specified card (only in the list)
function changePositionInList(id, column_number, row_number){
    for (var i = 0; i < card_list.length; i++){
        if (card_list[i]["pk"] == id){
            card_list[i]["row_number"] = row_number;
            card_list[i]["column_number"] = column_number;
            break;
        }

    }
}

function getIdByCardModel(card){
    return card.attr("id").substring(card.attr("id").lastIndexOf('_') + 1);

}

function getIndexOfArrayCardById(id){
    for (var k = 0; k < card_list.length; k++){
        if (card_list[k]["pk"] == id)
            return k;
    }
    return -1;
}

function disableDrag(card){
    card.removeClass("ui-draggable");
    card.removeClass("ui-draggable-handle");
}

function getPercentage(first, second){
    var min = first;
    if (second < first){
        min = second;
        //console.log(second/first * 100);
        return second/first * 100;
    }
    //console.log(first/second * 100);
    return 100;

}

function getProportion(first, second){
    var proportion = "";
    if (first > second){
        proportion += second;
    }else{
        proportion += first;
    }
    proportion += "/" + first;
    return proportion;
}

function test(){

}


