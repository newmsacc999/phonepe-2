<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Success</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>

<div id="success-message">
    <h2>Payment Successful</h2>
    <p>Thank you for your purchase!</p>
</div>

<script>
    Swal.fire({
        title: 'Payment Successful',
        text: 'Thank you for your purchase!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to the home or order summary page
            // window.location.href = 'index.php'; // Change to your desired page
        }
    });
</script>

</body>
</html>
