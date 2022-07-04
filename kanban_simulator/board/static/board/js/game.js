var current_version = 0;
var team_id = 1;
var player_id = 0;
var current_day = 1;
var player_collaboration_day = 10;
var limits = [4, 4, 4];
var BV = 0;
// initial data for graph plotting
var bar_data = [{"1": 0}, {"2": 0}, {"3": 0}, {"4": 0}];
var line_data = [{"1": [0, 0, 0]}, {"2": [0, 0, 0]}, {"3": [0, 0, 0]}, {"4": [0, 0, 0]}];
var throughput_data = {"0": 4}
var scatter_data = {}

var lineChart;
var barChart;
var throughtputChart;
var scatterChart;

// arrays of days
var analytic_completed_tasks = [];
var developer_completed_tasks = [];
var test_completed_tasks = [];

var is_backlog_function_processed = false;

// needed for showing that players have only 1 week left
var last_week_reminder = false;

// needed for showing that players have only 1 day left
var last_day_reminder = false;

// needed for showing that first expedite modal was shown
var first_expedite_modal_was_shown = false;

// needed for showing that second expedite modal was shown
var second_expedite_modal_was_shown = false;

// needed for showing that third expedite modal was shown
var third_expedite_modal_was_shown = false;

// needed for showing that second half of cards modal was shown
var second_half_model_shown = false;

// function which is responsible for initial card states(position, progress and etc)
function backLogInitialPopulation(){
    $.ajax({
        type: 'POST',
        url: "populate_backlog",
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
                        break;
                    case 2:
                        document.getElementById("analytic_completed_container").innerHTML += card_element;
                        break;
                    case 3:
                        document.getElementById("devop_in_process_container").innerHTML += card_element;
                        analytic_completed_tasks.push(current_day);
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
            allowToDrop();
            is_backlog_function_processed = true;
    }});
    performVersionCheck();
}


// function which calls every start day button click (here we calculate the progress, business value, next positions of the cards and etc)
function start_new_day() {
    if (window.confirm("Do you really want to start new day?")) {
        console.log("Start new day");
        var data = { team: team_id };

        var analysisCompleted = 0;
        var developmentCompleted = 0;
        var testingCompleted = 0;

        blocked = [];
        for (var i = 0; i < card_list.length; i ++){
            blocked.push(false);
        }

        var changed_cards = [];
        for (var j = 0; j < players_list.length; j++){
            const characterPosition = players_list[j];
            if (characterPosition != -1) {
                const cardIndex = getIndexOfArrayCardById(characterPosition);
                const card = card_list[cardIndex];

                if (!changed_cards.includes(cardIndex)) {
                    changed_cards.push(cardIndex);
                }

                if (card.develop_completed >= card.develop_remaining && !blocked[cardIndex]) {
                    card.test_completed += current_effort[j] + (j == 5 || j == 6 ? 0 : -1);
                    if (card.test_completed >= card.test_remaining) {
                        blocked[cardIndex] = true;
                        console.log("CARD#" + card.pk + " is blocked");
                    }
                } else if (card.analytic_completed >= card.analytic_remaining && !blocked[cardIndex]) {
                    card.develop_completed += current_effort[j] + (j == 2 || j == 3 || j == 4 ? 0 : -1);
                    if (card.develop_completed >= card.develop_remaining) {
                        blocked[cardIndex] = true;
                        console.log("CARD#" + card.pk + " is blocked");
                    }
                } else if (!blocked[cardIndex]) {
                    card.analytic_completed += current_effort[j] + (j == 0 || j == 1 ? 0 : -1);
                    if (card.analytic_completed >= card.analytic_remaining) {
                        blocked[cardIndex] = true;
                        console.log("CARD#" + card.pk + " is blocked");
                    }
                }
            }
        }

        for (var j = 0; j < players_list.length; j++) {
            const characterPosition = players_list[j];
            if (characterPosition != -1) {
                const cardIndex = getIndexOfArrayCardById(players_list[j]);
                if (blocked[cardIndex]){
                    players_list[j] = -1;
                }
            }
        }
        console.log("Character positions sending: ");
        console.log(players_list);

        var first_empty_row_anl_comp = getNumberOfChildNodesById("analytic_completed_container");
        var first_empty_row_dev_comp = getNumberOfChildNodesById("devop_completed_container");
        var first_empty_row_test_comp = getNumberOfChildNodesById("test_completed_container");

        for (cardIndex of changed_cards){
            const card = card_list[cardIndex];
            if (blocked[cardIndex]) {
                if (card.test_completed >= card.test_remaining) {
                    testingCompleted += 1;
                    card.ready_day = current_day;
                    card.column_number += 1;
                    card.row_number = first_empty_row_test_comp;
                    first_empty_row_test_comp += 1;
                    test_completed_tasks.push(current_day);
                } else if (card.develop_completed >= card.develop_remaining) {
                    developmentCompleted += 1;
                    card.column_number += 1;
                    card.row_number = first_empty_row_dev_comp;
                    first_empty_row_dev_comp += 1;
                    developer_completed_tasks.push(current_day);
                } else if (card.analytic_completed >= card.analytic_remaining) {
                    analysisCompleted += 1;
                    card.column_number += 1;
                    card.row_number = first_empty_row_anl_comp;
                    first_empty_row_anl_comp += 1;
                    analytic_completed_tasks.push(current_day);
                }
            }
        }
        calculateBV();

        const constraints = {
            true: {
                lateDay: LATE_EXPEDITE_CARD_DAY,
                fine: EXIPEDITE_CARD_FINE,
            },
            false: {
                lateDay: LATE_CARD_DAY,
                fine: CARD_FINE,
            }
        }

        for (card of card_list) {
            card.age++;

            const {
                column_number: columnNumber,
                is_expedite: isExpedite,
                age
            } = card

            const { lateDay, fine } = constraints[isExpedite.toString()]

            if (columnNumber !== 6 && columnNumber !== 7) {
                age >= lateDay
                    ? card.business_value -= fine
                    : null;
            }
        }

        var analysisInProcess = card_list.filter(x => x.column_number == 1).sort(compare_cards);
        var developmentInProcess = card_list.filter(x => x.column_number == 3).sort(compare_cards);
        var testingInProcess = card_list.filter(x => x.column_number == 5).sort(compare_cards);

        for (index in analysisInProcess) {
            analysisInProcess[index].row_number = index;
        }

        for (index in developmentInProcess) {
            developmentInProcess[index].row_number = index;
        }

        for (index in testingInProcess) {
            testingInProcess[index].row_number = index;
        }

        data["current_day"] = current_day;
        data["anl_completed"] = analysisCompleted;
        data["dev_completed"] = developmentCompleted;
        data["test_completed"] = testingCompleted;
        data["cards"] = JSON.stringify(card_list);
        data["characters"] = players_list;
        data["BV"] = BV;

        $.ajax({
            type: "POST",
            url: "start_day",
            data: data,
            dataType : "json",
            success: function(response){
                var syn = JSON.parse(response["SYN"]);
                if (syn){
                    current_day = JSON.parse(response["day_num"]);
                    if (current_day == FIRST_EXPEDITE || current_day == SECOND_EXPEDITE || current_day == THIRD_EXPEDITE){
                        showExpediteModal();
                     }else if (current_day == SECOND_HALF_APPEARS){
                        showNewCardsModal();
                    }
                    current_effort = JSON.parse(response["team_effort"]);
                    $('#day_num_title').text("День #" + current_day);
                }

            }
        });

     current_day++;
    }
}

$(function() {
    // description of droppable property of the header(initial place for characters)
    updateCharacterConfiguration();

    $('#day_num_title').text("День #" + current_day);

    // statistics button (business value calculating and graph plotting)
    $(document).on("click", "#stat_show", function () {
        plotCumulativeGraph();
        plotBar();
        plotThroughtputChart();
        plotScatterChart();
        calculateBV();
        document.getElementById('bv_sum_container').innerHTML = "БИЗНЕС VALUE: " + BV;
        $('#StatisticsModal').modal('toggle');
    });
});

// function for inter-player synchronization
function performVersionCheck(){
    if (is_backlog_function_processed){
        $.ajax({
        type: "POST",
        url: "version_check",
        data: {'team_id': team_id,
                'version': current_version},
        success: function(response){
            var syn = JSON.parse(response["SYN"]);
            if (!syn){
                document.body.classList.add('waiting');
                var cards = JSON.parse(response["cards"]);
                var characters = JSON.parse(response["characters"]);

                console.log("Accepted character list: ");
                console.log(characters);

                var board_info = JSON.parse(response["board_info"]);
                limits[0] = board_info["Wip1"];
                document.getElementById("anl_wip").innerHTML = limits[0];
                limits[1] = board_info["Wip2"];
                document.getElementById("dev_wip").innerHTML = limits[1];
                limits[2] = board_info["Wip3"];
                document.getElementById("test_wip").innerHTML = limits[2];
                bar_data = JSON.parse(response["bar_data"]);
                line_data = JSON.parse(response["line_data"]);
                throughput_data = JSON.parse(response["throughput_data"])
                scatter_data = JSON.parse(response["scatter_data"])

                current_version = board_info["version"];
                if (current_day != board_info["Age"]){
                    current_day = board_info["Age"];
                    if (current_day == FIRST_EXPEDITE && !first_expedite_modal_was_shown){
                        showExpediteModal();
                        first_expedite_modal_was_shown = true;
                     }else if (current_day == SECOND_EXPEDITE && !second_expedite_modal_was_shown){
                        showExpediteModal();
                        second_expedite_modal_was_shown = true;
                     }else if (current_day == THIRD_EXPEDITE && !third_expedite_modal_was_shown){
                        showExpediteModal();
                        third_expedite_modal_was_shown = true;
                     }else if (current_day == SECOND_HALF_APPEARS && !second_half_model_shown){
                        showNewCardsModal();
                        second_half_model_shown = true;
                    }
                }

                $('#day_num_title').text("День #" + current_day);
                if (current_day == last_day - 1 && !last_day_reminder){
                    last_day_reminder = true;
                    document.getElementById("end_game_label").innerHTML = "Игра заканчивается завтра! Поторопитесь!";
                    $("#AlertWeekEndGameModal").modal('toggle');
                }else if (current_day == last_day - 7 && !last_week_reminder){
                    last_week_reminder = true;
                    document.getElementById("end_game_label").innerHTML = "Игра заканчивается через 7 дней! Поторопитесь!";
                    $("#AlertWeekEndGameModal").modal('toggle');
                }

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
                    players_list[characters[j]["role"]] = characters[j]["card_id"];
                    placeCharacterAtSpecifiedCard(character_template,
                        characters[j]["card_id"], card_index == -1 ? 0 :card_list[card_index]["column_number"]);
                }
                updateCharacterConfiguration();
                document.body.classList.remove('waiting');
            }
            if (current_day == last_day){
                $('#AlertEndGameModal').modal('toggle');
                setTimeout(goToFinishRoom, 3000);
            }else{
                setTimeout(performVersionCheck, 1000);
            }
        }
    });
    }else{
        setTimeout(performVersionCheck, 1000);
    }

}

// function which redirects all player inside same team to finish(statistic) room
function goToFinishRoom(){
    $.ajax({
        type: "GET",
        url: "/"+ player_id + "/finish",
        success: function(response){
        window.location.href = "/" + player_id + "/finish";
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
  if (card_a["is_expedite"] && !card_b["is_expedite"]) return 1;
  else if (!card_a["is_expedite" && card_b["is_expedite"]]) return -1;
  return 0;
}

// get number of children inside the parent container
function getNumberOfChildNodesById(id){
    return document.getElementById(id).childElementCount;
}

function showNewCardsModal(){
    $('#AlertCardsModal').modal('toggle');
}

function showExpediteModal(){
    $('#AlertExpediteCardsModal').modal('toggle');
}

// calculate business value(1st algo for 5-24 days and 2nd for last days)
function calculateBV(){
    var sum = 0;
    for (var k = 0; k < card_list.length; k ++){
        const card = card_list[k];
        if (card.column_number == 7){
            sum += card.business_value;
        }
        if (current_day >= last_day - 1){
            var travel_distance = 7 - card_list[k]["column_number"];
            var fine = card.is_expedite ? EXIPEDITE_CARD_FINE : CARD_FINE;
            sum -= fine * travel_distance;
        }
    }
    BV = sum;
}

// plot cumulative graph (cumulative amount of task which is done by every department)
function plotCumulativeGraph(){
    if (lineChart != null){
        lineChart.destroy();
    }
    var ctx = document.getElementById('firstChart').getContext('2d');
    ctx.height = 400;
    ctx.width = 400;
    var labels = Object.keys(line_data).slice(FIRST_HALF_APPEARS - 1);

    for (var i = 0; i < labels.length; i++)
    {
        labels[i] = (parseInt(labels[i]) + 1).toString();
    }

    var anl_data = [];
    var dev_data = [];
    var test_data = [];

    for (var i = FIRST_HALF_APPEARS - 1; i < line_data.length; i++){
        var pDay = Object.values(line_data[i])[0];
        anl_data.push(pDay[0]);
        dev_data.push(pDay[1]);
        test_data.push(pDay[2]);
    }
    var data = {
        labels: labels,
        datasets: [
        {
            label: 'Analytic tasks',
            data: anl_data,
            fill: {
                target: 'origin',
                above: 'rgb(220, 53, 69)'
            },
            borderColor: 'rgb(220, 53, 69)',
            tension: 0.1
        },
        {
            label: 'Develop tasks',
            data: dev_data,
            fill: {
                target: 'origin',
                above: 'rgb(13, 110, 253)'
            },
            borderColor: 'rgb(13, 110, 253)',
            tension: 0.1
        },
        {
            label: 'Test tasks',
            data: test_data,
            fill: {
                target: 'origin',
                above: 'rgb(25, 135, 84)'
            },
            borderColor: 'rgb(25, 135, 84)',
            tension: 0.1
        }
        ]
    };
    lineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            title: {
                display: true,
                text: 'Cumulative Flow Diagram',
                position: 'left'
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 5,
                    ticks: {
                        autoSkip: false,
                        maxTicksLimit: 100,
                        stepSize: 1
                    }
                },
                y: {
                    type: 'linear',
                    ticks: {
                        autoSkip: false,
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// plot bar graph (number of task which is done in principle)
function plotBar(){
    if (barChart != null){
        barChart.destroy();
    }
    var ctx = document.getElementById('secondChart').getContext('2d');
    ctx.height = 400;
    ctx.width = 400;
    var labels = Object.keys(bar_data).slice(FIRST_HALF_APPEARS - 1);

    for (var i = 0; i < labels.length; i++)
    {
        labels[i] = (parseInt(labels[i]) + 1).toString();
    }

    var ds = [];

    for (var i = FIRST_HALF_APPEARS - 1; i < bar_data.length; i++){
        ds.push(Object.values(bar_data[i])[0]);
    }

    var data = {
        labels: labels,
        datasets: [
        {
            label: 'Completed tasks',
            data: ds,
            backgroundColor: 'rgb(100, 149, 237)'
        }]
    };
    barChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            title: {
                display: true,
                text: 'Lead Time Distribution',
                position: 'bottom'
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 5,
                    max: last_day - 1,
                    ticks: {
                        autoSkip: false,
                        maxTicksLimit: 100,
                        stepSize: 1
                    }
                },
                y: {
                    type: 'linear',
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1,
                        autoSkip: false
                    }
                }
            },
        }
    });
}

function plotThroughtputChart(){
    if (throughtputChart != null){
        throughtputChart.destroy();
    }
    var ctx = document.getElementById('throughputChart').getContext('2d');
    ctx.height = 400;
    ctx.width = 400;
    var labels = Object.keys(throughput_data);

    var ds = Object.values(throughput_data);

    var data = {
        labels: labels,
        datasets: [
        {
            label: 'Days',
            data: ds,
            backgroundColor: 'rgb(100, 149, 237)'
        }]
    };
    throughtputChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    suggestedMax: 5,
                    ticks: {
                        autoSkip: false,
                        stepSize: 1
                    }
                },
                y: {
                    type: 'linear',
                    ticks: {
                        autoSkip: false,
                        stepSize: 1
                    }
                }
            },
            title: {
                display: true,
                text: 'Throughput Diagram',
                position: 'bottom'
            }
        }
    });
}

function plotScatterChart(){
    if (scatterChart != null){
        scatterChart.destroy();
    }
    var ctx = document.getElementById('scatterChart').getContext('2d');
    ctx.height = 400;
    ctx.width = 400;
    var labels = Object.keys(scatter_data);

    var ds = scatter_data;//Object.values(throughput_data);
    console.log(ds);

    var data = {
        labels: labels,
        datasets: [
        {
            label: 'Completed tasks',
            data: ds,
            backgroundColor: 'rgb(100, 149, 237)'
        }]
    };
    scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    min: 5,
                    max: last_day - 1,
                    ticks: {
                        autoSkip: false,
                        maxTicksLimit: 100,
                        stepSize: 1
                    }
                },
                y: {
                    type: 'linear',
                    suggestedMin: 0,
                    ticks: {
                        autoSkip: false,
                        stepSize: 1
                    }
                }
            },
            elements: {
                point: {
                    radius: 5
                }
            }
        },
    });
    //options: {
        //     title: {
        //         display: true,
        //         text: 'Cycle Time Scatterplot',
        //         position: 'bottom'
        //     },
        //     scales: {
        //         x: {
        //             min: FIRST_HALF_APPEARS,
        //             max: current_day
        //         }
        //     },
        //     elements: {
        //         point: {
        //             radius: 5
        //         }
        //     }
        // }
}