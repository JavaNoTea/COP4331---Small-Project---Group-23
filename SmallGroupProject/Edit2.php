<?php

	$inData = getRequestInfo();

    $Name = $inData["Name"];
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];
	$ID = $inData["ID"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
		if ($conn->connect_error)
		{
			returnWithError( $conn->connect_error );
		}
		else
		{
			$stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email= ? WHERE ID= ?");
			$stmt->bind_param("sssi", $Name, $Phone, $Email, $ID);
			$stmt->execute();

			$stmt->close();
			$conn->close();
			returnWithError("");
		}



	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"ID" : 0, "Name" : "", "Phone" : "", "Email" : "", "UserID" : 0, "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}


?>
