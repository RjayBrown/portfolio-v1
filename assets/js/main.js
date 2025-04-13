/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
	var $window = $(window),
		$body = $("body"),
		$wrapper = $("#wrapper"),
		$header = $("#header"),
		$footer = $("#footer"),
		$main = $("#main"),
		$main_articles = $main.children("article");

	// Breakpoints.
	breakpoints({
		xlarge: ["1281px", "1680px"],
		large: ["981px", "1280px"],
		medium: ["737px", "980px"],
		small: ["481px", "736px"],
		xsmall: ["361px", "480px"],
		xxsmall: [null, "360px"],
	});

	// Play initial animations on page load.
	$window.on("load", function () {
		window.setTimeout(function () {
			$body.removeClass("is-preload");
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == "ie") {
		var flexboxFixTimeoutId;

		$window
			.on("resize.flexbox-fix", function () {
				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function () {
					if ($wrapper.prop("scrollHeight") > $window.height())
						$wrapper.css("height", "auto");
					else $wrapper.css("height", "100vh");
				}, 250);
			})
			.triggerHandler("resize.flexbox-fix");
	}

	// Nav.
	var $nav = $header.children("nav"),
		$nav_li = $nav.find("li");

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if ($nav_li.length % 2 == 0) {
		$nav.addClass("use-middle");
		$nav_li.eq($nav_li.length / 2).addClass("is-middle");
	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function (id, initial) {
		var $article = $main_articles.filter("#" + id);

		// No such article? Bail.
		if ($article.length == 0) return;

		// Handle lock.

		// Already locked? Speed through "show" steps w/o delays.
		if (locked || (typeof initial != "undefined" && initial === true)) {
			// Mark as switching.
			$body.addClass("is-switching");

			// Mark as visible.
			$body.addClass("is-article-visible");

			// Deactivate all articles (just in case one's already active).
			$main_articles.removeClass("active");

			// Hide header, footer.
			$header.hide();
			$footer.hide();

			// Show main, article.
			$main.show();
			$article.show();

			// Activate article.
			$article.addClass("active");

			// Unlock.
			locked = false;

			// Unmark as switching.
			setTimeout(
				function () {
					$body.removeClass("is-switching");
				},
				initial ? 1000 : 0
			);

			return;
		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if ($body.hasClass("is-article-visible")) {
			// Deactivate current article.
			var $currentArticle = $main_articles.filter(".active");

			$currentArticle.removeClass("active");

			// Show article.
			setTimeout(function () {
				// Hide current article.
				$currentArticle.hide();

				// Show article.
				$article.show();

				// Activate article.
				setTimeout(function () {
					$article.addClass("active");

					// Window stuff.
					$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		}

		// Otherwise, handle as normal.
		else {
			// Mark as visible.
			$body.addClass("is-article-visible");

			// Show article.
			setTimeout(function () {
				// Hide header, footer.
				$header.hide();
				$footer.hide();

				// Show main, article.
				$main.show();
				$article.show();

				// Activate article.
				setTimeout(function () {
					$article.addClass("active");

					// Window stuff.
					$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		}
	};

	$main._hide = function (addState) {
		var $article = $main_articles.filter(".active");

		// Article not visible? Bail.
		if (!$body.hasClass("is-article-visible")) return;

		// Add state?
		if (typeof addState != "undefined" && addState === true)
			history.pushState(null, null, "#");

		// Handle lock.

		// Already locked? Speed through "hide" steps w/o delays.
		if (locked) {
			// Mark as switching.
			$body.addClass("is-switching");

			// Deactivate article.
			$article.removeClass("active");

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			$body.removeClass("is-article-visible");

			// Unlock.
			locked = false;

			// Unmark as switching.
			$body.removeClass("is-switching");

			// Window stuff.
			$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

			return;
		}

		// Lock.
		locked = true;

		// Deactivate article.
		$article.removeClass("active");

		// Hide article.
		setTimeout(function () {
			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			setTimeout(function () {
				$body.removeClass("is-article-visible");

				// Window stuff.
				$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

				// Unlock.
				setTimeout(function () {
					locked = false;
				}, delay);
			}, 25);
		}, delay);
	};

	// Articles.
	$main_articles.each(function () {
		var $this = $(this);

		// Close.
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on("click", function () {
				location.hash = "";
			});

		// Prevent clicks from inside article from bubbling.
		$this.on("click", function (event) {
			event.stopPropagation();
		});
	});

	// Events.
	$body.on("click", function (event) {
		// Article visible? Hide.
		if ($body.hasClass("is-article-visible")) $main._hide(true);
	});

	$window.on("keyup", function (event) {
		switch (event.keyCode) {
			case 27:
				// Article visible? Hide.
				if ($body.hasClass("is-article-visible")) $main._hide(true);

				break;

			default:
				break;
		}
	});

	$window.on("hashchange", function (event) {
		// Empty hash?
		if (location.hash == "" || location.hash == "#") {
			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$main._hide();
		}

		// Otherwise, check for a matching article.
		else if ($main_articles.filter(location.hash).length > 0) {
			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Show article.
			$main._show(location.hash.substr(1));
		}
	});

	// Scroll restoration.
	// This prevents the page from scrolling back to the top on a hashchange.
	if ("scrollRestoration" in history) history.scrollRestoration = "manual";
	else {
		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $("html,body");

		$window
			.on("scroll", function () {
				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();
			})
			.on("hashchange", function () {
				$window.scrollTop(oldScrollPos);
			});
	}

	// Initialize.

	// Hide main, articles.
	$main.hide();
	$main_articles.hide();

	// Initial article.
	if (location.hash != "" && location.hash != "#")
		$window.on("load", function () {
			$main._show(location.hash.substr(1), true);
		});
})(jQuery);

// Get user data from local storage
const saved = localStorage.getItem("data");

const consultationForm = document.querySelector("#consultationForm");
const companyName = document.querySelectorAll("#company")[0];
const industry = document.querySelector("#industry");
const answer1 = document.querySelector("#answer1");
const answer2 = document.querySelector("#answer2");
const answer3 = document.querySelector("#answer3");

const appointmentForm = document.querySelector("#appointmentForm");
const nameField = document.querySelector("#name");
const subjectField = document.querySelector("#subject");
const dateField = document.querySelector("#date");

//ON PAGE LOAD
// Use data from local storage to preload form fields
window.onload = () => {
	const answers = JSON.parse(saved);
	const details = answers
		? `${answers.answer1}. ${answers.answer2}. ${answers.answer3}`
		: null;

	const preloadFields = {
		consultation: ["company", "industry", "answer1", "answer2", "answer3"],
		appointment: ["company", "industry", "message"],
	};

	// Consultation Form
	preloadFields.consultation.forEach((field) => {
		if (answers) {
			consultationForm.elements[field].value = answers[field];
		} else {
			consultationForm.elements[field].value = "";
		}
	});

	// Appointment Form
	preloadFields.appointment.forEach((field) => {
		if (answers) {
			field === "message"
				? (appointmentForm.elements[field].value = details)
				: (appointmentForm.elements[field].value = answers[field]);
		} else {
			appointmentForm.elements[field].value = null;
		}
	});
};

// ON FORM RESET
// Clear both forms and local storage
const formResetBtn = document.querySelectorAll(".reset");
formResetBtn.forEach((btn, i) => {
	btn.addEventListener("click", (e) => {
		if (i === 0) {
			companyName.focus();
		} else {
			location.assign(`${window.location.href.split("#")[0]}` + "#services");
			companyName.focus();
		}

		consultationForm.reset();
		appointmentForm.reset();
		localStorage.clear();
	});
});

/* FORM VALIDATION
Displays a custom message for invalid inputs
Removes message as the input value changes
*/

// APPOINTMENT FORM

// Name
nameField.addEventListener("input", (e) => {
	nameField.setCustomValidity("");
});

nameField.addEventListener("invalid", (e) => {
	nameField.setCustomValidity("Please enter a minimum of 3 characters.");
});

// Subject
subjectField.addEventListener("input", (e) => {
	subjectField.setCustomValidity("");
});

subjectField.addEventListener("invalid", (e) => {
	subjectField.setCustomValidity(
		"Please select a subject from the dropdown list."
	);
});

// Date

dateField.addEventListener("input", (e) => {
	dateField.setCustomValidity("");
});

dateField.addEventListener("invalid", (e) => {
	dateField.setCustomValidity("Please select an available date.");
});

// Configures date limit used in form
const minDate = generateMinDate(7);
dateField.setAttribute("min", minDate);

// Returns the formatted minimum date (string)
function generateMinDate(daysToAdd) {
	const date = new Date();
	date.setDate(date.getDate() + daysToAdd);

	// Convert new date to yyyy-mm-dd format
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");

	return `${yyyy}-${mm}-${dd}`;
}

// CONSULTATION FORM

// Save data to local storage
consultationForm.addEventListener("submit", (e) => {
	const data = {
		company: companyName.value,
		industry: industry.value,
		answer1: answer1.value,
		answer2: answer2.value,
		answer3: answer3.value,
	};
	localStorage.setItem("data", JSON.stringify(data));
	location.hash = "creating-value";
});
