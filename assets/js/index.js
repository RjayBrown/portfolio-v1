// ON PAGE LOAD
// Get user data from local storage
let userData = JSON.parse(localStorage.getItem("data"));

const consultationForm = document.querySelector("#consultationForm");
const companyName = document.querySelector("#company");
const industryList = document.querySelectorAll("#industry");
const timeList = document.querySelector("#time");
const answer1 = document.querySelector("#answer1");
const answer2 = document.querySelector("#answer2");
const answer3 = document.querySelector("#answer3");

const appointmentForm = document.querySelector("#appointmentForm");
const nameField = document.querySelector("#name");
const subjectField = document.querySelector("#subject");
const dateField = document.querySelector("#date");

// Create industry dropdown list
const industries = getIndustries();

industries.forEach((type) => {
	const optionEl = document.createElement("option");
	optionEl.setAttribute("value", type);
	optionEl.textContent = type;
	optionEl.classList.add("value");

	const optionEl2 = document.createElement("option");
	optionEl2.setAttribute("value", type);
	optionEl2.textContent = type;
	optionEl2.classList.add("value");

	industryList.forEach((dropdown, i) => {
		i === 0 ? dropdown.appendChild(optionEl) : dropdown.appendChild(optionEl2);
	});
});

// Create time dropdown list (open, close, timeslot) - args in military time
generateTimeDropdown(11, 20, 30);

// CONFIG (CONNECTED FORMS)

// Connected form fields
const connected = {
	consultationFields: ["company", "industry", "answer1", "answer2", "answer3"],
	appointmentFields: ["company", "industry", "message"],
};

// Summary template for message field (appointment form)
const setSummaryText = (data) => {
	return `SUMMARY \n\nWhat is the top priority for your business right now? \n  • ${data.answer1} \n\nWhat are the most frustrating tasks for you or your employees? \n  • ${data.answer2} \n\nWhat negative customer feedback have you received? \n  • ${data.answer3}`;
};

// Preload consultation form
connected.consultationFields.forEach((field) => {
	if (userData) {
		consultationForm.elements[field].value = userData[field];
	} else {
		consultationForm.elements[field].value = "";
	}
});

// Preload appointment form
const summary = userData ? setSummaryText(userData) : null;

connected.appointmentFields.forEach((field) => {
	if (userData) {
		field === "message"
			? (appointmentForm.elements[field].value = summary)
			: (appointmentForm.elements[field].value = userData[field]);
	} else {
		appointmentForm.elements[field].value = "";
	}
});

// Updates appontment form state and preloadeds user data without forcing a refresh
window.addEventListener("hashchange", () => {
	const freshData = JSON.parse(localStorage.getItem("data"));
	const freshDetails = freshData ? setSummaryText(freshData) : null;
	connected.appointmentFields.forEach((field) => {
		if (freshData) {
			field === "message"
				? (appointmentForm.elements[field].value = freshDetails)
				: (appointmentForm.elements[field].value = freshData[field]);
		} else {
			appointmentForm.elements[field].value = "";
		}
	});
});

// ON SUBMIT (Consultation Form)
// Saves data to local storage and scroll
consultationForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const data = {
		company: companyName.value,
		industry: industryList[0].value,
		answer1: answer1.value,
		answer2: answer2.value,
		answer3: answer3.value,
	};
	localStorage.setItem("data", JSON.stringify(data));
	location.hash = "creating-value";
});

// ON SUBMIT (Appointment Form)
// Validate appointment form input
// Displays a custom message for invalid inputs and updates/removes message as the input value changes

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

// ON FORM RESET
// Clear both forms and local storage
const formResetBtn = document.querySelectorAll(".reset");
formResetBtn.forEach((btn, i) => {
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		localStorage.clear();
		userData = null;
		consultationForm.reset();
		appointmentForm.reset();

		if (i === 0) {
			companyName.focus();
		} else {
			location.hash = "contact";
			nameField.focus();
		}
	});
});

// CONFIG (TIME DROPDOWN LIST)
function generateTimeDropdown(earliest, latest, slot) {
	const earliestTime = earliest;
	const latestTime = latest;
	const timeSlot = slot;
	for (let hour = earliestTime; hour < latestTime; hour++) {
		for (let min = 0; min < 60; min += timeSlot) {
			const converted = hour % 12 || 12;
			const period = hour >= 12 ? "PM" : "AM";

			const hh = String(converted).padStart(2, "0");
			const mm = String(min).padStart(2, "0");

			const time = `${hh}:${mm} ${period}`;

			const optionEl = document.createElement("option");
			optionEl.value = time;
			optionEl.textContent = time;
			timeList.appendChild(optionEl);

			if (converted < earliestTime && period === "AM") {
				optionEl.setAttribute("disabled", true);
			}
			if (converted > latestTime && period === "PM") {
				optionEl.setAttribute("disabled", true);
			}
		}
	}
}

// CONFIG INDUSTRIES
function getIndustries() {
	return [
		"Accounting",
		"Agriculture",
		"Architecture",
		"Automotive",
		"Biotechnology",
		"Construction",
		"Consulting",
		"Education",
		"Energy",
		"Entertainment",
		"Environmental Services",
		"Fashion",
		"Finance",
		"Food & Beverage",
		"Healthcare",
		"Hospitality",
		"Import & Export",
		"Information Technology",
		"Insurance",
		"Legal",
		"Logistics",
		"Manufacturing",
		"Marketing",
		"Media & Broadcasting",
		"Mining",
		"Nonprofit",
		"Pharmaceuticals",
		"Public Relations",
		"Publishing",
		"Real Estate",
		"Retail",
		"Science & Research",
		"Security",
		"Technology",
		"Telecommunications",
		"Transportation",
		"Travel & Tourism",
		"Utilities",
		"Veterinary",
		"Warehousing",
	];
}
