from django.shortcuts import render, redirect, get_object_or_404
from django.http.response import HttpResponse
from django.http.request import HttpRequest
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import *
from django.contrib import messages
from django.db.models import Q
from .models import *
from .forms import *
# from .functions import *


# Create your views here.
def landing_view(request:HttpRequest)->HttpResponse:
    return render(request, 'landing.html')


def register_view(request:HttpRequest)->HttpResponse:
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # UserProfile.objects.create(user=user)
            login(request,user)
            return redirect('pets')
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form':form})


def login_view(request:HttpRequest)->HttpResponse:
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('pets')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form':form})


def pets_view(request:HttpRequest)->HttpResponse:
    pets = Pet.objects.filter(owner=request.user)
    context = {
        'pets': pets,
    }
    print(pets)
    return render(request, 'pets.html', context)


def add_pet_view(request:HttpRequest)->HttpResponse:
    if request.method == 'POST':
        form = PetForm(request.POST)
        if form.is_valid():
            new_pet = form.save(commit=False)
            new_pet.owner = request.user
            new_pet.save()
            return redirect('pets')
    else:
        form = PetForm()
    return render(request, 'pets.html', {'form': form})


def edit_pet_view(request:HttpRequest, pet_id:int)->HttpResponse:
    pet = get_object_or_404(Pet, id=pet_id)
    if not pet.owner == request.user:
        return HttpResponseForbidden("You are not allowed to edit this pet.")
    form = PetForm(request.POST or None, instance=pet)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("pets")
    return render(request, "pets.html", {"form": form})


@login_required
def logout_view(request:HttpRequest)->HttpResponse:
    logout(request)
    return redirect('landing')


# def search_view(request:HttpRequest)->HttpResponse:
#     query = request.GET.get('q') 
#     results = Course.objects.all()
#     if query:
#         results = results.filter(Q(title__icontains=query))
#     else:
#         results = Course.objects.none() 
#     context = {
#         'results': results,
#         'query': query,
#     }
#     return render(request, 'teacher_dashboard.html', context)
