<?php
/* /app/views/helpers/link.php */

class WijmoHelper extends AppHelper {

	function tooltip($properties) {
		
		$title = $properties['title'];

		$output = '<script type="text/javascript">jQuery(function($) {$(".wijtooltip").wijtooltip();});</script>';
		$output .= '<h3><a onclick="return false;" class="wijtooltip" title="' . $title . '" href="#">I have a tooltip</a></h3>';

		return $output;

	}

}

?>