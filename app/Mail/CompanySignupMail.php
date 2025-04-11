<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompanySignupMail extends Mailable
{
    use Queueable, SerializesModels;

    public $company;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct($company, $user)
    {
        $this->company = $company;
        $this->user = $user;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('New Company Signup')
                    ->view('emails.company_signup');
    }
}

