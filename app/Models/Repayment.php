<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'payment_date',
        'loan_id'
    ];

    public function loan(){
        return $this->hasOne('App\Models\Loan', 'id', 'loan_id');
    }
}
