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
        }
    </style>
</head>
<body>
    <h2>Dear {{ $employee->user->name }},</h2>
    <p>We regret to inform you that your details have been declined after review.</p>
    <p>Please feel free to reach out if you would like further information or have any questions regarding this decision.</p>
    <p>We appreciate your understanding, and thank you for your time and effort.</p>
    <p>Best regards,</p>
    <p><strong>The Vermsol Team</strong></p>
</body>
</html>
