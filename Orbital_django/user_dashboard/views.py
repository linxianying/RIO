from django.shortcuts import render
from django.contrib.auth import logout, get_user
from django.shortcuts import redirect

def handle_log_out(request):
    logout(request)
    return redirect("home")

def display_user_dashboard(request):
    current_user = get_user(request)
    return render(request, "user_dashboard/user_dashboard_page.html", {"current_user": current_user})
