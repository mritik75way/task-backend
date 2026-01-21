from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()

@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if User.objects.filter(email=data["email"]).exists():
            messages.error(request, "Email already registered")
            return redirect("register")

        user = User.objects.create_user(
            email=data["email"],
            password=data["password"],
            full_name=data.get("full_name", "")
        )
        messages.success(request, "Account created. Please login.")
        return redirect("login")

    return render(request, "accounts/register.html")

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        
        user = authenticate(
            request,
            email=request.POST.get("email"),
            password=request.POST.get("password")
        )

        if user is not None:
            login(request, user)
            return redirect("/")  
        else:
            messages.error(request, "Invalid email or password")

    return render(request, "accounts/login.html")


def logout_view(request):
    logout(request)
    return redirect("login")
