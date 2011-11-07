<hr>
<h2>wijtooltip</h3>
<p>Helper to insert a wijtooltip. Ability to write any tag with <strike>all</strike> almost all properties.</p>
<div class="wijmo">Wijmo->tooltip(string $tag, string $title, string $class, string $tip)</div>

<div class="code">
Code: <pre>
echo $this->Wijmo->tooltip(array(
	"tag" => "span",
	"title" => "Hover over me!",
	"class" => "wijmotooltip", 
	"tip" => "This is a tool tip!"
));
</pre>
Demo: <?php 

echo $this->Wijmo->tooltip(array(
							"tag" => "span",
							"title" => "Hover over me!",
							"class" => "wijmotooltip", 
							"tip" => "This is a tool tip!"
						));


?>
</div>
<div class="code">
Code: <pre>
echo $this->Wijmo->tooltip(array(
	"tag" => "a",
	"title" => "I am a link. Hover over me!",
	"class" => "wijmotooltip", 
	"tip" => "This is another tooltip"
));
</pre>
Demo: <?php 

echo $this->Wijmo->tooltip(array(
							"tag" => "a",
							"title" => "I am a link. Hover over me!",
							"class" => "wijmotooltip", 
							"tip" => "This is another tooltip"
						));


?>
</div>
<hr>

