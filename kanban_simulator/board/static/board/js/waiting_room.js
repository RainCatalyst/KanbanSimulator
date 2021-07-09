var number_of_players = 0;
var game_id = 0;
var current_version = -1;
var player_id = -1;

function player_template(player, count){
    return '<tr>' +
                    '<th scope="row">' + count +'</th>' +
                    '<td>' + player["name"] + '</td>' +
                    '</tr>';
}

function new_players_check(){
    $.ajax({
        type: "POST",
        url: "waiting_room/players_check",
        data: {'game_id': game_id,
                'version': current_version},
        success: function(response){
            var syn = JSON.parse(response["SYN"]);
            var ready = JSON.parse(response["ready"]);
            console.log(ready);
            if (ready){
                $.ajax({
                    type: "GET",
                    url: 'join_game',
                    data: {},
                    success: function (response){
                        window.location = "join_game";
                    }
                });
            }else{
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
        }

    });

}

/*window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = '';
    console.log(e);
    //navigator.sendBeacon("waiting_room/delete_player");
}, false);*/





