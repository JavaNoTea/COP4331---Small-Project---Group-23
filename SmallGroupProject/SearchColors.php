<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select * from Contacts where Name like ? and UserID=?");
		//$stmt = $conn->prepare("select * from Contacts where Name like ? and UserID=?");
		$colorName = "%" . $inData["search"] . "%";
		//$colorName = $inData["search"];
		$stmt->bind_param("si", $colorName, $inData["UserID"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			//$searchResults .= '"' . $row['firstName"] . '"';
			$searchResults .= '{"name":"' . $row["Name"] . '","phone":"' . $row["Phone"] . '","email":"'. $row["Email"] . '","ID":"'. $row["ID"]  .'"}';
			// , "lastName" : "' . $row["LastName"]. '", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		
		sendResultInfoAsJson( $retValue );
	}
	
?>