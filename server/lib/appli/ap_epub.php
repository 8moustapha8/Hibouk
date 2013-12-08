<?php
class ap_epub extends ZipArchive {

	public function creat($filEepub) {
		file_put_contents($filEepub, base64_decode("UEsDBAoAAAAAAOmRAT1vYassFAAAABQAAAAIAAAAbWltZXR5cGVhcHBsaWNhdGlvbi9lcHViK3ppcFBLAQIUAAoAAAAAAOmRAT1vYassFAAAABQAAAAIAAAAAAAAAAAAIAAAAAAAAABtaW1ldHlwZVBLBQYAAAAAAQABADYAAAA6AAAAAAA="));
		return parent::open($filEepub);
	}

	public function addDir($path, $subDir='') {
		$nodes = glob($path . '/*');
		foreach ($nodes as $node) {
			if (is_dir($node)) {
				$this->addDir($node,$subDir);
			} else if (is_file($node)) {
				$newname = substr($node, strlen($subDir));
				$this->addFile($node,$newname);
			}
		}
	}
}
?>