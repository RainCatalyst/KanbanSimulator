from django.urls import path
from . import views

app_name = 'board'
urlpatterns = [
    path('home', views.index, name="home"),
    path('about', views.index, name="about"),
    path('<int:team_id>/board', views.board, name="board"),
    path('populate_backlog', views.populateBackLog, name="populateBackLog"),
    path('move_card', views.move_card),
    path('move_player', views.move_player),
    path('version_check', views.version_check),
    path('create_room', views.create_room, name="createRoom"),
    path('waiting_room', views.waiting_room, name='waitingRoom'),

    # to be added
    path('rules', views.rules, name='rules'),
    path('news', views.news, name='news')
]
