<?php

namespace App\Services;

use AfricasTalking\SDK\AfricasTalking;

class SmsService
{
    protected $AT;
    protected $sms;

    public function __construct()
    {
        $username = env('AFRICASTALKING_USERNAME', 'sandbox'); 
        $apiKey = env('AFRICASTALKING_API_KEY');

        $this->AT = new AfricasTalking($username, $apiKey);
        $this->sms = $this->AT->sms();
    }

    public function sendSms($recipients, $message)
    {
        try {
            $response = $this->sms->send([
                'to' => $recipients, 
                'message' => $message
            ]);
            return $response;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
