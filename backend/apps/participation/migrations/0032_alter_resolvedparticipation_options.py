# Generated by Django 4.2 on 2023-09-22 15:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('participation', '0031_alter_participationmodel_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='resolvedparticipation',
            options={'verbose_name': 'Participation résolue', 'verbose_name_plural': 'Participations résolues'},
        ),
    ]
