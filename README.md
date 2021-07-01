# KanbanSimulator
First of all:
1) Go to the main directory(KanbanSimulator/kanban_simulator) by typing: 
```
cd kanban_simulator
```
2) Make sure you have already installed Django, otherwise
```
pip install django
```

To start the local server:
```
python manage.py runserver
```
## Migrations
To make migration file:
```
python manage.py makemigrations
```

To apply changes of migrations:
```
python manage.py migrate
```
## Admin
If you want to access admin panel:
```
python manage.py createsuperuser
```

---
If something isn't working, then try to change python to python3 or pip to pip3
