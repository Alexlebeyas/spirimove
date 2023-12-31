# Generated by Django 4.2 on 2023-06-26 22:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('participation', '0009_alter_unapprovedparticipation_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='participationmodel',
            options={'ordering': ['-pk'], 'verbose_name': 'Participation', 'verbose_name_plural': 'Participations'},
        ),
        migrations.RemoveField(
            model_name='participationmodel',
            name='is_in_group',
        ),
        migrations.AlterField(
            model_name='participationmodel',
            name='image',
            field=models.ImageField(upload_to='uploads/%Y/%m/%d/'),
        ),
    ]
