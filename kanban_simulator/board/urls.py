from django.urls import path
from . import views

app_name = 'board'
urlpatterns = [
    path('home', views.index, name="home"),
    path('about', views.index, name="about"),
    path('<int:player_id>/board', views.board, name="board"),
    path('populate_backlog', views.populateBackLog, name="populateBackLog"),
    path('move_card', views.move_card),
    path('move_player', views.move_player),
    path('version_check', views.version_check),
    path('create_room', views.create_room, name="createRoom"),
    path('<int:room_id>/join', views.join_room, name='join'),
    path('<int:player_id>/waiting_room', views.waiting_room, name='waitingRoom'),
    path('<int:player_id>/start_game', views.start_game, name='startGame'),
    path('<int:player_id>/join_game', views.join_game, name='joinGame'),
    path('rules', views.rules, name='rules'),

    # to be added
    path('news', views.news, name='news')
]
