# Generated by Django 4.2 on 2023-09-18 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contest', '0004_contestsmodel_name_en_contestsmodel_name_fr'),
    ]

    operations = [
        migrations.AddField(
            model_name='contestsmodel',
            name='show_winners',
            field=models.BooleanField(default=False),
        ),
        migrations.AddConstraint(
            model_name='contestsmodel',
            constraint=models.UniqueConstraint(condition=models.Q(('is_open', True)), fields=('is_open',), name='Only one contest can be set to True at a time'),
        ),
    ]
