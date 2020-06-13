<?php
class InsertionSort {
	protected $codeStructure = [
		['line' => 'int i,key,j;', 'tab' => 0],
		['line' => 'for(i = 1; i < n; i++)', 'tab' => 0],
		['line' => '{', 'tab' => 0],
		['line' => 'key = arr[i];', 'tab' => 1],
		['line' => 'j = i - 1;', 'tab' => 1],
		['line' => 'while(j >= 0 && arr[j] > key)', 'tab' => 1],
		['line' => '{', 'tab' => 1],
		['line' => 'arr[j + 1] = arr[j];', 'tab' => 2],
		['line' => 'j = j - 1;', 'tab' => 2],
		['line' => '}', 'tab' => 1],
		['line' => 'arr[j + 1] = key;', 'tab' => 1],
		['line' => '}', 'tab' => 0],
	];

	public function getFormatCode(): array
	{
		$formattedCode = [];
		foreach ($this->codeStructure as $line => $codePart) {
			$formattedCode[] = '<div style="margin-left: ' . $codePart['tab'] * 10 . 'px;"class="step ' . $line . '">' . $codePart['line'] . '</div>';
		}

		return $formattedCode;
	}
}
class Graph {

	protected $collection = [];

	public function __construct(array $collection = []) {
		$this->setCollection($collection);
	}

	public function setCollection(array $collection = []) {
		if (isset($_GET['set'])) {
			$this->collection = explode(',', $_GET['set']);
		} else {
			$this->collection = $collection;
		}

		return $this;
	}

	public function getCollection(): array
	{
		return $this->collection;
	}

	public function getFormattedCollection(): array
	{
		return array_merge(array_map(
			function ($value) {
				return '
						<div id="' . $value . '" class="bar-block d-flex justify-content-center ">
							' . $value . '
							<div class="bar " style="background-color:' . sprintf("#%06X\n", mt_rand(0, 0xffffff)) . ';height: ' . 0.85 * 100 * $value / $this->getMax() . '%"></div>
						</div>'
				;},
			$this->collection
		),
			['<div id="empty" class="bar-block d-flex justify-content-center">&nbsp;</div>']
		);
	}

	private function getMax(): int {
		return max($this->collection);
	}

}

$Graph = new Graph;
$Code = new InsertionSort;
?>
<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<link rel="stylesheet" href="/projekt3000/css/style.css" type="text/css" />
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
		<script src="/projekt3000/js/jquery.js" type="text/javascript"></script>
		<script src="/projekt3000/js/jquery-swapsies.js" type="text/javascript"></script>
	</head>
	<body>
		<div class="container">
			<div class="text-center m-4 app-title">Sorting algoritms</div>
			<!-- sort nav start -->
			<div class="sorting-nav row my-4">
				<a class="col text-center sort-option" href="/projekt3000/InsertionSort/InsertionSort.php">Insertion sort</a>
				<a class="col text-center sort-option" href="/projekt3000/CountingSort/CountingSort.php">Counting sort</a>
				<div class="col text-center sort-option">sort3</div>
				<div class="col text-center sort-option">sort4</div>
				<div class="col text-center sort-option">sort5</div>
			</div>
			<!-- sort nav end -->
			<!-- graphical section start -->
			<div class="graphical-section row">
				<div class="graph-block col-8">
					<div class="graph my-1 mx-3 p-4 d-flex justify-content-around">
						<?php
foreach ($Graph->getFormattedCollection() as $value) {
	echo $value;
}
?>
					</div>
				</div>
				<div class="code-block col-4">
					<div class="code m-1">
						<?php
foreach ($Code->getFormatCode() as $value) {
	echo $value;
}
?>
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
		<script src="/projekt3000/InsertionSort/InsertionSort.js"></script>
	</body>
</html>