from django import forms
from django.forms import modelformset_factory
from .models import Player


class CreateRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм:', max_length=20,
                           widget=forms.TextInput(attrs={'placeholder': 'Введите свой никнейм'}))
    teams_num = forms.IntegerField(label='Количество команд:', min_value=0, max_value=10,
                                   widget=forms.NumberInput(attrs={'placeholder': 'Введите количество команд'}))
    wip_limit1 = forms.IntegerField(label='WIP лимит 1', min_value=1, max_value=10, initial=4)
    wip_limit2 = forms.IntegerField(label='WIP лимит 2', min_value=1, max_value=10, initial=4)
    wip_limit3 = forms.IntegerField(label='WIP лимит 3', min_value=1, max_value=10, initial=4)
    spectator = forms.BooleanField(label='Быть наблюдателем?', required=False)


class JoinRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм:', max_length=20,
                           widget=forms.TextInput(attrs={'placeholder': 'Введите свой никнейм'}))
    spectator = forms.BooleanField(label='Быть наблюдателем?', required=False)


PlayerFormSet = modelformset_factory(Player, fields=("id", "name", "team", "spectator"),
                                     widgets={'name': forms.HiddenInput(), 'id': forms.HiddenInput}, extra=0)
