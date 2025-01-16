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
        'provider_id'
    ];

    public function employee(){
        return $this->hasOne('App\Models\Employee', 'id', 'employee_id');
    }

    public function provider(){
        return $this->hasOne('App\Models\Provider', 'id', 'provider_id');
    }
}
