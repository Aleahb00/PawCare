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
        return HttpResponseForbidden()
    form = PetForm(request.POST or None, instance=pet)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("pets")
    return render(request, "edit_pet.html", {"form": form})


def delete_pet_view(request: HttpRequest, pet_id) -> HttpResponse:
    Pet.objects.filter(id=pet_id).delete()
    return redirect('pets')




def vet_visits_view(request:HttpRequest, )->HttpResponse:
    visit = VetVisit.objects.filter(pet__owner=request.user)
    context = {
        'visit': visit,
    }
    return render(request, 'vetVisits.html', context)


def create_vet_visit_view(request:HttpRequest)->HttpResponse:
    if request.method == 'POST':
        form = VetVisitForm(request.POST)
        if form.is_valid():
            new_visit = form.save(commit=False)
            new_visit.pet = form.cleaned_data['pet']
            new_visit.save()
            return redirect('pets')
    else:
        form = VetVisitForm()
    form.fields["pet"].queryset = Pet.objects.filter(
        owner=request.user)
    return render(request, 'vetVisits.html', {'form': form})


def edit_vet_visit_view(request:HttpRequest, visit_id:int)->HttpResponse:
    visit = get_object_or_404(VetVisit, id=visit_id)
    if not visit.pet.owner == request.user:
        return HttpResponseForbidden()
    form = VetVisitForm(request.POST or None, instance=visit)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("vet-visits")
    return render(request, "edit_vetVisit.html", {"form": form})


def delete_vet_visit_view(request: HttpRequest, visit_id) -> HttpResponse:
    VetVisit.objects.filter(id=visit_id).delete()
    return redirect('vet-visits')




def vaccinations_view(request:HttpRequest)-> HttpResponse:
    vaccinations = Vaccination.objects.filter(pet__owner=request.user)
    context = {
        'vaccinations': vaccinations,
    }
    return render(request, 'vaccinations.html', context)


def create_vaccination_view(request:HttpRequest)-> HttpResponse:
    if request.method == 'POST':
        form = VaccinationForm(request.POST)
        if form.is_valid():
            new_vaccine = form.save(commit=False)
            new_vaccine.pet = form.cleaned_data['pet']
            new_vaccine.save()
            return redirect('vaccinations')
    else:
        form = VaccinationForm()
    form.fields["pet"].queryset = Pet.objects.filter(
        owner=request.user)
    return render(request, 'vaccinations.html', {'form': form})


def edit_vaccination_view(request:HttpRequest,vaccination_id:int)-> HttpResponse:
    vaccination = get_object_or_404(Vaccination, id=vaccination_id)
    if not vaccination.pet.owner == request.user:
        return HttpResponseForbidden()
    form = VaccinationForm(request.POST or None, instance=vaccination)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("vaccinations")
    return render(request, "edit_vaccination.html", {"form": form})


def delete_vaccination_view(request:HttpRequest,vaccination_id:int)-> HttpResponse:
    Vaccination.objects.filter(id=vaccination_id).delete()
    return redirect('vaccinations')



def community_view(request:HttpRequest)->HttpResponse:
    posts = CommunityPost.objects.all().order_by('-created_at')
    context = {
        'posts': posts,
    }
    return render(request, 'community.html', context)


def create_post_view(request:HttpRequest)->HttpResponse:
    if request.method == 'POST':
        form = CommunityPostForm(request.POST)
        if form.is_valid():
            new_post = form.save(commit=False)
            new_post.author = request.user
            new_post.save()
            return redirect('community')
    else:
        form = CommunityPostForm()
    return render(request, 'community.html', {'form': form})


def edit_post_view(request:HttpRequest, post_id:int)->HttpResponse:
    post = get_object_or_404(CommunityPost, id=post_id)
    if not post.author == request.user:
        return HttpResponseForbidden()
    form = CommunityPostForm(request.POST or None, instance=post)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("community")
    return render(request, "edit_post.html", {"form": form})


def delete_post_view(request:HttpRequest, post_id:int)->HttpResponse:
    CommunityPost.objects.filter(id=post_id).delete()
    return redirect('community')


def post_detail_view(request:HttpRequest, post_id:int)->HttpResponse:
    post = get_object_or_404(CommunityPost, id=post_id)
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author = request.user
            new_comment.post = post
            new_comment.save()
            return redirect('community')
    else:
        form = CommentForm() 
    return render(request, 'postDetails.html', {'post': post, 'form': form})


def comment_view(request:HttpRequest, post_id:int)->HttpResponse:
    pass





@login_required
def logout_view(request:HttpRequest)->HttpResponse:
    logout(request)
    return redirect('landing')

# SEARCH VIEW - TO BE IMPLEMENTED LATER (potentially for posts, visits, etc.)
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
