from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="home"),
    path('about', views.index, name="about"),
    path('board', views.board, name="board"),
    path('populate_backlog', views.populateBackLog, name="populateBackLog")
]
