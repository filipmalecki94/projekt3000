<?php
require_once 'Code.php';

class InsertionSort extends Code {
	protected $codeStructure = [
		'int i,j;' => 1,
		'for(i = 0; i < n - 1; i++)' => 2,
		'for(j = 0; j < n-i-1; j++)' => 3,
		'if(arr[j] > arr[j+1])' => 4,
		'swap(&arr[j],&arr[j+1]);' => 5,
	];

}