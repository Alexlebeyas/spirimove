# Generated by Django 4.2 on 2023-06-21 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('participation', '0003_alter_participationmodel_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='participationmodel',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
