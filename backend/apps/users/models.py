from django.db import models
from django.contrib.auth.models import Group, AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _



# manager for our custom model
class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError(_('The given email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self._create_user(email, password, **extra_fields)


class Role(models.Model):
    class Meta:
        verbose_name = _('Role')
        verbose_name_plural = _('Roles')

    ADMIN = 'ADMIN'
    MODERATOR = 'MODERATOR'
    PARTICIPANT = 'PARTICIPANT'
    ROLE_CHOICES = [
        (ADMIN, _('Admin')),
        (MODERATOR, _('Moderator')),
        (PARTICIPANT, _('Partcipant'))
    ]

    def __str__(self):
        return self.role
    role = models.CharField(_('Role'), choices=ROLE_CHOICES, max_length=50, unique=True)
    is_default = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)
    def save(self, *args, **kwargs):
        super(Role, self).save(*args, **kwargs)
        Group.objects.get_or_create(name=self.role)


class User(AbstractUser):
    """
      Custom user class inheriting AbstractBaseUser class
    """
    username = None
    email = models.EmailField(_('email address'), max_length=60, unique=True)
    phone = models.CharField(_('Phone'), max_length=256, null=True, blank=True)
    office = models.CharField(_('Office'), max_length=256, null=True, blank=True)
    display_name = models.CharField(_('Display Name'), max_length=256, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile/%Y/%m/%d/', null=True, blank=True)
    roles = models.ManyToManyField(Role, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)
        self.groups.clear()
        # Handle default groupe
        if not self.roles.count():
            default_role = Role.objects.filter(is_default=True).first()
            group, created = Group.objects.get_or_create(name=default_role.role)
            self.groups.add(group)
        else:
            for role in self.roles.all():
                group, created = Group.objects.get_or_create(name=role.role)
                self.groups.add(group)

    def __str__(self):
        return self.email

    def is_admin(self):
        return self.groups.filter(name=Role.ADMIN).exists()

    def is_moderator(self):
        return self.groups.filter(name=Role.MODERATOR).exists()

    def is_participant(self):
        return self.groups.filter(name=Role.PARTICIPANT).exists()
