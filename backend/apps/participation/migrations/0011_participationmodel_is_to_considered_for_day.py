# Generated by Django 4.2 on 2023-06-27 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('participation', '0010_alter_participationmodel_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='participationmodel',
            name='is_to_considered_for_day',
            field=models.BooleanField(default=False),
        ),
    ]