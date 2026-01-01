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
                'placeholder': 'Allergies',
                'rows': 3
            }),
            'personality': forms.Textarea(attrs={
                'placeholder': 'Personality',
                'rows': 3
            }),
            'daily_routine': forms.Textarea(attrs={
                'placeholder': 'Daily Routine',
                'rows': 3
            }),
            'care_instructions': forms.Textarea(attrs={
                'placeholder': 'Care Instructions',
                'rows': 3
            }),
        }