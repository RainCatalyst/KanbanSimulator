# Generated by Django 4.0.5 on 2022-07-05 09:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0012_day_anl_active_tasks_day_dev_active_tasks_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='day',
            name='done_active_tasks',
            field=models.IntegerField(default=0),
        ),
    ]
