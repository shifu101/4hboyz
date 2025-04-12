<?php

namespace App\Mail;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LoanDisbursementFailureMail extends Mailable
{
    use Queueable, SerializesModels;

    public $loan;
    public $code;
    public $description;

    public function __construct(Loan $loan, $code, $description)
    {
        $this->loan = $loan;
        $this->code = $code;
        $this->description = $description;
    }

    public function build()
    {
        return $this->subject('Loan Disbursement Failed')
                    ->view('emails.loan_failure')
                    ->with([
                        'loan' => $this->loan,
                        'code' => $this->code,
                        'description' => $this->description,
                    ]);
    }
}

