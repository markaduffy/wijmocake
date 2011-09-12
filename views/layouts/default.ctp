<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php __('CakePHP: the rapid development php framework:'); ?>
		<?php echo $title_for_layout; ?>
	</title>

	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js"></script>

	<script type="text/javascript" src="/wijmo-open/js/jquery.wijmo-open.1.4.1.min.js"></script>
	<link rel="stylesheet" type="text/css" media="all" href="/wijmo-open/css/jquery.wijmo-open.1.4.1.css" />
	<link rel="stylesheet" type="text/css" media="all" href="/wijmo-open/themes/rocket/jquery-wijmo.css" />


	<?php
		echo $this->Html->css('style');
		echo $scripts_for_layout;
	?>
</head>
<body>
	<div id="container">
		<div id="header">
			<h1>WijmoCake</h1>
		</div>
		<div id="content">

			<?php //echo $this->Session->flash(); ?>

			<?php echo $content_for_layout; ?>

		</div>
		<div id="footer">
			
		</div>
	</div>
	<?php //echo $this->element('sql_dump'); ?>
</body>
</html>