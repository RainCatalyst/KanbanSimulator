# Generated by Django 3.1.3 on 2021-06-19 11:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0008_auto_20210619_1431'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='people',
        ),
    ]
