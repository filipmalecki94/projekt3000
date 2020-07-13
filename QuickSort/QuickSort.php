<?php
class QuickSort {
	public $partitionCodeStructure = [
		['line' => 'int pivot = arr[high];', 'tab' => 0],
		['line' => 'int i = (low - 1);', 'tab' => 0],
		['line' => '&nbsp;', 'tab' => 0],
		['line' => 'for(int j = low; j <= high-1; j++) {', 'tab' => 0],
		['line' => 'if(arr[j] < pivot) {', 'tab' => 1],
		['line' => 'i++;', 'tab' => 2],
		['line' => 'swap(&arr[i], &arr[j]);', 'tab' => 2],
		['line' => '}', 'tab' => 1],
		['line' => '}', 'tab' => 0],
		['line' => 'swap(&arr[i+1],&arr[high];', 'tab' => 0],
		['line' => 'return (i+1);', 'tab' => 0],
	];

	public $quickSortCodeStructure = [
		['line' => 'if(low < high) {', 'tab' => 0],
		['line' => 'int pi = partition(arr, low, high);', 'tab' => 1],
		['line' => '&nbsp;', 'tab' => 1],
		['line' => 'quickSort(arr, pi + 1, high);', 'tab' => 1],
		['line' => 'quickSort(arr, low, pi - 1);', 'tab' => 1],
		['line' => '}', 'tab' => 0],
	];

	public function getFormatCode(array $code = []): array
	{
		$formattedCode = [];
		foreach ($code as $line => $codePart) {
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
		return array_map(
			function ($value) {
				return '
						<div id="' . $value . '" class="bar-block d-flex justify-content-center ">
							' . $value . '
							<div class="bar " style="background-color:' . $this->hsl_col_perc(100 * $value / $this->getMax(), 0, 300) . ';height: ' . 0.85 * 100 * $value / $this->getMax() . '%"></div>
						</div>'
				;},
			$this->collection
		);
	}

	public function hsl_col_perc($percent, $start, $end) {
		$a = $percent / 100;
		$b = ($end - $start) * $a;
		$c = $b + $start;

		// Return a CSS HSL string
		return 'hsl(' . $c . ', 100%, 50%)';
	}

	public function getCounter(): array
	{
		$counterArr = [];
		for ($i = 0; $i <= $this->getMax(); $i++) {
			$counterArr[] = '
				<div id="' . $i . '" class="counter-block d-flex flex-wrap justify-content-center" style="width:100%;">' . $i . '
					<div class="counter-box d-flex justify-content-center align-items-center">0</div>
				</div>
			';
		}

		return $counterArr;
	}

	private function getMax(): int {
		if (count($this->collection) === 0) {
			return 0;
		}
		return max($this->collection);
	}

}

$Graph = new Graph;
$Code = new QuickSort;
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
			<div class="text-center m-4 app-title">Sorting algorithms</div>
			<!-- sort nav start -->
			<div class="sorting-nav row my-4">
				<a class="col text-center sort-option" href="InsertionSort/InsertionSort.php">Insertion sort</a>
				<a class="col text-center sort-option" href="CountingSort/CountingSort.php">Counting sort</a>
				<a class="col text-center sort-option" href="QuickSort/QuickSort.php">Quick sort</a>
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
					<div class="code m-1 h-50">
						<?php
foreach ($Code->getFormatCode($Code->partitionCodeStructure) as $value) {
	echo $value;
}
?>
					</div>
					<div class="code m-1 h-50">
						<?php
foreach ($Code->getFormatCode($Code->quickSortCodeStructure) as $value) {
	echo $value;
}
?>
					</div>
				</div>
			</div>
			<!-- grapghical section end -->
			<!-- algorithm nav start -->
			<div class="algorithm-nav row my-4 mx-1 border border-dark">
				<button class="col text-center nav-option next">next</button>
			</div>
			<!-- algorithm nav end -->
		</div>
		<script src="/projekt3000/QuickSort/QuickSort.js"></script>
	</body>
</html>