# Generated by Django 4.2.2 on 2023-07-15 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_comment', '0002_alter_comment_author_alter_comment_post'),
        ('core_user', '0005_user_posts_liked'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='comments_liked',
            field=models.ManyToManyField(related_name='commented_by', to='core_comment.comment'),
        ),
    ]
