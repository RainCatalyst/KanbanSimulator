from django import forms


class CreateRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм:', max_length=20, widget=forms.TextInput(attrs={'placeholder': 'Введите свой никнейм'}))
    teams_num = forms.IntegerField(label='Количество команд:', min_value=0, max_value=10, widget=forms.TextInput(attrs={'placeholder': 'Введите количество команд'}))
    spectator = forms.BooleanField(label='Быть наблюдателем?', required=False)


class JoinRoomForm(forms.Form):
    name = forms.CharField(label='Ваш никнейм:', max_length=20, widget=forms.TextInput(attrs={'placeholder': 'Введите свой никнейм'}))
    spectator = forms.BooleanField(label='Быть наблюдателем?', required=False)
