<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MpesaService
{
    protected $accessToken;

    public function __construct()
    {
        $this->accessToken = env('MPESA_ACCESS_TOKEN');
    }

    public function sendB2CPayment($phone, $amount)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->accessToken
        ])->post(env('MPESA_B2C_URL'), [
            'InitiatorName' => env('MPESA_INITIATOR_NAME'),
            'SecurityCredential' => env('MPESA_SECURITY_CREDENTIAL'),
            'CommandID' => 'SalaryPayment',
            'Amount' => $amount,
            'PartyA' => env('MPESA_BUSINESS_SHORTCODE'),
            'PartyB' => $phone,
            'Remarks' => 'Umeskia Withdrawal',
            'QueueTimeOutURL' => env('MPESA_QUEUE_TIMEOUT_URL'),
            'ResultURL' => env('MPESA_RESULT_URL'),
            'Occasion' => 'Online Payment'
        ]);

        return $response->json();
    }
}
