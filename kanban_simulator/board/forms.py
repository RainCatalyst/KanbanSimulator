from django import forms
from django.forms import modelformset_factory
from .models import Player


class CreateRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм:', max_length=20,
                           widget=forms.TextInput(attrs={'placeholder': 'Введите свой никнейм'}))
    teams_num = forms.IntegerField(label='Количество команд:', min_value=0, max_value=10,
                                   widget=forms.NumberInput(attrs={'placeholder': 'Введите количество команд'}))
    spectator = forms.BooleanField(label='Быть наблюдателем?', required=False)


class JoinRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм:', max_length=20,
                           widget=forms.TextInput(attrs={'placeholder': 'Введите свой никнейм'}))
    spectator = forms.BooleanField(label='Быть наблюдателем?', required=False)


PlayerFormSet = modelformset_factory(Player, fields=("name", "team", "spectator"),
                                     widgets={'name': forms.HiddenInput()}, extra=0)
