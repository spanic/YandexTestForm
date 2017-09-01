"use strict";

const mainForm = document.getElementById("myForm"),
	userNameInput = document.getElementById("name"),
	emailInput = document.getElementById("email"),
	phoneInput = document.getElementById("phone"),
	submitButton = document.getElementById("submitButton"),
	resultContainer = document.getElementById("resultContainer");

const responseTemplateNames = ["success.json", "error.json", "progress.json"];

removeErrorClass(userNameInput, emailInput, phoneInput);

let MyForm = {

	validate() {
		
		let isValid = true;
		let errorFields = [];

		if (!verifyUserName(userNameInput.value)) {errorFields.push(userNameInput.name)};
		if (!verifyEmail(emailInput.value)) {errorFields.push(emailInput.name)};
		if (!verifyPhone(phoneInput.value)) {errorFields.push(phoneInput.name)};

		if (errorFields.length != 0) {isValid = false;}
		
		errorFields.forEach(function(inputName) {
			addErrorClass(inputName);
		});

		return {isValid, errorFields};

	},

	getData() {

		let formDataObject = addPropertyWithValue(userNameInput, emailInput, phoneInput);
		return formDataObject;

	},

	setData(formData) {

		for (let currentProperty in formData) {

			let targetInputField;

			switch (currentProperty) {
				case userNameInput.name : targetInputField = userNameInput; break;
				case emailInput.name : targetInputField = emailInput; break;
				case phoneInput.name : targetInputField = phoneInput; break;
			}

			if (targetInputField != undefined) {targetInputField.value = formData[currentProperty];}

		}

	},

	submit() {
		
		let test = MyForm.validate();
		
		console.dir(test);

		if (test.isValid) {
			
			disableSubmitButton();
		
			let randomResponceTemplateNumber = Math.floor(Math.random() * 3);

			let ajaxRequest = new XMLHttpRequest();

			ajaxRequest.onreadystatechange = function() {

				if (this.readyState == XMLHttpRequest.DONE && 
					(this.status == 0 || this.status == 200)) /* Zero status value added to maintain local ALAX calls */ {
					
					let responseJSONObject = JSON.parse(this.responseText);
					console.log(responseJSONObject);
					processResponse(responseJSONObject);					
					
				}

			};
			
			let responseTemplateName = responseTemplateNames[randomResponceTemplateNumber];
			
			console.log(mainForm.action + "/" + responseTemplateName);

			ajaxRequest.open("GET", mainForm.action + "/" + responseTemplateName);
			ajaxRequest.send();
			
		}

	}

}

submitButton.onclick = function (e) {

	e.preventDefault();

	let formData = this;
	console.dir(formData);

	MyForm.submit();

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
	fieldNode.classList.add("incorrect");
	fieldNode.classList.add("error");

}

function removeErrorClass() {

	Array.prototype.forEach.call(arguments, function(inputNode) {
		inputNode.addEventListener("focus", function() {
			this.classList.remove("incorrect");
			this.classList.remove("error");
		});
	});

}

function addPropertyWithValue() {

	let resultObject = {};

	console.log(arguments);

	Array.prototype.forEach.call(arguments, function(inputNode) {
		Object.defineProperty(resultObject, inputNode.name, {
			value : inputNode.value
		})
	});

	return resultObject;

}

function processResponse(responseJSONObject) {
	
	let responseTextElementId = "resultText",
		responseIconElementId = "resultIcon";
	
	resultContainer.removeAttribute("class");
	removeElementIfExists(responseIconElementId, responseTextElementId);
	
	let responseTextNode = document.createElement("span");
	responseTextNode.id = responseTextElementId;
	let responseTextContent;
	
	let resultIcon = document.createElement("object");
	resultIcon.setAttribute("type", "image/svg+xml");
	resultIcon.id = responseIconElementId;
	let displayedIconName;
	
	let responseStatus = responseJSONObject.status;
	switch (responseStatus) {
			
		case "success" : {
			resultContainer.classList.add("success");
			responseTextContent = "Success";
			displayedIconName = "correct";
			enableSubmitButton();
			break;
		}
		
		case "error" : {
			resultContainer.classList.add("error");
			responseTextContent = responseJSONObject.reason;
			displayedIconName = "incorrect";
			enableSubmitButton();
			break;
		}
		
		case "progress" : {
			resultContainer.classList.add("progress");
			responseTextContent = "Service is busy, wait please...";
			displayedIconName = "pending";
			setTimeout(function() {MyForm.submit();}, responseJSONObject.timeout);
			break;
		}
		
	}
	
	responseTextNode.textContent = responseTextContent;
	resultIcon.setAttribute("data", "img/icons.svg#" + displayedIconName);
	
	resultContainer.appendChild(resultIcon);
	resultContainer.appendChild(responseTextNode);
	
}

function removeElementIfExists() {
	
	Array.prototype.forEach.call(arguments, function(nodeId) {
		if (document.contains(document.getElementById(nodeId)))
			document.getElementById(nodeId).remove();
	});
	
}

function disableSubmitButton() {
	
	submitButton.disabled = true;
	submitButton.classList.add("disabled");
	
}

function enableSubmitButton() {
	
	submitButton.disabled = false;
	submitButton.classList.remove("disabled");
	
}
