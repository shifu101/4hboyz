<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'status',
        'disbursed_at',
        'employee_id',
        'loan_provider_id',
        'loan'
    ];

    public function employee(){
        return $this->hasOne('App\Models\Employee', 'id', 'employee_id');
    }

    public function loanProvider(){
        return $this->hasOne('App\Models\LoanProvider', 'id', 'loan_provider_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($loan) {
            $latestLoan = static::latest('id')->first();
            $nextNumber = $latestLoan ? ((int) substr($latestLoan->number, strrpos($latestLoan->number, '-') + 1)) + 1 : 1;

            $loan->number = '4hB-L-' . $nextNumber;
        });
    }
}
