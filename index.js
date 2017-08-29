"use strict";

const mainForm = document.getElementById("myForm"),
	userNameInput = document.getElementById("name"),
	emailInput = document.getElementById("email"),
	phoneInput = document.getElementById("phone"),
	submitButton = document.getElementById("submitButton");

mainForm.onsubmit = function (e) {

	e.preventDefault();

	let userNameVerified, emailVerified, phoneVerified;
	let formData = this;

	console.dir(formData);

	userNameVerified = verifyUserName(userNameInput.value);
	emailVerified = verifyEmail(emailInput.value);

	console.log(emailVerified);

}

function verifyUserName(userName) {
	
	console.log("Name verification started");

	let nameValidationRegExp = new RegExp("^(?:[а-я\\w-`]+\\s+){2}[а-я\\w-`]+$", "i");
	let userNameVerificationResult = nameValidationRegExp.test(userName.trim());

	console.log("Verification result: " + userNameVerificationResult);

	return userNameVerificationResult;

}

function verifyEmail(email) {

	console.log("Email verification started");

	let acceptedDomainNames = ["ya.ru", "yandex.ru", "yandex.ua", "yandex.by", "yandex.kz", "yandex.com"];
	let userPartValidationRegExp = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$", "i");
	
	let emailPartitions = email.split("@");
	if (emailPartitions.length != 2) return false;

	// According to RFC standards
	let userPartValidationResult = userPartValidationRegExp.test(emailPartitions[0]);
	let domainPartValidationResult = acceptedDomainNames.indexOf(emailPartitions[1]) != -1;

	console.log("User part validation result: " + userPartValidationResult + ", domain part val. result: " + domainPartValidationResult);

	return userPartValidationResult && domainPartValidationResult;

}