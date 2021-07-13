
// first 2 numbers - analytic dep
// next 3 numbers - development dep
// last 2 numbers - test dep
var current_effort = [];

// positions of the players
var players_list = [-1, -1, -1, -1, -1, -1, -1];


// html template creation function
function createCharacterTemplate(role){
    var template = "";
    switch(role){
        case 0:
            template = '<div class="anl_player players" id="anl_player0">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="29.375" viewBox="0 0 48 47">' +
                    '<image id="A" width="48" height="47" xlink:href="data:img/png;base64,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"/>' +
                '</svg>' +
                '</div>';
            break;
        case 1:
            template = '<div class="anl_player players" id="anl_player1">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="29.375" viewBox="0 0 48 47">' +
                    '<image id="A" width="48" height="47" xlink:href="data:img/png;base64,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"/>' +
                '</svg>' +
                '</div>';
            break;
        case 2:
            template = '<div class="dev_player players" id="dev_player2">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="29.375" viewBox="0 0 48 47">' +
                    '<image id="D" width="48" height="47" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAYAAAC9pNwMAAAGz0lEQVRIia1Xa2wc1RX+5rUzs+9dPzbLxg9sJ6FOsJPdJE4KTaUGN0nVBggtRK1D1KqRGvctCn9AQpWgFUi0qiroD1wgcRWkBoiaCgEtbYOAOGA76zwc2Xlgx6l3sdfr3dnXzOy8qjvZoDR+4KQ90tXqzj3n++4599xzz+IWZBWAlwBcBHABwB8r325KqCUqt1XGXQC+d8cdXda66E9oshA/+XtzZKSX4LwM4EMApwGc+jxAdpG1BkICYDNF0Z3hcKvS2Li+fPz4Kxwo96Wm5g0emzjuygNo+tKWfbvHxwa7JidPOU3TeBdAX2Uz4/OBz+cxD+AJAPsaGjaGorH75Lb2h1SfL8SHw67CO28fKB/+88+KxaIUIMoulzfz4EO/c23fsZdLJhWXJCWNs2eOsAP9rznHxvo+BdAD4CkA6mLEawD8JRRa03T/rqeL6zfu1EQBflkBDB3QNMDrgzk9lZ89NXTY9rh97bfytbWeYE4CzXIAywKCCJRVZAcH32KPvP64O5GIfwLgPgBn5iNuBfBuNLY7/PDeF1KhZYFgZhZMuWyAuk7LsgBBYOB2X50XCoCizNXhOAbBIIyZmULm4IHu6v6Pe6cAbAUwfD2xiyRELNbV/PNHenPlMry53H+DXZNfPtkCRZHsWXPLFvu3o2Mv7mzbOUeXbMDjZcDzyP/2uT2ewYE/kVuwFkCJrug8W1cfa97/w94ZVYVXkuYnJZLNXoHoDGDrPY+isbED2cwV9Ly4C0NDr1s36hKMnGRAVeDZ392brquPrQDwDFkjxPUURXXde+8zRVFEMJ83QNPzctpO8LwH1VW3457Ox+zR/aN34HQGMNB/aN6tEiyCKYoIEA6KovcQTkLx9dsi7d629q1GJgN6IU+vOXHjB0JaVxfFxQvvLWxEAQS7rX2reVvkTh+AHYR4Yyy6u8hxEE1zTrT+b0KwOQ5CNPpgiaQFIV5R3xDjyDWwLPOWeGbSY4gsb19Uh2ATjvqGDQyAlaRyVdE04yBrSyFR1TxKpQxGR/8BuZRBPP4a0jOfoLPzsaWYszTNkuOqJsSsedXTJdVtv78O6fQYXnlptz0PBhuw64HfYPMXv78Uc6oSVXaxWj1HaJrBU78am3PVSGqYBjlHY8lYixKTAsDzDNweOxyqokArlSxW11XWNHXblqZZneMEXRShCwLDEZNCnhzJwrVgDjEhYhiG3Dk7FiwLNTGZnu3rO+qXS5n8xMSgdHn8hEuSEl5VVUi1gyA4ZZ8vkmu8vaO4fHnUL4p+z+o1O7ORSFVQ18HrOimpgK4b8xFTYBigqpqBrkNKTI5bQyffKBw//ryrXKZTqdQk63AEmaamb9ArVv6CYjkXKKpSZSyDKpeLmJ6KMwP9z3KaJhVqap5OcZwpbtr8g9S66DfdkUgT5eAZH03hs1QixJTLGTBoGvm//61HHxp6s3hu+G2Hy71KDgTuFr/QuqN2xcr7eZblnRwHF8va1Y75DIGCaFlwGDpMTQOr60rx/OiR2vHxt6xjx16Vjx59glvduk1uX/c1bfv2/YzTFfBWagom2tfu9CYTAwVJMoo1tev9sfWPWpHIZkcg4HAqCnhFNe1zsCxjwbtOIkBRDCiKAs/TEASUMxmtmEye0E4OPodkok/y+RhxWTjqPXP6TYkQnwxWRRtXrXpYaV3dxVVX22dDk7dX0+Sb6I7mpCY4TiTViuSKOZvOpoeHe43RkZeFdDp+iYT6/UhkU+u27T8VMhmIkiTbu7529rcuFDRNsZsHy7Jo0emv+eq2H8uSdIZJp+PvkfP664Xzr/ITE1NlwkN9zitxK0IwySt1+XKyfPHCYY5wEuL3FSVzdmTkgNPphGL9T14uJBS5ouroyEGnqmZJB/ohXWnCes+d7eHyUlnmece8xmTXLCuAFwQIZIiVIVz9RtYWihbBzOVUeXi4h3h7EIDGVNbiijL7bV6o8bW0bKJlWb/6LlM0WI6Hx8PC4WBzqqrLOWmCLRSm6GI+pRQLM3pJnmVVtaBznDvn8TjKgsDyhsHCNE07wcgl8Po5o/+jF3B+9NAVAN8FoF+/xW7RWfv8d/aczi4LhTyqCsswYErSdPbSxTdqC4V/G1OffiRNT/f7yuU82bBWseMcDq9RG9qQC4U2+jyeerq55YFpr7cqwDCgeAFUMpnIH+pd65flVDeAP9gRvCEqH4TDd9+15cu/1orFrHJu+EXP1PSAWiwkhgCQFvVEpUWdAaBUbAQANZV/GpsANLrdy2PLwh1sa+u+Ai+I/LF/PsKlUgP/AvCVhbIgWOn+CckHAB6vtKQ3l0lAJ4AnAXxcwSJe2n24LQD+A2IGs+5FUp2ZAAAAAElFTkSuQmCC"/>' +
                '</svg>' +
                '</div>';
            break;
        case 3:
            template = '<div class="dev_player players" id="dev_player3">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="29.375" viewBox="0 0 48 47">' +
                    '<image id="D" width="48" height="47" xlink:href="data:img/png;base64,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"/>' +
                '</svg>' +
                '</div>';
            break;
        case 4:
            template = '<div class="dev_player players" id="dev_player4">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="29.375" viewBox="0 0 48 47">' +
                    '<image id="D" width="48" height="47" xlink:href="data:img/png;base64,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"/>' +
                '</svg>' +
                '</div>';
            break;
        case 5:
            template = '<div class="tst_player players" id="tst_player5">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="29.375" viewBox="0 0 48 47">' +
                    '<image id="T" width="48" height="47" xlink:href="data:img/png;base64,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"/>' +
                '</svg>' +
                '</div>';
            break;
        case 6:
            template = '<div class="tst_player players" id="tst_player6">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="29.375" viewBox="0 0 48 47">' +
                    '<image id="T" width="48" height="47" xlink:href="data:img/png;base64,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"/>' +
                '</svg>' +
                '</div>';
            break;
    }

    return template;
}


$(function() {
    updateCharacterConfiguration();
});

// new elements don't know about their droppability and dragability, so we need to update it
function updateCharacterConfiguration(){
    $('.players').draggable({revert: 'invalid',
                    stop: function(event){
                    $(this).css("inset", "");
                    }});
    $("#big_header_container").droppable({
        accept: '.players',
        drop: function(event, ui){
            var parent = $("#header_container");
            var child = $(ui.draggable);
            var role = characterDistinguishByID(child.attr("id"));

            if (players_list[role] != -1){
                parent.append(child);
                child.removeAttr("style");
                child.css("position", "relative");
                moveCharacter(role, -1);
            }else{
                return false;
            }
        }
    });

    $(".players").dblclick(function(){
        var elem = $(this);
        var cur_role = characterDistinguishByID(elem.attr("id"));
        if (players_list[cur_role] != -1){
            $(this).remove();
            $("#header_container").append(elem);
            moveCharacter(cur_role, -1);
            updateCharacterConfiguration();
        }
    });
}

// functions which tells to server that the given character changed its position
function moveCharacter(role, card_id){
    console.log("Character#" + role + " was moved on card#" + card_id);
    players_list[role] = card_id;
    data = {"team_id": team_id,
            "role": role,
            "card_id": card_id};
    $.ajax({
        type: "POST",
        url: "move_player",
        data: data,
        success: function(response){
            current_version += 1;
            console.log("New version: " + current_version);
        }
    })
}

// function which place character at specified card
function placeCharacterAtSpecifiedCard(character, card_id, col_number){
    if (card_id != -1 && col_number != 0 && col_number != 2 && col_number != 4 && col_number != 6){
        var card_string_id = '#kb_card_' + card_id;
        var card_string_id = '#player_card_container_' + card_id;
        $(card_string_id).append(character);
    }else{
        $("#header_container").append(character);
    }
}

function characterDistinguishByID(player_id){
    switch(player_id){
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
