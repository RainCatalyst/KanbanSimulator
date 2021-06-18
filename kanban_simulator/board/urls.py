from django.urls import path
from . import views

app_name = 'board'
urlpatterns = [
    path('', views.index, name="home"),
    path('about', views.index, name="about"),
    path('board', views.board, name="board"),
    path('populate_backlog', views.populateBackLog, name="populateBackLog"),
    path('move_card', views.move_card),
    path('move_player', views.move_player),
    path('version_check', views.version_check)
]
