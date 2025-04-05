<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class CustomVerifyEmail extends VerifyEmail
{
    protected $password;

    public function __construct($password)
    {
        $this->password = $password;
    }


    public function toMail($notifiable)
    {
        $loginUrl = url('/login'); 

        return (new MailMessage)
            ->subject('Welcome. Update your login details.')
            ->line('Your temporary password is: **' . $this->password . '**')
            ->line('Please log in and change your password immediately for security reasons.')
            ->action('Log in Now', $loginUrl); 
    }

}

