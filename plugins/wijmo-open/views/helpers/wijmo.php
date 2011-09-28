<?php
/* /app/views/helpers/link.php */

class WijmoHelper extends AppHelper {

	var $helpers = array('Html');

	function tooltip($properties) {
		
		extract($properties);

		if (!isset($title)) $title = null;
		if (!isset($class)) $class = "wijmocake-tooltip";
		if (!isset($tip)) $tip = "Default ToolTip";
		if (!isset($tag)) $tag = "span";
		if (!isset($url)) $url = "#";

		$this->generate_script($class);

		if ($tag == 'a'){
			return $this->Html->tag($tag, $title, array('href' => $url, 'class' => $class, 'title' => $tip));
		} else {
			return $this->Html->tag($tag, $title, array('class' => $class, 'title' => $tip));
		}

	}

	function generate_script($class){
		
		ob_start();

		?>

				jQuery(function($) {
					$('.<?php echo $class ?>').wijtooltip();
				});

		<?php

		$jscript = ob_get_contents();
		ob_end_clean();

		echo $this->Html->scriptBlock($jscript, array("inline" => false));

	}

}

?>