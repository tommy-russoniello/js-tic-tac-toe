window.onload = function () {

	PLAYER = "X";

	var count = 0;
	$("#board div").each (function () {
		$(this).addClass ("tile");
		$(this).addClass ("blank");
		if (count <= 2) {
			$(this).addClass ("top");
		} else if (count <= 5) {
			$(this).addClass ("middle");
		} else {
			$(this).addClass ("bottom");
		}
		if (count % 3 == 0) {
			$(this).addClass ("left");
		} else if (count % 3 == 1) {
			if ($(this).hasClass ("middle")) {
				$(this).removeClass ("middle");
				$(this).addClass ("center");
			} else {
				$(this).addClass ("middle");
			}
		} else {
			$(this).addClass ("right");
		}
 	    $(this).css ({
	    	"left": (count % 3) * 150 + "px",
	        "top": Math.trunc (count / 3) * 150 + "px"
  		});
		count++;
	});

	function update_player () {
		if (PLAYER == "X") {
			PLAYER = "O";
		} else {
			PLAYER = "X";
		}
	}

	function opposite_tile_to (tile) {
		var vertical, horizontal;
		if (tile.hasClass ("top")) {
			vertical = "bottom";
		} else {
			vertical = tile.hasClass ("bottom")? "top" : "middle";
		}
		if (tile.hasClass ("left")) {
			horizontal = "right";
		} else {
			horizontal = tile.hasClass ("right")? "left" : "middle";
		}
		return $("." + vertical + "." + horizontal);
	}

	function center_check () {
		var size = $("." + PLAYER + ":not('.center')").length;
		var opposite_tile, tile;
		for (i = 0; i < size; i++) {
			tile = $("." + PLAYER + ":not('.center')").eq(i);
			opposite_tile = opposite_tile_to (tile);
			if (opposite_tile.hasClass (PLAYER)) {
				tile.addClass ("winning_row");
				opposite_tile.addClass ("winning_row");
				$(".center").addClass ("winning_row");
				return true;
			}
		}
		return false;
	}

	function mid_check (tile) {
		var pos = tile.attr ('class').replace (/X|O|middle|tile/g, "").trim ();
		if ($("." + pos + ":first").hasClass (PLAYER) && $("." + pos + ":last").hasClass (PLAYER)) {
			$("." + pos).addClass ("winning_row");
			return true;
		} else if (opposite_tile_to (tile).hasClass (PLAYER) && $(".center").hasClass (PLAYER)) {
			tile.addClass ("winning_row");
			opposite_tile_to (tile).addClass ("winning_row");
			$(".center").addClass ("winning_row");
			return true;
		} else {
			return false;
		}
	}

	function corner_check (tile) {
		var pos = tile.attr ('class').replace (/X|O|tile/g, "").trim ().split (" ");
		if ($("." + pos [0]).length == $("." + pos [0] + "." + PLAYER).length) {
			$("." + pos [0]).addClass("winning_row");
			return true;
		} else if ($("." + pos [1]).length == $("." + pos [1] + "." + PLAYER).length) {
			$("." + pos [1]).addClass ("winning_row");
			return true;
		} else if (opposite_tile_to (tile).hasClass (PLAYER) && $(".center").hasClass (PLAYER)) {
			tile.addClass ("winning_row");
			opposite_tile_to (tile).addClass ("winning_row");
			$(".center").addClass ("winning_row");
			return true;
		} else {
			return false;
		}
	}

	function solved (tile) {
		if (tile.hasClass ("middle")) {
			if (mid_check (tile)) { return true; }
		} else if (tile.hasClass ("center")) {
			if (center_check ()) { return true; }
		} else {
			return corner_check (tile);
		}
	}

	$("div").on ("click", ".blank", function() {
		$(this).html (PLAYER);
		$(this).removeClass ("blank");
		$(this).addClass (PLAYER);
		if (solved ($(this))) {
			$("#message").html ("Player " + PLAYER + " wins!");
			$(".blank").removeClass ("blank");
			return;
		}
		if ($(".blank").length == 0) {
			$("#message").html ("It's a tie!");
			return;
		}
		update_player ();
	});

	$(document).on ("click", "#reset", function () {
		PLAYER = 'X';
		$(".winning_row").removeClass ("winning_row");
		$(".X").removeClass ("X");
		$(".O").removeClass ("O");
		$(".tile").addClass ("blank");
		$(".tile").html ("");
		$("#message").html ("");
	});

}
