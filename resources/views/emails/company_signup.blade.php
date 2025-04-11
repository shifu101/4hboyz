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
    <title>New Company Signup</title>
</head>
<body>
    <div class="content">
        <h2>New Company Registered</h2>
        <p><strong>Company Name:</strong> {{ $company->name }}</p>
        <p><strong>Email:</strong> {{ $company->email }}</p>
        <p><strong>Phone:</strong> {{ $company->phone }}</p>

        <hr>
        <p><strong>User Assigned:</strong> {{ $user->name }}</p>
        <p><strong>User Email:</strong> {{ $user->email }}</p>

        <a href="{{ url('/login') }}" class="btn">Login & Approve Company</a>
    </div>
</body>
</html>
