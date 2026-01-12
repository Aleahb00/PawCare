from django.shortcuts import render, redirect, get_object_or_404
from django.http.response import HttpResponse
from django.http.request import HttpRequest
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import *
from django.contrib import messages
from django.db.models import Q
from .models import *
from .forms import *
from django.template.loader import get_template
# from xhtml2pdf import pisa 
# from .functions import *


# Create your views here.
# NOTE SETUP VIEWS
def landing_view(request:HttpRequest)->HttpResponse:
    return render(request, 'landing.html')


def register_view(request:HttpRequest)->HttpResponse:
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
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


# NOTE PET VIEWS
@login_required
def pets_view(request: HttpRequest) -> HttpResponse:
    pets = Pet.objects.filter(owner=request.user)
    pet_id = request.GET.get("pet")
    selected_pet = None
    form = PetForm()  

    if pet_id:
        selected_pet = pets.filter(id=pet_id).first()
        if selected_pet:
            form = PetForm(instance=selected_pet)  # pre-filled form

    # adding a new pet
    if request.method == 'POST':
        form = PetForm(request.POST)
        if form.is_valid():
            new_pet = form.save(commit=False)
            new_pet.owner = request.user
            new_pet.save()
            return redirect('pets')

    return render(request, 'pets.html', {'pets': pets,'form': form,'selected_pet': selected_pet})

    return render(request, 'pets.html', {
        'pets': pets,
        'form': form,
        'selected_pet': selected_pet
    })


# NOTE VIEWS FOR ALL PET ACTIONS
def add_pet_view(request:HttpRequest)->HttpResponse:
    if request.method == 'POST':
        form = PetForm(request.POST)
        if form.is_valid():
            new_pet = form.save(commit=False)
            new_pet.owner = request.user
            new_pet.save()
            return redirect('pets')
    return redirect('pets')

@login_required
def edit_pet_view(request:HttpRequest, pet_id:int)->HttpResponse:
    pet = get_object_or_404(Pet, id=pet_id)

    if not pet.owner == request.user:
        raise PermissionDenied

    form = PetForm(request.POST or None, instance=pet)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("pets")
    return redirect('pets')

@login_required
def delete_pet_view(request: HttpRequest, pet_id) -> HttpResponse:
    Pet.objects.filter(id=pet_id).delete()
    return redirect('pets')

@login_required
def pet_print_view(request, pet_id):
    pet = Pet.objects.filter(id=pet_id).delete()
    return render(request, 'pets.html', {'pet': pet})


# NOTE VET VISIT VIEWS
@login_required
def vet_visits_view(request:HttpRequest)->HttpResponse:
    visit = VetVisit.objects.filter(pet__owner=request.user)
    if request.method == 'POST':
        form = VetVisitForm(request.POST)
        if form.is_valid():
            new_visit = form.save(commit=False)
            new_visit.pet = form.cleaned_data['pet']
            new_visit.save()
            messages.success(request, 'Visit saved successfully!')
            return redirect('vet-visits')
    else:
        form = VetVisitForm()
    form.fields["pet"].queryset = Pet.objects.filter(
        owner=request.user)
    return render(request, 'vetVisits.html', {'visit': visit,'form':form })

@login_required
def edit_vet_visit_view(request:HttpRequest, visit_id:int)->HttpResponse:
    visit = get_object_or_404(VetVisit, id=visit_id)
    if not visit.pet.owner == request.user:
        raise PermissionDenied
    form = VetVisitForm(request.POST or None, instance=visit)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("vet-visits")
    return render(request, "edit_vetVisit.html", {"form": form})

@login_required
def delete_vet_visit_view(request: HttpRequest, visit_id) -> HttpResponse:
    VetVisit.objects.filter(id=visit_id).delete()
    return redirect('vet-visits')


# NOTE VACCINATION VIEWS 
@login_required
def vaccinations_view(request:HttpRequest)-> HttpResponse:
    vaccinations = Vaccination.objects.filter(pet__owner=request.user)
    upcoming_vaccinations = [
        v for v in vaccinations
        if v.next_due_date and (v.next_due_date -  timezone.now().date()).days <= 14
    ]
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
    return render(request, 'vaccinations.html', {'vaccinations':vaccinations, 'form':form})


@login_required
def edit_vaccination_view(request:HttpRequest,vaccination_id:int)-> HttpResponse:
    vaccination = get_object_or_404(Vaccination, id=vaccination_id)
    if not vaccination.pet.owner == request.user:
        raise PermissionDenied
    form = VaccinationForm(request.POST or None, instance=vaccination)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("vaccinations")
    return render(request, "edit_vaccination.html", {"form": form})

@login_required
def delete_vaccination_view(request:HttpRequest,vaccination_id:int)-> HttpResponse:
    Vaccination.objects.filter(id=vaccination_id).delete()
    return redirect('vaccinations')


# NOTE COMMUNITY / POST VIEWS
@login_required
def community_view(request:HttpRequest)->HttpResponse:
    posts = CommunityPost.objects.all().order_by('-created_at')
    query = request.GET.get('q') 
    results = CommunityPost.objects.all()
    if query:
        posts = results.filter(Q(title__icontains=query))
    else:
        results = CommunityPost.objects.none()
    if request.method == 'POST':
        form = CommunityPostForm(request.POST)
        if form.is_valid():
            new_post = form.save(commit=False)
            new_post.author = request.user
            new_post.save()
            return redirect('community')
    else:
        form = CommunityPostForm()
    return render(request, 'community.html', {'posts':posts, 'form':form, 'query':query})


@login_required
def edit_post_view(request:HttpRequest, post_id:int)->HttpResponse:
    post = get_object_or_404(CommunityPost, id=post_id)
    if not post.author == request.user:
        raise PermissionDenied
    form = CommunityPostForm(request.POST or None, instance=post)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("community")
    return render(request, "edit_post.html", {"form": form})

@login_required
def delete_post_view(request:HttpRequest, post_id:int)->HttpResponse:
    CommunityPost.objects.filter(id=post_id).delete()
    return redirect('community')


@login_required
def post_detail_view(request:HttpRequest, post_id:int)->HttpResponse:
    post = get_object_or_404(CommunityPost, id=post_id)
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author = request.user
            new_comment.post = post
            new_comment.save()
            return redirect(request.path_info)
    else:
        form = CommentForm() 
    return render(request, 'postDetails.html', {'post': post, 'form': form})

@login_required
def delete_comment_view(request:HttpRequest, comment_id:int)->HttpResponse:
    Comment.objects.filter(id=comment_id).delete()
    return redirect('community')


# NOTE ERROR VIEW
def error_view(request:HttpRequest)->HttpResponse:
    return render(request, '403.html', status=403)

# NOTE LOGOUT VIEW 
@login_required
def logout_view(request:HttpRequest)->HttpResponse:
    logout(request)
    return redirect('landing')




# NOTE EXTRA VIEWS (TO BE REMOVED UPON COMPLETION)
# def download_pdf(request):
#     # Fetch data
#     pets = Pet.objects.filter(owner=request.user)
#     context = {'pets': pets}
#     template = get_template('pets.html')
#     html = template.render(context)

#     response = HttpResponse(content_type='application/pdf')
#     response['Content-Disposition'] = 'attachment; filename="report.pdf"'

#     pisa_status = pisa.CreatePDF(html, dest=response) # For xhtml2pdf

#     if pisa_status.err:
#         return HttpResponse('Error generating PDF', status=500)

#     return response



