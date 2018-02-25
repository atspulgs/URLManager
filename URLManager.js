"use strict";

/** -------------------------------------------------------------------------------------------------------------------------------------------------
*	@author Toms Andrulis
*	@version 0.1
* ------------------------------------------------------------------------------------------------------------------------------------------------ */

/** -----------------------------------------------------------------------------------------------
* Main exception class for URLManager.
*
* @param errorCode A number representing the particular error.
* @param ...params Parameter array that is passed to the Error class.
*
* Error params are:
*	message		- A human-readable description of the error.
*	fileName	- The value for the fileName property on the created Error object. Defaults to the name of the file containing the code that called the Error() constructor.
*	lineNumber	- The value for the lineNumber property on the created Error object. Defaults to the line number containing the Error() constructor invocation.
*
* This error class can function more or less the same as a regular error would in javascript.
* The extras on this class are to allow for a more informative outputs in catch statements.
*
* -- Error Codes --
* 0xx Errors - Constructor Errors.
*	001: Essentially this error represents a failure with the parameters passed in the constructor.
*	002: <placeholder>
*	003: <placeholder>
* 1xx Errors - <placeholder>
* 	101: <placeholder>
*	102: <placeholder>
* ---------------------------------------------------------------------------------------------- */
class URLManagerException extends Error {
	constructor(errorCode, ...params) {
		super(...params);
		if(Error.captureStackTrace) {
			Error.captureStackTrace(this, URLManagerException);
		}
		this.errorCode = errorCode;
		this.lines = new Array(0);
	}

	/** -------------------------------------------------------------------------------------------
	* This method provides a way to push onto the array meant to hold extra information on the error
	* you are throwing. Of course this could be done directly like this (error.lines.push()). This
	* method could be considered as an alternative to it since the result would be the same.
	*
	* @param line 	- An extra line of information.
	* ------------------------------------------------------------------------------------------ */
	addLine(line) {
		this.lines.push(line);
	}
	/** -------------------------------------------------------------------------------------------
	* This is a static method used to format URLManagerExceptions in a single string. This is probably
	* the better ways to get most of the custom data out easily. You can always do the formating yourself
	* when you catch the error or let the browser use the default excpetion handling which will only hold the
	* default message passed to it.
	*
	* The idea is that you can turn a more detailed logging on when needed.
	* https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
	*
	* @param error 	- Instance of The Error. (Ideally it has to be URLManagerException)
	*
	* @return returns a complete formatted string for output.
	* ------------------------------------------------------------------------------------------ */
	static format(error) {
		let errorString = "";
		if(error instanceof URLManagerException) {
			errorString += error.errorCode+": "+error.message+"\n";
			error.lines.forEach(function(element) {
				errorString += element+"\n";
			});
		} else {
			errorString += "URLManagerException.format could not format the passed in error."
		}
		return errorString;
	}
}
/* --------------------------------------------------------------------------------------------------------------------------------------------------

/** -----------------------------------------------------------------------------------------------
* 
* ---------------------------------------------------------------------------------------------- */
class URLParameter {
	constructor(key,value) {
		if(key.constructor.name !== "String" || value.constructor.name !== "String") {
            var error = new URLManagerException("001","Constructor error - Unacceptable parameters passed to the constructor.");
            error.addLine("Both 'key' and 'value' are expected to be strings."
            	+"\n\tTip: If youre passing in a number, please make sure its a string.\n\tExample: \"\"+number. Where 'number' is a variable of a number");
            error.addLine("key: "+key+" <"+key.constructor.name+">");
            error.addLine("value: "+value+" <"+value.constructor.name+">");
            throw error;
		}
		this.key = key;
        this.value = value;
        this.enabled = true;
	}

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }

    toggle() {
        if(this.enabled)
            this.enabled = false;
        else this.enabled = true;
    }

    get status() {
    	return this.enabled;
    }
}
/* --------------------------------------------------------------------------------------------------------------------------------------------------

/** -----------------------------------------------------------------------------------------------
* 
* ---------------------------------------------------------------------------------------------- */
class URLManager {

}