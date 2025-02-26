<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MpesaService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = env('MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke');
    }

    public function generateAccessToken()
    {
        $consumerKey = env('MPESA_CONSUMER_KEY');
        $consumerSecret = env('MPESA_CONSUMER_SECRET');

        $response = Http::withBasicAuth($consumerKey, $consumerSecret)
            ->get("{$this->baseUrl}/oauth/v1/generate?grant_type=client_credentials");

        if ($response->failed()) {
            Log::error('M-Pesa Access Token Error:', $response->json());
            return null;
        }

        return $response->json()['access_token'] ?? null;
    }

    public function sendB2CPayment($phone, $amount)
    {
        $accessToken = $this->generateAccessToken();

        if (!$accessToken) {
            return ['error' => 'Failed to generate access token'];
        }

        // Format phone number to ensure it's in 2547XXXXXXXX format
        $formattedPhone = $this->formatPhoneNumber($phone);

        $payload = [
            'InitiatorName' => env('MPESA_INITIATOR_NAME'),
            'SecurityCredential' => env('MPESA_SECURITY_CREDENTIAL'),
            'CommandID' => 'SalaryPayment',
            'Amount' => $amount,
            'PartyA' => env('MPESA_BUSINESS_SHORTCODE'),
            'PartyB' => $formattedPhone,
            'Remarks' => 'Advance remitted',
            'QueueTimeOutURL' => env('MPESA_QUEUE_TIMEOUT_URL'),
            'ResultURL' => env('MPESA_RESULT_URL'),
            'Occasion' => 'Online Payment'
        ];

        $response = Http::withToken($accessToken)
            ->post("{$this->baseUrl}/mpesa/b2c/v1/paymentrequest", $payload);

        if ($response->failed()) {
            Log::error('M-Pesa B2C Payment Error:', $response->json());
            return ['error' => 'M-Pesa B2C request failed'];
        }

        return $response->json();
    }

    private function formatPhoneNumber($phone)
    {
        // Remove any non-numeric characters
        $phone = preg_replace('/\D/', '', $phone);

        // Convert 07xxxxxxxx to 2547xxxxxxxx
        if (substr($phone, 0, 1) == '0') {
            $phone = '254' . substr($phone, 1);
        }

        return $phone;
    }
}
