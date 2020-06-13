<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<link rel="stylesheet" href="css/style.css" type="text/css" />
		<link
			rel="stylesheet"
			href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
			integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
			crossorigin="anonymous"
			>
		<script
		src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
		integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
		crossorigin="anonymous"
		></script>
		<script src="js/jquery.js" type="text/javascript"></script>
		<script src="js/jquery-swapsies.js" type="text/javascript"></script>
	</head>
	<body>
		<div class="container">
			<div class="text-center m-4 app-title">Sorting algoritms</div>
			<!-- sort nav start -->
			<div class="sorting-nav row my-4">
				<a class="col text-center sort-option" href="InsertionSort/InsertionSort.php">Insertion sort</a>
				<a class="col text-center sort-option" href="CountingSort/CountingSort.php">Counting sort</a>
				<div class="col text-center sort-option">sort3</div>
				<div class="col text-center sort-option">sort4</div>
				<div class="col text-center sort-option">sort5</div>
			</div>
			<!-- sort nav end -->
			<!-- graphical section start -->
			<div class="graphical-section row">
				<div class="graph-block col-8">
					<div class="graph my-1 mx-3 p-4 d-flex justify-content-around">
					</div>
				</div>
				<div class="code-block col-4">
					<div class="code m-1">
					</div>
				</div>
			</div>
			<!-- grapghical section end -->
			<!-- algorithm nav start -->
			<div class="algorithm-nav row my-4 mx-1 border border-dark">
				<div class="col text-center nav-option prev">prev</div>
				<div class="col text-center nav-option play">play</div>
				<button class="col text-center nav-option next">next</button>
			</div>
			<!-- algorithm nav end -->
		</div>
		<script src="InsertionSort/InsertionSort.js"></script>
	</body>
</html>