from .models import Room, Team, Day, Player, Card, Character, UserStory
from .constants import *
import random

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
        
    