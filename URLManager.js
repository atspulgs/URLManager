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
* 1xx Errors - Method Errors.
* 	101: Paramaeters passed to the method were not acceptable.
*	102: <placeholder>
* 2xx Errors - Generic Errors.
*	201: Array index out of bounds.
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
* This is class used to keep the parameters key and value. This class also can keep a state of the
* parameter. Its either on or off. Thats meant to be used for the manager to know whether the parameter
* should be included in the url output or not.
*
* @param key 	- Key of the parameter.
* @param value 	- Value of the parameter.
*
* Example: url?key=value&key=value
* ---------------------------------------------------------------------------------------------- */
class URLParameter {
	constructor(key,value) {
		if(key.constructor.name !== "String" || value.constructor.name !== "String") {
            let error = new URLManagerException("001","Constructor error - Unacceptable parameters passed to the constructor.");
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

	/** -------------------------------------------------------------------------------------------
	* Sets this instance enablement to false, regardless of the initial state.
	* This would be the same as instance.enabled = false;
	* ------------------------------------------------------------------------------------------ */
    disable() {
        this.enabled = false;
    }

    /** -------------------------------------------------------------------------------------------
	* Sets this instance enablement to true, regarldess of the initial state.
	* This would eb the same as instancce.enabled = true.
	* ------------------------------------------------------------------------------------------ */
    enable() {
        this.enabled = true;
    }

    /** -------------------------------------------------------------------------------------------
	* This toggles the enablement of the state. This would check what the state it is intiially and
	* sets it to be the oposite. If its enabled, then disable. If its disabled then enable.
	* ------------------------------------------------------------------------------------------ */
    toggle() {
        if(this.enabled)
            this.enabled = false;
        else this.enabled = true;
    }

    /** -------------------------------------------------------------------------------------------
	* This gets the state of the instance. Its the same as instance.enabled.
	* ------------------------------------------------------------------------------------------ */
    get status() {
    	return this.enabled;
    }
}
/* --------------------------------------------------------------------------------------------------------------------------------------------------

/** -----------------------------------------------------------------------------------------------
* This is the class that allows you to put a url in its instance and allows you to control the parameters
* for the url. It also deals with URI encodings.
*
* @param url 	- URL that is being passed in. It can be simple or it can have params already.
* ---------------------------------------------------------------------------------------------- */
class URLManager {
	constructor(url) {
		if(url.constructor.name !== "String") {
			let error = new URLManagerException("001","Constructor error - Unacceptable parameters passed to the constructor.");
			error.addLine("The parameter 'url' has to be a string.");
			error.addLine("url: "+url+" <"+url.constructor.name+">");
			throw error;
		}
		this.url = decodeURI(url.indexOf("?") !== -1? url.slice(0, url.indexOf("?")) : url);
		this.params = new Array(0);
        if(url.indexOf("?") !== -1) {
            var tParams = url.slice(url.indexOf("?")+1).split("&");
            for(var i = tParams.length - 1; i >= 0; i--) {
                this.params.push(new Parameter(decodeURIComponent(tParams[i].slice(0,tParams[i].indexOf("="))),decodeURIComponent(tParams[i].slice(tParams[i].indexOf("=")+1))));
            }
		}
	}

	/** -------------------------------------------------------------------------------------------
	* This method allows you to add one or more new parameters to the url.
	* 
	* @param ...parameter 	- one or more URLParameters to be added to the url.
	* ------------------------------------------------------------------------------------------ */
	addParam(...parameter) {
		if(parameter.length >= 1) {
			for(let i = 0; i < parameter.length; ++i) {
				if(parameter[i] instanceof URLParameter) {
					this.params.push(parameter[i]);
				} else { 
					let error = new URLManagerException("101", "Paramaeters passed to the method were not acceptable.");
					error.addLine("The encountered parameter wasnt part of URLParameter instance. All previous parameters may have been added successfully.");
					error.addLine("parameter: "+parameter[i]+" <"+parameter[i].constructor.name+">");
					throw error;
				}
			}
		} else {
			let error = new URLManagerException("201", "Array index is out of bounds.");
			error.addLine("There has to be at least one parameter passed to the method. Otherwise ntohing can be done.");
			throw error;
		}
	}

	/** -------------------------------------------------------------------------------------------
	* 
	* ------------------------------------------------------------------------------------------ */
	getParam(key, encounter = 1) {
        if(key.constructor.name !== "String" || encounter.constructor.name !== "Number") {
            let error = new URLManagerException();

            throw error;
        }
        let enc = 0;
        for(var i = 0; i < this.params.length; i++) {
            if(this.params[i].key === key) {
            	enc++;
            	if(enc == encounter) {
                	return this.params[i];
            	}
            }
        }
        return null;
    }

    /** -------------------------------------------------------------------------------------------
	* 
	* ------------------------------------------------------------------------------------------ */
	getParams(key) {
		if(key.constructor.name !== "String") {
            let error = new URLManagerException();

            throw error;
        }
		let a = new Array(0);
		for(var i = 0; i < this.params.length; i++) {
			if(this.params[i].key === key) {
				a.push(this.params[i]);
			}
		}
		return a;
	}

    /** -------------------------------------------------------------------------------------------
	* 
	* ------------------------------------------------------------------------------------------ */
	updateParam(key, value) {
        if(key.constructor.name !== "String" || value.constructor.name !== "String") {
			let error = new URLManagerException();

            throw error;
        }
        let param = this.getParam(key);
        if(param === null) return null;
        param.value = value;
        return param;
    }

    /** -------------------------------------------------------------------------------------------
	* 
	* ------------------------------------------------------------------------------------------ */
	upeaddParam(key, value) {
        if(key.constructor.name !== "String" || value.constructor.name !== "String") {
        	let error = new URLManagerException();

            throw error;
        }
        let param = this.getParam(key);
        if(param === null) {
            param = new Parameter(key, value);
            this.addParam(param);
        } else param.value = value;
        return param;
    }

    /** -------------------------------------------------------------------------------------------
	* 
	* ------------------------------------------------------------------------------------------ */
	genUrl() {
		let url = this.url+"?";
		for(let i = 0; i < this.params.length; ++i) {
            if(this.params[i].enabled)
                url += encodeURIComponent(this.params[i].key)+"="+encodeURIComponent(this.params[i].value)+(i == this.params.length-1?"":"&");
		}
		return url;
	}
}