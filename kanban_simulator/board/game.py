from matplotlib.pyplot import scatter
from .models import Room, Team, Day, Player, Card, Character, UserStory
from .constants import *
import random
from collections import Counter

def generate_cards_set():
    # creating cards
    # cards that will be actually used in the game
    cards_set = []

    # getting random set of cards
    chosen_indexes = set()
    user_stories = UserStory.objects.filter(is_expedite=False)

    for i in range(CARDS_IN_GAME):
        number_found = False
        while not number_found:
            j = random.randint(0, len(user_stories) - 1)
            if j in chosen_indexes:
                continue

            cards_set.append(user_stories[j])
            chosen_indexes.add(j)
            number_found = True

    # generating expedite cards
    chosen_indexes.clear()
    user_stories = UserStory.objects.filter(is_expedite=True)
    for i in range(EXPEDITE_CARDS):
        number_found = False
        while not number_found:
            j = random.randint(0, len(user_stories) - 1)
            if j in chosen_indexes:
                continue

            cards_set.append(user_stories[j])
            chosen_indexes.add(j)
            number_found = True

    return cards_set

def generate_initial_conditions(cards_set):
    # generating initial conditions
    analytic_completed = []
    develop_completed = []
    test_completed = []
    for i in range(CARDS_IN_GAME):
        card = cards_set[i]
        if i > 5:
            analytic_completed.append(0)
            develop_completed.append(0)
            test_completed.append(0)
        elif i > 3:
            analytic_completed.append(card.analytic_points)
            develop_completed.append(card.develop_points)
            test_completed.append(random.randint(0, card.test_points - 1))
        elif i > 1:
            analytic_completed.append(card.analytic_points)
            develop_completed.append(random.randint(0, card.develop_points - 1))
            test_completed.append(0)
        else:
            analytic_completed.append(random.randint(0, card.analytic_points - 1))
            develop_completed.append(0)
            test_completed.append(0)

    return analytic_completed, develop_completed, test_completed
        
# function which is responsible for appropriate data structure and format for working with statistics
def form_data_for_statistics(server_team, cards):
    days = Day.objects.filter(team=server_team).order_by("age")
    bar_data = []
    line_data = []
    processed_days = []

    for day in days:
        if day.age not in processed_days:
            bar_data.append({str(day.age): day.test_completed_tasks})
            line_data.append(
                {str(day.age): [day.anl_completed_tasks, day.dev_completed_tasks, day.test_completed_tasks]})
        processed_days.append(day.age)

    throughput_data = dict(Counter([list(x.values())[0] for x in bar_data[FIRST_HALF_APPEARS - 1:]]))

    for day in range(processed_days[-1] + 1, LAST_DAY):
        bar_data.append({str(day): 0})

    scatter_data = []
    for card in cards:
        if card.ready_day != -1 and card.ready_day > 4:
            scatter_data.append({"x": card.ready_day, "y": card.ready_day - card.start_day})

    for i in range(1, len(line_data)):
        vals = list(line_data[i].values())[0]
        prev_vals = list(line_data[i - 1].values())[0]
        line_data[i] = {
            list(line_data[i].keys())[0]: [vals[0] + prev_vals[0],
                                           vals[1] + prev_vals[1],
                                           vals[2] + prev_vals[2]]}

    return bar_data, line_data, throughput_data, scatter_data