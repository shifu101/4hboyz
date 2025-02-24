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

use Illuminate\Support\Facades\Http;

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
             'company_id' => 'nullable',
             'staff_number'=> 'nullable',
             'phone' => 'required',
             'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
             'password' => ['required', 'confirmed', Rules\Password::defaults()],
         ]);
     
         $user = User::create([
             'name' => $request->name,
             'email' => $request->email,
             'phone' => $request->phone,
             'staff_number' => $request->staff_number ?? null,
             'company_id'=>$request->company_id,
             'role_id' => $request->role_id,
             'password' => Hash::make($request->password),
         ]);
     
         // Send email
     
         event(new Registered($user));
     
         Auth::login($user);

         Mail::to($user->email)->send(new WelcomeMail($user));

         $this->sendSms($user->phone, "Hello {$user->name}, welcome to Centiflow Limited!");
     
         return redirect(RouteServiceProvider::HOME);
     }

     private function sendSms($phone, $message)
     {
        $apiUrl = config('services.bulk_sms.api_url');
        $apiKey = config('services.bulk_sms.api_key');
        $senderId = config('services.bulk_sms.sender_id');

        $response = Http::post($apiUrl, [
            'apiKey' => $apiKey,
            'senderId' => $senderId,
            'message' => $message,
            'recipients' => $phone,
        ]);

        if ($response->failed()) {
            \Log::error('SMS sending failed', ['response' => $response->body()]);
        }
    }

    
}
