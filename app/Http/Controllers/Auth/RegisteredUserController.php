<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

     public function store(Request $request): RedirectResponse
     {
         $request->validate([
             'name' => 'required|string|max:255',
             'role_id' => 'required',
             'phone' => 'required',
             'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
             'password' => ['required', 'confirmed', Rules\Password::defaults()],
         ]);
     
         $user = User::create([
             'name' => $request->name,
             'email' => $request->email,
             'phone' => $request->phone,
             'role_id' => $request->role_id,
             'password' => Hash::make($request->password),
         ]);
     
         // Send email
     
         event(new Registered($user));
     
         Auth::login($user);

         Mail::to($user->email)->send(new WelcomeMail($user));
     
         return redirect(RouteServiceProvider::HOME);
     }
    
}
