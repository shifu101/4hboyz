<?php

namespace App\Mail;

use App\Models\Employee;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmployeeAdvanceRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public $employee;
    public $loan;
    public $approver;

    /**
     * Create a new message instance.
     */
    public function __construct($loan, Employee $employee, $approver)
    {
        $this->loan = $loan;
        $this->employee = $employee;
        $this->approver = $approver;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('New loan request')
                    ->view('emails.employee_advance_request')
                    ->with([
                        'loan' => $this->loan,
                        'employee' => $this->employee,
                        'approver' => $this->approver
                    ]);
    }
}

