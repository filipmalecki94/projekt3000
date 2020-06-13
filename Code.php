<?php

class Code {
	protected $codeStructure = [];

	public function getFormatCode(): array
	{
		$formattedCode = [];
		foreach ($this->codeStructure as $line => $codePart) {
			$formattedCode[] = '<div style="margin-left: ' . $codePart['tab'] * 10 . 'px;"class="step ' . $line . '">' . $codePart['line'] . '</div>';
		}

		return $formattedCode;
	}
}