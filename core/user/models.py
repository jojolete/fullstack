from django.db import models

import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from core.abstract.models import AbstractManager, AbstractModel

def user_directory_path(instance, filename):
        return "user_{0}/{1}".format(instance.public_id, filename)

class UserManager(BaseUserManager, AbstractManager):

    def create_user(self, username, email, password=None, **kwargs):
        if username is None:
            raise TypeError('Users must have username')
        if email is None: 
            raise TypeError("users must have an email dummy")
        if password is None:
            raise TypeError("User must have password")
        user = self.model(username=username,
                        email=self.normalize_email(email,),
                          **kwargs)
        
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, username, email, password, **kwargs):
        if username is None:
            raise TypeError('Users must have username')
        if email is None: 
            raise TypeError("users must have an email dummy")
        if password is None:
            raise TypeError("User must have password")
        
        user = self.create_user(username, email, password, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser, AbstractModel, PermissionsMixin):

    username = models.CharField(db_index= True, max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    bio = models.TextField(null=True)
    avatar = models.ImageField(null=True, blank=True,
                                upload_to=user_directory_path)

    posts_liked = models.ManyToManyField("core_label.Post",
                                        related_name="liked_by")
    
    comments_liked = models.ManyToManyField(
        "core_comment.Comment", related_name="commented_by"
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = UserManager()

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"
    
    def like(self, post):
        return self.posts_liked.add(post)
    
    def remove_like(self,post):
        return self.posts_liked.remove(post)
    
    def has_liked(self, post):
        return self.posts_liked.filter(pk = post.pk).exists()
    
    def like_comment(self, comment):
        """Like `comment` if it hasn't been done yet"""
        return self.comments_liked.add(comment)

    def remove_like_comment(self, comment):
        """Remove a like from a `comment`"""
        return self.comments_liked.remove(comment)

    def has_liked_comment(self, comment):
        """Return True if the user has liked a `comment`; else False"""
        return self.comments_liked.filter(pk=comment.pk).exists()

    def __str__(self):
        return f"{self.email}"
    
    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

