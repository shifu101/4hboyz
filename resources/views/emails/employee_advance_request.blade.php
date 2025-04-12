<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            margin-top: 20px;
            padding: 0 20px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #155ab6;
        }
    </style>
    <title>Loan Request Notification</title>
</head>
<body>
    <div class="logo">
        <img src="{{ asset('logo/logo-dark.png') }}" alt="Centiflow Logo" width="120">
    </div>
    <div class="content">
        <h2>New Loan Request</h2>
        <p>Dear {{ $approver->name }},</p>
        <p>{{ $employee->name }} has requested a loan of <strong>KES {{ number_format($loan->amount, 2) }}</strong>.</p>

        <a href="{{ url('/login') }}" class="btn">Login to Review Loan Request</a>

        <p>Thank you for choosing Centiflow!</p>

        <p>Best regards,</p>
        <p><strong>The Centiflow Team</strong></p>
    </div>
</body>
</html>
