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
        fields = ['name', 'species', 'breed', 'age', 'allergies', 'personality', 'daily_routine', 'care_instructions']
        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'Pet name'
            }),
            'species': forms.TextInput(attrs={
                'placeholder': 'Species'
            }),
            'breed': forms.TextInput(attrs={
                'placeholder': 'Breed'
            }),
            'age': forms.NumberInput(attrs={
                'placeholder': 'Age'
            }),
            'allergies': forms.Textarea(attrs={
                'placeholder': 'Allergies(optional)',
            }),
            'personality': forms.Textarea(attrs={
                'placeholder': 'Personality(optional)',
            }),
            'daily_routine': forms.Textarea(attrs={
                'placeholder': 'Daily Routine(optional)',
            }),
            'care_instructions': forms.Textarea(attrs={
                'placeholder': 'Care Instructions(optional)',
            }),
        }


class VetVisitForm(forms.ModelForm):
    class Meta:
        model = VetVisit
        fields = ['pet', 'visit_date', 'reason', 'vet_name', 'description']
        widgets = {
            'visit_date': forms.DateInput(attrs={
                'type': 'date'
            }),
            'reason': forms.TextInput(attrs={
                'placeholder': 'Reason for visit'
            }),
            'vet_name': forms.TextInput(attrs={
                'placeholder': 'Veterinarian Name'
            }),
            'description': forms.Textarea(attrs={
                'placeholder': 'Description',
            }),
        }


class VaccinationForm(forms.ModelForm):
    class Meta: 
        model = Vaccination
        fields = ['pet', 'vaccine_name', 'date_administered', 'next_due_date']
        widgets = {
            'vaccine_name:' : forms.TextInput(attrs={
                'placeholder': 'Vaccine Name'
            }),
            'date_administered': forms.DateInput(attrs={
                'type': 'date'
            }),
            'next_due_date': forms.DateInput(attrs={
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

