# Generated by Django 4.2 on 2023-09-21 19:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('participation', '0030_delete_approveparticipation_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='participationmodel',
            options={'ordering': ['-date_created', '-id'], 'verbose_name': 'Participation', 'verbose_name_plural': 'Participations'},
        ),
        migrations.AlterModelOptions(
            name='pendingparticipation',
            options={'verbose_name': 'Participation en attente', 'verbose_name_plural': 'Participations en attente'},
        ),
        migrations.AlterModelOptions(
            name='resolvedparticipation',
            options={'verbose_name': 'Participation résolu', 'verbose_name_plural': 'Participations résolu'},
        ),
    ]
