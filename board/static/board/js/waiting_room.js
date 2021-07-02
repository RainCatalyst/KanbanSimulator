var number_of_players = 0;
var game_id = 0;
var current_version = -1;

function player_template(player, count){
    return '<tr>' +
                    '<th scope="row">' + count +'</th>' +
                    '<td>' + player["name"] + '</td>' +
                    '<td>' + player["team_number"] + '</td>' +
                    '<td>' + isSpectator(player) + '</td>' +
                    '</tr>';
}

function isSpectator(player){
    if (player["spectator"])
        return "Да";
    return "Нет";
}

function new_players_check(){
    $.ajax({
        type: "POST",
        url: "waiting_room/players_check",
        data: {'game_id': game_id,
                'version': current_version},
        success: function(response){
            var syn = JSON.parse(response["SYN"]);
            if (!syn){
                var players = JSON.parse(response["players"]);
                current_version = JSON.parse(response["version"]);

                document.getElementById("players_container").innerHTML = "";

                for (var i = 0; i < players.length; i++){
                    document.getElementById("players_container").innerHTML += player_template(players[i], i + 1);
                }
            }
            setTimeout(new_players_check, 1000);
        }

    });

}





