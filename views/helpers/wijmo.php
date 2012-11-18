<?php

class WijmoHelper extends AppHelper {

	var $helpers = array('Html');

	function beforeRender() {
		$this->Html->css('/wijmocake/themes/rocket/jquery-wijmo.css', null, array('inline' => false));
		$this->Html->css('/wijmocake/css/jquery.wijmo-open.2.3.1.css', null, array('inline' => false));
	    $this->Html->script('http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',false);
		$this->Html->script('https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js',false);
		$this->Html->script('/wijmocake/js/jquery.wijmo-open.all.2.3.1.min.js',false);
	}


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