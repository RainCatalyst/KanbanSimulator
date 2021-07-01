from django import forms
from django.forms import modelformset_factory
from .models import Player


class CreateRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм.', max_length=20)
    teams_num = forms.IntegerField(label='Количество команд.', min_value=0, max_value=10)
    spectator = forms.BooleanField(label='Хотите ли вы быть наблюдателем?', required=False)


class JoinRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм.', max_length=20)
    spectator = forms.BooleanField(label='Хотите ли вы быть наблюдателем?', required=False)


PlayerFormSet = modelformset_factory(Player, fields=("team", "spectator"), extra=0)
