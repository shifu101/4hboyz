<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'industry',
        'phone',
        'role_id',
        'email',
        'password',
        'address',
        'percentage',
        'unique_number'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($company) {
            do {
                $letter = strtoupper(chr(rand(65, 90))); 
                $randomNumber = rand(10000, 99999);
                $uniqueNumber = $letter . $randomNumber;
            } while (self::where('unique_number', $uniqueNumber)->exists()); 

            $company->unique_number = $uniqueNumber;
        });
    }
}


