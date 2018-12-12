# Generated by Django 2.1.3 on 2018-12-12 18:46

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0009_alter_user_last_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Email')),
                ('image', models.ImageField(blank=True, null=True, upload_to='', verbose_name='Image')),
                ('height', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0)], verbose_name='Height')),
                ('prime_expiration_date', models.DateField(blank=True, null=True, verbose_name='Prime account expiration date')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Furniture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=16, unique=True, validators=[django.core.validators.RegexValidator(message='Code should have only latin symbols and numbers.', regex='^\\w+$')], verbose_name='Code')),
                ('brand', models.SlugField(max_length=64, verbose_name='Brand')),
                ('type', models.CharField(choices=[('chair', 'Chair'), ('desk', 'Desk'), ('sofa', 'Sofa'), ('table', 'Table'), ('bed', 'Bed'), ('cupboard', 'Cupboard')], max_length=32, verbose_name='Type')),
                ('is_public', models.BooleanField(verbose_name='Is public')),
                ('allowed_users', models.ManyToManyField(related_name='allowed_furniture', to=settings.AUTH_USER_MODEL, verbose_name='Allowed users')),
            ],
            options={
                'verbose_name': 'Furniture',
                'verbose_name_plural': 'Furniture',
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='Content')),
                ('date', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Date')),
                ('pending', models.BooleanField(default=True, verbose_name='Pending')),
                ('furniture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='smartfurnitureapi.Furniture', verbose_name='Furniture')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_notifications', to=settings.AUTH_USER_MODEL, verbose_name='Receiver')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_notifications', to=settings.AUTH_USER_MODEL, verbose_name='Sender')),
            ],
            options={
                'verbose_name': 'Notification',
                'verbose_name_plural': 'Notifications',
            },
        ),
        migrations.CreateModel(
            name='Options',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('chair', 'Chair'), ('desk', 'Desk'), ('sofa', 'Sofa'), ('table', 'Table'), ('bed', 'Bed'), ('cupboard', 'Cupboard')], max_length=32, verbose_name='Type')),
                ('name', models.CharField(max_length=32, verbose_name='Name')),
                ('height', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0)], verbose_name='Height')),
                ('length', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0)], verbose_name='Length')),
                ('width', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0)], verbose_name='Width')),
                ('incline', models.FloatField(default=95, validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(180.0)], verbose_name='Incline')),
                ('rigidity', models.CharField(choices=[('soft', 'Soft'), ('medium', 'Medium'), ('solid', 'Solid')], default='medium', max_length=32, verbose_name='Rigidity')),
                ('temperature', models.FloatField(default=36.6, verbose_name='Temperature')),
                ('massage', models.CharField(choices=[('none', 'None'), ('slow', 'Slow'), ('medium', 'Medium'), ('rapid', 'Rapid')], default='none', max_length=32, verbose_name='Massage')),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Creator')),
            ],
            options={
                'verbose_name': 'Options',
                'verbose_name_plural': 'Options',
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='Content')),
                ('rating', models.IntegerField(default=1, validators=[django.core.validators.MaxValueValidator(5), django.core.validators.MinValueValidator(1)], verbose_name='Rating')),
                ('date', models.DateTimeField(default=django.utils.timezone.now)),
                ('furniture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='smartfurnitureapi.Furniture', verbose_name='Furniture')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Review',
                'verbose_name_plural': 'Reviews',
            },
        ),
        migrations.AddField(
            model_name='furniture',
            name='current_options',
            field=models.ManyToManyField(to='smartfurnitureapi.Options', verbose_name='Options'),
        ),
        migrations.AddField(
            model_name='furniture',
            name='current_users',
            field=models.ManyToManyField(related_name='current_furniture', to=settings.AUTH_USER_MODEL, verbose_name='Current users'),
        ),
        migrations.AddField(
            model_name='furniture',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_furniture', to=settings.AUTH_USER_MODEL, verbose_name='Owner'),
        ),
    ]
