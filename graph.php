<?php

class Graph {

	protected $collection = [];

	public function __construct(array $collection = []) {
		$this->setCollection($collection);
	}

	public function setCollection(array $collection = []) {
		if (isset($_GET['set'])) {
			$this->collection = array_map(
				function ($value) {
					return '
						<div class="bar-block">
							' . $value . '
							<div class="bar " style="background-color:' . sprintf("#%06X\n", mt_rand(0, 0xffffff)) . ';height: ' . 0.85 * 100 * $value / 9 . '%"></div>
						</div>'
					;},
				explode(',', $_GET['set'])
			);
		} else {
			$this->collection = $collection;
		}

		return $this;
	}

	public function getCollection(): array
	{
		return $this->collection;
	}

	public function getMax(): int {
		return max($this->collection);
	}

}