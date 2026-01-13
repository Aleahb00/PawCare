from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import *
from django.contrib.auth.models import User


class RegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, label='First Name', required=True)
    last_name = forms.CharField(max_length=30, label='Last Name', required=True)
    username = forms.CharField(max_length=40, label='Username', required=True)
    email = forms.EmailField(required=True)
    
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('first_name', 'last_name', 'username', 'email', 'password1', 'password2')


class PetForm(forms.ModelForm):
    class Meta:
        model = Pet
        fields = ['name','image', 'species', 'breed', 'age', 'allergies', 'personality', 'daily_routine', 'care_instructions']
        widgets = {
            'name': forms.TextInput(attrs={
                'class':'input',
                'placeholder': 'Pet name'
            }),
            'species': forms.TextInput(attrs={
                'class':'input',
                'placeholder': 'Species'
            }),
            'breed': forms.TextInput(attrs={
                'class':'input',
                'placeholder': 'Breed'
            }),
            'age': forms.NumberInput(attrs={
                'class':'input',
                'placeholder': 'Age'
            }),
            'allergies': forms.Textarea(attrs={
                'class':'input',
                'placeholder': 'Allergies(optional)',
            }),
            'personality': forms.Textarea(attrs={
                'class':'input',
                'placeholder': 'Personality(optional)',
            }),
            'daily_routine': forms.Textarea(attrs={
                'class':'input',
                'placeholder': 'Daily Routine(optional)',
            }),
            'care_instructions': forms.Textarea(attrs={
                'class':'input',
                'placeholder': 'Care Instructions(optional)',
            }),
        }


class VetVisitForm(forms.ModelForm):
    class Meta:
        model = VetVisit
        fields = ['pet', 'visit_date', 'reason', 'vet_name', 'description']
        widgets = {
            'pet': forms.Select(attrs={
                'class':'input',
            }),
            'visit_date': forms.DateInput(attrs={
                'class':'input',
                'type': 'date'
            }),
            'reason': forms.TextInput(attrs={
                'class':'input',
                'placeholder': 'Reason for visit'
            }),
            'vet_name': forms.TextInput(attrs={
                'class':'input',
                'placeholder': 'Veterinarian Name'
            }),
            'description': forms.Textarea(attrs={
                'class':'input',
                'placeholder': 'Description',
            }),
        }


class VaccinationForm(forms.ModelForm):
    class Meta: 
        model = Vaccination
        fields = ['pet', 'vaccine_name', 'date_administered', 'next_due_date']
        widgets = {
            'pet': forms.Select(attrs={
                'class':'input',
            }),
            'vaccine_name': forms.TextInput(attrs={
                'class':'input',
                'placeholder': 'Vaccine Name'
            }),
            'date_administered': forms.DateInput(attrs={
                'class':'input',
                'type': 'date'
            }),
            'next_due_date': forms.DateInput(attrs={
                'class':'input',
                'type': 'date'
            })
        }


class CommunityPostForm(forms.ModelForm):
    class Meta:
        model = CommunityPost
        fields = ['title', 'content']
        widgets = {
            'title': forms.TextInput(attrs={
                'placeholder': 'Post Title'
            }),
            'content': forms.Textarea(attrs={
                'placeholder': 'Write your post here...'
            }),
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'placeholder': 'write your comment here...'
            })
        }

