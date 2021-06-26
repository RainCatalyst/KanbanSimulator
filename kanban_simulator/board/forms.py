from django import forms


class CreateRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм.', max_length=20)
    teams_num = forms.IntegerField(label='Количество команд.')
    spectator = forms.BooleanField(label='Хотите ли вы быть наблюдателем?', required=False)


class JoinRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм.', max_length=20)
    spectator = forms.BooleanField(label='Хотите ли вы быть наблюдателем?', required=False)
