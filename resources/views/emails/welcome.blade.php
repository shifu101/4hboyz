<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to Centiflow, {{ $user->name }}!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f9f9f9;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        h2 {
            color: #2c3e50;
        }
        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #888;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ asset('logo/logo-dark.png') }}" alt="Centiflow Logo" width="120">
        </div>

        <h2>Welcome to Centiflow, {{ $user->name }}!</h2>
        <p>Thank you for registering with us. We're excited to have you on board.</p>
        <p><strong>This is your login password:</strong> {{ $password }}</p>
        <p>If you have any questions or need assistance, feel free to contact us at any time.</p>
        <p>Best regards,</p>
        <p><strong>The Centiflow Team</strong></p>
    </div>
</body>
</html>
