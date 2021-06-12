import json

from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Room, Team, Day, Player, Card
# Create your views here.


def index(request):
    return render(request, 'board/index.html')


@csrf_exempt
def board(request):
    return render(request, 'board/board.html')


@csrf_exempt
def populateBackLog(request):
    if request.method == 'POST':
        request_room = request.POST.get('room', 0)
        request_team = request.POST.get('team', 0)
        cards = Card.objects.filter(team=request_team)
        print("Length: ", len(cards))
        data = serializers.serialize('json', list(cards), fields=('title', 'age', 'is_expedite', 'ready_day'
                                                                  'analytic_remaining', 'analytic_completed',
                                                                  'develop_remaining', 'develop_completed',
                                                                  'test_remaining', 'test_completed'))
        return JsonResponse({"cards": data}, status=200)

    return JsonResponse({"error": ""}, status=400)