# Generated by Django 4.2 on 2023-09-12 11:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('participation', '0025_drawmodel_total_days'),
    ]

    operations = [
        migrations.AddField(
            model_name='levelmodel',
            name='name_en',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='levelmodel',
            name='name_fr',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='participationtypemodel',
            name='name_en',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='participationtypemodel',
            name='name_fr',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
