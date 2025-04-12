<!DOCTYPE html>
<html>
<head>
    <title>Loan Disbursement Failure</title>
</head>
<body>
    <h2>Loan Disbursement Failed</h2>
    <p><strong>Loan ID:</strong> {{ $loan->id }}</p>
    <p><strong>Employee:</strong> {{ $loan->employee->user->name }}</p>
    <p><strong>Amount:</strong> {{ $loan->amount }}</p>
    <p><strong>Error Code:</strong> {{ $code }}</p>
    <p><strong>Reason:</strong> {{ $description }}</p>
    <p>Please check the logs or contact support for assistance.</p>
</body>
</html>
