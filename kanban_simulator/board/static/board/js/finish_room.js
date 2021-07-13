var teams = [];
var teams_id = [];
var graphics;

var lineChart;
var barChart;


$(function() {
   commands_check();
});

// synchronization function for checking the teams which is already done
function commands_check(){
    $.ajax({
        method: "POST",
        url: "finish/commands_check",
        data: {"teams": teams_id},
        success: function(response){
            var syn = JSON.parse(response["SYN"]);
            if (!syn){
                graphics = JSON.parse(response["graphics"]);
                teams = JSON.parse(response["rating"]);
                teams_id = [];
                for (var j =0; j < teams.length; j ++){
                    teams_id.push(teams[j]["pk"]);
                }
                document.getElementById("team_rating").innerHTML = "";
                document.getElementById("team_tabs").innerHTML = "";
                if (lineChart != null){
                   lineChart.destroy();
                }
                if (barChart != null){
                    barChart.destroy();
                }
                ratingByBusinessValue();
                document.getElementById("team_tabs").firstChild.firstChild.click();

            }
            setTimeout(commands_check, 1000);
        }
    });
}

// add onClickListener to tab button
function addListeners(pk){
    var elem = document.getElementById("team_tab_" + pk).addEventListener("click", function(){
        var id = parseInt($(this).attr("id").substring(9));
        var data = findDataByID(id);
        cumulativeGraph(data[1]);
        barGraph(data[0]);
        $(this).addClass("active");
        for (var j =0; j < teams.length; j++){
            if (teams[j]["pk"] != id){
                $('#team_tab_' + teams[j]["pk"]).removeClass('active');
            }
        }
    }, false);
}

// find graph data in array by given id
function findDataByID(pk){
    for (var k = 0; k < graphics.length; k++){
        if (graphics[k]["pk"] == pk){
            return graphics[k]["data"];
        }
    }
}

// rating the teams by overall business value
function ratingByBusinessValue(){
    teams.sort(function(a, b) {
        return b.bv - a.bv;
    });

    for (var i = 0; i< teams.length; i++){
        var template = ratingTemplate(i + 1, teams[i]);
        var tab_template = tabTemplate(i + 1, teams[i]["pk"]);
        document.getElementById("team_rating").innerHTML += template;
        document.getElementById("team_tabs").innerHTML += tab_template;
    }

    for (var i = 0; i< teams.length; i++){
        addListeners(teams[i]["pk"]);
    }


}

// function for rating team template creation
function ratingTemplate(count, team){
    var player_list = "";
    //console.log(teams);
    var players_from_json = JSON.parse(team["players"]);
    for (var i =0; i < players_from_json.length; i++){
        if (i == players_from_json.length - 1){
            player_list += players_from_json[i]["name"];
        }else{
            player_list += players_from_json[i]["name"] + ", ";
        }
    }
    return '<tr>' +
                '<th scope="row">' + count +'</th>' +
                '<td>Команда #' + team["pk"] + '</td>' +
                '<td>' + player_list + '</td>' +
                '<td>' + team["bv"] + '</td>' +
                '</tr>';

}
// function for team tab template creation
function tabTemplate(count, pk){
    return '<li class="nav-item">' +
                    '<button type="button" class="btn btn-outline-info nav-link text-dark" id="team_tab_' + pk + '">Команда #' + pk + '</button>' +
                '</li>';
}

// plotting the cumulative graph for entire game
function cumulativeGraph(line_data){
    if (lineChart != null){
        lineChart.destroy();
    }
    var ctx = document.getElementById('firstChart').getContext('2d');
    ctx.height = 400;
    ctx.width = 400;
    var labels = Object.keys(line_data);

    var anl_data = [];
    var dev_data = [];
    var test_data = [];

    for (var i =0; i < line_data.length; i++){
        var pDay = Object.values(line_data[i])[0];
        anl_data.push(pDay[0]);
        dev_data.push(pDay[1]);
        test_data.push(pDay[2]);
    }
    var data = {
        labels: labels,
        options: {
            title: {
                display: true,
                text: 'Cumulative Flow Diagram',
                position: 'left'
            }
        },
        datasets: [
        {
            label: 'Test tasks',
            data: test_data,
            fill: {
                target: 'origin',
                above: 'rgb(0, 255, 0)'
            },
            borderColor: 'rgb(0, 255, 0)',
            tension: 0.1
        },
        {
            label: 'Develop tasks',
            data: dev_data,
            fill: {
                target: 'origin',
                above: 'rgb(0, 0, 255)'
            },
            borderColor: 'rgb(0, 0, 255)',
            tension: 0.1
        },
        {
            label: 'Analytic tasks',
            data: anl_data,
            fill: {
                target: 'origin',
                above: 'rgb(255, 0, 0)'
            },
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.1
        }]
    };
    lineChart = new Chart(ctx, {
        type: 'line',
        data: data,
    });
}

// plotting the bar graph for entire game
function barGraph(bar_data){
    if (barChart != null){
        barChart.destroy();
    }
    var ctx = document.getElementById('secondChart').getContext('2d');
    ctx.height = 400;
    ctx.width = 400;
    var labels = Object.keys(bar_data);

    var anl_data = [];
    var dev_data = [];
    var test_data = [];

    var ds = [];

    for (var i =0; i < bar_data.length; i++){
        ds.push(Object.values(bar_data[i])[0]);
    }
    var data = {
        labels: labels,
        options: {
            title: {
                display: true,
                text: 'Lead Time Distribution',
                position: 'bottom'
            }
        },
        datasets: [
        {
            label: 'Completed tasks',
            data: ds,
        }]
    };
    barChart = new Chart(ctx, {
        type: 'bar',
        data: data,
    });
}