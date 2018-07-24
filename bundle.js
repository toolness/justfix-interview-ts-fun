/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./web/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/interview-io.ts":
/*!*****************************!*\
  !*** ./lib/interview-io.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __webpack_require__(/*! ./question */ "./lib/question.ts");
const events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/**
 * This is any input/output mechanism by which the interview communicates with
 * the user.
 *
 * This interface has been designed to conduct interviews using multiple
 * communication media (voice, SMS, web, etc).
 */
class InterviewIO extends events_1.EventEmitter {
    createDateQuestion(text) {
        return new question_1.DateQuestion(text);
    }
    createMultiChoiceQuestion(text, answers) {
        return new question_1.MultiChoiceQuestion(text, answers);
    }
    createYesNoQuestion(text) {
        return new question_1.YesNoQuestion(text);
    }
    createNonBlankQuestion(text) {
        return new question_1.NonBlankQuestion(text);
    }
}
exports.InterviewIO = InterviewIO;


/***/ }),

/***/ "./lib/interview.ts":
/*!**************************!*\
  !*** ./lib/interview.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/**
 * This represents a series of questions for a user, parameterized by
 * a type that represents the state of the interview (e.g., the answers
 * to the questions the user has been asked).
 */
class Interview extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.now = options.now || new Date();
        this.io = options.io;
    }
    /**
     * This is an optional method that runs the next irreversible task that
     * the interview is capable of undertaking (e.g. sending an email or
     * real-world letter, filing a court case, etc).
     *
     * @param state The current state of the interview.
     */
    async runNextTask(state) {
        return state;
    }
    /**
     * This is an optional method that returns all the follow-ups
     * for the interview, given its current state.
     *
     * @param state The current state of the interview.
     */
    getFollowUps(state) {
        return [];
    }
    /**
     * Execute the next valid follow-up, if any. If no valid
     * follow-ups are available, the original state is returned.
     *
     * @param state The current state of the interview.
     */
    async executeNextFollowUp(state) {
        for (let followUp of this.getFollowUps(state)) {
            if (this.now >= new Date(followUp.date)) {
                return await followUp.execute();
            }
        }
        return state;
    }
    /**
     * Runs the interview, asking the user questions until they
     * are exhausted. Returns the final state of the interview.
     *
     * @param initialState
     */
    async execute(initialState) {
        let state = initialState;
        while (true) {
            let nextState = await this.askNext(state);
            if (nextState === state) {
                nextState = await this.executeNextFollowUp(state);
            }
            if (nextState === state) {
                nextState = await this.runNextTask(state);
            }
            if (nextState === state) {
                break;
            }
            this.emit('change', state, nextState);
            state = nextState;
        }
        return state;
    }
}
exports.Interview = Interview;


/***/ }),

/***/ "./lib/question.ts":
/*!*************************!*\
  !*** ./lib/question.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a validation error for a question, e.g. when a user
 * provides an invalid response.
 *
 * Note that this doesn't extend the standard Error class,
 * because it's not actually designed to be thrown: the rationale
 * is that validation errors are a normal occurrence and our
 * code should check for them all the time, rather than throwing
 * them and potentially having them go uncaught.
 */
class ValidationError {
    constructor(message) {
        this.message = message;
    }
}
exports.ValidationError = ValidationError;
/**
 * Represents a question in an interview, parmeterized by
 * the type of data that a valid answer represents.
 *
 * For example, a question like "How old are you?" might
 * be a Question<number>, while "Do you like salad?" might
 * be a Question<boolean>.
 */
class Question {
}
exports.Question = Question;
/**
 * A multiple-choice question. Answers are automatically
 * numbered.
 */
class MultiChoiceQuestion extends Question {
    constructor(question, answers) {
        super();
        this.question = question;
        this.answers = answers;
    }
    get text() {
        const parts = [this.question, ''];
        this.answers.forEach(([_, label], i) => {
            parts.push(`${i + 1} - ${label}`);
        });
        parts.push('', 'Enter a number from the list above:');
        return parts.join('\n');
    }
    async processResponse(response) {
        const responseInt = parseInt(response, 10);
        const answer = this.answers[responseInt - 1];
        if (answer === undefined) {
            return new ValidationError('Please choose a valid number.');
        }
        return answer[0];
    }
}
exports.MultiChoiceQuestion = MultiChoiceQuestion;
/**
 * A basic question that accepts any kind of non-blank input.
 */
class NonBlankQuestion extends Question {
    constructor(text) {
        super();
        this.text = text;
    }
    async processResponse(response) {
        if (!response.trim()) {
            return new ValidationError('Your response cannot be blank!');
        }
        return response;
    }
}
exports.NonBlankQuestion = NonBlankQuestion;
/**
 * A question whose answer must always be "yes" or "no".
 */
class YesNoQuestion extends Question {
    constructor(text) {
        super();
        this.text = text;
    }
    async processResponse(response) {
        const YES_REGEX = /^\s*y/i;
        const NO_REGEX = /^\s*n/i;
        if (YES_REGEX.test(response)) {
            return true;
        }
        else if (NO_REGEX.test(response)) {
            return false;
        }
        return new ValidationError('Please answer with "yes" or "no".');
    }
}
exports.YesNoQuestion = YesNoQuestion;
/**
 * A question that asks for a date (not including the time).
 */
class DateQuestion extends Question {
    constructor(text) {
        super();
        this.text = text;
    }
    async processResponse(response) {
        const DATE_REGEX = /^\d\d\d\d-\d\d-\d\d$/;
        if (DATE_REGEX.test(response)) {
            const date = new Date(response);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        return new ValidationError('Please specify a valid date in YYYY-MM-DD format.');
    }
}
exports.DateQuestion = DateQuestion;


/***/ }),

/***/ "./lib/tenant-interview.ts":
/*!*********************************!*\
  !*** ./lib/tenant-interview.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tenant_1 = __webpack_require__(/*! ./tenant */ "./lib/tenant.ts");
const interview_1 = __webpack_require__(/*! ./interview */ "./lib/interview.ts");
const util_1 = __webpack_require__(/*! ./util */ "./lib/util.ts");
const util_2 = __webpack_require__(/*! ./web/util */ "./lib/web/util.ts");
const RENTAL_HISTORY_FOLLOWUP_DAYS = 7;
class TenantInterview extends interview_1.Interview {
    async askForLeaseType(tenant) {
        const leaseType = await this.io.ask(this.io.createMultiChoiceQuestion('What kind of lease do you have?', [
            [tenant_1.LeaseType.MarketRate, 'Market rate'],
            [tenant_1.LeaseType.RentStabilized, 'Rent stabilized'],
            [tenant_1.LeaseType.NYCHA, 'Public housing (NYCHA)'],
            [tenant_1.LeaseType.Other, 'Other (e.g. month-to-month)'],
            [tenant_1.LeaseType.Unknown, 'Not sure'],
        ]));
        return { ...tenant, leaseType };
    }
    async askForHousingIssues(tenant) {
        const housingIssues = await this.io.askMany({
            needsRepairs: this.io.createYesNoQuestion('Does your apartment need repairs?'),
            isHarassed: this.io.createYesNoQuestion('Are you being harassed by your landlord?'),
            isFacingEviction: this.io.createYesNoQuestion('Are you facing eviction?'),
            hasLeaseIssues: this.io.createYesNoQuestion('Are you having issues with your lease?'),
            hasNoServices: this.io.createYesNoQuestion('Are you living without essential services, like heat/gas/hot water?'),
            hasOther: this.io.createYesNoQuestion('Do you have any other apartment issues?'),
        });
        if (housingIssues.isFacingEviction) {
            this.io.notify("Since you’re in an eviction, it’s important to try to get legal help right away. " +
                "We’ll point you to a resource that can help you find a lawyer in just a few moments.");
        }
        return { ...tenant, housingIssues };
    }
    async askForRentalHistory(tenant) {
        while (true) {
            const permission = await this.io.ask(this.io.createYesNoQuestion('Can we request your rental history from your landlord?'));
            if (permission) {
                return { ...tenant, rentalHistory: { status: 'accepted' } };
            }
            else {
                this.io.notify("Um, we really need to request your rental history to proceed.");
            }
        }
    }
    async followupRentalHistory(rentalHistory) {
        const wasReceived = await this.io.ask(this.io.createYesNoQuestion('Have you received your rental history yet?'));
        if (wasReceived) {
            const details = await this.io.askMany({
                dateReceived: this.io.createDateQuestion('When did you receive your rental history?'),
                isRentStabilized: this.io.createYesNoQuestion('Are you rent stabilized?'),
                photo: this.io.createPhotoQuestion('Please submit a photograph of your rental history.')
            });
            return {
                status: 'received',
                dateRequested: rentalHistory.dateRequested,
                ...details
            };
        }
        else {
            this.io.notify(`Alas, we will ask again in ${RENTAL_HISTORY_FOLLOWUP_DAYS} days.`);
            return {
                ...rentalHistory,
                nextReminder: util_1.addDays(this.now, RENTAL_HISTORY_FOLLOWUP_DAYS)
            };
        }
    }
    async askNext(tenant) {
        if (!tenant.name) {
            return {
                ...tenant,
                name: await this.io.ask(this.io.createNonBlankQuestion('What is your name?'))
            };
        }
        if (!tenant.housingIssues) {
            return this.askForHousingIssues(tenant);
        }
        if (!tenant.leaseType) {
            return this.askForLeaseType(tenant);
        }
        if (!tenant.phoneNumber) {
            return {
                ...tenant,
                phoneNumber: await this.io.ask(this.io.createNonBlankQuestion('What is your phone number?'))
            };
        }
        if (!tenant.rentalHistory) {
            return this.askForRentalHistory(tenant);
        }
        return tenant;
    }
    async runNextTask(tenant) {
        if (tenant.rentalHistory && tenant.rentalHistory.status === 'accepted') {
            // TODO: Actually request rental history.
            this.io.setStatus('Requesting your rental history...');
            await util_2.sleep(3000);
            this.io.notify(`Rental history requested! We'll ask if you've received it in ` +
                `${RENTAL_HISTORY_FOLLOWUP_DAYS} days.`);
            return {
                ...tenant,
                rentalHistory: {
                    status: 'requested',
                    dateRequested: this.now,
                    nextReminder: util_1.addDays(this.now, RENTAL_HISTORY_FOLLOWUP_DAYS)
                }
            };
        }
        return tenant;
    }
    getFollowUps(tenant) {
        const followUps = [];
        const rentalHistory = tenant.rentalHistory;
        if (rentalHistory && rentalHistory.status === 'requested') {
            followUps.push({
                date: rentalHistory.nextReminder,
                name: 'Rental history follow-up',
                execute: async () => ({
                    ...tenant,
                    rentalHistory: await this.followupRentalHistory(rentalHistory)
                }),
            });
        }
        return followUps;
    }
}
exports.TenantInterview = TenantInterview;


/***/ }),

/***/ "./lib/tenant.ts":
/*!***********************!*\
  !*** ./lib/tenant.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LeaseType;
(function (LeaseType) {
    /** Market rate or free market lease. */
    LeaseType["MarketRate"] = "mr";
    /** Rent stabilized (or rent controlled). */
    LeaseType["RentStabilized"] = "rs";
    /** Public housing. */
    LeaseType["NYCHA"] = "nycha";
    /** Other housing can be e.g. month to month without a lease, coop, shelter, sublet, Mitchell Lama. */
    LeaseType["Other"] = "other";
    /** The tenant is uncertain of their actual lease type. */
    LeaseType["Unknown"] = "unknown";
})(LeaseType = exports.LeaseType || (exports.LeaseType = {}));


/***/ }),

/***/ "./lib/util.ts":
/*!*********************!*\
  !*** ./lib/util.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// https://stackoverflow.com/a/3674550/2422398
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
exports.addDays = addDays;


/***/ }),

/***/ "./lib/web/date.ts":
/*!*************************!*\
  !*** ./lib/web/date.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __webpack_require__(/*! ../question */ "./lib/question.ts");
const util_1 = __webpack_require__(/*! ./util */ "./lib/web/util.ts");
class WebDateQuestion extends question_1.DateQuestion {
    constructor(text) {
        super(text);
        this.text = text;
        this.input = util_1.makeInput('date');
        this.container = util_1.wrapInControlDiv(this.input);
    }
    getElement() {
        return this.container;
    }
    processElement() {
        const isModernBrowser = 'valueAsDate' in this.input;
        if (isModernBrowser) {
            if (!this.input.valueAsDate) {
                return new question_1.ValidationError('Please provide a valid date!');
            }
            return this.input.valueAsDate;
        }
        return this.processResponse(this.input.value);
    }
}
exports.WebDateQuestion = WebDateQuestion;


/***/ }),

/***/ "./lib/web/io.ts":
/*!***********************!*\
  !*** ./lib/web/io.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interview_io_1 = __webpack_require__(/*! ../interview-io */ "./lib/interview-io.ts");
const question_1 = __webpack_require__(/*! ../question */ "./lib/question.ts");
const photo_1 = __webpack_require__(/*! ./photo */ "./lib/web/photo.ts");
const yes_no_1 = __webpack_require__(/*! ./yes-no */ "./lib/web/yes-no.ts");
const util_1 = __webpack_require__(/*! ./util */ "./lib/web/util.ts");
const date_1 = __webpack_require__(/*! ./date */ "./lib/web/date.ts");
const multi_choice_1 = __webpack_require__(/*! ./multi-choice */ "./lib/web/multi-choice.ts");
const throbber_1 = __importDefault(__webpack_require__(/*! ./throbber */ "./lib/web/throbber.ts"));
/**
 * Returns whether the given Question has native web support.
 *
 * @param question A Question instance.
 */
function isWebQuestion(question) {
    return typeof (question.getElement) === 'function';
}
/**
 * Given a Question, return a web-enabled version of it. If the
 * Question doesn't have native web support, we wrap it in a
 * simple text input field as a fallback.
 */
function createWebWidget(question) {
    if (isWebQuestion(question)) {
        return question;
    }
    else {
        const input = util_1.makeInput('text');
        const control = util_1.wrapInControlDiv(input);
        return {
            getElement: () => control,
            processElement: () => question.processResponse(input.value),
            labelForId: input.id
        };
    }
}
class QuestionInput {
    constructor(question) {
        this.question = question;
        this.question = question;
        this.container = util_1.makeElement('div', { classes: ['field'] });
        const label = util_1.makeElement('label', {
            classes: ['jf-question', 'label'],
            textContent: question.text,
            appendTo: this.container,
        });
        this.widget = createWebWidget(question);
        this.container.appendChild(this.widget.getElement());
        if (this.widget.labelForId) {
            label.setAttribute('for', this.widget.labelForId);
        }
        this.error = null;
    }
    showError(message) {
        if (!this.error) {
            this.error = util_1.makeElement('p', {
                classes: ['help', 'is-danger'],
                appendTo: this.container
            });
        }
        this.error.textContent = message;
    }
    hideError() {
        if (this.error) {
            this.container.removeChild(this.error);
            this.error = null;
        }
    }
    async respond() {
        let response = await this.widget.processElement();
        if (response instanceof question_1.ValidationError) {
            this.showError(response.message);
            return null;
        }
        this.hideError();
        return response;
    }
}
exports.QuestionInput = QuestionInput;
class WebInterviewIO extends interview_io_1.InterviewIO {
    constructor(root, modalBuilder) {
        super();
        this.modalBuilder = modalBuilder;
        this.root = root;
        this.modalBuilder = modalBuilder;
        this.statusDiv = util_1.makeElement('div', { appendTo: root });
    }
    ensureRoot() {
        if (!this.root) {
            throw new Error(`${this.constructor.name} was shut down`);
        }
        return this.root;
    }
    async ask(question) {
        return (await this.askMany({ question })).question;
    }
    async askMany(questions) {
        const form = document.createElement('form');
        const questionInputs = {};
        let foundFirstQuestion = false;
        this.ensureRoot().appendChild(form);
        this.setStatus('');
        for (let key in questions) {
            if (!foundFirstQuestion) {
                foundFirstQuestion = true;
                this.emit('title', questions[key].text);
            }
            const qi = new QuestionInput(questions[key]);
            questionInputs[key] = qi;
            form.appendChild(qi.container);
        }
        const submit = util_1.makeElement('button', {
            type: 'submit',
            classes: ['button', 'is-primary'],
            textContent: 'Submit',
            appendTo: form,
        });
        const getResponses = async () => {
            const responses = {};
            let isValid = true;
            for (let key in questionInputs) {
                const response = await questionInputs[key].respond();
                if (response !== null) {
                    responses[key] = response;
                }
                else {
                    isValid = false;
                }
            }
            return isValid ? responses : null;
        };
        return new Promise((resolve, reject) => {
            form.onsubmit = (e) => {
                e.preventDefault();
                getResponses().then(responses => {
                    if (responses) {
                        this.ensureRoot().removeChild(form);
                        return resolve(responses);
                    }
                }).catch(reject);
            };
        });
    }
    notify(text) {
        this.setStatus('');
        this.modalBuilder.createAndOpen(text);
    }
    setStatus(text, options = { showThrobber: true }) {
        this.ensureRoot();
        this.statusDiv.textContent = text;
        if (text) {
            if (options.showThrobber) {
                this.statusDiv.appendChild(document.createTextNode(' '));
                this.statusDiv.appendChild(throbber_1.default());
            }
            this.emit('title', text);
        }
    }
    createPhotoQuestion(text) {
        return new photo_1.WebPhotoQuestion(text);
    }
    createYesNoQuestion(text) {
        return new yes_no_1.WebYesNoQuestion(text);
    }
    createDateQuestion(text) {
        return new date_1.WebDateQuestion(text);
    }
    createMultiChoiceQuestion(text, answers) {
        return new multi_choice_1.WebMultiChoiceQuestion(text, answers);
    }
    close() {
        this.ensureRoot().innerHTML = '';
        this.root = null;
        this.modalBuilder.shutdown();
    }
}
exports.WebInterviewIO = WebInterviewIO;


/***/ }),

/***/ "./lib/web/modal.ts":
/*!**************************!*\
  !*** ./lib/web/modal.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(/*! ./util */ "./lib/web/util.ts");
const events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
class ModalBuilder {
    constructor(template) {
        this.template = template;
        this.modal = null;
        this.isShutDown = false;
        this.template = template;
        this.create('this is a smoke test to make sure the template is valid!');
    }
    create(text) {
        return new Modal(this.template, text);
    }
    /**
     * Create a simple modal with some text and an OK button, and show it.
     *
     * @param text The text to display in the modal.
     */
    createAndOpen(text) {
        if (this.isShutDown) {
            throw new Error(`${this.constructor.name} is shut down`);
        }
        if (this.modal) {
            this.modal.addText(text);
        }
        else {
            this.modal = this.create(text);
            this.modal.on('close', () => {
                this.modal = null;
            });
            this.modal.open();
        }
    }
    shutdown() {
        if (this.modal) {
            this.modal.close();
        }
        this.isShutDown = true;
    }
}
exports.ModalBuilder = ModalBuilder;
class Modal extends events_1.EventEmitter {
    constructor(template, text) {
        super();
        const clone = document.importNode(template.content, true);
        this.modalDiv = util_1.getElement('div', '.modal', clone);
        this.contentEl = util_1.getElement('div', '[data-modal-content]', this.modalDiv);
        this.okButton = util_1.getElement('button', '.is-primary', this.modalDiv);
        this.closeButton = util_1.getElement('button', '.modal-close', this.modalDiv);
        this.close = this.close.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.contentEl.textContent = text;
    }
    open() {
        document.body.appendChild(this.modalDiv);
        document.addEventListener('keyup', this.handleKeyUp);
        this.okButton.focus();
        this.okButton.onclick = this.closeButton.onclick = this.close;
        // TODO: Trap keyboard focus and all the other accessibility bits.
    }
    close() {
        document.body.removeChild(this.modalDiv);
        document.removeEventListener('keyup', this.handleKeyUp);
        this.emit('close');
    }
    addText(text) {
        util_1.makeElement('br', { appendTo: this.contentEl });
        util_1.makeElement('br', { appendTo: this.contentEl });
        this.contentEl.appendChild(document.createTextNode(text));
    }
    handleKeyUp(event) {
        if (event.keyCode === 27) {
            this.close();
        }
    }
}


/***/ }),

/***/ "./lib/web/multi-choice.ts":
/*!*********************************!*\
  !*** ./lib/web/multi-choice.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __webpack_require__(/*! ../question */ "./lib/question.ts");
const util_1 = __webpack_require__(/*! ./util */ "./lib/web/util.ts");
class WebMultiChoiceQuestion extends question_1.Question {
    constructor(question, answers) {
        super();
        this.text = question;
        this.answers = answers;
        this.div = util_1.makeElement('div', { classes: ['control'] });
        this.inputName = util_1.createUniqueId();
        this.radios = answers.map(answer => {
            const wrapper = util_1.makeElement('p', { appendTo: this.div });
            return util_1.makeRadio(wrapper, this.inputName, answer[1]).input;
        });
    }
    getElement() {
        return this.div;
    }
    async processElement() {
        for (let i = 0; i < this.radios.length; i++) {
            const radio = this.radios[i];
            if (radio.checked) {
                return this.answers[i][0];
            }
        }
        return new question_1.ValidationError('Please choose an answer.');
    }
    processResponse(response) {
        throw new Error('This should never be called!');
    }
}
exports.WebMultiChoiceQuestion = WebMultiChoiceQuestion;


/***/ }),

/***/ "./lib/web/photo.ts":
/*!**************************!*\
  !*** ./lib/web/photo.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __webpack_require__(/*! ../question */ "./lib/question.ts");
const util_1 = __webpack_require__(/*! ./util */ "./lib/web/util.ts");
class WebPhotoQuestion extends question_1.Question {
    constructor(text) {
        super();
        this.text = text;
        this.text = text;
        this.input = util_1.makeElement('input', { type: 'file' });
        this.labelForId = this.input.id;
    }
    processResponse(response) {
        throw new Error('This function should never be called!');
    }
    getElement() {
        return this.input;
    }
    async processElement() {
        const files = this.input.files;
        if (!files || files.length === 0) {
            return new question_1.ValidationError('You must upload an image!');
        }
        const file = files[0];
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (event) => {
                if (!event.target) {
                    return reject('event.target is null!');
                }
                if (typeof (event.target.result) === 'string' &&
                    /^data:/.test(event.target.result)) {
                    resolve(event.target.result);
                }
                else {
                    reject('event.target.result is not a data URI!');
                }
            };
            reader.readAsDataURL(file);
        });
    }
}
exports.WebPhotoQuestion = WebPhotoQuestion;


/***/ }),

/***/ "./lib/web/serializer.ts":
/*!*******************************!*\
  !*** ./lib/web/serializer.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class LocalStorageSerializer {
    constructor(keyname, defaultState) {
        this.keyname = keyname;
        this.defaultState = defaultState;
        this.keyname = keyname;
        this.defaultState = defaultState;
    }
    get() {
        try {
            const contents = window.localStorage[this.keyname];
            return JSON.parse(contents);
        }
        catch (e) {
            return this.defaultState;
        }
    }
    set(state) {
        const contents = JSON.stringify(state, null, 2);
        window.localStorage[this.keyname] = contents;
    }
}
exports.LocalStorageSerializer = LocalStorageSerializer;


/***/ }),

/***/ "./lib/web/throbber.ts":
/*!*****************************!*\
  !*** ./lib/web/throbber.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(/*! ./util */ "./lib/web/util.ts");
// https://commons.wikimedia.org/wiki/File:Chromiumthrobber.svg
const HTML = `
<svg width="16" height="16" viewBox="0 0 300 300"
     xmlns="http://www.w3.org/2000/svg" version="1.1">
  <path d="M 150,0
           a 150,150 0 0,1 106.066,256.066
           l -35.355,-35.355
           a -100,-100 0 0,0 -70.711,-170.711 z"
        fill="#00d1b2">
    <animateTransform attributeName="transform" attributeType="XML"
           type="rotate" from="0 150 150" to="360 150 150"
           begin="0s" dur="1s" fill="freeze" repeatCount="indefinite" />
  </path>
</svg>
`.trim();
function makeThrobber() {
    const div = util_1.makeElement('div', { innerHTML: HTML });
    const svg = div.querySelector('svg');
    if (!svg) {
        throw new Error('throbber svg not found');
    }
    return svg;
}
exports.default = makeThrobber;
// This is a smoke test/sanity check.
makeThrobber();


/***/ }),

/***/ "./lib/web/util.ts":
/*!*************************!*\
  !*** ./lib/web/util.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Find an element.
 *
 * @param tagName The name of the element's HTML tag.
 * @param selector The selector for the element, not including its HTML tag.
 * @param parent The parent node to search within.
 */
function getElement(tagName, selector, parent = document) {
    const finalSelector = `${tagName}${selector}`;
    const node = parent.querySelector(finalSelector);
    if (!node) {
        throw new Error(`Couldn't find any elements matching "${finalSelector}"`);
    }
    return node;
}
exports.getElement = getElement;
let idCounter = 0;
function createUniqueId() {
    idCounter++;
    return `unique_id_${idCounter}`;
}
exports.createUniqueId = createUniqueId;
/**
 * Create an HTML element.
 *
 * If the element is an <input>, automatically assign a unique ID to it.
 *
 * @param tagName The name of the element's HTML tag.
 * @param options Options for the element.
 */
function makeElement(tagName, options) {
    const el = document.createElement(tagName);
    if (options.classes) {
        options.classes.forEach(className => el.classList.add(className));
    }
    if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
        el.type = options.type || '';
    }
    if (el instanceof HTMLInputElement) {
        el.name = options.name || '';
        el.value = options.value || '';
        el.id = createUniqueId();
    }
    if (options.textContent) {
        el.textContent = options.textContent;
    }
    if (options.innerHTML) {
        el.innerHTML = options.innerHTML;
    }
    if (options.appendTo) {
        options.appendTo.appendChild(el);
    }
    if (options.children) {
        options.children.forEach(child => el.appendChild(child));
    }
    if (typeof (options.tabIndex) === 'number') {
        el.tabIndex = options.tabIndex;
    }
    return el;
}
exports.makeElement = makeElement;
/**
 * Create an <input> element with a unique id.
 *
 * @param type The value of the input's "type" attribute.
 */
function makeInput(type) {
    return makeElement('input', { type, classes: ['input'] });
}
exports.makeInput = makeInput;
/**
 * Wrap the given element in a <div class="control">.
 *
 * @param el The element to wrap.
 */
function wrapInControlDiv(el) {
    return makeElement('div', {
        classes: ['control'],
        children: [el],
    });
}
exports.wrapInControlDiv = wrapInControlDiv;
/**
 * Create an <input type="radio"> wrapped in a <label>.
 *
 * @param parent The parent node to append the radio to.
 * @param inputName The "name" attribute of the radio.
 * @param labelText The text of the radio's label.
 */
function makeRadio(parent, inputName, labelText) {
    const label = makeElement('label', { classes: ['radio'] });
    const input = makeElement('input', {
        type: 'radio',
        name: inputName,
        value: labelText,
        appendTo: label
    });
    label.appendChild(document.createTextNode(` ${labelText}`));
    parent.appendChild(label);
    return { label, input };
}
exports.makeRadio = makeRadio;
function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
exports.sleep = sleep;


/***/ }),

/***/ "./lib/web/yes-no.ts":
/*!***************************!*\
  !*** ./lib/web/yes-no.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __webpack_require__(/*! ../question */ "./lib/question.ts");
const util_1 = __webpack_require__(/*! ./util */ "./lib/web/util.ts");
class WebYesNoQuestion extends question_1.YesNoQuestion {
    constructor(text) {
        super(text);
        this.text = text;
        this.div = util_1.makeElement('div', { classes: ['control'] });
        this.inputName = util_1.createUniqueId();
        this.yesInput = util_1.makeRadio(this.div, this.inputName, 'Yes').input;
        this.noInput = util_1.makeRadio(this.div, this.inputName, 'No').input;
    }
    getElement() {
        return this.div;
    }
    async processElement() {
        if (this.yesInput.checked) {
            return true;
        }
        else if (this.noInput.checked) {
            return false;
        }
        else {
            return new question_1.ValidationError('Please choose an answer.');
        }
    }
}
exports.WebYesNoQuestion = WebYesNoQuestion;


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ "./web/index.ts":
/*!**********************!*\
  !*** ./web/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(/*! ../lib/util */ "./lib/util.ts");
const tenant_interview_1 = __webpack_require__(/*! ../lib/tenant-interview */ "./lib/tenant-interview.ts");
const serializer_1 = __webpack_require__(/*! ../lib/web/serializer */ "./lib/web/serializer.ts");
const io_1 = __webpack_require__(/*! ../lib/web/io */ "./lib/web/io.ts");
const util_2 = __webpack_require__(/*! ../lib/web/util */ "./lib/web/util.ts");
const modal_1 = __webpack_require__(/*! ../lib/web/modal */ "./lib/web/modal.ts");
const INITIAL_APP_STATE = {
    days: 0,
    tenant: {}
};
let io = null;
function restart(options = { pushState: true }) {
    const resetButton = util_2.getElement('button', '#reset');
    const daysInput = util_2.getElement('input', '#days');
    const mainDiv = util_2.getElement('div', '#main');
    const dateSpan = util_2.getElement('span', '#date');
    const modalTemplate = util_2.getElement('template', '#modal');
    if (io) {
        io.close();
        io = null;
    }
    const serializer = new serializer_1.LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE);
    const myIo = new io_1.WebInterviewIO(mainDiv, new modal_1.ModalBuilder(modalTemplate));
    io = myIo;
    if (options.pushState) {
        window.history.pushState(serializer.get(), '', null);
    }
    else {
        window.history.replaceState(serializer.get(), '', null);
    }
    window.onpopstate = (event) => {
        if (event.state) {
            serializer.set(event.state);
            restart({ pushState: false });
        }
    };
    const interview = new tenant_interview_1.TenantInterview({
        io,
        now: util_1.addDays(new Date(), serializer.get().days)
    });
    dateSpan.textContent = interview.now.toDateString();
    daysInput.value = serializer.get().days.toString();
    resetButton.onclick = () => {
        serializer.set(INITIAL_APP_STATE);
        restart();
    };
    daysInput.onchange = (e) => {
        e.preventDefault();
        serializer.set({
            ...serializer.get(),
            days: parseInt(daysInput.value)
        });
        restart();
    };
    interview.on('change', (_, nextState) => {
        serializer.set({
            ...serializer.get(),
            tenant: nextState
        });
        window.history.pushState(serializer.get(), '', null);
    });
    myIo.on('title', title => {
        document.title = `${title} - ${interview.now.toDateString()}`;
    });
    interview.execute(serializer.get().tenant).then((tenant) => {
        const followupCount = interview.getFollowUps(tenant).length;
        const status = followupCount ?
            `No more questions for now, but ${followupCount} followup(s) remain.` :
            `Interview complete, no more followups to process.`;
        myIo.setStatus(status, { showThrobber: false });
    });
}
window.addEventListener('load', () => {
    restart({ pushState: false });
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbGliL2ludGVydmlldy1pby50cyIsIndlYnBhY2s6Ly8vLi9saWIvaW50ZXJ2aWV3LnRzIiwid2VicGFjazovLy8uL2xpYi9xdWVzdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9saWIvdGVuYW50LWludGVydmlldy50cyIsIndlYnBhY2s6Ly8vLi9saWIvdGVuYW50LnRzIiwid2VicGFjazovLy8uL2xpYi91dGlsLnRzIiwid2VicGFjazovLy8uL2xpYi93ZWIvZGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL2lvLnRzIiwid2VicGFjazovLy8uL2xpYi93ZWIvbW9kYWwudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi9tdWx0aS1jaG9pY2UudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi9waG90by50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL3NlcmlhbGl6ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi90aHJvYmJlci50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi95ZXMtbm8udHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vd2ViL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtB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LEVBQUU7WUFDL0IsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNO1lBQ0wsT0FBTyxJQUFJLDBCQUFlLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7Q0FDRjtBQTNCRCw0Q0EyQkM7Ozs7Ozs7Ozs7OztBQ2hDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVB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T0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxLQUFLLE1BQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDekQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDNUQsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUM7WUFDNUIsa0NBQWtDLGFBQWEsc0JBQXNCLENBQUMsQ0FBQztZQUN2RSxtREFBbUQsQ0FBQztRQUN0RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE9BQU8sQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vd2ViL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHtcbiAgUXVlc3Rpb24sXG4gIERhdGVRdWVzdGlvbixcbiAgTXVsdGlDaG9pY2VBbnN3ZXIsXG4gIE11bHRpQ2hvaWNlUXVlc3Rpb24sXG4gIFllc05vUXVlc3Rpb24sXG4gIE5vbkJsYW5rUXVlc3Rpb25cbn0gZnJvbSAnLi9xdWVzdGlvbic7XG5cbmltcG9ydCB7IFBob3RvIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogVGhpcyBpcyBhIG1hcHBlZCB0eXBlIFsxXSBjb25zaXN0aW5nIG9mIHByb3BlcnRpZXMgdGhhdCBjb25zaXN0XG4gKiBvZiBxdWVzdGlvbnMgd2hvc2UgYW5zd2VycyBtYXAgdG8gdGhlIG9yaWdpbmFsIHByb3BlcnR5IHR5cGVzLlxuICogXG4gKiBbMV0gaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXNcbiAqL1xuZXhwb3J0IHR5cGUgUXVlc3Rpb25zRm9yPFQ+ID0ge1xuICBbUCBpbiBrZXlvZiBUXTogUXVlc3Rpb248VFtQXT47XG59O1xuXG4vKiogXG4gKiBUaGlzIGlzIGFueSBpbnB1dC9vdXRwdXQgbWVjaGFuaXNtIGJ5IHdoaWNoIHRoZSBpbnRlcnZpZXcgY29tbXVuaWNhdGVzIHdpdGhcbiAqIHRoZSB1c2VyLlxuICpcbiAqIFRoaXMgaW50ZXJmYWNlIGhhcyBiZWVuIGRlc2lnbmVkIHRvIGNvbmR1Y3QgaW50ZXJ2aWV3cyB1c2luZyBtdWx0aXBsZVxuICogY29tbXVuaWNhdGlvbiBtZWRpYSAodm9pY2UsIFNNUywgd2ViLCBldGMpLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW50ZXJ2aWV3SU8gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKiogXG4gICAqIEFzayBhIHF1ZXN0aW9uIG9mIHRoZSB1c2VyLiBJZiB0aGUgdXNlciBwcm92aWRlcyBpbnZhbGlkIGlucHV0LCBrZWVwIGFza2luZy5cbiAgICogQHBhcmFtIHF1ZXN0aW9uIFRoZSBxdWVzdGlvbiB0byBhc2suXG4gICAqL1xuICBhYnN0cmFjdCBhc2s8VD4ocXVlc3Rpb246IFF1ZXN0aW9uPFQ+KTogUHJvbWlzZTxUPjtcblxuICAvKipcbiAgICogQXNrIGEgbnVtYmVyIG9mIHF1ZXN0aW9ucyBvZiB0aGUgdXNlci4gU29tZSB1c2VyIGludGVyZmFjZXMsXG4gICAqIHN1Y2ggYXMgc2NyZWVucywgbWF5IHByZXNlbnQgdGhlIHF1ZXN0aW9ucyBhcyBhIHNpbmdsZSBmb3JtLlxuICAgKiBcbiAgICogQHBhcmFtIHF1ZXN0aW9ucyBBIG1hcHBpbmcgZnJvbSBzdHJpbmcga2V5cyB0byBxdWVzdGlvbnMuIFRoZVxuICAgKiAgIHJldHVybiB2YWx1ZSB3aWxsIGNvbnRhaW4gdGhlIGFuc3dlcnMsIG1hcHBlZCB1c2luZyB0aGUgc2FtZSBrZXlzLlxuICAgKi9cbiAgYWJzdHJhY3QgYXNrTWFueTxUPihxdWVzdGlvbnM6IFF1ZXN0aW9uc0ZvcjxUPik6IFByb21pc2U8VD47XG5cbiAgLyoqXG4gICAqIE5vdGlmeSB0aGUgdXNlciB3aXRoIGltcG9ydGFudCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGFic3RyYWN0IG5vdGlmeSh0ZXh0OiBzdHJpbmcpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgc3RhdHVzLCBzbyB0aGUgdXNlciBrbm93cyB3aGF0IGlzIGdvaW5nIG9uXG4gICAqIGlmIHRoZXJlIGFyZSBhbnkgZGVsYXlzLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0U3RhdHVzKHRleHQ6IHN0cmluZyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHF1ZXN0aW9uIHRoYXQgYXNrcyBmb3IgYSBwaG90by5cbiAgICovXG4gIGFic3RyYWN0IGNyZWF0ZVBob3RvUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248UGhvdG8+O1xuXG4gIGNyZWF0ZURhdGVRdWVzdGlvbih0ZXh0OiBzdHJpbmcpOiBRdWVzdGlvbjxEYXRlPiB7XG4gICAgcmV0dXJuIG5ldyBEYXRlUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVNdWx0aUNob2ljZVF1ZXN0aW9uPFQ+KHRleHQ6IHN0cmluZywgYW5zd2VyczogTXVsdGlDaG9pY2VBbnN3ZXI8VD5bXSk6IFF1ZXN0aW9uPFQ+IHtcbiAgICByZXR1cm4gbmV3IE11bHRpQ2hvaWNlUXVlc3Rpb24odGV4dCwgYW5zd2Vycyk7XG4gIH1cblxuICBjcmVhdGVZZXNOb1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFllc05vUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVOb25CbGFua1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgTm9uQmxhbmtRdWVzdGlvbih0ZXh0KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuaW1wb3J0IHsgRGF0ZVN0cmluZyB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBJbnRlcnZpZXdJTyB9IGZyb20gJy4vaW50ZXJ2aWV3LWlvJztcblxuZXhwb3J0IGludGVyZmFjZSBJbnRlcnZpZXdPcHRpb25zPFM+IHtcbiAgLyoqIFRoZSBpbnB1dC9vdXRwdXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSB1c2VyLiAqL1xuICBpbzogSW50ZXJ2aWV3SU87XG5cbiAgLyoqIFRoZSBjdXJyZW50IGRhdGUuICovXG4gIG5vdz86IERhdGU7XG59XG5cbi8qKlxuICogQSBzY2hlZHVsZWQgZm9sbG93LXVwIHBvcnRpb24gb2YgYW4gaW50ZXJ2aWV3LCBwYXJhbWV0ZXJpemVkIGJ5XG4gKiB0aGUgc3RhdGUgb2YgdGhlIGludGVydmlldy4gRm9yIGV4YW1wbGUsIGlmIHRoZVxuICogaW50ZXJ2aWV3IGFza3MgdGhlIHVzZXIgdG8gZG8gc29tZXRoaW5nIGluIHRoZSBuZXh0IHdlZWssIGl0XG4gKiBtaWdodCBzY2hlZHVsZSBhIGZvbGxvdy11cCBmb3IgYSB3ZWVrIGxhdGVyIHRvIGFzayB0aGUgdXNlclxuICogaWYgdGhleSd2ZSBkb25lIGl0IHlldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGb2xsb3dVcDxTPiB7XG4gIC8qKiBUaGUgc2NoZWR1bGVkIGRhdGUgb2YgdGhlIGZvbGxvdy11cC4gKi9cbiAgZGF0ZTogRGF0ZVN0cmluZztcblxuICAvKiogXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBmb2xsb3ctdXAuIEF0IHRoZSB0aW1lIG9mIHRoaXMgd3JpdGluZywgdGhpcyBpc24ndFxuICAgKiBhY3R1YWxseSB1c2VkIGFueXdoZXJlLCBidXQgZXZlbnR1YWxseSBpdCBtaWdodCBiZS5cbiAgICovXG4gIG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogRXhlY3V0ZSB0aGUgZm9sbG93LXVwIGFjdGlvbi4gVGhpcyBzaG91bGQgYWxyZWFkeSBiZSBib3VuZCB0byBhXG4gICAqIHNwZWNpZmljIGludGVydmlldyBzdGF0ZSBieSB0aGUgY29kZSB0aGF0IGNyZWF0ZWQgdGhlIGZvbGxvdy11cC5cbiAgICovXG4gIGV4ZWN1dGU6ICgpID0+IFByb21pc2U8Uz47XG59XG5cbi8qKlxuICogVGhpcyByZXByZXNlbnRzIGEgc2VyaWVzIG9mIHF1ZXN0aW9ucyBmb3IgYSB1c2VyLCBwYXJhbWV0ZXJpemVkIGJ5XG4gKiBhIHR5cGUgdGhhdCByZXByZXNlbnRzIHRoZSBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3IChlLmcuLCB0aGUgYW5zd2Vyc1xuICogdG8gdGhlIHF1ZXN0aW9ucyB0aGUgdXNlciBoYXMgYmVlbiBhc2tlZCkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbnRlcnZpZXc8Uz4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICByZWFkb25seSBub3c6IERhdGU7XG4gIHJlYWRvbmx5IGlvOiBJbnRlcnZpZXdJTztcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBJbnRlcnZpZXdPcHRpb25zPFM+KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5vdyA9IG9wdGlvbnMubm93IHx8IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5pbyA9IG9wdGlvbnMuaW87XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgY29yZSBhYnN0cmFjdCBtZXRob2QgdGhhdCBzdWJjbGFzc2VzIG11c3QgaW1wbGVtZW50LlxuICAgKiBHaXZlbiBhIGN1cnJlbnQgc3RhdGUsIGl0IG11c3QgYXNrIGFueSByZXF1aXJlZCBxdWVzdGlvbnMgYW5kXG4gICAqIHJldHVybiBhIHByb21pc2UgdGhhdCByZXByZXNlbnRzIHRoZSBuZXcgc3RhdGUgb2YgdGhlIGludGVydmlldy5cbiAgICogXG4gICAqIE5vdGUgdGhhdCB0aGUgc3RhdGUgaXMgaW1tdXRhYmxlLCBzbyB0aGUgbWV0aG9kIHNob3VsZCBhbHdheXNcbiAgICogY3JlYXRlIGEgbmV3IHN0YXRlIG9iamVjdC0tdW5sZXNzIHRoZSBpbnRlcnZpZXcgaXMgb3ZlciwgaW5cbiAgICogd2hpY2ggY2FzZSBpdCBzaG91bGQganVzdCByZXR1cm4gdGhlIHVuY2hhbmdlZCBzdGF0ZSBpdCB3YXNcbiAgICogcGFzc2VkIGluLlxuICAgKiBcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcuXG4gICAqL1xuICBhYnN0cmFjdCBhc3luYyBhc2tOZXh0KHN0YXRlOiBTKTogUHJvbWlzZTxTPjtcblxuICAvKipcbiAgICogVGhpcyBpcyBhbiBvcHRpb25hbCBtZXRob2QgdGhhdCBydW5zIHRoZSBuZXh0IGlycmV2ZXJzaWJsZSB0YXNrIHRoYXRcbiAgICogdGhlIGludGVydmlldyBpcyBjYXBhYmxlIG9mIHVuZGVydGFraW5nIChlLmcuIHNlbmRpbmcgYW4gZW1haWwgb3JcbiAgICogcmVhbC13b3JsZCBsZXR0ZXIsIGZpbGluZyBhIGNvdXJ0IGNhc2UsIGV0YykuXG4gICAqXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3LlxuICAgKi9cbiAgYXN5bmMgcnVuTmV4dFRhc2soc3RhdGU6IFMpOiBQcm9taXNlPFM+IHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyBhbiBvcHRpb25hbCBtZXRob2QgdGhhdCByZXR1cm5zIGFsbCB0aGUgZm9sbG93LXVwc1xuICAgKiBmb3IgdGhlIGludGVydmlldywgZ2l2ZW4gaXRzIGN1cnJlbnQgc3RhdGUuXG4gICAqIFxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGludGVydmlldy5cbiAgICovXG4gIGdldEZvbGxvd1VwcyhzdGF0ZTogUyk6IEZvbGxvd1VwPFM+W10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHRoZSBuZXh0IHZhbGlkIGZvbGxvdy11cCwgaWYgYW55LiBJZiBubyB2YWxpZFxuICAgKiBmb2xsb3ctdXBzIGFyZSBhdmFpbGFibGUsIHRoZSBvcmlnaW5hbCBzdGF0ZSBpcyByZXR1cm5lZC5cbiAgICogXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3LlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBleGVjdXRlTmV4dEZvbGxvd1VwKHN0YXRlOiBTKTogUHJvbWlzZTxTPiB7XG4gICAgZm9yIChsZXQgZm9sbG93VXAgb2YgdGhpcy5nZXRGb2xsb3dVcHMoc3RhdGUpKSB7XG4gICAgICBpZiAodGhpcy5ub3cgPj0gbmV3IERhdGUoZm9sbG93VXAuZGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZvbGxvd1VwLmV4ZWN1dGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgdGhlIGludGVydmlldywgYXNraW5nIHRoZSB1c2VyIHF1ZXN0aW9ucyB1bnRpbCB0aGV5XG4gICAqIGFyZSBleGhhdXN0ZWQuIFJldHVybnMgdGhlIGZpbmFsIHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcuXG4gICAqIFxuICAgKiBAcGFyYW0gaW5pdGlhbFN0YXRlIFxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZShpbml0aWFsU3RhdGU6IFMpOiBQcm9taXNlPFM+IHtcbiAgICBsZXQgc3RhdGUgPSBpbml0aWFsU3RhdGU7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IG5leHRTdGF0ZSA9IGF3YWl0IHRoaXMuYXNrTmV4dChzdGF0ZSk7XG4gICAgICBpZiAobmV4dFN0YXRlID09PSBzdGF0ZSkge1xuICAgICAgICBuZXh0U3RhdGUgPSBhd2FpdCB0aGlzLmV4ZWN1dGVOZXh0Rm9sbG93VXAoc3RhdGUpO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRTdGF0ZSA9PT0gc3RhdGUpIHtcbiAgICAgICAgbmV4dFN0YXRlID0gYXdhaXQgdGhpcy5ydW5OZXh0VGFzayhzdGF0ZSk7XG4gICAgICB9XG4gICAgICBpZiAobmV4dFN0YXRlID09PSBzdGF0ZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywgc3RhdGUsIG5leHRTdGF0ZSk7XG4gICAgICBzdGF0ZSA9IG5leHRTdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbnRlcnZpZXc8Uz4ge1xuICBlbWl0KGV2ZW50OiAnY2hhbmdlJywgcHJldlN0YXRlOiBTLCBuZXh0U3RhdGU6IFMpOiBib29sZWFuO1xuICBvbihldmVudDogJ2NoYW5nZScsIGxpc3RlbmVyOiAocHJldlN0YXRlOiBTLCBuZXh0U3RhdGU6IFMpID0+IHZvaWQpOiB0aGlzO1xufVxuIiwiLyoqIFxuICogUmVwcmVzZW50cyBhIHZhbGlkYXRpb24gZXJyb3IgZm9yIGEgcXVlc3Rpb24sIGUuZy4gd2hlbiBhIHVzZXJcbiAqIHByb3ZpZGVzIGFuIGludmFsaWQgcmVzcG9uc2UuXG4gKiBcbiAqIE5vdGUgdGhhdCB0aGlzIGRvZXNuJ3QgZXh0ZW5kIHRoZSBzdGFuZGFyZCBFcnJvciBjbGFzcyxcbiAqIGJlY2F1c2UgaXQncyBub3QgYWN0dWFsbHkgZGVzaWduZWQgdG8gYmUgdGhyb3duOiB0aGUgcmF0aW9uYWxlXG4gKiBpcyB0aGF0IHZhbGlkYXRpb24gZXJyb3JzIGFyZSBhIG5vcm1hbCBvY2N1cnJlbmNlIGFuZCBvdXJcbiAqIGNvZGUgc2hvdWxkIGNoZWNrIGZvciB0aGVtIGFsbCB0aGUgdGltZSwgcmF0aGVyIHRoYW4gdGhyb3dpbmdcbiAqIHRoZW0gYW5kIHBvdGVudGlhbGx5IGhhdmluZyB0aGVtIGdvIHVuY2F1Z2h0LlxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvbkVycm9yIHtcbiAgLyoqXG4gICAqIFRoZSBodW1hbi1yZWFkYWJsZSB0ZXh0IGV4cGxhaW5pbmcgdGhlIGVycm9yLiBJdCB3aWxsXG4gICAqIGJlIHNob3duIHRvIHRoZSB1c2VyLlxuICAgKi9cbiAgbWVzc2FnZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcXVlc3Rpb24gaW4gYW4gaW50ZXJ2aWV3LCBwYXJtZXRlcml6ZWQgYnlcbiAqIHRoZSB0eXBlIG9mIGRhdGEgdGhhdCBhIHZhbGlkIGFuc3dlciByZXByZXNlbnRzLlxuICogXG4gKiBGb3IgZXhhbXBsZSwgYSBxdWVzdGlvbiBsaWtlIFwiSG93IG9sZCBhcmUgeW91P1wiIG1pZ2h0XG4gKiBiZSBhIFF1ZXN0aW9uPG51bWJlcj4sIHdoaWxlIFwiRG8geW91IGxpa2Ugc2FsYWQ/XCIgbWlnaHRcbiAqIGJlIGEgUXVlc3Rpb248Ym9vbGVhbj4uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBRdWVzdGlvbjxUPiB7XG4gIC8qKiBUaGUgdGV4dCBvZiB0aGUgcXVlc3Rpb24sIGUuZy4gXCJIb3cgYXJlIHlvdT9cIi4gKi9cbiAgYWJzdHJhY3QgZ2V0IHRleHQoKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGEgcmVzcG9uc2UgZW50ZXJlZCBieSB0aGUgdXNlciBhbmQgcmV0dXJuIGVpdGhlclxuICAgKiB0aGUgZGF0YSBpdCByZXByZXNlbnRzLCBvciBhbiBlcnJvciBleHBsYWluaW5nIHdoeSB0aGVcbiAgICogcmVzcG9uc2UgaXMgaW52YWxpZC5cbiAgICogXG4gICAqIEBwYXJhbSByZXNwb25zZSBBIHJhdyByZXNwb25zZSBlbnRlcmVkIGJ5IHRoZSB1c2VyLlxuICAgKi9cbiAgYWJzdHJhY3QgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPFR8VmFsaWRhdGlvbkVycm9yPjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgdmFsaWQgYW5zd2VyIHRvIGEgbXVsdGlwbGUtY2hvaWNlIHF1ZXN0aW9uLlxuICogVGhlIGZpcnN0IG1lbWJlciByZXByZXNlbnRzIHRoZSBhY3R1YWwgZGF0YSB2YWx1ZSwgd2hpbGVcbiAqIHRoZSBzZWNvbmQgcmVwcmVzbnRzIHRoZSBodW1hbi1yZWFkYWJsZSB0ZXh0IGZvciBpdC5cbiAqL1xuZXhwb3J0IHR5cGUgTXVsdGlDaG9pY2VBbnN3ZXI8VD4gPSBbVCwgc3RyaW5nXTtcblxuLyoqXG4gKiBBIG11bHRpcGxlLWNob2ljZSBxdWVzdGlvbi4gQW5zd2VycyBhcmUgYXV0b21hdGljYWxseVxuICogbnVtYmVyZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNdWx0aUNob2ljZVF1ZXN0aW9uPFQ+IGV4dGVuZHMgUXVlc3Rpb248VD4ge1xuICAvKiogVGhlIHF1ZXN0aW9uLCBlLmcuIFwiV2hhdCBraW5kIG9mIGxlYXNlIGRvIHlvdSBoYXZlP1wiLiAqL1xuICBxdWVzdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBQb3RlbnRpYWwgYW5zd2VycyB0byB0aGUgcXVlc3Rpb24sIHdoaWNoIHRoZSB1c2VyIG11c3QgY2hvb3NlIGZyb20uICovXG4gIGFuc3dlcnM6IE11bHRpQ2hvaWNlQW5zd2VyPFQ+W107XG5cbiAgY29uc3RydWN0b3IocXVlc3Rpb246IHN0cmluZywgYW5zd2VyczogTXVsdGlDaG9pY2VBbnN3ZXI8VD5bXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgIHRoaXMuYW5zd2VycyA9IGFuc3dlcnM7XG4gIH1cblxuICBnZXQgdGV4dCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHBhcnRzID0gW3RoaXMucXVlc3Rpb24sICcnXTtcblxuICAgIHRoaXMuYW5zd2Vycy5mb3JFYWNoKChbXywgbGFiZWxdLCBpKSA9PiB7XG4gICAgICBwYXJ0cy5wdXNoKGAke2kgKyAxfSAtICR7bGFiZWx9YCk7XG4gICAgfSk7XG5cbiAgICBwYXJ0cy5wdXNoKCcnLCAnRW50ZXIgYSBudW1iZXIgZnJvbSB0aGUgbGlzdCBhYm92ZTonKTtcblxuICAgIHJldHVybiBwYXJ0cy5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTxUfFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIGNvbnN0IHJlc3BvbnNlSW50ID0gcGFyc2VJbnQocmVzcG9uc2UsIDEwKTtcbiAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmFuc3dlcnNbcmVzcG9uc2VJbnQgLSAxXTtcblxuICAgIGlmIChhbnN3ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBjaG9vc2UgYSB2YWxpZCBudW1iZXIuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFuc3dlclswXTtcbiAgfVxufVxuXG4vKipcbiAqIEEgYmFzaWMgcXVlc3Rpb24gdGhhdCBhY2NlcHRzIGFueSBraW5kIG9mIG5vbi1ibGFuayBpbnB1dC5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vbkJsYW5rUXVlc3Rpb24gZXh0ZW5kcyBRdWVzdGlvbjxzdHJpbmc+IHtcbiAgLyoqIFRoZSB0ZXh0IG9mIHRoZSBxdWVzdGlvbiwgZS5nLiBcIldoYXQgaXMgeW91ciBuYW1lP1wiLiAqL1xuICB0ZXh0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ3xWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICBpZiAoIXJlc3BvbnNlLnRyaW0oKSkge1xuICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1lvdXIgcmVzcG9uc2UgY2Fubm90IGJlIGJsYW5rIScpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHF1ZXN0aW9uIHdob3NlIGFuc3dlciBtdXN0IGFsd2F5cyBiZSBcInllc1wiIG9yIFwibm9cIi5cbiAqL1xuZXhwb3J0IGNsYXNzIFllc05vUXVlc3Rpb24gZXh0ZW5kcyBRdWVzdGlvbjxib29sZWFuPiB7XG4gIC8qKiBUaGUgdGV4dCBvZiB0aGUgcXVlc3Rpb24sIGUuZy4gXCJBcmUgeW91IG9rP1wiLiAqL1xuICB0ZXh0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW58VmFsaWRhdGlvbkVycm9yPiB7XG4gICAgY29uc3QgWUVTX1JFR0VYID0gL15cXHMqeS9pO1xuICAgIGNvbnN0IE5PX1JFR0VYID0gL15cXHMqbi9pO1xuXG4gICAgaWYgKFlFU19SRUdFWC50ZXN0KHJlc3BvbnNlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChOT19SRUdFWC50ZXN0KHJlc3BvbnNlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignUGxlYXNlIGFuc3dlciB3aXRoIFwieWVzXCIgb3IgXCJub1wiLicpO1xuICB9XG59XG5cbi8qKlxuICogQSBxdWVzdGlvbiB0aGF0IGFza3MgZm9yIGEgZGF0ZSAobm90IGluY2x1ZGluZyB0aGUgdGltZSkuXG4gKi9cbmV4cG9ydCBjbGFzcyBEYXRlUXVlc3Rpb24gZXh0ZW5kcyBRdWVzdGlvbjxEYXRlPiB7XG4gIC8qKiBUaGUgdGV4dCBvZiB0aGUgcXVlc3Rpb24sIGUuZy4gXCJXaGVuIGRpZCB5b3UgcmVjZWl2ZSB0aGUgbGV0dGVyP1wiLiAqL1xuICB0ZXh0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPERhdGV8VmFsaWRhdGlvbkVycm9yPiB7XG4gICAgY29uc3QgREFURV9SRUdFWCA9IC9eXFxkXFxkXFxkXFxkLVxcZFxcZC1cXGRcXGQkLztcbiAgICBpZiAoREFURV9SRUdFWC50ZXN0KHJlc3BvbnNlKSkge1xuICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHJlc3BvbnNlKTtcbiAgICAgIGlmICghaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBkYXRlIGluIFlZWVktTU0tREQgZm9ybWF0LicpO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBUZW5hbnQsXG4gIExlYXNlVHlwZSxcbiAgUmVxdWVzdGVkUmVudGFsSGlzdG9yeSxcbiAgUmVudGFsSGlzdG9yeVxufSBmcm9tICcuL3RlbmFudCc7XG5cbmltcG9ydCB7IEludGVydmlldywgRm9sbG93VXAgfSBmcm9tICcuL2ludGVydmlldyc7XG5cbmltcG9ydCB7IGFkZERheXMgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICcuL3dlYi91dGlsJztcblxuY29uc3QgUkVOVEFMX0hJU1RPUllfRk9MTE9XVVBfREFZUyA9IDc7XG5cbmV4cG9ydCBjbGFzcyBUZW5hbnRJbnRlcnZpZXcgZXh0ZW5kcyBJbnRlcnZpZXc8VGVuYW50PiB7XG4gIGFzeW5jIGFza0ZvckxlYXNlVHlwZSh0ZW5hbnQ6IFRlbmFudCk6IFByb21pc2U8VGVuYW50PiB7XG4gICAgY29uc3QgbGVhc2VUeXBlID0gYXdhaXQgdGhpcy5pby5hc2sodGhpcy5pby5jcmVhdGVNdWx0aUNob2ljZVF1ZXN0aW9uKFxuICAgICAgJ1doYXQga2luZCBvZiBsZWFzZSBkbyB5b3UgaGF2ZT8nLFxuICAgICAgW1xuICAgICAgICBbTGVhc2VUeXBlLk1hcmtldFJhdGUsICdNYXJrZXQgcmF0ZSddLFxuICAgICAgICBbTGVhc2VUeXBlLlJlbnRTdGFiaWxpemVkLCAnUmVudCBzdGFiaWxpemVkJ10sXG4gICAgICAgIFtMZWFzZVR5cGUuTllDSEEsICdQdWJsaWMgaG91c2luZyAoTllDSEEpJ10sXG4gICAgICAgIFtMZWFzZVR5cGUuT3RoZXIsICdPdGhlciAoZS5nLiBtb250aC10by1tb250aCknXSxcbiAgICAgICAgW0xlYXNlVHlwZS5Vbmtub3duLCAnTm90IHN1cmUnXSxcbiAgICAgIF1cbiAgICApKTtcblxuICAgIHJldHVybiB7Li4udGVuYW50LCBsZWFzZVR5cGV9O1xuICB9XG5cbiAgYXN5bmMgYXNrRm9ySG91c2luZ0lzc3Vlcyh0ZW5hbnQ6IFRlbmFudCk6IFByb21pc2U8VGVuYW50PiB7XG4gICAgY29uc3QgaG91c2luZ0lzc3VlcyA9IGF3YWl0IHRoaXMuaW8uYXNrTWFueSh7XG4gICAgICBuZWVkc1JlcGFpcnM6IHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignRG9lcyB5b3VyIGFwYXJ0bWVudCBuZWVkIHJlcGFpcnM/JyksXG4gICAgICBpc0hhcmFzc2VkOiB0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0FyZSB5b3UgYmVpbmcgaGFyYXNzZWQgYnkgeW91ciBsYW5kbG9yZD8nKSxcbiAgICAgIGlzRmFjaW5nRXZpY3Rpb246IHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignQXJlIHlvdSBmYWNpbmcgZXZpY3Rpb24/JyksXG4gICAgICBoYXNMZWFzZUlzc3VlczogdGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdBcmUgeW91IGhhdmluZyBpc3N1ZXMgd2l0aCB5b3VyIGxlYXNlPycpLFxuICAgICAgaGFzTm9TZXJ2aWNlczogdGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdBcmUgeW91IGxpdmluZyB3aXRob3V0IGVzc2VudGlhbCBzZXJ2aWNlcywgbGlrZSBoZWF0L2dhcy9ob3Qgd2F0ZXI/JyksXG4gICAgICBoYXNPdGhlcjogdGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdEbyB5b3UgaGF2ZSBhbnkgb3RoZXIgYXBhcnRtZW50IGlzc3Vlcz8nKSxcbiAgICB9KTtcblxuICAgIGlmIChob3VzaW5nSXNzdWVzLmlzRmFjaW5nRXZpY3Rpb24pIHtcbiAgICAgIHRoaXMuaW8ubm90aWZ5KFxuICAgICAgICBcIlNpbmNlIHlvdeKAmXJlIGluIGFuIGV2aWN0aW9uLCBpdOKAmXMgaW1wb3J0YW50IHRvIHRyeSB0byBnZXQgbGVnYWwgaGVscCByaWdodCBhd2F5LiBcIiArXG4gICAgICAgIFwiV2XigJlsbCBwb2ludCB5b3UgdG8gYSByZXNvdXJjZSB0aGF0IGNhbiBoZWxwIHlvdSBmaW5kIGEgbGF3eWVyIGluIGp1c3QgYSBmZXcgbW9tZW50cy5cIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gey4uLnRlbmFudCwgaG91c2luZ0lzc3Vlc307XG4gIH1cblxuICBhc3luYyBhc2tGb3JSZW50YWxIaXN0b3J5KHRlbmFudDogVGVuYW50KTogUHJvbWlzZTxUZW5hbnQ+IHtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3QgcGVybWlzc2lvbiA9IGF3YWl0IHRoaXMuaW8uYXNrKHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignQ2FuIHdlIHJlcXVlc3QgeW91ciByZW50YWwgaGlzdG9yeSBmcm9tIHlvdXIgbGFuZGxvcmQ/JykpO1xuICAgICAgaWYgKHBlcm1pc3Npb24pIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGVuYW50LCByZW50YWxIaXN0b3J5OiB7IHN0YXR1czogJ2FjY2VwdGVkJyB9IH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlvLm5vdGlmeShcIlVtLCB3ZSByZWFsbHkgbmVlZCB0byByZXF1ZXN0IHlvdXIgcmVudGFsIGhpc3RvcnkgdG8gcHJvY2VlZC5cIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZm9sbG93dXBSZW50YWxIaXN0b3J5KHJlbnRhbEhpc3Rvcnk6IFJlcXVlc3RlZFJlbnRhbEhpc3RvcnkpOiBQcm9taXNlPFJlbnRhbEhpc3Rvcnk+IHtcbiAgICBjb25zdCB3YXNSZWNlaXZlZCA9IGF3YWl0IHRoaXMuaW8uYXNrKHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignSGF2ZSB5b3UgcmVjZWl2ZWQgeW91ciByZW50YWwgaGlzdG9yeSB5ZXQ/JykpO1xuXG4gICAgaWYgKHdhc1JlY2VpdmVkKSB7XG4gICAgICBjb25zdCBkZXRhaWxzID0gYXdhaXQgdGhpcy5pby5hc2tNYW55KHtcbiAgICAgICAgZGF0ZVJlY2VpdmVkOiB0aGlzLmlvLmNyZWF0ZURhdGVRdWVzdGlvbignV2hlbiBkaWQgeW91IHJlY2VpdmUgeW91ciByZW50YWwgaGlzdG9yeT8nKSxcbiAgICAgICAgaXNSZW50U3RhYmlsaXplZDogdGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdBcmUgeW91IHJlbnQgc3RhYmlsaXplZD8nKSxcbiAgICAgICAgcGhvdG86IHRoaXMuaW8uY3JlYXRlUGhvdG9RdWVzdGlvbignUGxlYXNlIHN1Ym1pdCBhIHBob3RvZ3JhcGggb2YgeW91ciByZW50YWwgaGlzdG9yeS4nKVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6ICdyZWNlaXZlZCcsXG4gICAgICAgIGRhdGVSZXF1ZXN0ZWQ6IHJlbnRhbEhpc3RvcnkuZGF0ZVJlcXVlc3RlZCxcbiAgICAgICAgLi4uZGV0YWlsc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pby5ub3RpZnkoYEFsYXMsIHdlIHdpbGwgYXNrIGFnYWluIGluICR7UkVOVEFMX0hJU1RPUllfRk9MTE9XVVBfREFZU30gZGF5cy5gKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnJlbnRhbEhpc3RvcnksXG4gICAgICAgIG5leHRSZW1pbmRlcjogYWRkRGF5cyh0aGlzLm5vdywgUkVOVEFMX0hJU1RPUllfRk9MTE9XVVBfREFZUylcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYXNrTmV4dCh0ZW5hbnQ6IFRlbmFudCk6IFByb21pc2U8VGVuYW50PiB7XG4gICAgaWYgKCF0ZW5hbnQubmFtZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4udGVuYW50LFxuICAgICAgICBuYW1lOiBhd2FpdCB0aGlzLmlvLmFzayh0aGlzLmlvLmNyZWF0ZU5vbkJsYW5rUXVlc3Rpb24oJ1doYXQgaXMgeW91ciBuYW1lPycpKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIXRlbmFudC5ob3VzaW5nSXNzdWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5hc2tGb3JIb3VzaW5nSXNzdWVzKHRlbmFudCk7XG4gICAgfVxuXG4gICAgaWYgKCF0ZW5hbnQubGVhc2VUeXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5hc2tGb3JMZWFzZVR5cGUodGVuYW50KTtcbiAgICB9XG5cbiAgICBpZiAoIXRlbmFudC5waG9uZU51bWJlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4udGVuYW50LFxuICAgICAgICBwaG9uZU51bWJlcjogYXdhaXQgdGhpcy5pby5hc2sodGhpcy5pby5jcmVhdGVOb25CbGFua1F1ZXN0aW9uKCdXaGF0IGlzIHlvdXIgcGhvbmUgbnVtYmVyPycpKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIXRlbmFudC5yZW50YWxIaXN0b3J5KSB7XG4gICAgICByZXR1cm4gdGhpcy5hc2tGb3JSZW50YWxIaXN0b3J5KHRlbmFudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbmFudDtcbiAgfVxuXG4gIGFzeW5jIHJ1bk5leHRUYXNrKHRlbmFudDogVGVuYW50KTogUHJvbWlzZTxUZW5hbnQ+IHtcbiAgICBpZiAodGVuYW50LnJlbnRhbEhpc3RvcnkgJiYgdGVuYW50LnJlbnRhbEhpc3Rvcnkuc3RhdHVzID09PSAnYWNjZXB0ZWQnKSB7XG4gICAgICAvLyBUT0RPOiBBY3R1YWxseSByZXF1ZXN0IHJlbnRhbCBoaXN0b3J5LlxuICAgICAgdGhpcy5pby5zZXRTdGF0dXMoJ1JlcXVlc3RpbmcgeW91ciByZW50YWwgaGlzdG9yeS4uLicpO1xuICAgICAgYXdhaXQgc2xlZXAoMzAwMCk7XG5cbiAgICAgIHRoaXMuaW8ubm90aWZ5KFxuICAgICAgICBgUmVudGFsIGhpc3RvcnkgcmVxdWVzdGVkISBXZSdsbCBhc2sgaWYgeW91J3ZlIHJlY2VpdmVkIGl0IGluIGAgK1xuICAgICAgICBgJHtSRU5UQUxfSElTVE9SWV9GT0xMT1dVUF9EQVlTfSBkYXlzLmBcbiAgICAgICk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50ZW5hbnQsXG4gICAgICAgIHJlbnRhbEhpc3Rvcnk6IHtcbiAgICAgICAgICBzdGF0dXM6ICdyZXF1ZXN0ZWQnLFxuICAgICAgICAgIGRhdGVSZXF1ZXN0ZWQ6IHRoaXMubm93LFxuICAgICAgICAgIG5leHRSZW1pbmRlcjogYWRkRGF5cyh0aGlzLm5vdywgUkVOVEFMX0hJU1RPUllfRk9MTE9XVVBfREFZUylcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVuYW50O1xuICB9XG5cbiAgZ2V0Rm9sbG93VXBzKHRlbmFudDogVGVuYW50KTogRm9sbG93VXA8VGVuYW50PltdIHtcbiAgICBjb25zdCBmb2xsb3dVcHM6IEZvbGxvd1VwPFRlbmFudD5bXSA9IFtdO1xuXG4gICAgY29uc3QgcmVudGFsSGlzdG9yeSA9IHRlbmFudC5yZW50YWxIaXN0b3J5O1xuICAgIGlmIChyZW50YWxIaXN0b3J5ICYmIHJlbnRhbEhpc3Rvcnkuc3RhdHVzID09PSAncmVxdWVzdGVkJykge1xuICAgICAgZm9sbG93VXBzLnB1c2goe1xuICAgICAgICBkYXRlOiByZW50YWxIaXN0b3J5Lm5leHRSZW1pbmRlcixcbiAgICAgICAgbmFtZTogJ1JlbnRhbCBoaXN0b3J5IGZvbGxvdy11cCcsXG4gICAgICAgIGV4ZWN1dGU6IGFzeW5jICgpID0+ICh7XG4gICAgICAgICAgLi4udGVuYW50LFxuICAgICAgICAgIHJlbnRhbEhpc3Rvcnk6IGF3YWl0IHRoaXMuZm9sbG93dXBSZW50YWxIaXN0b3J5KHJlbnRhbEhpc3RvcnkpXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvbGxvd1VwcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGF0ZVN0cmluZywgUGhvdG8gfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZW51bSBMZWFzZVR5cGUge1xuICAvKiogTWFya2V0IHJhdGUgb3IgZnJlZSBtYXJrZXQgbGVhc2UuICovXG4gIE1hcmtldFJhdGUgPSAnbXInLFxuXG4gIC8qKiBSZW50IHN0YWJpbGl6ZWQgKG9yIHJlbnQgY29udHJvbGxlZCkuICovXG4gIFJlbnRTdGFiaWxpemVkID0gJ3JzJyxcblxuICAvKiogUHVibGljIGhvdXNpbmcuICovXG4gIE5ZQ0hBID0gJ255Y2hhJyxcblxuICAvKiogT3RoZXIgaG91c2luZyBjYW4gYmUgZS5nLiBtb250aCB0byBtb250aCB3aXRob3V0IGEgbGVhc2UsIGNvb3AsIHNoZWx0ZXIsIHN1YmxldCwgTWl0Y2hlbGwgTGFtYS4gKi9cbiAgT3RoZXIgPSAnb3RoZXInLFxuXG4gIC8qKiBUaGUgdGVuYW50IGlzIHVuY2VydGFpbiBvZiB0aGVpciBhY3R1YWwgbGVhc2UgdHlwZS4gKi9cbiAgVW5rbm93biA9ICd1bmtub3duJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIb3VzaW5nSXNzdWVzIHtcbiAgLyoqIFdoZXRoZXIgdGhlIHRlbmFudCBuZWVkcyByZXBhaXJzIGluIHRoZWlyIGFwYXJ0bWVudC4gKi9cbiAgbmVlZHNSZXBhaXJzOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZW5hbnQgaXMgYmVpbmcgaGFyYXNzZWQgYnkgdGhlaXIgbGFuZGxvcmQuICovXG4gIGlzSGFyYXNzZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRlbmFudCBpcyBiZWluZyBmYWNlZCB3aXRoIGV2aWN0aW9uLiAqL1xuICBpc0ZhY2luZ0V2aWN0aW9uOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZW5hbnQgaXMgaGF2aW5nIGlzc3VlcyB3aXRoIHRoZWlyIGxlYXNlLiAqL1xuICBoYXNMZWFzZUlzc3VlczogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgdGVuYW50IGlzIGxpdmluZyB3aXRob3V0IGVzc2VudGlhbCBzZXJ2aWNlcyAoaGVhdC9nYXMvaG90IHdhdGVyKS4gKi9cbiAgaGFzTm9TZXJ2aWNlczogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgdGVuYW50IGlzIGZhY2luZyBhbnkgb3RoZXIgaXNzdWVzLiAqL1xuICBoYXNPdGhlcjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBY2NlcHRlZFJlbnRhbEhpc3Rvcnkge1xuICAvKipcbiAgICogVGhlIHN0YXRlIGluZGljYXRpbmcgdGhhdCB0aGUgdXNlciBoYXMgZ2l2ZW4gdGhlaXIgcGVybWlzc2lvbiBmb3IgdXNcbiAgICogdG8gcmVxdWVzdCB0aGVpciByZW50YWwgaGlzdG9yeS5cbiAgICovXG4gIHN0YXR1czogJ2FjY2VwdGVkJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0ZWRSZW50YWxIaXN0b3J5IHtcbiAgc3RhdHVzOiAncmVxdWVzdGVkJztcblxuICAvKiogV2hlbiB0aGUgdGVuYW50IHJlcXVlc3RlZCB0aGVpciByZW50YWwgaGlzdG9yeS4gKi9cbiAgZGF0ZVJlcXVlc3RlZDogRGF0ZVN0cmluZztcblxuICAvKiogVGhlIGRhdGUgd2hlbiB3ZSdsbCBuZXh0IGFzayB0aGUgdGVuYW50IGlmIHRoZXkndmUgcmVjZWl2ZWQgdGhlIGhpc3RvcnkgeWV0LiAqL1xuICBuZXh0UmVtaW5kZXI6IERhdGVTdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjZWl2ZWRSZW50YWxIaXN0b3J5IHtcbiAgc3RhdHVzOiAncmVjZWl2ZWQnO1xuXG4gIGRhdGVSZXF1ZXN0ZWQ6IERhdGVTdHJpbmc7XG5cbiAgLyoqIFdoZW4gdGhlIHRlbmFudCByZWNlaXZlZCB0aGVpciByZW50YWwgaGlzdG9yeS4gKi9cbiAgZGF0ZVJlY2VpdmVkOiBEYXRlU3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByZW50YWwgaGlzdG9yeSBhc3NlcnRzIHRoYXQgdGhlIHRlbmFudCdzIGR3ZWxsaW5nIGlzIHJlbnQgc3RhYmlsaXplZC4gKi9cbiAgaXNSZW50U3RhYmlsaXplZDogYm9vbGVhbjtcblxuICAvKiogVGhlIHVzZXIncyBwaG90b2dyYXBoIG9mIHRoZWlyIHJlbnRhbCBoaXN0b3J5LiAqL1xuICBwaG90bzogUGhvdG87XG59XG5cbmV4cG9ydCB0eXBlIFJlbnRhbEhpc3RvcnkgPSBBY2NlcHRlZFJlbnRhbEhpc3RvcnkgfCBSZXF1ZXN0ZWRSZW50YWxIaXN0b3J5IHwgUmVjZWl2ZWRSZW50YWxIaXN0b3J5O1xuXG5pbnRlcmZhY2UgX1RlbmFudCB7XG4gIC8qKiBUaGUgdGVuYW50J3MgZnVsbCBuYW1lLiAqL1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSB0ZW5hbnQncyBwaG9uZSBudW1iZXIuIChUT0RPOiBob3cgc2hvdWxkIHRoaXMgYmUgZm9ybWF0dGVkPykgKi9cbiAgcGhvbmVOdW1iZXI6IHN0cmluZztcblxuICBsZWFzZVR5cGU6IExlYXNlVHlwZTtcbiAgaG91c2luZ0lzc3VlczogSG91c2luZ0lzc3VlcztcbiAgcmVudGFsSGlzdG9yeTogUmVudGFsSGlzdG9yeTtcbn1cblxuZXhwb3J0IHR5cGUgVGVuYW50ID0gUmVhZG9ubHk8UGFydGlhbDxfVGVuYW50Pj47XG4iLCIvKipcbiAqIEEgc3RyaW5nIHRoYXQgcmVwcmVzZW50cyBhIGRhdGUgaW4gSVNPIGZvcm1hdCwgKm9yKiBhIG5hdGl2ZSBEYXRlICh3aGljaCBpcyBjb252ZXJ0ZWQgdG9cbiAqIGFuIElTTyBzdHJpbmcgdXBvbiBKU09OIHNlcmlhbGl6YXRpb24pLlxuICovXG5leHBvcnQgdHlwZSBEYXRlU3RyaW5nID0gRGF0ZXxzdHJpbmc7XG5cbi8qKiBBIHBob3RvIGlzIGp1c3QgYSBVUkwgdG8gYW4gaW1hZ2UuICovXG5leHBvcnQgdHlwZSBQaG90byA9IHN0cmluZztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM2NzQ1NTAvMjQyMjM5OFxuZXhwb3J0IGZ1bmN0aW9uIGFkZERheXMoZGF0ZTogRGF0ZVN0cmluZywgZGF5czogbnVtYmVyKTogRGF0ZSB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBEYXRlKGRhdGUpO1xuICByZXN1bHQuc2V0RGF0ZShyZXN1bHQuZ2V0RGF0ZSgpICsgZGF5cyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgeyBEYXRlUXVlc3Rpb24sIFZhbGlkYXRpb25FcnJvciB9IGZyb20gXCIuLi9xdWVzdGlvblwiO1xuaW1wb3J0IHsgV2ViV2lkZ2V0IH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IG1ha2VJbnB1dCwgd3JhcEluQ29udHJvbERpdiB9IGZyb20gXCIuL3V0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkRhdGVRdWVzdGlvbiBleHRlbmRzIERhdGVRdWVzdGlvbiBpbXBsZW1lbnRzIFdlYldpZGdldDxEYXRlPiB7XG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKHRleHQpO1xuICAgIHRoaXMuaW5wdXQgPSBtYWtlSW5wdXQoJ2RhdGUnKTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHdyYXBJbkNvbnRyb2xEaXYodGhpcy5pbnB1dCk7XG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgfVxuXG4gIHByb2Nlc3NFbGVtZW50KCkge1xuICAgIGNvbnN0IGlzTW9kZXJuQnJvd3NlciA9ICd2YWx1ZUFzRGF0ZScgaW4gPGFueT50aGlzLmlucHV0O1xuICAgIGlmIChpc01vZGVybkJyb3dzZXIpIHtcbiAgICAgIGlmICghdGhpcy5pbnB1dC52YWx1ZUFzRGF0ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBkYXRlIScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQudmFsdWVBc0RhdGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb2Nlc3NSZXNwb25zZSh0aGlzLmlucHV0LnZhbHVlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW50ZXJ2aWV3SU8sIFF1ZXN0aW9uc0ZvciB9IGZyb20gJy4uL2ludGVydmlldy1pbyc7XG5pbXBvcnQgeyBRdWVzdGlvbiwgVmFsaWRhdGlvbkVycm9yLCBNdWx0aUNob2ljZUFuc3dlciB9IGZyb20gJy4uL3F1ZXN0aW9uJztcbmltcG9ydCB7IFBob3RvIH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgeyBXZWJQaG90b1F1ZXN0aW9uIH0gZnJvbSAnLi9waG90byc7XG5pbXBvcnQgeyBXZWJZZXNOb1F1ZXN0aW9uIH0gZnJvbSAnLi95ZXMtbm8nO1xuaW1wb3J0IHsgbWFrZUlucHV0LCB3cmFwSW5Db250cm9sRGl2LCBtYWtlRWxlbWVudCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBNb2RhbEJ1aWxkZXIgfSBmcm9tICcuL21vZGFsJztcbmltcG9ydCB7IFdlYkRhdGVRdWVzdGlvbiB9IGZyb20gJy4vZGF0ZSc7XG5pbXBvcnQgeyBXZWJNdWx0aUNob2ljZVF1ZXN0aW9uIH0gZnJvbSAnLi9tdWx0aS1jaG9pY2UnO1xuaW1wb3J0IG1ha2VUaHJvYmJlciBmcm9tICcuL3Rocm9iYmVyJztcblxuLyoqXG4gKiBBIFdlYldpZGdldCBpcyBhbiBhZGRpdGlvbmFsIGludGVyZmFjZSB0aGF0IGNhbiBiZSBpbXBsZW1lbnRlZCBvblxuICogYSBRdWVzdGlvbiB0byBpbmRpY2F0ZSB0aGF0IGl0IGhhcyBuYXRpdmUgd2ViIHN1cHBvcnQsIGFuZCBkb2Vzbid0XG4gKiBuZWVkIHRvIGp1c3QgYmUgYSB0ZXh0IGlucHV0IGZpZWxkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFdlYldpZGdldDxUPiB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuYXRpdmUgSFRNTCBlbGVtZW50IGZvciB0aGUgcXVlc3Rpb24uXG4gICAqL1xuICBnZXRFbGVtZW50OiAoKSA9PiBFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHF1ZXN0aW9uJ3Mgd2ViIGludGVyZmFjZVxuICAgKiBhbmQgcmV0dXJucyBpdHMgdmFsdWUgKG9yIGEgdmFsaWRhdGlvbiBlcnJvciBpZiBpdCdzIGludmFsaWQpLlxuICAgKi9cbiAgcHJvY2Vzc0VsZW1lbnQ6ICgpID0+IFByb21pc2U8VHxWYWxpZGF0aW9uRXJyb3I+O1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgbmF0aXZlIEhUTUwgZWxlbWVudCBjb250YWlucyBhbiA8aW5wdXQ+IHRoYXQgbmVlZHMgYSBsYWJlbCxcbiAgICogdGhpcyBjYW4gYmUgc2V0IHRvIHRoZSBcImlkXCIgYXR0cmlidXRlIG9mIHRoZSA8aW5wdXQ+LiBDYWxsaW5nIGNvZGVcbiAgICogaXMgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIGEgPGxhYmVsPiB3aXRoIGEgXCJmb3JcIiBhdHRyaWJ1dGUgcG9pbnRpbmdcbiAgICogdG8gdGhlIGlkLlxuICAgKi9cbiAgbGFiZWxGb3JJZD86IHN0cmluZztcbn1cblxuLyoqIEEgV2ViUXVlc3Rpb24gaXMganVzdCBhIFF1ZXN0aW9uIHRoYXQgc3VwcG9ydHMgdGhlIFdlYldpZGdldCBpbnRlcmZhY2UuICovXG50eXBlIFdlYlF1ZXN0aW9uPFQ+ID0gV2ViV2lkZ2V0PFQ+ICYgUXVlc3Rpb248VD47XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBRdWVzdGlvbiBoYXMgbmF0aXZlIHdlYiBzdXBwb3J0LlxuICogXG4gKiBAcGFyYW0gcXVlc3Rpb24gQSBRdWVzdGlvbiBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaXNXZWJRdWVzdGlvbjxUPihxdWVzdGlvbjogUXVlc3Rpb248VD4pOiBxdWVzdGlvbiBpcyBXZWJRdWVzdGlvbjxUPiB7XG4gIHJldHVybiB0eXBlb2YoKDxXZWJRdWVzdGlvbjxUPj5xdWVzdGlvbikuZ2V0RWxlbWVudCkgPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKiBcbiAqIEdpdmVuIGEgUXVlc3Rpb24sIHJldHVybiBhIHdlYi1lbmFibGVkIHZlcnNpb24gb2YgaXQuIElmIHRoZVxuICogUXVlc3Rpb24gZG9lc24ndCBoYXZlIG5hdGl2ZSB3ZWIgc3VwcG9ydCwgd2Ugd3JhcCBpdCBpbiBhXG4gKiBzaW1wbGUgdGV4dCBpbnB1dCBmaWVsZCBhcyBhIGZhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBjcmVhdGVXZWJXaWRnZXQ8VD4ocXVlc3Rpb246IFF1ZXN0aW9uPFQ+KTogV2ViV2lkZ2V0PFQ+IHtcbiAgaWYgKGlzV2ViUXVlc3Rpb24ocXVlc3Rpb24pKSB7XG4gICAgcmV0dXJuIHF1ZXN0aW9uO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlucHV0ID0gbWFrZUlucHV0KCd0ZXh0Jyk7XG4gICAgY29uc3QgY29udHJvbCA9IHdyYXBJbkNvbnRyb2xEaXYoaW5wdXQpO1xuICAgIHJldHVybiB7XG4gICAgICBnZXRFbGVtZW50OiAoKSA9PiBjb250cm9sLFxuICAgICAgcHJvY2Vzc0VsZW1lbnQ6ICgpID0+IHF1ZXN0aW9uLnByb2Nlc3NSZXNwb25zZShpbnB1dC52YWx1ZSksXG4gICAgICBsYWJlbEZvcklkOiBpbnB1dC5pZFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIGEgbWFwcGVkIHR5cGUgWzFdIGNvbnNpc3Rpbmcgb2YgcHJvcGVydGllcyB0aGF0IGNvbnNpc3RcbiAqIG9mIHF1ZXN0aW9uIGlucHV0cyB3aG9zZSBhbnN3ZXJzIG1hcCB0byB0aGUgb3JpZ2luYWwgcHJvcGVydHkgdHlwZXMuXG4gKiBcbiAqIFsxXSBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlc1xuICovXG5leHBvcnQgdHlwZSBRdWVzdGlvbklucHV0c0ZvcjxUPiA9IHtcbiAgW1AgaW4ga2V5b2YgVF06IFF1ZXN0aW9uSW5wdXQ8VFtQXT47XG59O1xuXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25JbnB1dDxUPiB7XG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gIHdpZGdldDogV2ViV2lkZ2V0PFQ+O1xuICBlcnJvcjogSFRNTFBhcmFncmFwaEVsZW1lbnR8bnVsbDtcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSBxdWVzdGlvbjogUXVlc3Rpb248VD4pIHtcbiAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgdGhpcy5jb250YWluZXIgPSBtYWtlRWxlbWVudCgnZGl2JywgeyBjbGFzc2VzOiBbJ2ZpZWxkJ10gfSk7XG5cbiAgICBjb25zdCBsYWJlbCA9IG1ha2VFbGVtZW50KCdsYWJlbCcsIHtcbiAgICAgIGNsYXNzZXM6IFsnamYtcXVlc3Rpb24nLCAnbGFiZWwnXSxcbiAgICAgIHRleHRDb250ZW50OiBxdWVzdGlvbi50ZXh0LFxuICAgICAgYXBwZW5kVG86IHRoaXMuY29udGFpbmVyLFxuICAgIH0pO1xuXG4gICAgdGhpcy53aWRnZXQgPSBjcmVhdGVXZWJXaWRnZXQocXVlc3Rpb24pO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMud2lkZ2V0LmdldEVsZW1lbnQoKSk7XG4gICAgaWYgKHRoaXMud2lkZ2V0LmxhYmVsRm9ySWQpIHtcbiAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgdGhpcy53aWRnZXQubGFiZWxGb3JJZCk7XG4gICAgfVxuICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICB9XG5cbiAgc2hvd0Vycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5lcnJvcikge1xuICAgICAgdGhpcy5lcnJvciA9IG1ha2VFbGVtZW50KCdwJywge1xuICAgICAgICBjbGFzc2VzOiBbJ2hlbHAnLCAnaXMtZGFuZ2VyJ10sXG4gICAgICAgIGFwcGVuZFRvOiB0aGlzLmNvbnRhaW5lclxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuZXJyb3IudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICB9XG5cbiAgaGlkZUVycm9yKCkge1xuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLmVycm9yKTtcbiAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlc3BvbmQoKTogUHJvbWlzZTxUfG51bGw+IHtcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLndpZGdldC5wcm9jZXNzRWxlbWVudCgpO1xuXG4gICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICB0aGlzLnNob3dFcnJvcihyZXNwb25zZS5tZXNzYWdlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0aGlzLmhpZGVFcnJvcigpO1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViSW50ZXJ2aWV3SU8gZXh0ZW5kcyBJbnRlcnZpZXdJTyB7XG4gIHJvb3Q6IEVsZW1lbnR8bnVsbDtcbiAgc3RhdHVzRGl2OiBIVE1MRGl2RWxlbWVudDtcblxuICBjb25zdHJ1Y3Rvcihyb290OiBFbGVtZW50LCByZWFkb25seSBtb2RhbEJ1aWxkZXI6IE1vZGFsQnVpbGRlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICB0aGlzLm1vZGFsQnVpbGRlciA9IG1vZGFsQnVpbGRlcjtcbiAgICB0aGlzLnN0YXR1c0RpdiA9IG1ha2VFbGVtZW50KCdkaXYnLCB7IGFwcGVuZFRvOiByb290IH0pO1xuICB9XG5cbiAgZW5zdXJlUm9vdCgpOiBFbGVtZW50IHtcbiAgICBpZiAoIXRoaXMucm9vdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gd2FzIHNodXQgZG93bmApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yb290O1xuICB9XG5cbiAgYXN5bmMgYXNrPFQ+KHF1ZXN0aW9uOiBRdWVzdGlvbjxUPik6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5hc2tNYW55KHsgcXVlc3Rpb24gfSkpLnF1ZXN0aW9uO1xuICB9XG5cbiAgYXN5bmMgYXNrTWFueTxUPihxdWVzdGlvbnM6IFF1ZXN0aW9uc0ZvcjxUPik6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgY29uc3QgcXVlc3Rpb25JbnB1dHMgPSB7fSBhcyBRdWVzdGlvbklucHV0c0ZvcjxUPjtcbiAgICBsZXQgZm91bmRGaXJzdFF1ZXN0aW9uID0gZmFsc2U7XG5cbiAgICB0aGlzLmVuc3VyZVJvb3QoKS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgICB0aGlzLnNldFN0YXR1cygnJyk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gcXVlc3Rpb25zKSB7XG4gICAgICBpZiAoIWZvdW5kRmlyc3RRdWVzdGlvbikge1xuICAgICAgICBmb3VuZEZpcnN0UXVlc3Rpb24gPSB0cnVlO1xuICAgICAgICB0aGlzLmVtaXQoJ3RpdGxlJywgcXVlc3Rpb25zW2tleV0udGV4dCk7XG4gICAgICB9XG4gICAgICBjb25zdCBxaSA9IG5ldyBRdWVzdGlvbklucHV0KHF1ZXN0aW9uc1trZXldKTtcbiAgICAgIHF1ZXN0aW9uSW5wdXRzW2tleV0gPSBxaTtcbiAgICAgIGZvcm0uYXBwZW5kQ2hpbGQocWkuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJtaXQgPSBtYWtlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICBjbGFzc2VzOiBbJ2J1dHRvbicsICdpcy1wcmltYXJ5J10sXG4gICAgICB0ZXh0Q29udGVudDogJ1N1Ym1pdCcsXG4gICAgICBhcHBlbmRUbzogZm9ybSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldFJlc3BvbnNlcyA9IGFzeW5jICgpOiBQcm9taXNlPFR8bnVsbD4gPT4ge1xuICAgICAgY29uc3QgcmVzcG9uc2VzID0ge30gYXMgVDtcbiAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgIGZvciAobGV0IGtleSBpbiBxdWVzdGlvbklucHV0cykge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHF1ZXN0aW9uSW5wdXRzW2tleV0ucmVzcG9uZCgpO1xuICAgICAgICBpZiAocmVzcG9uc2UgIT09IG51bGwpIHtcbiAgICAgICAgICByZXNwb25zZXNba2V5XSA9IHJlc3BvbnNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlzVmFsaWQgPyByZXNwb25zZXMgOiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmb3JtLm9uc3VibWl0ID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBnZXRSZXNwb25zZXMoKS50aGVuKHJlc3BvbnNlcyA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlcykge1xuICAgICAgICAgICAgdGhpcy5lbnN1cmVSb290KCkucmVtb3ZlQ2hpbGQoZm9ybSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXNwb25zZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBub3RpZnkodGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXRTdGF0dXMoJycpO1xuICAgIHRoaXMubW9kYWxCdWlsZGVyLmNyZWF0ZUFuZE9wZW4odGV4dCk7XG4gIH1cblxuICBzZXRTdGF0dXModGV4dDogc3RyaW5nLCBvcHRpb25zOiB7IHNob3dUaHJvYmJlcj86IGJvb2xlYW4gfSA9IHsgc2hvd1Rocm9iYmVyOiB0cnVlIH0pIHtcbiAgICB0aGlzLmVuc3VyZVJvb3QoKTtcbiAgICB0aGlzLnN0YXR1c0Rpdi50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgaWYgKHRleHQpIHtcbiAgICAgIGlmIChvcHRpb25zLnNob3dUaHJvYmJlcikge1xuICAgICAgICB0aGlzLnN0YXR1c0Rpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnICcpKTtcbiAgICAgICAgdGhpcy5zdGF0dXNEaXYuYXBwZW5kQ2hpbGQobWFrZVRocm9iYmVyKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCd0aXRsZScsIHRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVBob3RvUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248UGhvdG8+IHtcbiAgICByZXR1cm4gbmV3IFdlYlBob3RvUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVZZXNOb1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFdlYlllc05vUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVEYXRlUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248RGF0ZT4ge1xuICAgIHJldHVybiBuZXcgV2ViRGF0ZVF1ZXN0aW9uKHRleHQpO1xuICB9XG5cbiAgY3JlYXRlTXVsdGlDaG9pY2VRdWVzdGlvbjxUPih0ZXh0OiBzdHJpbmcsIGFuc3dlcnM6IE11bHRpQ2hvaWNlQW5zd2VyPFQ+W10pIHtcbiAgICByZXR1cm4gbmV3IFdlYk11bHRpQ2hvaWNlUXVlc3Rpb24odGV4dCwgYW5zd2Vycyk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLmVuc3VyZVJvb3QoKS5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICAgIHRoaXMubW9kYWxCdWlsZGVyLnNodXRkb3duKCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBXZWJJbnRlcnZpZXdJTyB7XG4gIG9uKGV2ZW50OiAndGl0bGUnLCBsaXN0ZW5lcjogKHRpdGxlOiBzdHJpbmcpID0+IHZvaWQpOiB0aGlzO1xuICBlbWl0KGV2ZW50OiAndGl0bGUnLCB0aXRsZTogc3RyaW5nKTogYm9vbGVhbjtcbn1cbiIsImltcG9ydCB7IGdldEVsZW1lbnQsIG1ha2VFbGVtZW50IH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcImV2ZW50c1wiO1xuXG5leHBvcnQgY2xhc3MgTW9kYWxCdWlsZGVyIHtcbiAgbW9kYWw6IE1vZGFsfG51bGwgPSBudWxsO1xuICBpc1NodXREb3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgdGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgdGhpcy5jcmVhdGUoJ3RoaXMgaXMgYSBzbW9rZSB0ZXN0IHRvIG1ha2Ugc3VyZSB0aGUgdGVtcGxhdGUgaXMgdmFsaWQhJyk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZSh0ZXh0OiBzdHJpbmcpOiBNb2RhbCB7XG4gICAgcmV0dXJuIG5ldyBNb2RhbCh0aGlzLnRlbXBsYXRlLCB0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBzaW1wbGUgbW9kYWwgd2l0aCBzb21lIHRleHQgYW5kIGFuIE9LIGJ1dHRvbiwgYW5kIHNob3cgaXQuXG4gICAqIFxuICAgKiBAcGFyYW0gdGV4dCBUaGUgdGV4dCB0byBkaXNwbGF5IGluIHRoZSBtb2RhbC5cbiAgICovXG4gIGNyZWF0ZUFuZE9wZW4odGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaXNTaHV0RG93bikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gaXMgc2h1dCBkb3duYCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZGFsKSB7XG4gICAgICB0aGlzLm1vZGFsLmFkZFRleHQodGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW9kYWwgPSB0aGlzLmNyZWF0ZSh0ZXh0KTtcbiAgICAgIHRoaXMubW9kYWwub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLm1vZGFsID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5tb2RhbC5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgc2h1dGRvd24oKSB7XG4gICAgaWYgKHRoaXMubW9kYWwpIHtcbiAgICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgICB9XG4gICAgdGhpcy5pc1NodXREb3duID0gdHJ1ZTtcbiAgfVxufVxuXG5jbGFzcyBNb2RhbCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIG1vZGFsRGl2OiBIVE1MRGl2RWxlbWVudDtcbiAgb2tCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuICBjbG9zZUJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gIGNvbnRlbnRFbDogSFRNTERpdkVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQsIHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3QgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXG4gICAgdGhpcy5tb2RhbERpdiA9IGdldEVsZW1lbnQoJ2RpdicsICcubW9kYWwnLCBjbG9uZSk7XG4gICAgdGhpcy5jb250ZW50RWwgPSBnZXRFbGVtZW50KCdkaXYnLCAnW2RhdGEtbW9kYWwtY29udGVudF0nLCB0aGlzLm1vZGFsRGl2KTtcbiAgICB0aGlzLm9rQnV0dG9uID0gZ2V0RWxlbWVudCgnYnV0dG9uJywgJy5pcy1wcmltYXJ5JywgdGhpcy5tb2RhbERpdik7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IGdldEVsZW1lbnQoJ2J1dHRvbicsICcubW9kYWwtY2xvc2UnLCB0aGlzLm1vZGFsRGl2KTtcblxuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVLZXlVcCA9IHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY29udGVudEVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm1vZGFsRGl2KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXApO1xuICAgIHRoaXMub2tCdXR0b24uZm9jdXMoKTtcbiAgICB0aGlzLm9rQnV0dG9uLm9uY2xpY2sgPSB0aGlzLmNsb3NlQnV0dG9uLm9uY2xpY2sgPSB0aGlzLmNsb3NlO1xuICAgIC8vIFRPRE86IFRyYXAga2V5Ym9hcmQgZm9jdXMgYW5kIGFsbCB0aGUgb3RoZXIgYWNjZXNzaWJpbGl0eSBiaXRzLlxuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm1vZGFsRGl2KTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXApO1xuICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcbiAgfVxuXG4gIGFkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgbWFrZUVsZW1lbnQoJ2JyJywgeyBhcHBlbmRUbzogdGhpcy5jb250ZW50RWwgfSk7XG4gICAgbWFrZUVsZW1lbnQoJ2JyJywgeyBhcHBlbmRUbzogdGhpcy5jb250ZW50RWwgfSk7XG4gICAgdGhpcy5jb250ZW50RWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVLZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTXVsdGlDaG9pY2VBbnN3ZXIsIFZhbGlkYXRpb25FcnJvciwgUXVlc3Rpb24gfSBmcm9tIFwiLi4vcXVlc3Rpb25cIjtcbmltcG9ydCB7IFdlYldpZGdldCB9IGZyb20gXCIuL2lvXCI7XG5pbXBvcnQgeyBtYWtlRWxlbWVudCwgY3JlYXRlVW5pcXVlSWQsIG1ha2VSYWRpbyB9IGZyb20gXCIuL3V0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFdlYk11bHRpQ2hvaWNlUXVlc3Rpb248VD4gZXh0ZW5kcyBRdWVzdGlvbjxUPiBpbXBsZW1lbnRzIFdlYldpZGdldDxUPiB7XG4gIGRpdjogSFRNTERpdkVsZW1lbnQ7XG4gIGlucHV0TmFtZTogc3RyaW5nO1xuICByYWRpb3M6IEhUTUxJbnB1dEVsZW1lbnRbXTtcbiAgdGV4dDogc3RyaW5nO1xuICBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdO1xuXG4gIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcnM6IE11bHRpQ2hvaWNlQW5zd2VyPFQ+W10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGV4dCA9IHF1ZXN0aW9uO1xuICAgIHRoaXMuYW5zd2VycyA9IGFuc3dlcnM7XG4gICAgdGhpcy5kaXYgPSBtYWtlRWxlbWVudCgnZGl2JywgeyBjbGFzc2VzOiBbJ2NvbnRyb2wnXSB9KTtcbiAgICB0aGlzLmlucHV0TmFtZSA9IGNyZWF0ZVVuaXF1ZUlkKCk7XG4gICAgdGhpcy5yYWRpb3MgPSBhbnN3ZXJzLm1hcChhbnN3ZXIgPT4ge1xuICAgICAgY29uc3Qgd3JhcHBlciA9IG1ha2VFbGVtZW50KCdwJywgeyBhcHBlbmRUbzogdGhpcy5kaXYgfSk7XG4gICAgICByZXR1cm4gbWFrZVJhZGlvKHdyYXBwZXIsIHRoaXMuaW5wdXROYW1lLCBhbnN3ZXJbMV0pLmlucHV0O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXY7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzRWxlbWVudCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCByYWRpbyA9IHRoaXMucmFkaW9zW2ldO1xuICAgICAgaWYgKHJhZGlvLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5zd2Vyc1tpXVswXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBjaG9vc2UgYW4gYW5zd2VyLicpO1xuICB9XG5cbiAgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPFQgfCBWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCEnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUXVlc3Rpb24sIFZhbGlkYXRpb25FcnJvciB9IGZyb20gXCIuLi9xdWVzdGlvblwiO1xuaW1wb3J0IHsgUGhvdG8gfSBmcm9tIFwiLi4vdXRpbFwiO1xuaW1wb3J0IHsgV2ViV2lkZ2V0IH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IG1ha2VJbnB1dCwgbWFrZUVsZW1lbnQgfSBmcm9tIFwiLi91dGlsXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJQaG90b1F1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb248UGhvdG8+IGltcGxlbWVudHMgV2ViV2lkZ2V0PFBob3RvPiB7XG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICBsYWJlbEZvcklkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgdGV4dDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMuaW5wdXQgPSBtYWtlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6ICdmaWxlJyB9KTtcbiAgICB0aGlzLmxhYmVsRm9ySWQgPSB0aGlzLmlucHV0LmlkO1xuICB9XG5cbiAgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPFBob3RvfFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBmdW5jdGlvbiBzaG91bGQgbmV2ZXIgYmUgY2FsbGVkIScpO1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpOiBFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dDtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NFbGVtZW50KCk6IFByb21pc2U8UGhvdG98VmFsaWRhdGlvbkVycm9yPiB7XG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmlucHV0LmZpbGVzO1xuXG4gICAgaWYgKCFmaWxlcyB8fCBmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBuZXcgVmFsaWRhdGlvbkVycm9yKCdZb3UgbXVzdCB1cGxvYWQgYW4gaW1hZ2UhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZSA9IGZpbGVzWzBdO1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8UGhvdG8+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKCFldmVudC50YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KCdldmVudC50YXJnZXQgaXMgbnVsbCEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKGV2ZW50LnRhcmdldC5yZXN1bHQpID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgL15kYXRhOi8udGVzdChldmVudC50YXJnZXQucmVzdWx0KSkge1xuICAgICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdldmVudC50YXJnZXQucmVzdWx0IGlzIG5vdCBhIGRhdGEgVVJJIScpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VTZXJpYWxpemVyPFM+IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkga2V5bmFtZTogc3RyaW5nLCByZWFkb25seSBkZWZhdWx0U3RhdGU6IFMpIHtcbiAgICB0aGlzLmtleW5hbWUgPSBrZXluYW1lO1xuICAgIHRoaXMuZGVmYXVsdFN0YXRlID0gZGVmYXVsdFN0YXRlO1xuICB9XG5cbiAgZ2V0KCk6IFMge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb250ZW50cyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbdGhpcy5rZXluYW1lXTtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0U3RhdGU7XG4gICAgfVxuICB9XG5cbiAgc2V0KHN0YXRlOiBTKSB7XG4gICAgY29uc3QgY29udGVudHMgPSBKU09OLnN0cmluZ2lmeShzdGF0ZSwgbnVsbCwgMik7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZVt0aGlzLmtleW5hbWVdID0gY29udGVudHM7XG4gIH1cbn1cbiIsImltcG9ydCB7IG1ha2VFbGVtZW50LCBnZXRFbGVtZW50IH0gZnJvbSBcIi4vdXRpbFwiO1xuXG4vLyBodHRwczovL2NvbW1vbnMud2lraW1lZGlhLm9yZy93aWtpL0ZpbGU6Q2hyb21pdW10aHJvYmJlci5zdmdcbmNvbnN0IEhUTUwgPSBgXG48c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMzAwIDMwMFwiXG4gICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCI+XG4gIDxwYXRoIGQ9XCJNIDE1MCwwXG4gICAgICAgICAgIGEgMTUwLDE1MCAwIDAsMSAxMDYuMDY2LDI1Ni4wNjZcbiAgICAgICAgICAgbCAtMzUuMzU1LC0zNS4zNTVcbiAgICAgICAgICAgYSAtMTAwLC0xMDAgMCAwLDAgLTcwLjcxMSwtMTcwLjcxMSB6XCJcbiAgICAgICAgZmlsbD1cIiMwMGQxYjJcIj5cbiAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPVwidHJhbnNmb3JtXCIgYXR0cmlidXRlVHlwZT1cIlhNTFwiXG4gICAgICAgICAgIHR5cGU9XCJyb3RhdGVcIiBmcm9tPVwiMCAxNTAgMTUwXCIgdG89XCIzNjAgMTUwIDE1MFwiXG4gICAgICAgICAgIGJlZ2luPVwiMHNcIiBkdXI9XCIxc1wiIGZpbGw9XCJmcmVlemVcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiAvPlxuICA8L3BhdGg+XG48L3N2Zz5cbmAudHJpbSgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWtlVGhyb2JiZXIoKTogU1ZHRWxlbWVudCB7XG4gIGNvbnN0IGRpdiA9IG1ha2VFbGVtZW50KCdkaXYnLCB7IGlubmVySFRNTDogSFRNTCB9KTtcbiAgY29uc3Qgc3ZnID0gZGl2LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICBpZiAoIXN2Zykge1xuICAgIHRocm93IG5ldyBFcnJvcigndGhyb2JiZXIgc3ZnIG5vdCBmb3VuZCcpO1xuICB9XG4gIHJldHVybiBzdmc7XG59XG5cbi8vIFRoaXMgaXMgYSBzbW9rZSB0ZXN0L3Nhbml0eSBjaGVjay5cbm1ha2VUaHJvYmJlcigpO1xuIiwiLyoqXG4gKiBGaW5kIGFuIGVsZW1lbnQuXG4gKiBcbiAqIEBwYXJhbSB0YWdOYW1lIFRoZSBuYW1lIG9mIHRoZSBlbGVtZW50J3MgSFRNTCB0YWcuXG4gKiBAcGFyYW0gc2VsZWN0b3IgVGhlIHNlbGVjdG9yIGZvciB0aGUgZWxlbWVudCwgbm90IGluY2x1ZGluZyBpdHMgSFRNTCB0YWcuXG4gKiBAcGFyYW0gcGFyZW50IFRoZSBwYXJlbnQgbm9kZSB0byBzZWFyY2ggd2l0aGluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudDxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihcbiAgdGFnTmFtZTogSyxcbiAgc2VsZWN0b3I6IHN0cmluZyxcbiAgcGFyZW50OiBQYXJlbnROb2RlID0gZG9jdW1lbnRcbik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSB7XG4gIGNvbnN0IGZpbmFsU2VsZWN0b3IgPSBgJHt0YWdOYW1lfSR7c2VsZWN0b3J9YDtcbiAgY29uc3Qgbm9kZSA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKGZpbmFsU2VsZWN0b3IpO1xuICBpZiAoIW5vZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkbid0IGZpbmQgYW55IGVsZW1lbnRzIG1hdGNoaW5nIFwiJHtmaW5hbFNlbGVjdG9yfVwiYCk7XG4gIH1cbiAgcmV0dXJuIG5vZGUgYXMgSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xufVxuXG5sZXQgaWRDb3VudGVyID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVuaXF1ZUlkKCk6IHN0cmluZyB7XG4gIGlkQ291bnRlcisrO1xuICByZXR1cm4gYHVuaXF1ZV9pZF8ke2lkQ291bnRlcn1gO1xufVxuXG4vKiogVGhpcyBkZWZpbmVzIGFsbCB0aGUgdmFsaWQgQ1NTIGNsYXNzZXMgaW4gb3VyIHByb2plY3QuICovXG50eXBlIENzc0NsYXNzTmFtZSA9XG4gIC8vIEJ1bG1hIGNsYXNzZXMuXG4gICdjb250cm9sJyB8XG4gICdmaWVsZCcgfFxuICAnbGFiZWwnIHxcbiAgJ2hlbHAnIHxcbiAgJ2J1dHRvbicgfFxuICAncmFkaW8nIHxcbiAgJ2lucHV0JyB8XG4gICdpcy1kYW5nZXInIHxcbiAgJ2lzLXByaW1hcnknIHxcbiAgLy8gQ3VzdG9tIEp1c3RGaXggY2xhc3Nlcy5cbiAgJ2pmLXF1ZXN0aW9uJztcblxuaW50ZXJmYWNlIE1ha2VFbGVtZW50T3B0aW9uczxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+IHtcbiAgLyoqIFRoZSBlbGVtZW50J3MgY2xhc3NlcyAoY29ycmVzcG9uZHMgdG8gdGhlIFwiY2xhc3NcIiBhdHRyaWJ1dGUpLiAqL1xuICBjbGFzc2VzPzogQ3NzQ2xhc3NOYW1lW10sXG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCdzIHR5cGUuICovXG4gIHR5cGU/OiBUIGV4dGVuZHMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxCdXR0b25FbGVtZW50ID8gc3RyaW5nIDogbmV2ZXIsXG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCdzIG5hbWUuICovXG4gIG5hbWU/OiBUIGV4dGVuZHMgSFRNTElucHV0RWxlbWVudCA/IHN0cmluZyA6IG5ldmVyLFxuICAvKiogVGhlIGlucHV0IGVsZW1lbnQncyB2YWx1ZS4gKi9cbiAgdmFsdWU/OiBUIGV4dGVuZHMgSFRNTElucHV0RWxlbWVudCA/IHN0cmluZyA6IG5ldmVyLFxuICAvKiogT3B0aW9uYWwgcGFyZW50IGVsZW1lbnQgdG8gYXBwZW5kIHRoZSBuZXdseS1jcmVhdGVkIGVsZW1lbnQgdG8uICovXG4gIGFwcGVuZFRvPzogRWxlbWVudCxcbiAgLyoqIE9wdGlvbmFsIGNoaWxkIGVsZW1lbnRzIHRvIGFwcGVuZCB0byB0aGUgbmV3bHktY3JlYXRlZCBlbGVtZW50LiAqL1xuICBjaGlsZHJlbj86IEVsZW1lbnRbXSxcbiAgLyoqIFRoZSBlbGVtZW50J3MgdGV4dCBjb250ZW50LiAqL1xuICB0ZXh0Q29udGVudD86IHN0cmluZyxcbiAgLyoqIFRoZSBlbGVtZW50J3MgaW5uZXIgSFRNTC4gKi9cbiAgaW5uZXJIVE1MPzogc3RyaW5nLFxuICAvKiogVGhlIGVsZW1lbnQncyBcInRhYmluZGV4XCIgYXR0cmlidXRlLiAqL1xuICB0YWJJbmRleD86IDAgfCAtMSxcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gSFRNTCBlbGVtZW50LlxuICogXG4gKiBJZiB0aGUgZWxlbWVudCBpcyBhbiA8aW5wdXQ+LCBhdXRvbWF0aWNhbGx5IGFzc2lnbiBhIHVuaXF1ZSBJRCB0byBpdC5cbiAqIFxuICogQHBhcmFtIHRhZ05hbWUgVGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQncyBIVE1MIHRhZy5cbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVsZW1lbnQ8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oXG4gIHRhZ05hbWU6IEssXG4gIG9wdGlvbnM6IE1ha2VFbGVtZW50T3B0aW9uczxIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10+XG4pOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cbiAgaWYgKG9wdGlvbnMuY2xhc3Nlcykge1xuICAgIG9wdGlvbnMuY2xhc3Nlcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkpO1xuICB9XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgfHwgZWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgIGVsLnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgJyc7XG4gIH1cbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgIGVsLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJyc7XG4gICAgZWwudmFsdWUgPSBvcHRpb25zLnZhbHVlIHx8ICcnO1xuICAgIGVsLmlkID0gY3JlYXRlVW5pcXVlSWQoKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLnRleHRDb250ZW50KSB7XG4gICAgZWwudGV4dENvbnRlbnQgPSBvcHRpb25zLnRleHRDb250ZW50O1xuICB9XG4gIGlmIChvcHRpb25zLmlubmVySFRNTCkge1xuICAgIGVsLmlubmVySFRNTCA9IG9wdGlvbnMuaW5uZXJIVE1MO1xuICB9XG4gIGlmIChvcHRpb25zLmFwcGVuZFRvKSB7XG4gICAgb3B0aW9ucy5hcHBlbmRUby5hcHBlbmRDaGlsZChlbCk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuY2hpbGRyZW4pIHtcbiAgICBvcHRpb25zLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gZWwuYXBwZW5kQ2hpbGQoY2hpbGQpKTtcbiAgfVxuICBpZiAodHlwZW9mKG9wdGlvbnMudGFiSW5kZXgpID09PSAnbnVtYmVyJykge1xuICAgIGVsLnRhYkluZGV4ID0gb3B0aW9ucy50YWJJbmRleDtcbiAgfVxuXG4gIHJldHVybiBlbDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gPGlucHV0PiBlbGVtZW50IHdpdGggYSB1bmlxdWUgaWQuXG4gKiBcbiAqIEBwYXJhbSB0eXBlIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQncyBcInR5cGVcIiBhdHRyaWJ1dGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSW5wdXQodHlwZTogc3RyaW5nKTogSFRNTElucHV0RWxlbWVudCB7XG4gIHJldHVybiBtYWtlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGUsIGNsYXNzZXM6IFsnaW5wdXQnXSB9KTtcbn1cblxuLyoqXG4gKiBXcmFwIHRoZSBnaXZlbiBlbGVtZW50IGluIGEgPGRpdiBjbGFzcz1cImNvbnRyb2xcIj4uXG4gKiBcbiAqIEBwYXJhbSBlbCBUaGUgZWxlbWVudCB0byB3cmFwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcEluQ29udHJvbERpdihlbDogRWxlbWVudCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgcmV0dXJuIG1ha2VFbGVtZW50KCdkaXYnLCB7XG4gICAgY2xhc3NlczogWydjb250cm9sJ10sXG4gICAgY2hpbGRyZW46IFtlbF0sXG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiA8aW5wdXQgdHlwZT1cInJhZGlvXCI+IHdyYXBwZWQgaW4gYSA8bGFiZWw+LlxuICogXG4gKiBAcGFyYW0gcGFyZW50IFRoZSBwYXJlbnQgbm9kZSB0byBhcHBlbmQgdGhlIHJhZGlvIHRvLlxuICogQHBhcmFtIGlucHV0TmFtZSBUaGUgXCJuYW1lXCIgYXR0cmlidXRlIG9mIHRoZSByYWRpby5cbiAqIEBwYXJhbSBsYWJlbFRleHQgVGhlIHRleHQgb2YgdGhlIHJhZGlvJ3MgbGFiZWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUmFkaW8ocGFyZW50OiBIVE1MRWxlbWVudCwgaW5wdXROYW1lOiBzdHJpbmcsIGxhYmVsVGV4dDogc3RyaW5nKToge1xuICBsYWJlbDogSFRNTExhYmVsRWxlbWVudCxcbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnRcbn0ge1xuICBjb25zdCBsYWJlbCA9IG1ha2VFbGVtZW50KCdsYWJlbCcsIHsgY2xhc3NlczogWydyYWRpbyddIH0pO1xuICBjb25zdCBpbnB1dCA9IG1ha2VFbGVtZW50KCdpbnB1dCcsIHtcbiAgICB0eXBlOiAncmFkaW8nLFxuICAgIG5hbWU6IGlucHV0TmFtZSxcbiAgICB2YWx1ZTogbGFiZWxUZXh0LFxuICAgIGFwcGVuZFRvOiBsYWJlbFxuICB9KTtcblxuICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgICR7bGFiZWxUZXh0fWApKTtcblxuICBwYXJlbnQuYXBwZW5kQ2hpbGQobGFiZWwpO1xuXG4gIHJldHVybiB7IGxhYmVsLCBpbnB1dCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNvbmRzOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtaWxsaXNlY29uZHMpO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IFZhbGlkYXRpb25FcnJvciwgWWVzTm9RdWVzdGlvbiB9IGZyb20gXCIuLi9xdWVzdGlvblwiO1xuaW1wb3J0IHsgV2ViV2lkZ2V0IH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IGNyZWF0ZVVuaXF1ZUlkLCBtYWtlUmFkaW8sIG1ha2VFbGVtZW50IH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5cbmV4cG9ydCBjbGFzcyBXZWJZZXNOb1F1ZXN0aW9uIGV4dGVuZHMgWWVzTm9RdWVzdGlvbiBpbXBsZW1lbnRzIFdlYldpZGdldDxib29sZWFuPiB7XG4gIGRpdjogSFRNTERpdkVsZW1lbnQ7XG4gIHllc0lucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICBub0lucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICBpbnB1dE5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSB0ZXh0OiBzdHJpbmcpIHtcbiAgICBzdXBlcih0ZXh0KTtcbiAgICB0aGlzLmRpdiA9IG1ha2VFbGVtZW50KCdkaXYnLCB7IGNsYXNzZXM6IFsnY29udHJvbCddIH0pO1xuICAgIHRoaXMuaW5wdXROYW1lID0gY3JlYXRlVW5pcXVlSWQoKTtcbiAgICB0aGlzLnllc0lucHV0ID0gbWFrZVJhZGlvKHRoaXMuZGl2LCB0aGlzLmlucHV0TmFtZSwgJ1llcycpLmlucHV0O1xuICAgIHRoaXMubm9JbnB1dCA9IG1ha2VSYWRpbyh0aGlzLmRpdiwgdGhpcy5pbnB1dE5hbWUsICdObycpLmlucHV0O1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZGl2O1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc0VsZW1lbnQoKTogUHJvbWlzZTxib29sZWFufFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIGlmICh0aGlzLnllc0lucHV0LmNoZWNrZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ub0lucHV0LmNoZWNrZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBjaG9vc2UgYW4gYW5zd2VyLicpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaW1wb3J0IHsgYWRkRGF5cyB9IGZyb20gJy4uL2xpYi91dGlsJztcbmltcG9ydCB7IFRlbmFudEludGVydmlldyB9IGZyb20gJy4uL2xpYi90ZW5hbnQtaW50ZXJ2aWV3JztcbmltcG9ydCB7IFRlbmFudCB9IGZyb20gJy4uL2xpYi90ZW5hbnQnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlU2VyaWFsaXplciB9IGZyb20gJy4uL2xpYi93ZWIvc2VyaWFsaXplcic7XG5pbXBvcnQgeyBXZWJJbnRlcnZpZXdJTyB9IGZyb20gJy4uL2xpYi93ZWIvaW8nO1xuaW1wb3J0IHsgZ2V0RWxlbWVudCB9IGZyb20gJy4uL2xpYi93ZWIvdXRpbCc7XG5pbXBvcnQgeyBNb2RhbEJ1aWxkZXIgfSBmcm9tICcuLi9saWIvd2ViL21vZGFsJztcblxuaW50ZXJmYWNlIEFwcFN0YXRlIHtcbiAgZGF5czogbnVtYmVyLFxuICB0ZW5hbnQ6IFRlbmFudCxcbn1cblxuY29uc3QgSU5JVElBTF9BUFBfU1RBVEU6IEFwcFN0YXRlID0ge1xuICBkYXlzOiAwLFxuICB0ZW5hbnQ6IHt9XG59O1xuXG5pbnRlcmZhY2UgUmVzdGFydE9wdGlvbnMge1xuICBwdXNoU3RhdGU6IGJvb2xlYW47XG59XG5cbmxldCBpbzogV2ViSW50ZXJ2aWV3SU98bnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIHJlc3RhcnQob3B0aW9uczogUmVzdGFydE9wdGlvbnMgPSB7IHB1c2hTdGF0ZTogdHJ1ZSB9KSB7XG4gIGNvbnN0IHJlc2V0QnV0dG9uID0gZ2V0RWxlbWVudCgnYnV0dG9uJywgJyNyZXNldCcpO1xuICBjb25zdCBkYXlzSW5wdXQgPSBnZXRFbGVtZW50KCdpbnB1dCcsICcjZGF5cycpO1xuICBjb25zdCBtYWluRGl2ID0gZ2V0RWxlbWVudCgnZGl2JywgJyNtYWluJyk7XG4gIGNvbnN0IGRhdGVTcGFuID0gZ2V0RWxlbWVudCgnc3BhbicsICcjZGF0ZScpO1xuICBjb25zdCBtb2RhbFRlbXBsYXRlID0gZ2V0RWxlbWVudCgndGVtcGxhdGUnLCAnI21vZGFsJyk7XG5cbiAgaWYgKGlvKSB7XG4gICAgaW8uY2xvc2UoKTtcbiAgICBpbyA9IG51bGw7XG4gIH1cblxuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IExvY2FsU3RvcmFnZVNlcmlhbGl6ZXIoJ3RlbmFudEFwcFN0YXRlJywgSU5JVElBTF9BUFBfU1RBVEUpO1xuICBjb25zdCBteUlvID0gbmV3IFdlYkludGVydmlld0lPKG1haW5EaXYsIG5ldyBNb2RhbEJ1aWxkZXIobW9kYWxUZW1wbGF0ZSkpO1xuICBpbyA9IG15SW87XG5cbiAgaWYgKG9wdGlvbnMucHVzaFN0YXRlKSB7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHNlcmlhbGl6ZXIuZ2V0KCksICcnLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc2VyaWFsaXplci5nZXQoKSwgJycsIG51bGwpO1xuICB9XG5cbiAgd2luZG93Lm9ucG9wc3RhdGUgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQuc3RhdGUpIHtcbiAgICAgIHNlcmlhbGl6ZXIuc2V0KGV2ZW50LnN0YXRlKTtcbiAgICAgIHJlc3RhcnQoeyBwdXNoU3RhdGU6IGZhbHNlIH0pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBpbnRlcnZpZXcgPSBuZXcgVGVuYW50SW50ZXJ2aWV3KHtcbiAgICBpbyxcbiAgICBub3c6IGFkZERheXMobmV3IERhdGUoKSwgc2VyaWFsaXplci5nZXQoKS5kYXlzKVxuICB9KTtcblxuICBkYXRlU3Bhbi50ZXh0Q29udGVudCA9IGludGVydmlldy5ub3cudG9EYXRlU3RyaW5nKCk7XG4gIGRheXNJbnB1dC52YWx1ZSA9IHNlcmlhbGl6ZXIuZ2V0KCkuZGF5cy50b1N0cmluZygpO1xuXG4gIHJlc2V0QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgc2VyaWFsaXplci5zZXQoSU5JVElBTF9BUFBfU1RBVEUpO1xuICAgIHJlc3RhcnQoKTtcbiAgfTtcblxuICBkYXlzSW5wdXQub25jaGFuZ2UgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBzZXJpYWxpemVyLnNldCh7XG4gICAgICAuLi5zZXJpYWxpemVyLmdldCgpLFxuICAgICAgZGF5czogcGFyc2VJbnQoZGF5c0lucHV0LnZhbHVlKVxuICAgIH0pO1xuICAgIHJlc3RhcnQoKTtcbiAgfTtcblxuICBpbnRlcnZpZXcub24oJ2NoYW5nZScsIChfLCBuZXh0U3RhdGUpID0+IHtcbiAgICBzZXJpYWxpemVyLnNldCh7XG4gICAgICAuLi5zZXJpYWxpemVyLmdldCgpLFxuICAgICAgdGVuYW50OiBuZXh0U3RhdGVcbiAgICB9KTtcbiAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc2VyaWFsaXplci5nZXQoKSwgJycsIG51bGwpO1xuICB9KTtcblxuICBteUlvLm9uKCd0aXRsZScsIHRpdGxlID0+IHtcbiAgICBkb2N1bWVudC50aXRsZSA9IGAke3RpdGxlfSAtICR7aW50ZXJ2aWV3Lm5vdy50b0RhdGVTdHJpbmcoKX1gO1xuICB9KTtcblxuICBpbnRlcnZpZXcuZXhlY3V0ZShzZXJpYWxpemVyLmdldCgpLnRlbmFudCkudGhlbigodGVuYW50KSA9PiB7XG4gICAgY29uc3QgZm9sbG93dXBDb3VudCA9IGludGVydmlldy5nZXRGb2xsb3dVcHModGVuYW50KS5sZW5ndGg7XG4gICAgY29uc3Qgc3RhdHVzID0gZm9sbG93dXBDb3VudCA/XG4gICAgICBgTm8gbW9yZSBxdWVzdGlvbnMgZm9yIG5vdywgYnV0ICR7Zm9sbG93dXBDb3VudH0gZm9sbG93dXAocykgcmVtYWluLmAgOlxuICAgICAgYEludGVydmlldyBjb21wbGV0ZSwgbm8gbW9yZSBmb2xsb3d1cHMgdG8gcHJvY2Vzcy5gO1xuICAgIG15SW8uc2V0U3RhdHVzKHN0YXR1cywgeyBzaG93VGhyb2JiZXI6IGZhbHNlIH0pO1xuICB9KTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gIHJlc3RhcnQoeyBwdXNoU3RhdGU6IGZhbHNlIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9