import json

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from .models import Room, Team, Day, Player, Card, Character, UserStory
from math import ceil
import random

NUMBER_OF_CHARACTERS = 7
CARDS_IN_GAME = 10


def index(request):
    return render(request, 'board/index.html')


@csrf_exempt
def board(request, player_id):
    player = Player.objects.get(pk=player_id)
    return render(request, 'board/board.html', {'player': player})


# temporary function for testing (board clearing and etc.)
def initial_conditions(team_id):
    team = Team.objects.get(pk=team_id)
    Card.objects.filter(team=team).update(column_number=0, row_number=0, analytic_completed=0,
                                          develop_completed=0, test_completed=0, ready_day=15)

    Character.objects.filter(team=team).delete()
    for i in range(7):
        character = Character(team=team, role=i)
        character.save()

    team.version = 0
    team.save()


# initial backlog population function
@csrf_exempt
def populateBackLog(request):
    if request.method == 'POST':
        # request_room = request.POST.get('room', 0)
        request_team = request.POST.get('team', 0)

        # testing purposes
        # initial_conditions(request_team)

        cards = Card.objects.filter(team=request_team).values('pk', 'title', 'age', 'is_expedite', 'ready_day',
                                                              'analytic_remaining', 'analytic_completed',
                                                              'develop_remaining', 'develop_completed',
                                                              'test_remaining', 'test_completed',
                                                              'column_number', 'row_number')

        return JsonResponse(
            {"cards": json.dumps(list(cards)), "team_effort": json.dumps(generate_random_effort_for_whole_team())},
            status=200)

    return JsonResponse({"error": ""}, status=400)


# .. in process
@csrf_exempt
def start_new_day(request):
    if request.method == 'POST':
        day_num = request.POST.get('day', 0)
        team_num = request.POST.get('team', 0)
        team = Team.objects.filter(team=team_num)
        completed_cards = request.POST.get('completed_cards', [])
        anl = 0
        dev = 0
        test = 0
        for card in completed_cards:
            if card["dep"] == "analytic":
                anl += 1
            elif card["dep"] == "devop":
                dev += 1
            else:
                test += 1

        day = Day(age=day_num, team=team, anl_completed_tasks=anl, dev_completed_tasks=dev, test_completed_tasks=test)
        day.save()


# function which generates random efforts for the characters
def generate_random_effort_for_whole_team():
    team_effort = []
    for i in range(NUMBER_OF_CHARACTERS):
        team_effort.append(random.randint(1, 6))
    return team_effort


# accepts actual position of the character and updates it in the db
@csrf_exempt
def move_card(request):
    if request.method == "POST":
        team = request.POST.get('team_id', -1)
        id = request.POST.get('id', -1)
        col = request.POST.get('col_num', -1)
        row = request.POST.get('row_num', -1)

        if team != - 1 and id != -1 and col != -1 and row != -1:
            Card.objects.filter(pk=id).update(column_number=col, row_number=row)
            old_version = Team.objects.get(pk=team).version
            Team.objects.filter(pk=team).update(version=old_version + 1)
            print("Card#", id, " was moved on column#", col, "row#", row)

    return JsonResponse({"Success": ""}, status=200)


# accepts actual position of the character and updates it in the db
@csrf_exempt
def move_player(request):
    if request.method == "POST":
        team_id = request.POST.get('team_id', -1)
        card_id = request.POST.get('card_id', -1)
        role = request.POST.get('role')

        if team_id != -1 and role != -1:
            team = Team.objects.get(pk=team_id)
            Character.objects.filter(team=team, role=role).update(card_id=card_id)
            team.version += 1
            team.save()
            print("Character was moved on card#", card_id)

    return JsonResponse({"Success": ""}, status=200)


# check board version
@csrf_exempt
def version_check(request):
    if request.method == "POST":
        input_version = request.POST.get('version', -1)
        input_team = request.POST.get('team_id', -1)
        server_team = Team.objects.get(pk=input_team)
        if int(server_team.version) > int(input_version):
            cards = Card.objects.filter(team=server_team).values('pk', 'title', 'age', 'is_expedite', 'ready_day',
                                                                 'analytic_remaining', 'analytic_completed',
                                                                 'develop_remaining', 'develop_completed',
                                                                 'test_remaining', 'test_completed',
                                                                 'column_number', 'row_number')
            characters = Character.objects.filter(team=server_team).values('role', 'card_id')
            board_info = {"version": server_team.version,
                          "Age": server_team.dayNum,
                          "Wip1": server_team.wip_limit1,
                          "Wip2": server_team.wip_limit2,
                          "Wip3": server_team.wip_limit3}
            return JsonResponse({"cards": json.dumps(list(cards)),
                                 "characters": json.dumps(list(characters)),
                                 "board_info": json.dumps(board_info), "SYN": False}, status=200)
        else:
            return JsonResponse({"SYN": True}, status=200)

    return JsonResponse({"Error": "error"}, status=400)


def create_room(request):
    new_room = Room()
    new_room.save()
    new_team = Team(game=new_room)
    new_team.save()
    new_player = Player(team=new_team, creator=True)
    new_player.save()
    return HttpResponseRedirect(reverse('board:waitingRoom', args=(new_player.pk,)))


def join_room(request, room_id):
    room = Room.objects.get(pk=room_id)
    team = Team.objects.filter(game=room)
    new_player = Player(team=team)
    new_player.save()
    return HttpResponseRedirect(reverse('board:waitingRoom', args=(new_player.pk,)))


def waiting_room(request, player_id):
    player = Player.objects.get(pk=player_id)
    return render(request, 'board/waiting_room.html', {'player': player})


def start_game(request, player_id):
    room = Player.objects.get(pk=player_id).team.game
    player_set = Team.objects.get(game=room).player_set.all()

    # creating teams
    team_num = ceil(len(player_set) ** 0.5)
    for i in range(team_num - 1):
        new_team = Team(game=room)
        new_team.save()

    # distributing players among teams
    team_set = room.team_set.all()
    i = 0
    for el in player_set:
        el.team = team_set[i]
        el.save()
        i = (i + 1) % team_num

    # creating cards

    # cards that will be actually used in the game
    cards_set = []

    # getting random set of cards
    chosen_indexes = set()
    user_stories = UserStory.objects.filter(is_expedite=False)

    for i in range(CARDS_IN_GAME):
        number_found = False
        while not number_found:
            j = random.randint(0, len(user_stories)-1)
            if j in chosen_indexes:
                continue

            cards_set.append(user_stories[j])
            chosen_indexes.add(j)
            number_found = True

    for team in team_set:
        # creating cards for each team
        row = 0
        for card in cards_set:
            new_card = Card(title=card.title, team=team, analytic_remaining=card.analytic_points,
                            develop_remaining=card.develop_points, test_remaining=card.test_points, row_number=row,
                            business_value=card.business_value)
            new_card.save()
            row = row + 1

        # creating characters for each team
        for i in range(7):
            character = Character(team=team, role=i)
            character.save()

    room.ready = True
    room.save()
    return HttpResponseRedirect(reverse('board:board', args=(player_id,)))


def join_game(request, player_id):
    player = Player.objects.get(pk=player_id)
    if player.team.game.ready:
        return HttpResponseRedirect(reverse('board:board', args=(player_id,)))


def rules(request):
    return render(request, 'board/rules.html')


# to be added
def news(request):
    return
