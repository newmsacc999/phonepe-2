<?php

include "../dbFunctions.php";
include "../dbInfo.php";
$servername = "localhost";
$username = "root";
$password = "JaishreeRam@1";
$dbname = "root";
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$order_id=$_GET["order_id"];

$sql = "DELETE FROM reports WHERE status='' and order_id='$order_id'";
setXbyY($sql);

        $slq_p = "SELECT * FROM orders where order_id='$order_id'";
        $res_p = getXbyY($slq_p);    
        $user_token = $res_p[0]['user_token'];
        $gateway_txn = $res_p[0]['gateway_txn'];
        
        $slq_p = "SELECT * FROM users where user_token='$user_token'";
        $res_p = getXbyY($slq_p);    
        $callback_url = $res_p[0]['callback_url'];
        $usridz = $res_p[0]['id'];
        
 //$txn_data = file_get_contents('//phnpe/user_txn.php?no='.$user_token.''); 
  $url ='///phnpe/user_txn.php?no='.$user_token.'';
 	$headers = array('Content-Type:application/json'); 
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		$txn_data = curl_exec($ch);
		curl_close ($ch);
  //$txn_data= substr("$txn_data",6);

    //  $json0=json_decode($txn_data,1);
    //  echo $results=$json0["data"]["results"]["0"]["transactionId"];
    
    
$obj = json_decode($txn_data);
$data=$obj->data;

$json0=json_decode($txn_data,1);
$data=$json0["data"];
$results=$data["results"];



$rows = count($results);

    for ($i = 0; $i < $rows; $i++) { 
        $customerDetails=$results[$i]["customerDetails"];
        $user_name=$customerDetails["userName"];
        $paymentApp=$results[$i]["paymentApp"];
        $paymentApp=$paymentApp["paymentApp"];
        $logo=$paymentApp["logo"];
        //$image = file_get_contents("$logo");
        
        $amount=$results[$i]["amount"];
        $amount=$amount / 100;
        $transactionId=$results[$i]["transactionId"];
        $paymentState=$results[$i]["payResponseCode"];
        $transactionDate=$results[$i]["transactionDate"];
        $transactionNote=$results[$i]["transactionNote"];
        $transactionDate=date('m/d/Y', $transactionDate);
        $Status=$results[$i]["Status"];
        $UTR=$results[$i]["UTR"];
        $vpa=$results[$i]["vpa"];
        $amount=$results[$i]["amount"];
        $amount=$amount / 100;
        $slq_p = "SELECT * FROM reports where transactionId='$transactionId'";
        $res_pp = getXbyY($slq_p);    
        $db_transactionId = $res_pp[0]['transactionId'];
        
if($db_transactionId==''){
        $sql = "INSERT INTO reports (transactionId, status, order_id, vpa, user_name, paymentApp, amount, user_token)
VALUES ('$transactionId', '$paymentState','$transactionNote', '$vpa', '$user_name', '$paymentApp', '$amount', '$user_token')";
   
if ($conn->query($sql) === TRUE) {
}


}   

        
    } 



$slq_p3 = "SELECT * FROM plan where amount='$amount'";
        $resd_p = getXbyY($slq_p3);    
        $pidd = $resd_p[0]['id'];

$slq_pff = "SELECT * FROM orderrs where order_id='$order_id'";
$res_pf = getXbyY($slq_pff);    
$auser_tokent = $res_pf[0]['uid']; 
$plnid = $res_pf[0]['plan_id']; 

if($plnid == 1){
$dt = date("Y-m-d");
$one = date( "Y-m-d", strtotime( "$dt +1 month" ) );
}
if($plnid == 2){
$dt = date("Y-m-d");
$one = date( "Y-m-d", strtotime( "$dt +3 month" ) );
}
if($plnid == 3){
$dt = date("Y-m-d");
$one = date( "Y-m-d", strtotime( "$dt +12 month" ) );
}

$slq_pfff = "SELECT * FROM users where user_token='$auser_tokent'";
$res_pff = getXbyY($slq_pfff);    
$auid = $res_pff[0]['id'];

$slq_p = "SELECT * FROM reports where order_id='$order_id'";
        $res_p = getXbyY($slq_p);    
        $db_status = $res_p[0]['status'];
        $db_user_token = $res_p[0]['user_token'];
        $db_transactionId = $res_p[0]['transactionId'];
        
        if($db_status=='SUCCESS'){
            echo 'success';
$callback=''.$callback_url.'?order_id='.$order_id.'&status=SUCCESS&gateway_txn='.$gateway_txn.'';            
file_get_contents($callback);            
$sql = "UPDATE orders SET status='$db_status' WHERE order_id='$order_id'";
setXbyY($sql);

$sql = "UPDATE reports SET status='SUCCESS' WHERE order_id='$order_id'";
setXbyY($sql);

$sql = "UPDATE orders SET utr='$db_transactionId' WHERE user_token='$db_user_token'";
setXbyY($sql);


$sql1 = "UPDATE users SET plan_id='$plnid', expire_date='$one' WHERE id='$auser_tokent'";
setXbyY($sql1);



        }else{

          echo 'PENDING';  
        }
if($db_status=='FAILURE' | $db_status=='FAILED' | $db_status=='UPI_BACKBONE_ERROR'){
echo 'FAILURE';
    
}
