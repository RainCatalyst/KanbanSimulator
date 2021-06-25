from django.contrib import admin
from .models import Room, Team, Day, Player, Card, Character, UserStory

# Register your models here.

admin.site.register(Room)
admin.site.register(Team)
admin.site.register(Day)
admin.site.register(Player)
admin.site.register(Card)
admin.site.register(Character)
admin.site.register(UserStory)


