from django.db import models


# Create your models here.

class Room(models.Model):
    # number of people in particular the game
    people = models.IntegerField()


class Team(models.Model):
    # name of the team
    name = models.CharField(max_length=30)
    # id of the correspondent game/room
    game = models.ForeignKey(Room, on_delete=models.CASCADE)
    # version of the board
    version = models.IntegerField(default=0)
    # current game day
    dayNum = models.IntegerField(default=1)

    # WIP limits for Analytics, Devops, Testers respectively
    wip1 = models.IntegerField(name='wip_limit1')
    wip2 = models.IntegerField(name='wip_limit2')
    wip3 = models.IntegerField(name='wip_limit3')


# Primary usage - statistics (graph plotting)
class Day(models.Model):
    # Age of the day (it's actually counter from the initial date)
    age = models.IntegerField()
    # id of the correspondent team
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    # Amount of completed tasks oby Analytics,Devops, Testers respectively
    anl_completed_tasks = models.IntegerField()
    dev_completed_tasks = models.IntegerField()
    test_completed_tasks = models.IntegerField()


class Player(models.Model):
    # id of the correspondent team
    team = models.ForeignKey(Team, on_delete=models.CASCADE)


class Character(models.Model):
    # Correspondent team
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    # roles
    # (0...1) analytics
    # (2...4) developers
    # (5..6) testers
    role = models.IntegerField(default=0)
    # if it's -1 then character locates at common character position
    # otherwise it locates above the correspondent card
    card_id = models.IntegerField(default=-1)


class Card(models.Model):
    # Card title
    title = models.CharField(max_length=20)
    # id of the correspondent team
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    # age of the current card
    age = models.IntegerField(default=0)
    # Expedite factor
    is_expedite = models.BooleanField(default=False)
    # Day when card was completed (used for statistics, particularly for Lead Time Distribution Chart)
    ready_day = models.IntegerField(default=15)

    # Amount of remaining and completed points in the Analytic, Devop, Test lines respectively
    analytic_remaining = models.IntegerField()
    analytic_completed = models.IntegerField(default=0)

    develop_remaining = models.IntegerField()
    develop_completed = models.IntegerField(default=0)

    test_remaining = models.IntegerField()
    test_completed = models.IntegerField(default=0)

    column_number = models.IntegerField(default=0)
    row_number = models.IntegerField(default=0)
