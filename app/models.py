from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Pet(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=100, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    personality = models.TextField(blank=True, null=True)
    daily_routine = models.TextField(blank=True, null=True)
    care_instructions = models.TextField(blank=True, null=True)
    

    def __str__(self):
        return f"{self.name} ({self.species})"


class VetVisit(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    visit_date = models.DateField()
    reason = models.CharField(max_length=25)
    vet_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.pet.name}"


class Vaccination(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    vaccine_name = models.CharField(max_length=100)
    date_administered = models.DateField()
    next_due_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.vaccine_name}"


class CommunityPost(models.Model):
    author = models.ManyToManyField(User)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    upvotes_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"