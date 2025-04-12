<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Employee;

use Illuminate\Support\Facades\Log;

use App\Services\SmsService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */

     protected $smsService;
 
     public function __construct(SmsService $smsService = null)
     {
         $this->smsService = $smsService;
     }

    public function edit(Request $request): Response
    {
        $user = Auth::user();
        $employee = null; 
    
        if ($user->role_id == 3) {
            $employee = Employee::where('user_id', '=', $user->id)->first();
        }
    
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'employee' => $employee, 
        ]);
    }

    public function updatePhone(Request $request): Response
    {
        $user = Auth::user();
        $employee = null; 
    
        if ($user->role_id == 3) {
            $employee = Employee::where('user_id', '=', $user->id)->first();
        }
    
        return Inertia::render('UpdatePhone', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'employee' => $employee, 
        ]);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $otp = rand(100000, 999999);

        $user = auth()->user();
        $user->phone = $request->phone;
        $user->otp = $otp;
        $user->save();

        $employee = null; 
    
        if ($user->role_id == 3) {
            $employee = Employee::where('user_id', '=', $user->id)->first();
        }

        $this->smsService->sendSms(
            $user->phone, 
            "Hello {$user->name}, Your OTP for phone verification is: {$otp}"
        );

        return Inertia::render('UpdatePhone', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'employee' => $employee, 
        ]);
    }
    

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string',
        ]);

        $user = auth()->user();

        if ($user->otp === $request->otp) {
            $user->phone_verified_at = now();
            $user->otp = 'Active';
            $user->save();

            return response()->json(['message' => 'Phone number verified']);
        }

        return response()->json(['message' => 'Invalid or expired OTP'], 422);
    }


    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
