<?php

namespace App\Mail;

use App\Models\Employee;  
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmployeeDeclinedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $employee;
    public $reason;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Employee  $employee
     * @return void
     */
    public function __construct(Employee $employee, $reason)
    {
        $this->employee = $employee;
        $this->reason = $reason;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    { 

        return $this->subject('Your Details Have Been Declined')
                    ->view('emails.employee_declined')
                    ->with([
                        'employee' => $this->employee,
                        'reason'=> $this->reason
                    ]);
    }
}



