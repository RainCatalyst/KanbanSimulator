# Generated by Django 4.0.5 on 2022-07-05 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0011_team_business_value_sum'),
    ]

    operations = [
        migrations.AddField(
            model_name='day',
            name='anl_active_tasks',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='day',
            name='dev_active_tasks',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='day',
            name='test_active_tasks',
            field=models.IntegerField(default=0),
        ),
    ]
