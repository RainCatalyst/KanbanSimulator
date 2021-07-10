from django.db import models


# Create your models here.

class Room(models.Model):
    ready = models.BooleanField(default=False)
    started = models.BooleanField(default=False)
    version = models.IntegerField(default=0)


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
    wip1 = models.IntegerField(name='wip_limit1', default=4)
    wip2 = models.IntegerField(name='wip_limit2', default=4)
    wip3 = models.IntegerField(name='wip_limit3', default=4)

    def __str__(self):
        return self.name + '. ID комнаты: ' + str(self.game.pk)


# Primary usage - statistics (graph plotting)
class Day(models.Model):
    # Age of the day (it's actually counter from the initial date)
    age = models.IntegerField()
    # id of the correspondent team
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    # Amount of completed tasks oby Analytics, Devops, Testers respectively
    anl_completed_tasks = models.IntegerField()
    dev_completed_tasks = models.IntegerField()
    test_completed_tasks = models.IntegerField()

    def __str__(self):
        return 'ID: ' + str(self.pk) + '. ' + self.team.__str__()


class Player(models.Model):
    # nickname
    name = models.CharField(max_length=20, default='name')
    # id of the correspondent team
    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name='Команда игрока')
    # is the player spectator
    spectator = models.BooleanField(default=False, verbose_name='Является ли игрок наблюдателем')
    # is the player creator of a room
    creator = models.BooleanField(default=False)

    def __str__(self):
        return 'Никнейм: ' + self.name + '. ID: ' + str(self.pk) + '. ' + self.team.__str__()


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


class UserStory(models.Model):
    # Card title
    title = models.CharField(max_length=20)

    # Expedite factor
    is_expedite = models.BooleanField(default=False)

    analytic_points = models.IntegerField()
    develop_points = models.IntegerField()
    test_points = models.IntegerField()

    business_value = models.IntegerField()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'User Stories'


class Card(models.Model):
    # Card title
    title = models.CharField(max_length=20, null=True)

    # id of the correspondent team
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    # day when cart is added to backlog
    start_day = models.IntegerField(null=True)
    # age of the current card
    age = models.IntegerField(default=0)
    # Expedite factor
    is_expedite = models.BooleanField(default=False)
    # Day when card was completed (used for statistics, particularly for Lead Time Distribution Chart)
    ready_day = models.IntegerField(default=-1)

    # Amount of remaining and completed points in the Analytic, Devop, Test lines respectively
    analytic_remaining = models.IntegerField()
    analytic_completed = models.IntegerField(default=0)

    develop_remaining = models.IntegerField()
    develop_completed = models.IntegerField(default=0)

    test_remaining = models.IntegerField()
    test_completed = models.IntegerField(default=0)

    column_number = models.IntegerField(default=0)
    row_number = models.IntegerField(default=0)

    business_value = models.IntegerField(null=True)

    def __str__(self):
        return self.title + '. ' + self.team.__str__()
