<?php

class Graph {

	protected $collection = [];

	private $indexes = ['i', 'j'];

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
							<div class="bar " style="background-color:' . sprintf("#%06X\n", mt_rand(0, 0xffffff)) . ';height: ' . 0.85 * 100 * $value / $this->getMax() . '%"></div>
						</div>'
				;},
			$this->collection
		);
	}

	public function getIndexes(): string{
		$indexes = '';
		foreach ($this->collection as $position => $value) {
			$indexes = $indexes . '<div id="' . $position . '" class="index">';
			foreach ($this->indexes as $index) {
				$indexes = $indexes . '<div class="index-bar ' . $index . '"></div>';
			}
			$indexes = $indexes . '</div>';
		}

		return $indexes;
	}

	private function getMax(): int {
		return max($this->collection);
	}

}