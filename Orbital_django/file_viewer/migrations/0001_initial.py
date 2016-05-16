# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-16 00:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post_time', models.DateTimeField()),
                ('left_up_position_x', models.FloatField()),
                ('left_up_position_y', models.FloatField()),
                ('right_bottom_position_x', models.FloatField()),
                ('right_bottom_position_y', models.FloatField()),
                ('commenter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.User')),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=b'')),
                ('num_of_pages', models.IntegerField()),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.User')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='file_this_comment_belongs',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='file_viewer.File'),
        ),
    ]
