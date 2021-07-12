var card_list = [];


// html template creation function
function createCardTemplate(card_model){
    var class_name = "no_droppable_card";
    if (card_model["column_number"] == 1 || card_model["column_number"] == 3 || card_model["column_number"] == 5){
        class_name = "droppable_card";
    }
    return '<div class="card border-success mb-3 kanban_card draggable ' + class_name + '" id="kb_card_' + card_model["pk"] + '">' +
                            '<h6 class="card-header border-success text-start">' + card_model["title"] + '</h6>' +
                            '<div class="card-body p-1 text-start">' +

                               '<div class="d-flex flex-row">' +
                                   '<div class="flex-grow-1">' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: ' + getPercentage(card_model["analytic_remaining"], card_model["analytic_completed"]) + '%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">' + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="ps-1 fw-light fst-italic d-flex align-items-center" style="font-size: 75%;">' + '<small>' + getProportion(card_model["analytic_remaining"], card_model["analytic_completed"]) + '</small>' + '</div>' +
                                '</div>' +

                                '<div class="d-flex flex-row">' +
                                   '<div class="flex-grow-1">' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-primary" role="progressbar" style="width: ' + getPercentage(card_model["develop_remaining"], card_model["develop_completed"]) + '%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">' + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="ps-1 fw-light fst-italic d-flex align-items-center" style="font-size: 75%;">' + '<small>' + getProportion(card_model["develop_remaining"], card_model["develop_completed"]) + '</small>' + '</div>' +
                                '</div>' +

                                '<div class="d-flex flex-row">' +
                                   '<div class="flex-grow-1">' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ' + getPercentage(card_model["test_remaining"], card_model["test_completed"]) + '%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">' + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="ps-1 fw-light fst-italic d-flex align-items-center" style="font-size: 75%;">' + '<small>' + getProportion(card_model["test_remaining"], card_model["test_completed"]) + '</small>' + '</div>' +
                                '</div>' +

                                '<div class="d-flex flex-row for_players border-top flex-wrap" style="min-height: 36px;" id="player_card_container_' +  card_model["pk"] + '"></div>' +

                            '</div>' +

                            '<div class="card-footer border-success d-flex flex-row p-1 pe-2 fw-light fst-italic"><div class="me-auto"><small>value: ' + card_model["business_value"] + '</small></div><div class="ms-auto"><small>День #' +card_model["age"] + '</small></div></div>' +
            '</div>';
}

// html template creation function for expedite card
function createExpediteCardTemplate(card_model){
    var class_name = "no_droppable_card";
    if (card_model["column_number"] == 1 || card_model["column_number"] == 3 || card_model["column_number"] == 5){
        class_name = "droppable_card";
    }
    return '<div class="card border-dark mb-3 kanban_card draggable expedite ' + class_name + '" id="kb_card_' + card_model["pk"] + '" >' +
                            '<h6 class="card-header bg-warning border-dark text-start">' + card_model["title"] + '</h6>' +
                            '<div class="card-body p-1 text-start">' +

                               '<div class="d-flex flex-row">' +
                                   '<div class="flex-grow-1">' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: ' + getPercentage(card_model["analytic_remaining"], card_model["analytic_completed"]) + '%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">' + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="ps-1 fw-light fst-italic d-flex align-items-center" style="font-size: 75%;">' + '<small>' + getProportion(card_model["analytic_remaining"], card_model["analytic_completed"]) + '</small>' + '</div>' +
                                '</div>' +

                                '<div class="d-flex flex-row">' +
                                   '<div class="flex-grow-1">' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-primary" role="progressbar" style="width: ' + getPercentage(card_model["develop_remaining"], card_model["develop_completed"]) + '%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">' + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="ps-1 fw-light fst-italic d-flex align-items-center" style="font-size: 75%;">' + '<small>' + getProportion(card_model["develop_remaining"], card_model["develop_completed"]) + '</small>' + '</div>' +
                                '</div>' +

                                '<div class="d-flex flex-row">' +
                                   '<div class="flex-grow-1">' +
                                        '<div class="progress my-1">' +
                                            '<div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ' + getPercentage(card_model["test_remaining"], card_model["test_completed"]) + '%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">' + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="ps-1 fw-light fst-italic d-flex align-items-center" style="font-size: 75%;">' + '<small>' + getProportion(card_model["test_remaining"], card_model["test_completed"]) + '</small>' + '</div>' +
                                '</div>' +

                                '<div class="d-flex flex-row for_players border-top flex-wrap" style="min-height: 36px;" id="player_card_container_' +  card_model["pk"] + '"></div>' +

                            '</div>' +

                            '<div class="card-footer bg-warning border-dark d-flex flex-row p-1 pe-2 fw-light fst-italic"><div class="me-auto"><small>value: ' + card_model["business_value"] + '</small></div><div class="ms-auto"><small>День #' +card_model["age"] + '</small></div></div>' +
        '</div>';
}

// droppable behavior for sub_containers
$(function() {
    allowToDrop();
});

// new cards don't know about their possible dragability, so we need to declare it
function allowToDrop(){
$('.droppable_anl_proc').droppable({
        accept: function(draggable){
        if (draggable.hasClass("draggable")){
            if (draggable.hasClass("expedite")){
                return true;
            }
            //console.log("it is draggable");
            if (getAnalyticChildren() < limits[0]){
                return true;
            }
            //console.log("bigger than");
            return false;
        }
        return false;
        },
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
        }
    });

    $('.droppable_dev_proc').droppable({
        accept: function(draggable){
        if (draggable.hasClass("draggable_to_dev")){
            if (draggable.hasClass("expedite")){
                return true;
            }
            if (getDevChildren() < limits[1]){
                return true;
            }
            return false;
        }
        return false;
        },
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
        }
    });

    $('.droppable_test_in_proc ').droppable({
        accept: function(draggable){
        if (draggable.hasClass("draggable_to_test")){
            if (draggable.hasClass("expedite")){
                return true;
            }
            if (getTestChildren() < limits[2]){
                return true;
            }
            return false;
        }
        return false;
        },
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
        }
    });

}

// function which calls after moving card to the given position (server interaction)
function moveCard(column_number, row_number, id){
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
    droppableAbility();

}

// also new cards don't know about their droppability (they can accept characters), so we need to update it
function droppableAbility(){
    $('.droppable_card').droppable({
        accept: function(draggable){
            if (draggable.hasClass("players")){

                var role = characterDistinguishByID(draggable.attr("id"))
                var card_id = getIdByCardModel($(this));
                var card = card_list[getIndexOfArrayCardById(card_id)];

                 if (current_day >= player_collaboration_day || (card["column_number"] == 1 && (role == 0 || role == 1)) ||
                (card["column_number"] == 3 && (role == 2 || role == 3 || role == 4)) ||
                (card["column_number"] == 5 && (role == 5 || role == 6))){
                    return true
                }
                return false
            }
            return false
        },
        drop: function(event, ui){
            var role = characterDistinguishByID($(ui.draggable).attr("id"))
            var card_id = getIdByCardModel($(this));

            var parent = $("#player_card_container_" + card_id)
            parent.append(ui.draggable[0]);
            var child = parent.children().last();
            child.css("inset", "");

            if (players_list[role] != card_id){
                deleteCharacterCopy('#kb_card_' + players_list[role], $(ui.draggable).attr("id"));
                moveCharacter(role, card_id);
            }
    }});
}

// function related to draggability bug(2 copies of the same characters in different locations)
function deleteCharacterCopy(card_id, player_id){
    var parent_id;
    if (card_id == -1){
        parent_id = "#header_container";
    }else{
        parent_id = card_id;
    }
    if ($(parent_id).has("#" + player_id).length){
        $(parent_id).find("#" + player_id).remove();
    }
}

// function which is need for adding specific draggable classes to card,
// since card initially created with just 'draggable' class
function addDraggableAbility(card, card_template){
    $(card_template).removeClass("draggable");
    if (card["test_completed"] >= card["test_remaining"]){
        $(card_template).addClass("draggable_to_finish");
    }else if (card["develop_completed"] >= card["develop_remaining"]){
        $(card_template).addClass("draggable_to_test");
    }else if (card["analytic_completed"] >= card["analytic_remaining"]){
        $(card_template).addClass("draggable_to_dev");
    }else if (card["analytic_completed"] == 0 && card["column_number"] != 0){

    }else{
        $(card_template).addClass("draggable");
    }

    $(".draggable_to_dev, .draggable_to_test, .draggable_to_finish, .draggable")
        .draggable({revert: 'invalid',
                    stop: function(event){
                    $(this).removeAttr("style");
                    }});

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

// get pk of the card from it html id
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

function getPercentage(first, second){
    var min = first;
    if (second < first){
        min = second;
        return second/first * 100;
    }
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

// get amount of children which locates in columns 1 and 2 and they shouldn't be expedite, since expedite cards may break WIP limits
function getAnalyticChildren(){
    var amount = 0;
    for (var i = 0; i < card_list.length; i++){
        if ((card_list[i]["column_number"] == 1 || card_list[i]["column_number"] == 2)&& !card_list[i]["is_expedite"]){
            amount += 1;
        }
    }
    return amount;
}

// get amount of children which locates in columns 3 and 4 and they shouldn't be expedite, since expedite cards may break WIP limits
function getDevChildren(){
    var amount = 0;
    for (var i = 0; i < card_list.length; i++){
        if ((card_list[i]["column_number"] == 3 || card_list[i]["column_number"] == 4) && !card_list[i]["is_expedite"]){
            amount += 1;
        }
    }
    return amount;
}

// get amount of children which locates in columns 5 and 6 and they shouldn't be expedite, since expedite cards may break WIP limits
function getTestChildren(){
    var amount = 0;
    for (var i = 0; i < card_list.length; i++){
        if ((card_list[i]["column_number"] == 5 || card_list[i]["column_number"] == 6) && !card_list[i]["is_expedite"]){
            amount += 1;
        }
    }
    return amount;
}


