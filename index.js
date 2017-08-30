"use strict";

const mainForm = document.getElementById("myForm"),
	userNameInput = document.getElementById("name"),
	emailInput = document.getElementById("email"),
	phoneInput = document.getElementById("phone"),
	submitButton = document.getElementById("submitButton");

let MyForm = {

	validate() {
		
		let isValid = true;
		let errorFields = [];

		if (!verifyUserName(userNameInput.value)) {errorFields.push(userNameInput.name)};
		if (!verifyEmail(emailInput.value)) {errorFields.push(emailInput.name)};
		if (!verifyPhone(phoneInput.value)) {errorFields.push(phoneInput.name)};

		if (errorFields.length != 0) {isValid = false;}

		return {isValid, errorFields};

	},

	getData() {

	},

	setData(formData) {

	},

	submit() {

	}

}

mainForm.onsubmit = function (e) {

	e.preventDefault();

	let formData = this;

	console.dir(formData);

	let formValidationResult = MyForm.validate();

	if (!formValidationResult.isValid) {

		formValidationResult.errorFields.forEach(function(inputName) {
			addErrorClass(inputName);
		});

	}

}

function verifyUserName(userName) {
	
	console.log("Name verification started");

	let nameValidationRegExp = new RegExp("^(?:[а-я\\w-`]+\\s+){2}[а-я\\w-`]+$", "i");
	let userNameValidationPassed = nameValidationRegExp.test(userName.trim());

	console.log("Name verification result: " + userNameValidationPassed);
	return userNameValidationPassed;

}

function verifyEmail(email) {

	console.log("Email verification started");

	let acceptedDomainNames = ["ya.ru", "yandex.ru", "yandex.ua", "yandex.by", "yandex.kz", "yandex.com"];
	let userPartValidationRegExp = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$", "i");
	
	let emailPartitions = email.split("@");
	if (emailPartitions.length != 2) {

		console.log("Email verification failed");
		return false;

	}

	let userPartValidationPassed = userPartValidationRegExp.test(emailPartitions[0]);
	let domainPartValidationPassed = acceptedDomainNames.indexOf(emailPartitions[1]) != -1;

	console.log("User part verification result: " + userPartValidationPassed + ", domain part ver. result: " + domainPartValidationPassed);
	return userPartValidationPassed && domainPartValidationPassed;

}

function verifyPhone(phoneNumber) {

	console.log("Phone number verification started");

	let phoneFormatValidationRegExp = new RegExp("\\+7\\([0-9]{3}\\)[0-9]{3}(?:\\-[0-9]{2}){2}");
	
	let phoneFormatValidationPassed = phoneFormatValidationRegExp.test(phoneNumber);
	let summOfAllNumbers = 0;

	if (phoneFormatValidationPassed) {

		console.log("Phone number format is correct");

		for (let i = 0; i < phoneNumber.length; i++) {
			let currentSymbol = phoneNumber[i];
			if (!isNaN(currentSymbol)) {summOfAllNumbers += parseInt(currentSymbol)};
		}

		let summOfAllNumbersValidationResult = summOfAllNumbers <= 30;

		console.log("Summ of numbers verification result: " + summOfAllNumbersValidationResult);
		return summOfAllNumbersValidationResult;

	} 

	console.log("Phone number verification failed");
	return false;

}

function addErrorClass(inputName) {

	let fieldNode = document.getElementsByName(inputName)[0];
	fieldNode.classList.add("error");

}
