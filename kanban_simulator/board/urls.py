from django.urls import path
from django.views.generic.base import RedirectView
from . import views

app_name = 'board'
urlpatterns = [
    path('', views.index, name="home"),
    path('about', views.index, name="about"),
    path('board/<int:player_id>', views.board, name="board"),
    path('board/populate_backlog', views.populateBackLog, name="populateBackLog"),
    path('board/start_day', views.start_new_day, name="startDay"),
    path('board/move_card', views.move_card, name="moveCard"),
    path('board/move_player', views.move_player, name="movePlayer"),
    path('board/version_check', views.version_check, name="versionCheck"),
    path('<int:room_id>/join', views.join_room, name='join'),
    path('<int:player_id>/waiting_room', views.waiting_room, name='waitingRoom'),
    path('<int:player_id>/waiting_room/players_check', views.players_check, name="playersCheck"),
    path('<int:player_id>/manage_players', views.manage_players, name='managePlayers'),
    path('<int:player_id>/start_game', views.start_game, name='startGame'),
    path('<int:player_id>/join_game', views.join_game, name='joinGame'),
    path('rules', views.rules, name='rules'),

    # to be added
    path('news', views.news, name='news')
]
