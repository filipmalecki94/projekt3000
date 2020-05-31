<?php

class Code {
	protected $codeStructure = [];

	public function getFormatCode(): array
	{
		$formattedCode = [];
		foreach ($this->codeStructure as $line => $tab) {
			$formattedCode[] = '<div class="ml-' . $tab . '">' . $line . '</div>';
		}

		return $formattedCode;
	}
}