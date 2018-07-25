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

/***/ "./lib/recordable-io.ts":
/*!******************************!*\
  !*** ./lib/recordable-io.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const interview_io_1 = __webpack_require__(/*! ./interview-io */ "./lib/interview-io.ts");
/**
 * This class can be used to record interview phases that are
 * only partially completed, for playback at a later time. It
 * can be useful to e.g. resume a partly-completed sequence of
 * interview questions that only return a final state
 * change after the full sequence is answered.
 */
class RecordableInterviewIO extends interview_io_1.InterviewIO {
    constructor(delegate, recording = []) {
        super();
        this.delegate = delegate;
        this.recording = recording;
        this.newRecording = recording.slice();
    }
    resetRecording() {
        this.recording.splice(0);
        this.newRecording.splice(0);
        return this.newRecording;
    }
    async playbackOrRecord(type, record) {
        const result = this.recording.shift();
        if (result !== undefined) {
            const [actualType, value] = result;
            if (actualType !== type) {
                throw new Error(`Expected recorded action of type ${type} but got ${actualType}`);
            }
            return Promise.resolve(value);
        }
        else {
            this.emit('begin-recording-action', type);
            const result = await record();
            this.newRecording.push([type, result]);
            return result;
        }
    }
    ask(question) {
        return this.playbackOrRecord('ask', () => this.delegate.ask(question));
    }
    askMany(questions) {
        return this.playbackOrRecord('askMany', () => this.delegate.askMany(questions));
    }
    notify(text) {
        this.playbackOrRecord('notify', () => {
            this.delegate.notify(text);
            return Promise.resolve(null);
        });
    }
    setStatus(text) {
        this.playbackOrRecord('setStatus', () => {
            this.delegate.setStatus(text);
            return Promise.resolve(null);
        });
    }
    createPhotoQuestion(text) {
        return this.delegate.createPhotoQuestion(text);
    }
    createDateQuestion(text) {
        return this.delegate.createDateQuestion(text);
    }
    createMultiChoiceQuestion(text, answers) {
        return this.delegate.createMultiChoiceQuestion(text, answers);
    }
    createYesNoQuestion(text) {
        return this.delegate.createYesNoQuestion(text);
    }
    createNonBlankQuestion(text) {
        return this.delegate.createNonBlankQuestion(text);
    }
}
exports.RecordableInterviewIO = RecordableInterviewIO;


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
        this.input = util_1.makeElement('input', { type: 'date', classes: ['input'] });
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
        const input = util_1.makeElement('input', {
            type: 'text',
            name: question.text,
            classes: ['input'],
        });
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
const tenant_interview_1 = __webpack_require__(/*! ../lib/tenant-interview */ "./lib/tenant-interview.ts");
const serializer_1 = __webpack_require__(/*! ../lib/web/serializer */ "./lib/web/serializer.ts");
const io_1 = __webpack_require__(/*! ../lib/web/io */ "./lib/web/io.ts");
const util_1 = __webpack_require__(/*! ../lib/web/util */ "./lib/web/util.ts");
const modal_1 = __webpack_require__(/*! ../lib/web/modal */ "./lib/web/modal.ts");
const recordable_io_1 = __webpack_require__(/*! ../lib/recordable-io */ "./lib/recordable-io.ts");
const INITIAL_APP_STATE = {
    date: new Date(),
    tenant: {},
    recording: [],
};
let io = null;
function restart(options = { pushState: true }) {
    const resetButton = util_1.getElement('button', '#reset');
    const dateInput = util_1.getElement('input', '#date');
    const mainDiv = util_1.getElement('div', '#main');
    const modalTemplate = util_1.getElement('template', '#modal');
    if (io) {
        io.close();
        io = null;
    }
    const serializer = new serializer_1.LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE);
    const myIo = new io_1.WebInterviewIO(mainDiv, new modal_1.ModalBuilder(modalTemplate));
    io = myIo;
    // We want to bind this reset button as early as possible, so that if the
    // serializer state is broken (e.g. because the schema changed recently),
    // it's always possible to reset.
    resetButton.onclick = () => {
        serializer.set(INITIAL_APP_STATE);
        restart();
    };
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
    const recordableIo = new recordable_io_1.RecordableInterviewIO(io, serializer.get().recording);
    const interview = new tenant_interview_1.TenantInterview({
        io: recordableIo,
        now: new Date(serializer.get().date),
    });
    dateInput.valueAsDate = interview.now;
    dateInput.onchange = (e) => {
        e.preventDefault();
        serializer.set({
            ...serializer.get(),
            recording: [],
            date: dateInput.valueAsDate
        });
        restart();
    };
    recordableIo.on('begin-recording-action', type => {
        if (type === 'ask' || type === 'askMany' && io === myIo) {
            const state = serializer.get();
            const recording = recordableIo.newRecording;
            if (recording.length > state.recording.length) {
                // The interview contains multiple question steps before
                // returning a new state. Remember what the user has
                // answered so far, so that they can still easily
                // navigate between the question steps using their
                // browser's back/forward buttons.
                serializer.set({
                    ...state,
                    recording,
                });
                window.history.pushState(serializer.get(), '', null);
            }
        }
    });
    interview.on('change', (_, nextState) => {
        serializer.set({
            ...serializer.get(),
            recording: recordableIo.resetRecording(),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbGliL2ludGVydmlldy1pby50cyIsIndlYnBhY2s6Ly8vLi9saWIvaW50ZXJ2aWV3LnRzIiwid2VicGFjazovLy8uL2xpYi9xdWVzdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9saWIvcmVjb3JkYWJsZS1pby50cyIsIndlYnBhY2s6Ly8vLi9saWIvdGVuYW50LWludGVydmlldy50cyIsIndlYnBhY2s6Ly8vLi9saWIvdGVuYW50LnRzIiwid2VicGFjazovLy8uL2xpYi91dGlsLnRzIiwid2VicGFjazovLy8uL2xpYi93ZWIvZGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL2lvLnRzIiwid2VicGFjazovLy8uL2xpYi93ZWIvbW9kYWwudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi9tdWx0aS1jaG9pY2UudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi9waG90by50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL3NlcmlhbGl6ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi90aHJvYmJlci50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi95ZXMtbm8udHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vd2ViL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFF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QUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxvQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FB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QUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDdkIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLEtBQUssTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUN6RCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUM1RCxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsQ0FBQztZQUM1QixrQ0FBa0MsYUFBYSxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3ZFLG1EQUFtRCxDQUFDO1FBQ3RELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDbkMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi93ZWIvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQge1xuICBRdWVzdGlvbixcbiAgRGF0ZVF1ZXN0aW9uLFxuICBNdWx0aUNob2ljZUFuc3dlcixcbiAgTXVsdGlDaG9pY2VRdWVzdGlvbixcbiAgWWVzTm9RdWVzdGlvbixcbiAgTm9uQmxhbmtRdWVzdGlvblxufSBmcm9tICcuL3F1ZXN0aW9uJztcblxuaW1wb3J0IHsgUGhvdG8gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBUaGlzIGlzIGEgbWFwcGVkIHR5cGUgWzFdIGNvbnNpc3Rpbmcgb2YgcHJvcGVydGllcyB0aGF0IGNvbnNpc3RcbiAqIG9mIHF1ZXN0aW9ucyB3aG9zZSBhbnN3ZXJzIG1hcCB0byB0aGUgb3JpZ2luYWwgcHJvcGVydHkgdHlwZXMuXG4gKiBcbiAqIFsxXSBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlc1xuICovXG5leHBvcnQgdHlwZSBRdWVzdGlvbnNGb3I8VD4gPSB7XG4gIFtQIGluIGtleW9mIFRdOiBRdWVzdGlvbjxUW1BdPjtcbn07XG5cbi8qKiBcbiAqIFRoaXMgaXMgYW55IGlucHV0L291dHB1dCBtZWNoYW5pc20gYnkgd2hpY2ggdGhlIGludGVydmlldyBjb21tdW5pY2F0ZXMgd2l0aFxuICogdGhlIHVzZXIuXG4gKlxuICogVGhpcyBpbnRlcmZhY2UgaGFzIGJlZW4gZGVzaWduZWQgdG8gY29uZHVjdCBpbnRlcnZpZXdzIHVzaW5nIG11bHRpcGxlXG4gKiBjb21tdW5pY2F0aW9uIG1lZGlhICh2b2ljZSwgU01TLCB3ZWIsIGV0YykuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbnRlcnZpZXdJTyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKiBcbiAgICogQXNrIGEgcXVlc3Rpb24gb2YgdGhlIHVzZXIuIElmIHRoZSB1c2VyIHByb3ZpZGVzIGludmFsaWQgaW5wdXQsIGtlZXAgYXNraW5nLlxuICAgKiBAcGFyYW0gcXVlc3Rpb24gVGhlIHF1ZXN0aW9uIHRvIGFzay5cbiAgICovXG4gIGFic3RyYWN0IGFzazxUPihxdWVzdGlvbjogUXVlc3Rpb248VD4pOiBQcm9taXNlPFQ+O1xuXG4gIC8qKlxuICAgKiBBc2sgYSBudW1iZXIgb2YgcXVlc3Rpb25zIG9mIHRoZSB1c2VyLiBTb21lIHVzZXIgaW50ZXJmYWNlcyxcbiAgICogc3VjaCBhcyBzY3JlZW5zLCBtYXkgcHJlc2VudCB0aGUgcXVlc3Rpb25zIGFzIGEgc2luZ2xlIGZvcm0uXG4gICAqIFxuICAgKiBAcGFyYW0gcXVlc3Rpb25zIEEgbWFwcGluZyBmcm9tIHN0cmluZyBrZXlzIHRvIHF1ZXN0aW9ucy4gVGhlXG4gICAqICAgcmV0dXJuIHZhbHVlIHdpbGwgY29udGFpbiB0aGUgYW5zd2VycywgbWFwcGVkIHVzaW5nIHRoZSBzYW1lIGtleXMuXG4gICAqL1xuICBhYnN0cmFjdCBhc2tNYW55PFQ+KHF1ZXN0aW9uczogUXVlc3Rpb25zRm9yPFQ+KTogUHJvbWlzZTxUPjtcblxuICAvKipcbiAgICogTm90aWZ5IHRoZSB1c2VyIHdpdGggaW1wb3J0YW50IGluZm9ybWF0aW9uLlxuICAgKi9cbiAgYWJzdHJhY3Qgbm90aWZ5KHRleHQ6IHN0cmluZyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCBzdGF0dXMsIHNvIHRoZSB1c2VyIGtub3dzIHdoYXQgaXMgZ29pbmcgb25cbiAgICogaWYgdGhlcmUgYXJlIGFueSBkZWxheXMuXG4gICAqL1xuICBhYnN0cmFjdCBzZXRTdGF0dXModGV4dDogc3RyaW5nKTogdm9pZDtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgcXVlc3Rpb24gdGhhdCBhc2tzIGZvciBhIHBob3RvLlxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlUGhvdG9RdWVzdGlvbih0ZXh0OiBzdHJpbmcpOiBRdWVzdGlvbjxQaG90bz47XG5cbiAgY3JlYXRlRGF0ZVF1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPERhdGU+IHtcbiAgICByZXR1cm4gbmV3IERhdGVRdWVzdGlvbih0ZXh0KTtcbiAgfVxuXG4gIGNyZWF0ZU11bHRpQ2hvaWNlUXVlc3Rpb248VD4odGV4dDogc3RyaW5nLCBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdKTogUXVlc3Rpb248VD4ge1xuICAgIHJldHVybiBuZXcgTXVsdGlDaG9pY2VRdWVzdGlvbih0ZXh0LCBhbnN3ZXJzKTtcbiAgfVxuXG4gIGNyZWF0ZVllc05vUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248Ym9vbGVhbj4ge1xuICAgIHJldHVybiBuZXcgWWVzTm9RdWVzdGlvbih0ZXh0KTtcbiAgfVxuXG4gIGNyZWF0ZU5vbkJsYW5rUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBOb25CbGFua1F1ZXN0aW9uKHRleHQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgeyBEYXRlU3RyaW5nIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEludGVydmlld0lPIH0gZnJvbSAnLi9pbnRlcnZpZXctaW8nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEludGVydmlld09wdGlvbnM8Uz4ge1xuICAvKiogVGhlIGlucHV0L291dHB1dCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIHVzZXIuICovXG4gIGlvOiBJbnRlcnZpZXdJTztcblxuICAvKiogVGhlIGN1cnJlbnQgZGF0ZS4gKi9cbiAgbm93PzogRGF0ZTtcbn1cblxuLyoqXG4gKiBBIHNjaGVkdWxlZCBmb2xsb3ctdXAgcG9ydGlvbiBvZiBhbiBpbnRlcnZpZXcsIHBhcmFtZXRlcml6ZWQgYnlcbiAqIHRoZSBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3LiBGb3IgZXhhbXBsZSwgaWYgdGhlXG4gKiBpbnRlcnZpZXcgYXNrcyB0aGUgdXNlciB0byBkbyBzb21ldGhpbmcgaW4gdGhlIG5leHQgd2VlaywgaXRcbiAqIG1pZ2h0IHNjaGVkdWxlIGEgZm9sbG93LXVwIGZvciBhIHdlZWsgbGF0ZXIgdG8gYXNrIHRoZSB1c2VyXG4gKiBpZiB0aGV5J3ZlIGRvbmUgaXQgeWV0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZvbGxvd1VwPFM+IHtcbiAgLyoqIFRoZSBzY2hlZHVsZWQgZGF0ZSBvZiB0aGUgZm9sbG93LXVwLiAqL1xuICBkYXRlOiBEYXRlU3RyaW5nO1xuXG4gIC8qKiBcbiAgICogVGhlIG5hbWUgb2YgdGhlIGZvbGxvdy11cC4gQXQgdGhlIHRpbWUgb2YgdGhpcyB3cml0aW5nLCB0aGlzIGlzbid0XG4gICAqIGFjdHVhbGx5IHVzZWQgYW55d2hlcmUsIGJ1dCBldmVudHVhbGx5IGl0IG1pZ2h0IGJlLlxuICAgKi9cbiAgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHRoZSBmb2xsb3ctdXAgYWN0aW9uLiBUaGlzIHNob3VsZCBhbHJlYWR5IGJlIGJvdW5kIHRvIGFcbiAgICogc3BlY2lmaWMgaW50ZXJ2aWV3IHN0YXRlIGJ5IHRoZSBjb2RlIHRoYXQgY3JlYXRlZCB0aGUgZm9sbG93LXVwLlxuICAgKi9cbiAgZXhlY3V0ZTogKCkgPT4gUHJvbWlzZTxTPjtcbn1cblxuLyoqXG4gKiBUaGlzIHJlcHJlc2VudHMgYSBzZXJpZXMgb2YgcXVlc3Rpb25zIGZvciBhIHVzZXIsIHBhcmFtZXRlcml6ZWQgYnlcbiAqIGEgdHlwZSB0aGF0IHJlcHJlc2VudHMgdGhlIHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcgKGUuZy4sIHRoZSBhbnN3ZXJzXG4gKiB0byB0aGUgcXVlc3Rpb25zIHRoZSB1c2VyIGhhcyBiZWVuIGFza2VkKS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEludGVydmlldzxTPiBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIHJlYWRvbmx5IG5vdzogRGF0ZTtcbiAgcmVhZG9ubHkgaW86IEludGVydmlld0lPO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEludGVydmlld09wdGlvbnM8Uz4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubm93ID0gb3B0aW9ucy5ub3cgfHwgbmV3IERhdGUoKTtcbiAgICB0aGlzLmlvID0gb3B0aW9ucy5pbztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBjb3JlIGFic3RyYWN0IG1ldGhvZCB0aGF0IHN1YmNsYXNzZXMgbXVzdCBpbXBsZW1lbnQuXG4gICAqIEdpdmVuIGEgY3VycmVudCBzdGF0ZSwgaXQgbXVzdCBhc2sgYW55IHJlcXVpcmVkIHF1ZXN0aW9ucyBhbmRcbiAgICogcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIG5ldyBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3LlxuICAgKiBcbiAgICogTm90ZSB0aGF0IHRoZSBzdGF0ZSBpcyBpbW11dGFibGUsIHNvIHRoZSBtZXRob2Qgc2hvdWxkIGFsd2F5c1xuICAgKiBjcmVhdGUgYSBuZXcgc3RhdGUgb2JqZWN0LS11bmxlc3MgdGhlIGludGVydmlldyBpcyBvdmVyLCBpblxuICAgKiB3aGljaCBjYXNlIGl0IHNob3VsZCBqdXN0IHJldHVybiB0aGUgdW5jaGFuZ2VkIHN0YXRlIGl0IHdhc1xuICAgKiBwYXNzZWQgaW4uXG4gICAqIFxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGludGVydmlldy5cbiAgICovXG4gIGFic3RyYWN0IGFzeW5jIGFza05leHQoc3RhdGU6IFMpOiBQcm9taXNlPFM+O1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGFuIG9wdGlvbmFsIG1ldGhvZCB0aGF0IHJ1bnMgdGhlIG5leHQgaXJyZXZlcnNpYmxlIHRhc2sgdGhhdFxuICAgKiB0aGUgaW50ZXJ2aWV3IGlzIGNhcGFibGUgb2YgdW5kZXJ0YWtpbmcgKGUuZy4gc2VuZGluZyBhbiBlbWFpbCBvclxuICAgKiByZWFsLXdvcmxkIGxldHRlciwgZmlsaW5nIGEgY291cnQgY2FzZSwgZXRjKS5cbiAgICpcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcuXG4gICAqL1xuICBhc3luYyBydW5OZXh0VGFzayhzdGF0ZTogUyk6IFByb21pc2U8Uz4ge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGFuIG9wdGlvbmFsIG1ldGhvZCB0aGF0IHJldHVybnMgYWxsIHRoZSBmb2xsb3ctdXBzXG4gICAqIGZvciB0aGUgaW50ZXJ2aWV3LCBnaXZlbiBpdHMgY3VycmVudCBzdGF0ZS5cbiAgICogXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3LlxuICAgKi9cbiAgZ2V0Rm9sbG93VXBzKHN0YXRlOiBTKTogRm9sbG93VXA8Uz5bXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgdGhlIG5leHQgdmFsaWQgZm9sbG93LXVwLCBpZiBhbnkuIElmIG5vIHZhbGlkXG4gICAqIGZvbGxvdy11cHMgYXJlIGF2YWlsYWJsZSwgdGhlIG9yaWdpbmFsIHN0YXRlIGlzIHJldHVybmVkLlxuICAgKiBcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGV4ZWN1dGVOZXh0Rm9sbG93VXAoc3RhdGU6IFMpOiBQcm9taXNlPFM+IHtcbiAgICBmb3IgKGxldCBmb2xsb3dVcCBvZiB0aGlzLmdldEZvbGxvd1VwcyhzdGF0ZSkpIHtcbiAgICAgIGlmICh0aGlzLm5vdyA+PSBuZXcgRGF0ZShmb2xsb3dVcC5kYXRlKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgZm9sbG93VXAuZXhlY3V0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogUnVucyB0aGUgaW50ZXJ2aWV3LCBhc2tpbmcgdGhlIHVzZXIgcXVlc3Rpb25zIHVudGlsIHRoZXlcbiAgICogYXJlIGV4aGF1c3RlZC4gUmV0dXJucyB0aGUgZmluYWwgc3RhdGUgb2YgdGhlIGludGVydmlldy5cbiAgICogXG4gICAqIEBwYXJhbSBpbml0aWFsU3RhdGUgXG4gICAqL1xuICBhc3luYyBleGVjdXRlKGluaXRpYWxTdGF0ZTogUyk6IFByb21pc2U8Uz4ge1xuICAgIGxldCBzdGF0ZSA9IGluaXRpYWxTdGF0ZTtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgbmV4dFN0YXRlID0gYXdhaXQgdGhpcy5hc2tOZXh0KHN0YXRlKTtcbiAgICAgIGlmIChuZXh0U3RhdGUgPT09IHN0YXRlKSB7XG4gICAgICAgIG5leHRTdGF0ZSA9IGF3YWl0IHRoaXMuZXhlY3V0ZU5leHRGb2xsb3dVcChzdGF0ZSk7XG4gICAgICB9XG4gICAgICBpZiAobmV4dFN0YXRlID09PSBzdGF0ZSkge1xuICAgICAgICBuZXh0U3RhdGUgPSBhd2FpdCB0aGlzLnJ1bk5leHRUYXNrKHN0YXRlKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0U3RhdGUgPT09IHN0YXRlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCBzdGF0ZSwgbmV4dFN0YXRlKTtcbiAgICAgIHN0YXRlID0gbmV4dFN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEludGVydmlldzxTPiB7XG4gIGVtaXQoZXZlbnQ6ICdjaGFuZ2UnLCBwcmV2U3RhdGU6IFMsIG5leHRTdGF0ZTogUyk6IGJvb2xlYW47XG4gIG9uKGV2ZW50OiAnY2hhbmdlJywgbGlzdGVuZXI6IChwcmV2U3RhdGU6IFMsIG5leHRTdGF0ZTogUykgPT4gdm9pZCk6IHRoaXM7XG59XG4iLCIvKiogXG4gKiBSZXByZXNlbnRzIGEgdmFsaWRhdGlvbiBlcnJvciBmb3IgYSBxdWVzdGlvbiwgZS5nLiB3aGVuIGEgdXNlclxuICogcHJvdmlkZXMgYW4gaW52YWxpZCByZXNwb25zZS5cbiAqIFxuICogTm90ZSB0aGF0IHRoaXMgZG9lc24ndCBleHRlbmQgdGhlIHN0YW5kYXJkIEVycm9yIGNsYXNzLFxuICogYmVjYXVzZSBpdCdzIG5vdCBhY3R1YWxseSBkZXNpZ25lZCB0byBiZSB0aHJvd246IHRoZSByYXRpb25hbGVcbiAqIGlzIHRoYXQgdmFsaWRhdGlvbiBlcnJvcnMgYXJlIGEgbm9ybWFsIG9jY3VycmVuY2UgYW5kIG91clxuICogY29kZSBzaG91bGQgY2hlY2sgZm9yIHRoZW0gYWxsIHRoZSB0aW1lLCByYXRoZXIgdGhhbiB0aHJvd2luZ1xuICogdGhlbSBhbmQgcG90ZW50aWFsbHkgaGF2aW5nIHRoZW0gZ28gdW5jYXVnaHQuXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uRXJyb3Ige1xuICAvKipcbiAgICogVGhlIGh1bWFuLXJlYWRhYmxlIHRleHQgZXhwbGFpbmluZyB0aGUgZXJyb3IuIEl0IHdpbGxcbiAgICogYmUgc2hvd24gdG8gdGhlIHVzZXIuXG4gICAqL1xuICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBxdWVzdGlvbiBpbiBhbiBpbnRlcnZpZXcsIHBhcm1ldGVyaXplZCBieVxuICogdGhlIHR5cGUgb2YgZGF0YSB0aGF0IGEgdmFsaWQgYW5zd2VyIHJlcHJlc2VudHMuXG4gKiBcbiAqIEZvciBleGFtcGxlLCBhIHF1ZXN0aW9uIGxpa2UgXCJIb3cgb2xkIGFyZSB5b3U/XCIgbWlnaHRcbiAqIGJlIGEgUXVlc3Rpb248bnVtYmVyPiwgd2hpbGUgXCJEbyB5b3UgbGlrZSBzYWxhZD9cIiBtaWdodFxuICogYmUgYSBRdWVzdGlvbjxib29sZWFuPi5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFF1ZXN0aW9uPFQ+IHtcbiAgLyoqIFRoZSB0ZXh0IG9mIHRoZSBxdWVzdGlvbiwgZS5nLiBcIkhvdyBhcmUgeW91P1wiLiAqL1xuICBhYnN0cmFjdCBnZXQgdGV4dCgpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb2Nlc3MgYSByZXNwb25zZSBlbnRlcmVkIGJ5IHRoZSB1c2VyIGFuZCByZXR1cm4gZWl0aGVyXG4gICAqIHRoZSBkYXRhIGl0IHJlcHJlc2VudHMsIG9yIGFuIGVycm9yIGV4cGxhaW5pbmcgd2h5IHRoZVxuICAgKiByZXNwb25zZSBpcyBpbnZhbGlkLlxuICAgKiBcbiAgICogQHBhcmFtIHJlc3BvbnNlIEEgcmF3IHJlc3BvbnNlIGVudGVyZWQgYnkgdGhlIHVzZXIuXG4gICAqL1xuICBhYnN0cmFjdCBwcm9jZXNzUmVzcG9uc2UocmVzcG9uc2U6IHN0cmluZyk6IFByb21pc2U8VHxWYWxpZGF0aW9uRXJyb3I+O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB2YWxpZCBhbnN3ZXIgdG8gYSBtdWx0aXBsZS1jaG9pY2UgcXVlc3Rpb24uXG4gKiBUaGUgZmlyc3QgbWVtYmVyIHJlcHJlc2VudHMgdGhlIGFjdHVhbCBkYXRhIHZhbHVlLCB3aGlsZVxuICogdGhlIHNlY29uZCByZXByZXNudHMgdGhlIGh1bWFuLXJlYWRhYmxlIHRleHQgZm9yIGl0LlxuICovXG5leHBvcnQgdHlwZSBNdWx0aUNob2ljZUFuc3dlcjxUPiA9IFtULCBzdHJpbmddO1xuXG4vKipcbiAqIEEgbXVsdGlwbGUtY2hvaWNlIHF1ZXN0aW9uLiBBbnN3ZXJzIGFyZSBhdXRvbWF0aWNhbGx5XG4gKiBudW1iZXJlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIE11bHRpQ2hvaWNlUXVlc3Rpb248VD4gZXh0ZW5kcyBRdWVzdGlvbjxUPiB7XG4gIC8qKiBUaGUgcXVlc3Rpb24sIGUuZy4gXCJXaGF0IGtpbmQgb2YgbGVhc2UgZG8geW91IGhhdmU/XCIuICovXG4gIHF1ZXN0aW9uOiBzdHJpbmc7XG5cbiAgLyoqIFBvdGVudGlhbCBhbnN3ZXJzIHRvIHRoZSBxdWVzdGlvbiwgd2hpY2ggdGhlIHVzZXIgbXVzdCBjaG9vc2UgZnJvbS4gKi9cbiAgYW5zd2VyczogTXVsdGlDaG9pY2VBbnN3ZXI8VD5bXTtcblxuICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogc3RyaW5nLCBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb247XG4gICAgdGhpcy5hbnN3ZXJzID0gYW5zd2VycztcbiAgfVxuXG4gIGdldCB0ZXh0KCk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFydHMgPSBbdGhpcy5xdWVzdGlvbiwgJyddO1xuXG4gICAgdGhpcy5hbnN3ZXJzLmZvckVhY2goKFtfLCBsYWJlbF0sIGkpID0+IHtcbiAgICAgIHBhcnRzLnB1c2goYCR7aSArIDF9IC0gJHtsYWJlbH1gKTtcbiAgICB9KTtcblxuICAgIHBhcnRzLnB1c2goJycsICdFbnRlciBhIG51bWJlciBmcm9tIHRoZSBsaXN0IGFib3ZlOicpO1xuXG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPFR8VmFsaWRhdGlvbkVycm9yPiB7XG4gICAgY29uc3QgcmVzcG9uc2VJbnQgPSBwYXJzZUludChyZXNwb25zZSwgMTApO1xuICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuYW5zd2Vyc1tyZXNwb25zZUludCAtIDFdO1xuXG4gICAgaWYgKGFuc3dlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignUGxlYXNlIGNob29zZSBhIHZhbGlkIG51bWJlci4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYW5zd2VyWzBdO1xuICB9XG59XG5cbi8qKlxuICogQSBiYXNpYyBxdWVzdGlvbiB0aGF0IGFjY2VwdHMgYW55IGtpbmQgb2Ygbm9uLWJsYW5rIGlucHV0LlxuICovXG5leHBvcnQgY2xhc3MgTm9uQmxhbmtRdWVzdGlvbiBleHRlbmRzIFF1ZXN0aW9uPHN0cmluZz4ge1xuICAvKiogVGhlIHRleHQgb2YgdGhlIHF1ZXN0aW9uLCBlLmcuIFwiV2hhdCBpcyB5b3VyIG5hbWU/XCIuICovXG4gIHRleHQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzUmVzcG9uc2UocmVzcG9uc2U6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nfFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIGlmICghcmVzcG9uc2UudHJpbSgpKSB7XG4gICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignWW91ciByZXNwb25zZSBjYW5ub3QgYmUgYmxhbmshJyk7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxufVxuXG4vKipcbiAqIEEgcXVlc3Rpb24gd2hvc2UgYW5zd2VyIG11c3QgYWx3YXlzIGJlIFwieWVzXCIgb3IgXCJub1wiLlxuICovXG5leHBvcnQgY2xhc3MgWWVzTm9RdWVzdGlvbiBleHRlbmRzIFF1ZXN0aW9uPGJvb2xlYW4+IHtcbiAgLyoqIFRoZSB0ZXh0IG9mIHRoZSBxdWVzdGlvbiwgZS5nLiBcIkFyZSB5b3Ugb2s/XCIuICovXG4gIHRleHQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzUmVzcG9uc2UocmVzcG9uc2U6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbnxWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICBjb25zdCBZRVNfUkVHRVggPSAvXlxccyp5L2k7XG4gICAgY29uc3QgTk9fUkVHRVggPSAvXlxccypuL2k7XG5cbiAgICBpZiAoWUVTX1JFR0VYLnRlc3QocmVzcG9uc2UpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKE5PX1JFR0VYLnRlc3QocmVzcG9uc2UpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvbkVycm9yKCdQbGVhc2UgYW5zd2VyIHdpdGggXCJ5ZXNcIiBvciBcIm5vXCIuJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHF1ZXN0aW9uIHRoYXQgYXNrcyBmb3IgYSBkYXRlIChub3QgaW5jbHVkaW5nIHRoZSB0aW1lKS5cbiAqL1xuZXhwb3J0IGNsYXNzIERhdGVRdWVzdGlvbiBleHRlbmRzIFF1ZXN0aW9uPERhdGU+IHtcbiAgLyoqIFRoZSB0ZXh0IG9mIHRoZSBxdWVzdGlvbiwgZS5nLiBcIldoZW4gZGlkIHlvdSByZWNlaXZlIHRoZSBsZXR0ZXI/XCIuICovXG4gIHRleHQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzUmVzcG9uc2UocmVzcG9uc2U6IHN0cmluZyk6IFByb21pc2U8RGF0ZXxWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICBjb25zdCBEQVRFX1JFR0VYID0gL15cXGRcXGRcXGRcXGQtXFxkXFxkLVxcZFxcZCQvO1xuICAgIGlmIChEQVRFX1JFR0VYLnRlc3QocmVzcG9uc2UpKSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocmVzcG9uc2UpO1xuICAgICAgaWYgKCFpc05hTihkYXRlLmdldFRpbWUoKSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvbkVycm9yKCdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXQuJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEludGVydmlld0lPLCBRdWVzdGlvbnNGb3IgfSBmcm9tIFwiLi9pbnRlcnZpZXctaW9cIjtcbmltcG9ydCB7IFF1ZXN0aW9uLCBNdWx0aUNob2ljZUFuc3dlciB9IGZyb20gXCIuL3F1ZXN0aW9uXCI7XG5pbXBvcnQgeyBQaG90byB9IGZyb20gXCIuL3V0aWxcIjtcblxuZXhwb3J0IHR5cGUgSW9BY3Rpb25UeXBlID0gJ2Fzayd8J2Fza01hbnknfCdub3RpZnknfCdzZXRTdGF0dXMnO1xuXG5leHBvcnQgdHlwZSBSZWNvcmRlZEFjdGlvbiA9IFtJb0FjdGlvblR5cGUsIGFueV07XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjYW4gYmUgdXNlZCB0byByZWNvcmQgaW50ZXJ2aWV3IHBoYXNlcyB0aGF0IGFyZVxuICogb25seSBwYXJ0aWFsbHkgY29tcGxldGVkLCBmb3IgcGxheWJhY2sgYXQgYSBsYXRlciB0aW1lLiBJdFxuICogY2FuIGJlIHVzZWZ1bCB0byBlLmcuIHJlc3VtZSBhIHBhcnRseS1jb21wbGV0ZWQgc2VxdWVuY2Ugb2ZcbiAqIGludGVydmlldyBxdWVzdGlvbnMgdGhhdCBvbmx5IHJldHVybiBhIGZpbmFsIHN0YXRlXG4gKiBjaGFuZ2UgYWZ0ZXIgdGhlIGZ1bGwgc2VxdWVuY2UgaXMgYW5zd2VyZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNvcmRhYmxlSW50ZXJ2aWV3SU8gZXh0ZW5kcyBJbnRlcnZpZXdJTyB7XG4gIHJlYWRvbmx5IG5ld1JlY29yZGluZzogUmVjb3JkZWRBY3Rpb25bXTtcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSBkZWxlZ2F0ZTogSW50ZXJ2aWV3SU8sIHByaXZhdGUgcmVhZG9ubHkgcmVjb3JkaW5nOiBSZWNvcmRlZEFjdGlvbltdID0gW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubmV3UmVjb3JkaW5nID0gcmVjb3JkaW5nLnNsaWNlKCk7XG4gIH1cblxuICByZXNldFJlY29yZGluZygpOiBSZWNvcmRlZEFjdGlvbltdIHtcbiAgICB0aGlzLnJlY29yZGluZy5zcGxpY2UoMCk7XG4gICAgdGhpcy5uZXdSZWNvcmRpbmcuc3BsaWNlKDApO1xuICAgIHJldHVybiB0aGlzLm5ld1JlY29yZGluZztcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcGxheWJhY2tPclJlY29yZDxUPih0eXBlOiBJb0FjdGlvblR5cGUsIHJlY29yZDogKCkgPT4gUHJvbWlzZTxUPik6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucmVjb3JkaW5nLnNoaWZ0KCk7XG4gICAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBbYWN0dWFsVHlwZSwgdmFsdWVdID0gcmVzdWx0O1xuICAgICAgaWYgKGFjdHVhbFR5cGUgIT09IHR5cGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCByZWNvcmRlZCBhY3Rpb24gb2YgdHlwZSAke3R5cGV9IGJ1dCBnb3QgJHthY3R1YWxUeXBlfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdCgnYmVnaW4tcmVjb3JkaW5nLWFjdGlvbicsIHR5cGUpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVjb3JkKCk7XG4gICAgICB0aGlzLm5ld1JlY29yZGluZy5wdXNoKFt0eXBlLCByZXN1bHRdKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgYXNrPFQ+KHF1ZXN0aW9uOiBRdWVzdGlvbjxUPik6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiB0aGlzLnBsYXliYWNrT3JSZWNvcmQoJ2FzaycsICgpID0+IHRoaXMuZGVsZWdhdGUuYXNrKHF1ZXN0aW9uKSk7XG4gIH1cblxuICBhc2tNYW55PFQ+KHF1ZXN0aW9uczogUXVlc3Rpb25zRm9yPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMucGxheWJhY2tPclJlY29yZCgnYXNrTWFueScsICgpID0+IHRoaXMuZGVsZWdhdGUuYXNrTWFueShxdWVzdGlvbnMpKTtcbiAgfVxuXG4gIG5vdGlmeSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnBsYXliYWNrT3JSZWNvcmQoJ25vdGlmeScsICgpID0+IHtcbiAgICAgIHRoaXMuZGVsZWdhdGUubm90aWZ5KHRleHQpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFN0YXR1cyh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnBsYXliYWNrT3JSZWNvcmQoJ3NldFN0YXR1cycsICgpID0+IHtcbiAgICAgIHRoaXMuZGVsZWdhdGUuc2V0U3RhdHVzKHRleHQpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZVBob3RvUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248UGhvdG8+IHtcbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5jcmVhdGVQaG90b1F1ZXN0aW9uKHRleHQpO1xuICB9XG5cbiAgY3JlYXRlRGF0ZVF1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPERhdGU+IHtcbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5jcmVhdGVEYXRlUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVNdWx0aUNob2ljZVF1ZXN0aW9uPFQ+KHRleHQ6IHN0cmluZywgYW5zd2VyczogTXVsdGlDaG9pY2VBbnN3ZXI8VD5bXSk6IFF1ZXN0aW9uPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5kZWxlZ2F0ZS5jcmVhdGVNdWx0aUNob2ljZVF1ZXN0aW9uKHRleHQsIGFuc3dlcnMpO1xuICB9XG5cbiAgY3JlYXRlWWVzTm9RdWVzdGlvbih0ZXh0OiBzdHJpbmcpOiBRdWVzdGlvbjxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuY3JlYXRlWWVzTm9RdWVzdGlvbih0ZXh0KTtcbiAgfVxuXG4gIGNyZWF0ZU5vbkJsYW5rUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuY3JlYXRlTm9uQmxhbmtRdWVzdGlvbih0ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZGFibGVJbnRlcnZpZXdJTyB7XG4gIG9uKGV2ZW50OiAnYmVnaW4tcmVjb3JkaW5nLWFjdGlvbicsIGxpc3RlbmVyOiAodHlwZTogSW9BY3Rpb25UeXBlKSA9PiB2b2lkKTogdGhpcztcbiAgZW1pdChldmVudDogJ2JlZ2luLXJlY29yZGluZy1hY3Rpb24nLCB0eXBlOiBJb0FjdGlvblR5cGUpOiBib29sZWFuO1xufVxuIiwiaW1wb3J0IHtcbiAgVGVuYW50LFxuICBMZWFzZVR5cGUsXG4gIFJlcXVlc3RlZFJlbnRhbEhpc3RvcnksXG4gIFJlbnRhbEhpc3Rvcnlcbn0gZnJvbSAnLi90ZW5hbnQnO1xuXG5pbXBvcnQgeyBJbnRlcnZpZXcsIEZvbGxvd1VwIH0gZnJvbSAnLi9pbnRlcnZpZXcnO1xuXG5pbXBvcnQgeyBhZGREYXlzIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnLi93ZWIvdXRpbCc7XG5cbmNvbnN0IFJFTlRBTF9ISVNUT1JZX0ZPTExPV1VQX0RBWVMgPSA3O1xuXG5leHBvcnQgY2xhc3MgVGVuYW50SW50ZXJ2aWV3IGV4dGVuZHMgSW50ZXJ2aWV3PFRlbmFudD4ge1xuICBhc3luYyBhc2tGb3JMZWFzZVR5cGUodGVuYW50OiBUZW5hbnQpOiBQcm9taXNlPFRlbmFudD4ge1xuICAgIGNvbnN0IGxlYXNlVHlwZSA9IGF3YWl0IHRoaXMuaW8uYXNrKHRoaXMuaW8uY3JlYXRlTXVsdGlDaG9pY2VRdWVzdGlvbihcbiAgICAgICdXaGF0IGtpbmQgb2YgbGVhc2UgZG8geW91IGhhdmU/JyxcbiAgICAgIFtcbiAgICAgICAgW0xlYXNlVHlwZS5NYXJrZXRSYXRlLCAnTWFya2V0IHJhdGUnXSxcbiAgICAgICAgW0xlYXNlVHlwZS5SZW50U3RhYmlsaXplZCwgJ1JlbnQgc3RhYmlsaXplZCddLFxuICAgICAgICBbTGVhc2VUeXBlLk5ZQ0hBLCAnUHVibGljIGhvdXNpbmcgKE5ZQ0hBKSddLFxuICAgICAgICBbTGVhc2VUeXBlLk90aGVyLCAnT3RoZXIgKGUuZy4gbW9udGgtdG8tbW9udGgpJ10sXG4gICAgICAgIFtMZWFzZVR5cGUuVW5rbm93biwgJ05vdCBzdXJlJ10sXG4gICAgICBdXG4gICAgKSk7XG5cbiAgICByZXR1cm4gey4uLnRlbmFudCwgbGVhc2VUeXBlfTtcbiAgfVxuXG4gIGFzeW5jIGFza0ZvckhvdXNpbmdJc3N1ZXModGVuYW50OiBUZW5hbnQpOiBQcm9taXNlPFRlbmFudD4ge1xuICAgIGNvbnN0IGhvdXNpbmdJc3N1ZXMgPSBhd2FpdCB0aGlzLmlvLmFza01hbnkoe1xuICAgICAgbmVlZHNSZXBhaXJzOiB0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0RvZXMgeW91ciBhcGFydG1lbnQgbmVlZCByZXBhaXJzPycpLFxuICAgICAgaXNIYXJhc3NlZDogdGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdBcmUgeW91IGJlaW5nIGhhcmFzc2VkIGJ5IHlvdXIgbGFuZGxvcmQ/JyksXG4gICAgICBpc0ZhY2luZ0V2aWN0aW9uOiB0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0FyZSB5b3UgZmFjaW5nIGV2aWN0aW9uPycpLFxuICAgICAgaGFzTGVhc2VJc3N1ZXM6IHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignQXJlIHlvdSBoYXZpbmcgaXNzdWVzIHdpdGggeW91ciBsZWFzZT8nKSxcbiAgICAgIGhhc05vU2VydmljZXM6IHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignQXJlIHlvdSBsaXZpbmcgd2l0aG91dCBlc3NlbnRpYWwgc2VydmljZXMsIGxpa2UgaGVhdC9nYXMvaG90IHdhdGVyPycpLFxuICAgICAgaGFzT3RoZXI6IHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignRG8geW91IGhhdmUgYW55IG90aGVyIGFwYXJ0bWVudCBpc3N1ZXM/JyksXG4gICAgfSk7XG5cbiAgICBpZiAoaG91c2luZ0lzc3Vlcy5pc0ZhY2luZ0V2aWN0aW9uKSB7XG4gICAgICB0aGlzLmlvLm5vdGlmeShcbiAgICAgICAgXCJTaW5jZSB5b3XigJlyZSBpbiBhbiBldmljdGlvbiwgaXTigJlzIGltcG9ydGFudCB0byB0cnkgdG8gZ2V0IGxlZ2FsIGhlbHAgcmlnaHQgYXdheS4gXCIgK1xuICAgICAgICBcIldl4oCZbGwgcG9pbnQgeW91IHRvIGEgcmVzb3VyY2UgdGhhdCBjYW4gaGVscCB5b3UgZmluZCBhIGxhd3llciBpbiBqdXN0IGEgZmV3IG1vbWVudHMuXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsuLi50ZW5hbnQsIGhvdXNpbmdJc3N1ZXN9O1xuICB9XG5cbiAgYXN5bmMgYXNrRm9yUmVudGFsSGlzdG9yeSh0ZW5hbnQ6IFRlbmFudCk6IFByb21pc2U8VGVuYW50PiB7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IHBlcm1pc3Npb24gPSBhd2FpdCB0aGlzLmlvLmFzayh0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0NhbiB3ZSByZXF1ZXN0IHlvdXIgcmVudGFsIGhpc3RvcnkgZnJvbSB5b3VyIGxhbmRsb3JkPycpKTtcbiAgICAgIGlmIChwZXJtaXNzaW9uKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnRlbmFudCwgcmVudGFsSGlzdG9yeTogeyBzdGF0dXM6ICdhY2NlcHRlZCcgfSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pby5ub3RpZnkoXCJVbSwgd2UgcmVhbGx5IG5lZWQgdG8gcmVxdWVzdCB5b3VyIHJlbnRhbCBoaXN0b3J5IHRvIHByb2NlZWQuXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZvbGxvd3VwUmVudGFsSGlzdG9yeShyZW50YWxIaXN0b3J5OiBSZXF1ZXN0ZWRSZW50YWxIaXN0b3J5KTogUHJvbWlzZTxSZW50YWxIaXN0b3J5PiB7XG4gICAgY29uc3Qgd2FzUmVjZWl2ZWQgPSBhd2FpdCB0aGlzLmlvLmFzayh0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0hhdmUgeW91IHJlY2VpdmVkIHlvdXIgcmVudGFsIGhpc3RvcnkgeWV0PycpKTtcblxuICAgIGlmICh3YXNSZWNlaXZlZCkge1xuICAgICAgY29uc3QgZGV0YWlscyA9IGF3YWl0IHRoaXMuaW8uYXNrTWFueSh7XG4gICAgICAgIGRhdGVSZWNlaXZlZDogdGhpcy5pby5jcmVhdGVEYXRlUXVlc3Rpb24oJ1doZW4gZGlkIHlvdSByZWNlaXZlIHlvdXIgcmVudGFsIGhpc3Rvcnk/JyksXG4gICAgICAgIGlzUmVudFN0YWJpbGl6ZWQ6IHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignQXJlIHlvdSByZW50IHN0YWJpbGl6ZWQ/JyksXG4gICAgICAgIHBob3RvOiB0aGlzLmlvLmNyZWF0ZVBob3RvUXVlc3Rpb24oJ1BsZWFzZSBzdWJtaXQgYSBwaG90b2dyYXBoIG9mIHlvdXIgcmVudGFsIGhpc3RvcnkuJylcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzOiAncmVjZWl2ZWQnLFxuICAgICAgICBkYXRlUmVxdWVzdGVkOiByZW50YWxIaXN0b3J5LmRhdGVSZXF1ZXN0ZWQsXG4gICAgICAgIC4uLmRldGFpbHNcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW8ubm90aWZ5KGBBbGFzLCB3ZSB3aWxsIGFzayBhZ2FpbiBpbiAke1JFTlRBTF9ISVNUT1JZX0ZPTExPV1VQX0RBWVN9IGRheXMuYCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5yZW50YWxIaXN0b3J5LFxuICAgICAgICBuZXh0UmVtaW5kZXI6IGFkZERheXModGhpcy5ub3csIFJFTlRBTF9ISVNUT1JZX0ZPTExPV1VQX0RBWVMpXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFza05leHQodGVuYW50OiBUZW5hbnQpOiBQcm9taXNlPFRlbmFudD4ge1xuICAgIGlmICghdGVuYW50Lm5hbWUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRlbmFudCxcbiAgICAgICAgbmFtZTogYXdhaXQgdGhpcy5pby5hc2sodGhpcy5pby5jcmVhdGVOb25CbGFua1F1ZXN0aW9uKCdXaGF0IGlzIHlvdXIgbmFtZT8nKSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCF0ZW5hbnQuaG91c2luZ0lzc3Vlcykge1xuICAgICAgcmV0dXJuIHRoaXMuYXNrRm9ySG91c2luZ0lzc3Vlcyh0ZW5hbnQpO1xuICAgIH1cblxuICAgIGlmICghdGVuYW50LmxlYXNlVHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXNrRm9yTGVhc2VUeXBlKHRlbmFudCk7XG4gICAgfVxuXG4gICAgaWYgKCF0ZW5hbnQucGhvbmVOdW1iZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRlbmFudCxcbiAgICAgICAgcGhvbmVOdW1iZXI6IGF3YWl0IHRoaXMuaW8uYXNrKHRoaXMuaW8uY3JlYXRlTm9uQmxhbmtRdWVzdGlvbignV2hhdCBpcyB5b3VyIHBob25lIG51bWJlcj8nKSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCF0ZW5hbnQucmVudGFsSGlzdG9yeSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXNrRm9yUmVudGFsSGlzdG9yeSh0ZW5hbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0ZW5hbnQ7XG4gIH1cblxuICBhc3luYyBydW5OZXh0VGFzayh0ZW5hbnQ6IFRlbmFudCk6IFByb21pc2U8VGVuYW50PiB7XG4gICAgaWYgKHRlbmFudC5yZW50YWxIaXN0b3J5ICYmIHRlbmFudC5yZW50YWxIaXN0b3J5LnN0YXR1cyA9PT0gJ2FjY2VwdGVkJykge1xuICAgICAgLy8gVE9ETzogQWN0dWFsbHkgcmVxdWVzdCByZW50YWwgaGlzdG9yeS5cbiAgICAgIHRoaXMuaW8uc2V0U3RhdHVzKCdSZXF1ZXN0aW5nIHlvdXIgcmVudGFsIGhpc3RvcnkuLi4nKTtcbiAgICAgIGF3YWl0IHNsZWVwKDMwMDApO1xuXG4gICAgICB0aGlzLmlvLm5vdGlmeShcbiAgICAgICAgYFJlbnRhbCBoaXN0b3J5IHJlcXVlc3RlZCEgV2UnbGwgYXNrIGlmIHlvdSd2ZSByZWNlaXZlZCBpdCBpbiBgICtcbiAgICAgICAgYCR7UkVOVEFMX0hJU1RPUllfRk9MTE9XVVBfREFZU30gZGF5cy5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4udGVuYW50LFxuICAgICAgICByZW50YWxIaXN0b3J5OiB7XG4gICAgICAgICAgc3RhdHVzOiAncmVxdWVzdGVkJyxcbiAgICAgICAgICBkYXRlUmVxdWVzdGVkOiB0aGlzLm5vdyxcbiAgICAgICAgICBuZXh0UmVtaW5kZXI6IGFkZERheXModGhpcy5ub3csIFJFTlRBTF9ISVNUT1JZX0ZPTExPV1VQX0RBWVMpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbmFudDtcbiAgfVxuXG4gIGdldEZvbGxvd1Vwcyh0ZW5hbnQ6IFRlbmFudCk6IEZvbGxvd1VwPFRlbmFudD5bXSB7XG4gICAgY29uc3QgZm9sbG93VXBzOiBGb2xsb3dVcDxUZW5hbnQ+W10gPSBbXTtcblxuICAgIGNvbnN0IHJlbnRhbEhpc3RvcnkgPSB0ZW5hbnQucmVudGFsSGlzdG9yeTtcbiAgICBpZiAocmVudGFsSGlzdG9yeSAmJiByZW50YWxIaXN0b3J5LnN0YXR1cyA9PT0gJ3JlcXVlc3RlZCcpIHtcbiAgICAgIGZvbGxvd1Vwcy5wdXNoKHtcbiAgICAgICAgZGF0ZTogcmVudGFsSGlzdG9yeS5uZXh0UmVtaW5kZXIsXG4gICAgICAgIG5hbWU6ICdSZW50YWwgaGlzdG9yeSBmb2xsb3ctdXAnLFxuICAgICAgICBleGVjdXRlOiBhc3luYyAoKSA9PiAoe1xuICAgICAgICAgIC4uLnRlbmFudCxcbiAgICAgICAgICByZW50YWxIaXN0b3J5OiBhd2FpdCB0aGlzLmZvbGxvd3VwUmVudGFsSGlzdG9yeShyZW50YWxIaXN0b3J5KVxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmb2xsb3dVcHM7XG4gIH1cbn1cbiIsImltcG9ydCB7IERhdGVTdHJpbmcsIFBob3RvIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGVudW0gTGVhc2VUeXBlIHtcbiAgLyoqIE1hcmtldCByYXRlIG9yIGZyZWUgbWFya2V0IGxlYXNlLiAqL1xuICBNYXJrZXRSYXRlID0gJ21yJyxcblxuICAvKiogUmVudCBzdGFiaWxpemVkIChvciByZW50IGNvbnRyb2xsZWQpLiAqL1xuICBSZW50U3RhYmlsaXplZCA9ICdycycsXG5cbiAgLyoqIFB1YmxpYyBob3VzaW5nLiAqL1xuICBOWUNIQSA9ICdueWNoYScsXG5cbiAgLyoqIE90aGVyIGhvdXNpbmcgY2FuIGJlIGUuZy4gbW9udGggdG8gbW9udGggd2l0aG91dCBhIGxlYXNlLCBjb29wLCBzaGVsdGVyLCBzdWJsZXQsIE1pdGNoZWxsIExhbWEuICovXG4gIE90aGVyID0gJ290aGVyJyxcblxuICAvKiogVGhlIHRlbmFudCBpcyB1bmNlcnRhaW4gb2YgdGhlaXIgYWN0dWFsIGxlYXNlIHR5cGUuICovXG4gIFVua25vd24gPSAndW5rbm93bicsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSG91c2luZ0lzc3VlcyB7XG4gIC8qKiBXaGV0aGVyIHRoZSB0ZW5hbnQgbmVlZHMgcmVwYWlycyBpbiB0aGVpciBhcGFydG1lbnQuICovXG4gIG5lZWRzUmVwYWlyczogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgdGVuYW50IGlzIGJlaW5nIGhhcmFzc2VkIGJ5IHRoZWlyIGxhbmRsb3JkLiAqL1xuICBpc0hhcmFzc2VkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZW5hbnQgaXMgYmVpbmcgZmFjZWQgd2l0aCBldmljdGlvbi4gKi9cbiAgaXNGYWNpbmdFdmljdGlvbjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgdGVuYW50IGlzIGhhdmluZyBpc3N1ZXMgd2l0aCB0aGVpciBsZWFzZS4gKi9cbiAgaGFzTGVhc2VJc3N1ZXM6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRlbmFudCBpcyBsaXZpbmcgd2l0aG91dCBlc3NlbnRpYWwgc2VydmljZXMgKGhlYXQvZ2FzL2hvdCB3YXRlcikuICovXG4gIGhhc05vU2VydmljZXM6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRlbmFudCBpcyBmYWNpbmcgYW55IG90aGVyIGlzc3Vlcy4gKi9cbiAgaGFzT3RoZXI6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWNjZXB0ZWRSZW50YWxIaXN0b3J5IHtcbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSBpbmRpY2F0aW5nIHRoYXQgdGhlIHVzZXIgaGFzIGdpdmVuIHRoZWlyIHBlcm1pc3Npb24gZm9yIHVzXG4gICAqIHRvIHJlcXVlc3QgdGhlaXIgcmVudGFsIGhpc3RvcnkuXG4gICAqL1xuICBzdGF0dXM6ICdhY2NlcHRlZCc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdGVkUmVudGFsSGlzdG9yeSB7XG4gIHN0YXR1czogJ3JlcXVlc3RlZCc7XG5cbiAgLyoqIFdoZW4gdGhlIHRlbmFudCByZXF1ZXN0ZWQgdGhlaXIgcmVudGFsIGhpc3RvcnkuICovXG4gIGRhdGVSZXF1ZXN0ZWQ6IERhdGVTdHJpbmc7XG5cbiAgLyoqIFRoZSBkYXRlIHdoZW4gd2UnbGwgbmV4dCBhc2sgdGhlIHRlbmFudCBpZiB0aGV5J3ZlIHJlY2VpdmVkIHRoZSBoaXN0b3J5IHlldC4gKi9cbiAgbmV4dFJlbWluZGVyOiBEYXRlU3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlY2VpdmVkUmVudGFsSGlzdG9yeSB7XG4gIHN0YXR1czogJ3JlY2VpdmVkJztcblxuICBkYXRlUmVxdWVzdGVkOiBEYXRlU3RyaW5nO1xuXG4gIC8qKiBXaGVuIHRoZSB0ZW5hbnQgcmVjZWl2ZWQgdGhlaXIgcmVudGFsIGhpc3RvcnkuICovXG4gIGRhdGVSZWNlaXZlZDogRGF0ZVN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgcmVudGFsIGhpc3RvcnkgYXNzZXJ0cyB0aGF0IHRoZSB0ZW5hbnQncyBkd2VsbGluZyBpcyByZW50IHN0YWJpbGl6ZWQuICovXG4gIGlzUmVudFN0YWJpbGl6ZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFRoZSB1c2VyJ3MgcGhvdG9ncmFwaCBvZiB0aGVpciByZW50YWwgaGlzdG9yeS4gKi9cbiAgcGhvdG86IFBob3RvO1xufVxuXG5leHBvcnQgdHlwZSBSZW50YWxIaXN0b3J5ID0gQWNjZXB0ZWRSZW50YWxIaXN0b3J5IHwgUmVxdWVzdGVkUmVudGFsSGlzdG9yeSB8IFJlY2VpdmVkUmVudGFsSGlzdG9yeTtcblxuaW50ZXJmYWNlIF9UZW5hbnQge1xuICAvKiogVGhlIHRlbmFudCdzIGZ1bGwgbmFtZS4gKi9cbiAgbmFtZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgdGVuYW50J3MgcGhvbmUgbnVtYmVyLiAoVE9ETzogaG93IHNob3VsZCB0aGlzIGJlIGZvcm1hdHRlZD8pICovXG4gIHBob25lTnVtYmVyOiBzdHJpbmc7XG5cbiAgbGVhc2VUeXBlOiBMZWFzZVR5cGU7XG4gIGhvdXNpbmdJc3N1ZXM6IEhvdXNpbmdJc3N1ZXM7XG4gIHJlbnRhbEhpc3Rvcnk6IFJlbnRhbEhpc3Rvcnk7XG59XG5cbmV4cG9ydCB0eXBlIFRlbmFudCA9IFJlYWRvbmx5PFBhcnRpYWw8X1RlbmFudD4+O1xuIiwiLyoqXG4gKiBBIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgYSBkYXRlIGluIElTTyBmb3JtYXQsICpvciogYSBuYXRpdmUgRGF0ZSAod2hpY2ggaXMgY29udmVydGVkIHRvXG4gKiBhbiBJU08gc3RyaW5nIHVwb24gSlNPTiBzZXJpYWxpemF0aW9uKS5cbiAqL1xuZXhwb3J0IHR5cGUgRGF0ZVN0cmluZyA9IERhdGV8c3RyaW5nO1xuXG4vKiogQSBwaG90byBpcyBqdXN0IGEgVVJMIHRvIGFuIGltYWdlLiAqL1xuZXhwb3J0IHR5cGUgUGhvdG8gPSBzdHJpbmc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNjc0NTUwLzI0MjIzOThcbmV4cG9ydCBmdW5jdGlvbiBhZGREYXlzKGRhdGU6IERhdGVTdHJpbmcsIGRheXM6IG51bWJlcik6IERhdGUge1xuICBjb25zdCByZXN1bHQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgcmVzdWx0LnNldERhdGUocmVzdWx0LmdldERhdGUoKSArIGRheXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IHsgRGF0ZVF1ZXN0aW9uLCBWYWxpZGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vcXVlc3Rpb25cIjtcbmltcG9ydCB7IFdlYldpZGdldCB9IGZyb20gXCIuL2lvXCI7XG5pbXBvcnQgeyB3cmFwSW5Db250cm9sRGl2LCBtYWtlRWxlbWVudCB9IGZyb20gXCIuL3V0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkRhdGVRdWVzdGlvbiBleHRlbmRzIERhdGVRdWVzdGlvbiBpbXBsZW1lbnRzIFdlYldpZGdldDxEYXRlPiB7XG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKHRleHQpO1xuICAgIHRoaXMuaW5wdXQgPSBtYWtlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6ICdkYXRlJywgY2xhc3NlczogWydpbnB1dCddIH0pXG4gICAgdGhpcy5jb250YWluZXIgPSB3cmFwSW5Db250cm9sRGl2KHRoaXMuaW5wdXQpO1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH1cblxuICBwcm9jZXNzRWxlbWVudCgpIHtcbiAgICBjb25zdCBpc01vZGVybkJyb3dzZXIgPSAndmFsdWVBc0RhdGUnIGluIDxhbnk+dGhpcy5pbnB1dDtcbiAgICBpZiAoaXNNb2Rlcm5Ccm93c2VyKSB7XG4gICAgICBpZiAoIXRoaXMuaW5wdXQudmFsdWVBc0RhdGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgZGF0ZSEnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlucHV0LnZhbHVlQXNEYXRlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzUmVzcG9uc2UodGhpcy5pbnB1dC52YWx1ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEludGVydmlld0lPLCBRdWVzdGlvbnNGb3IgfSBmcm9tICcuLi9pbnRlcnZpZXctaW8nO1xuaW1wb3J0IHsgUXVlc3Rpb24sIFZhbGlkYXRpb25FcnJvciwgTXVsdGlDaG9pY2VBbnN3ZXIgfSBmcm9tICcuLi9xdWVzdGlvbic7XG5pbXBvcnQgeyBQaG90byB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgV2ViUGhvdG9RdWVzdGlvbiB9IGZyb20gJy4vcGhvdG8nO1xuaW1wb3J0IHsgV2ViWWVzTm9RdWVzdGlvbiB9IGZyb20gJy4veWVzLW5vJztcbmltcG9ydCB7IHdyYXBJbkNvbnRyb2xEaXYsIG1ha2VFbGVtZW50IH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IE1vZGFsQnVpbGRlciB9IGZyb20gJy4vbW9kYWwnO1xuaW1wb3J0IHsgV2ViRGF0ZVF1ZXN0aW9uIH0gZnJvbSAnLi9kYXRlJztcbmltcG9ydCB7IFdlYk11bHRpQ2hvaWNlUXVlc3Rpb24gfSBmcm9tICcuL211bHRpLWNob2ljZSc7XG5pbXBvcnQgbWFrZVRocm9iYmVyIGZyb20gJy4vdGhyb2JiZXInO1xuXG4vKipcbiAqIEEgV2ViV2lkZ2V0IGlzIGFuIGFkZGl0aW9uYWwgaW50ZXJmYWNlIHRoYXQgY2FuIGJlIGltcGxlbWVudGVkIG9uXG4gKiBhIFF1ZXN0aW9uIHRvIGluZGljYXRlIHRoYXQgaXQgaGFzIG5hdGl2ZSB3ZWIgc3VwcG9ydCwgYW5kIGRvZXNuJ3RcbiAqIG5lZWQgdG8ganVzdCBiZSBhIHRleHQgaW5wdXQgZmllbGQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2ViV2lkZ2V0PFQ+IHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG5hdGl2ZSBIVE1MIGVsZW1lbnQgZm9yIHRoZSBxdWVzdGlvbi5cbiAgICovXG4gIGdldEVsZW1lbnQ6ICgpID0+IEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcXVlc3Rpb24ncyB3ZWIgaW50ZXJmYWNlXG4gICAqIGFuZCByZXR1cm5zIGl0cyB2YWx1ZSAob3IgYSB2YWxpZGF0aW9uIGVycm9yIGlmIGl0J3MgaW52YWxpZCkuXG4gICAqL1xuICBwcm9jZXNzRWxlbWVudDogKCkgPT4gUHJvbWlzZTxUfFZhbGlkYXRpb25FcnJvcj47XG5cbiAgLyoqXG4gICAqIElmIHRoZSBuYXRpdmUgSFRNTCBlbGVtZW50IGNvbnRhaW5zIGFuIDxpbnB1dD4gdGhhdCBuZWVkcyBhIGxhYmVsLFxuICAgKiB0aGlzIGNhbiBiZSBzZXQgdG8gdGhlIFwiaWRcIiBhdHRyaWJ1dGUgb2YgdGhlIDxpbnB1dD4uIENhbGxpbmcgY29kZVxuICAgKiBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgYSA8bGFiZWw+IHdpdGggYSBcImZvclwiIGF0dHJpYnV0ZSBwb2ludGluZ1xuICAgKiB0byB0aGUgaWQuXG4gICAqL1xuICBsYWJlbEZvcklkPzogc3RyaW5nO1xufVxuXG4vKiogQSBXZWJRdWVzdGlvbiBpcyBqdXN0IGEgUXVlc3Rpb24gdGhhdCBzdXBwb3J0cyB0aGUgV2ViV2lkZ2V0IGludGVyZmFjZS4gKi9cbnR5cGUgV2ViUXVlc3Rpb248VD4gPSBXZWJXaWRnZXQ8VD4gJiBRdWVzdGlvbjxUPjtcblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIFF1ZXN0aW9uIGhhcyBuYXRpdmUgd2ViIHN1cHBvcnQuXG4gKiBcbiAqIEBwYXJhbSBxdWVzdGlvbiBBIFF1ZXN0aW9uIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBpc1dlYlF1ZXN0aW9uPFQ+KHF1ZXN0aW9uOiBRdWVzdGlvbjxUPik6IHF1ZXN0aW9uIGlzIFdlYlF1ZXN0aW9uPFQ+IHtcbiAgcmV0dXJuIHR5cGVvZigoPFdlYlF1ZXN0aW9uPFQ+PnF1ZXN0aW9uKS5nZXRFbGVtZW50KSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqIFxuICogR2l2ZW4gYSBRdWVzdGlvbiwgcmV0dXJuIGEgd2ViLWVuYWJsZWQgdmVyc2lvbiBvZiBpdC4gSWYgdGhlXG4gKiBRdWVzdGlvbiBkb2Vzbid0IGhhdmUgbmF0aXZlIHdlYiBzdXBwb3J0LCB3ZSB3cmFwIGl0IGluIGFcbiAqIHNpbXBsZSB0ZXh0IGlucHV0IGZpZWxkIGFzIGEgZmFsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVdlYldpZGdldDxUPihxdWVzdGlvbjogUXVlc3Rpb248VD4pOiBXZWJXaWRnZXQ8VD4ge1xuICBpZiAoaXNXZWJRdWVzdGlvbihxdWVzdGlvbikpIHtcbiAgICByZXR1cm4gcXVlc3Rpb247XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaW5wdXQgPSBtYWtlRWxlbWVudCgnaW5wdXQnLCB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBuYW1lOiBxdWVzdGlvbi50ZXh0LFxuICAgICAgY2xhc3NlczogWydpbnB1dCddLFxuICAgIH0pO1xuICAgIGNvbnN0IGNvbnRyb2wgPSB3cmFwSW5Db250cm9sRGl2KGlucHV0KTtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0RWxlbWVudDogKCkgPT4gY29udHJvbCxcbiAgICAgIHByb2Nlc3NFbGVtZW50OiAoKSA9PiBxdWVzdGlvbi5wcm9jZXNzUmVzcG9uc2UoaW5wdXQudmFsdWUpLFxuICAgICAgbGFiZWxGb3JJZDogaW5wdXQuaWRcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyBhIG1hcHBlZCB0eXBlIFsxXSBjb25zaXN0aW5nIG9mIHByb3BlcnRpZXMgdGhhdCBjb25zaXN0XG4gKiBvZiBxdWVzdGlvbiBpbnB1dHMgd2hvc2UgYW5zd2VycyBtYXAgdG8gdGhlIG9yaWdpbmFsIHByb3BlcnR5IHR5cGVzLlxuICogXG4gKiBbMV0gaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXNcbiAqL1xuZXhwb3J0IHR5cGUgUXVlc3Rpb25JbnB1dHNGb3I8VD4gPSB7XG4gIFtQIGluIGtleW9mIFRdOiBRdWVzdGlvbklucHV0PFRbUF0+O1xufTtcblxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uSW5wdXQ8VD4ge1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICB3aWRnZXQ6IFdlYldpZGdldDxUPjtcbiAgZXJyb3I6IEhUTUxQYXJhZ3JhcGhFbGVtZW50fG51bGw7XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgcXVlc3Rpb246IFF1ZXN0aW9uPFQ+KSB7XG4gICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uO1xuICAgIHRoaXMuY29udGFpbmVyID0gbWFrZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NlczogWydmaWVsZCddIH0pO1xuXG4gICAgY29uc3QgbGFiZWwgPSBtYWtlRWxlbWVudCgnbGFiZWwnLCB7XG4gICAgICBjbGFzc2VzOiBbJ2pmLXF1ZXN0aW9uJywgJ2xhYmVsJ10sXG4gICAgICB0ZXh0Q29udGVudDogcXVlc3Rpb24udGV4dCxcbiAgICAgIGFwcGVuZFRvOiB0aGlzLmNvbnRhaW5lcixcbiAgICB9KTtcblxuICAgIHRoaXMud2lkZ2V0ID0gY3JlYXRlV2ViV2lkZ2V0KHF1ZXN0aW9uKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLndpZGdldC5nZXRFbGVtZW50KCkpO1xuICAgIGlmICh0aGlzLndpZGdldC5sYWJlbEZvcklkKSB7XG4gICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIHRoaXMud2lkZ2V0LmxhYmVsRm9ySWQpO1xuICAgIH1cbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgfVxuXG4gIHNob3dFcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZXJyb3IpIHtcbiAgICAgIHRoaXMuZXJyb3IgPSBtYWtlRWxlbWVudCgncCcsIHtcbiAgICAgICAgY2xhc3NlczogWydoZWxwJywgJ2lzLWRhbmdlciddLFxuICAgICAgICBhcHBlbmRUbzogdGhpcy5jb250YWluZXJcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmVycm9yLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgfVxuXG4gIGhpZGVFcnJvcigpIHtcbiAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5lcnJvcik7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZXNwb25kKCk6IFByb21pc2U8VHxudWxsPiB7XG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy53aWRnZXQucHJvY2Vzc0VsZW1lbnQoKTtcblxuICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikge1xuICAgICAgdGhpcy5zaG93RXJyb3IocmVzcG9uc2UubWVzc2FnZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5oaWRlRXJyb3IoKTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYkludGVydmlld0lPIGV4dGVuZHMgSW50ZXJ2aWV3SU8ge1xuICByb290OiBFbGVtZW50fG51bGw7XG4gIHN0YXR1c0RpdjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3Iocm9vdDogRWxlbWVudCwgcmVhZG9ubHkgbW9kYWxCdWlsZGVyOiBNb2RhbEJ1aWxkZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgdGhpcy5tb2RhbEJ1aWxkZXIgPSBtb2RhbEJ1aWxkZXI7XG4gICAgdGhpcy5zdGF0dXNEaXYgPSBtYWtlRWxlbWVudCgnZGl2JywgeyBhcHBlbmRUbzogcm9vdCB9KTtcbiAgfVxuXG4gIGVuc3VyZVJvb3QoKTogRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IHdhcyBzaHV0IGRvd25gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgfVxuXG4gIGFzeW5jIGFzazxUPihxdWVzdGlvbjogUXVlc3Rpb248VD4pOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuYXNrTWFueSh7IHF1ZXN0aW9uIH0pKS5xdWVzdGlvbjtcbiAgfVxuXG4gIGFzeW5jIGFza01hbnk8VD4ocXVlc3Rpb25zOiBRdWVzdGlvbnNGb3I8VD4pOiBQcm9taXNlPFQ+IHtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIGNvbnN0IHF1ZXN0aW9uSW5wdXRzID0ge30gYXMgUXVlc3Rpb25JbnB1dHNGb3I8VD47XG4gICAgbGV0IGZvdW5kRmlyc3RRdWVzdGlvbiA9IGZhbHNlO1xuXG4gICAgdGhpcy5lbnN1cmVSb290KCkuYXBwZW5kQ2hpbGQoZm9ybSk7XG4gICAgdGhpcy5zZXRTdGF0dXMoJycpO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHF1ZXN0aW9ucykge1xuICAgICAgaWYgKCFmb3VuZEZpcnN0UXVlc3Rpb24pIHtcbiAgICAgICAgZm91bmRGaXJzdFF1ZXN0aW9uID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KCd0aXRsZScsIHF1ZXN0aW9uc1trZXldLnRleHQpO1xuICAgICAgfVxuICAgICAgY29uc3QgcWkgPSBuZXcgUXVlc3Rpb25JbnB1dChxdWVzdGlvbnNba2V5XSk7XG4gICAgICBxdWVzdGlvbklucHV0c1trZXldID0gcWk7XG4gICAgICBmb3JtLmFwcGVuZENoaWxkKHFpLmNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgY29uc3Qgc3VibWl0ID0gbWFrZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgIHR5cGU6ICdzdWJtaXQnLFxuICAgICAgY2xhc3NlczogWydidXR0b24nLCAnaXMtcHJpbWFyeSddLFxuICAgICAgdGV4dENvbnRlbnQ6ICdTdWJtaXQnLFxuICAgICAgYXBwZW5kVG86IGZvcm0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRSZXNwb25zZXMgPSBhc3luYyAoKTogUHJvbWlzZTxUfG51bGw+ID0+IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlcyA9IHt9IGFzIFQ7XG4gICAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gcXVlc3Rpb25JbnB1dHMpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBxdWVzdGlvbklucHV0c1trZXldLnJlc3BvbmQoKTtcbiAgICAgICAgaWYgKHJlc3BvbnNlICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzcG9uc2VzW2tleV0gPSByZXNwb25zZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpc1ZhbGlkID8gcmVzcG9uc2VzIDogbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8VD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZm9ybS5vbnN1Ym1pdCA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZ2V0UmVzcG9uc2VzKCkudGhlbihyZXNwb25zZXMgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZXMpIHtcbiAgICAgICAgICAgIHRoaXMuZW5zdXJlUm9vdCgpLnJlbW92ZUNoaWxkKGZvcm0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzcG9uc2VzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgbm90aWZ5KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMuc2V0U3RhdHVzKCcnKTtcbiAgICB0aGlzLm1vZGFsQnVpbGRlci5jcmVhdGVBbmRPcGVuKHRleHQpO1xuICB9XG5cbiAgc2V0U3RhdHVzKHRleHQ6IHN0cmluZywgb3B0aW9uczogeyBzaG93VGhyb2JiZXI/OiBib29sZWFuIH0gPSB7IHNob3dUaHJvYmJlcjogdHJ1ZSB9KSB7XG4gICAgdGhpcy5lbnN1cmVSb290KCk7XG4gICAgdGhpcy5zdGF0dXNEaXYudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGlmICh0ZXh0KSB7XG4gICAgICBpZiAob3B0aW9ucy5zaG93VGhyb2JiZXIpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKSk7XG4gICAgICAgIHRoaXMuc3RhdHVzRGl2LmFwcGVuZENoaWxkKG1ha2VUaHJvYmJlcigpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdCgndGl0bGUnLCB0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVQaG90b1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPFBob3RvPiB7XG4gICAgcmV0dXJuIG5ldyBXZWJQaG90b1F1ZXN0aW9uKHRleHQpO1xuICB9XG5cbiAgY3JlYXRlWWVzTm9RdWVzdGlvbih0ZXh0OiBzdHJpbmcpOiBRdWVzdGlvbjxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBXZWJZZXNOb1F1ZXN0aW9uKHRleHQpO1xuICB9XG5cbiAgY3JlYXRlRGF0ZVF1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPERhdGU+IHtcbiAgICByZXR1cm4gbmV3IFdlYkRhdGVRdWVzdGlvbih0ZXh0KTtcbiAgfVxuXG4gIGNyZWF0ZU11bHRpQ2hvaWNlUXVlc3Rpb248VD4odGV4dDogc3RyaW5nLCBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdKSB7XG4gICAgcmV0dXJuIG5ldyBXZWJNdWx0aUNob2ljZVF1ZXN0aW9uKHRleHQsIGFuc3dlcnMpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5lbnN1cmVSb290KCkuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLm1vZGFsQnVpbGRlci5zaHV0ZG93bigpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2ViSW50ZXJ2aWV3SU8ge1xuICBvbihldmVudDogJ3RpdGxlJywgbGlzdGVuZXI6ICh0aXRsZTogc3RyaW5nKSA9PiB2b2lkKTogdGhpcztcbiAgZW1pdChldmVudDogJ3RpdGxlJywgdGl0bGU6IHN0cmluZyk6IGJvb2xlYW47XG59XG4iLCJpbXBvcnQgeyBnZXRFbGVtZW50LCBtYWtlRWxlbWVudCB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gXCJldmVudHNcIjtcblxuZXhwb3J0IGNsYXNzIE1vZGFsQnVpbGRlciB7XG4gIG1vZGFsOiBNb2RhbHxudWxsID0gbnVsbDtcbiAgaXNTaHV0RG93bjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIHRoaXMuY3JlYXRlKCd0aGlzIGlzIGEgc21va2UgdGVzdCB0byBtYWtlIHN1cmUgdGhlIHRlbXBsYXRlIGlzIHZhbGlkIScpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGUodGV4dDogc3RyaW5nKTogTW9kYWwge1xuICAgIHJldHVybiBuZXcgTW9kYWwodGhpcy50ZW1wbGF0ZSwgdGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgc2ltcGxlIG1vZGFsIHdpdGggc29tZSB0ZXh0IGFuZCBhbiBPSyBidXR0b24sIGFuZCBzaG93IGl0LlxuICAgKiBcbiAgICogQHBhcmFtIHRleHQgVGhlIHRleHQgdG8gZGlzcGxheSBpbiB0aGUgbW9kYWwuXG4gICAqL1xuICBjcmVhdGVBbmRPcGVuKHRleHQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmlzU2h1dERvd24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IGlzIHNodXQgZG93bmApO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2RhbCkge1xuICAgICAgdGhpcy5tb2RhbC5hZGRUZXh0KHRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vZGFsID0gdGhpcy5jcmVhdGUodGV4dCk7XG4gICAgICB0aGlzLm1vZGFsLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5tb2RhbCA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIHRoaXMubW9kYWwub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIHNodXRkb3duKCkge1xuICAgIGlmICh0aGlzLm1vZGFsKSB7XG4gICAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gICAgfVxuICAgIHRoaXMuaXNTaHV0RG93biA9IHRydWU7XG4gIH1cbn1cblxuY2xhc3MgTW9kYWwgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBtb2RhbERpdjogSFRNTERpdkVsZW1lbnQ7XG4gIG9rQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgY2xvc2VCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuICBjb250ZW50RWw6IEhUTUxEaXZFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50LCB0ZXh0OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblxuICAgIHRoaXMubW9kYWxEaXYgPSBnZXRFbGVtZW50KCdkaXYnLCAnLm1vZGFsJywgY2xvbmUpO1xuICAgIHRoaXMuY29udGVudEVsID0gZ2V0RWxlbWVudCgnZGl2JywgJ1tkYXRhLW1vZGFsLWNvbnRlbnRdJywgdGhpcy5tb2RhbERpdik7XG4gICAgdGhpcy5va0J1dHRvbiA9IGdldEVsZW1lbnQoJ2J1dHRvbicsICcuaXMtcHJpbWFyeScsIHRoaXMubW9kYWxEaXYpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBnZXRFbGVtZW50KCdidXR0b24nLCAnLm1vZGFsLWNsb3NlJywgdGhpcy5tb2RhbERpdik7XG5cbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlS2V5VXAgPSB0aGlzLmhhbmRsZUtleVVwLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmNvbnRlbnRFbC50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tb2RhbERpdik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwKTtcbiAgICB0aGlzLm9rQnV0dG9uLmZvY3VzKCk7XG4gICAgdGhpcy5va0J1dHRvbi5vbmNsaWNrID0gdGhpcy5jbG9zZUJ1dHRvbi5vbmNsaWNrID0gdGhpcy5jbG9zZTtcbiAgICAvLyBUT0RPOiBUcmFwIGtleWJvYXJkIGZvY3VzIGFuZCBhbGwgdGhlIG90aGVyIGFjY2Vzc2liaWxpdHkgYml0cy5cbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5tb2RhbERpdik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwKTtcbiAgICB0aGlzLmVtaXQoJ2Nsb3NlJyk7XG4gIH1cblxuICBhZGRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIG1ha2VFbGVtZW50KCdicicsIHsgYXBwZW5kVG86IHRoaXMuY29udGVudEVsIH0pO1xuICAgIG1ha2VFbGVtZW50KCdicicsIHsgYXBwZW5kVG86IHRoaXMuY29udGVudEVsIH0pO1xuICAgIHRoaXMuY29udGVudEVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE11bHRpQ2hvaWNlQW5zd2VyLCBWYWxpZGF0aW9uRXJyb3IsIFF1ZXN0aW9uIH0gZnJvbSBcIi4uL3F1ZXN0aW9uXCI7XG5pbXBvcnQgeyBXZWJXaWRnZXQgfSBmcm9tIFwiLi9pb1wiO1xuaW1wb3J0IHsgbWFrZUVsZW1lbnQsIGNyZWF0ZVVuaXF1ZUlkLCBtYWtlUmFkaW8gfSBmcm9tIFwiLi91dGlsXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJNdWx0aUNob2ljZVF1ZXN0aW9uPFQ+IGV4dGVuZHMgUXVlc3Rpb248VD4gaW1wbGVtZW50cyBXZWJXaWRnZXQ8VD4ge1xuICBkaXY6IEhUTUxEaXZFbGVtZW50O1xuICBpbnB1dE5hbWU6IHN0cmluZztcbiAgcmFkaW9zOiBIVE1MSW5wdXRFbGVtZW50W107XG4gIHRleHQ6IHN0cmluZztcbiAgYW5zd2VyczogTXVsdGlDaG9pY2VBbnN3ZXI8VD5bXTtcblxuICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogc3RyaW5nLCBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnRleHQgPSBxdWVzdGlvbjtcbiAgICB0aGlzLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICAgIHRoaXMuZGl2ID0gbWFrZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NlczogWydjb250cm9sJ10gfSk7XG4gICAgdGhpcy5pbnB1dE5hbWUgPSBjcmVhdGVVbmlxdWVJZCgpO1xuICAgIHRoaXMucmFkaW9zID0gYW5zd2Vycy5tYXAoYW5zd2VyID0+IHtcbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBtYWtlRWxlbWVudCgncCcsIHsgYXBwZW5kVG86IHRoaXMuZGl2IH0pO1xuICAgICAgcmV0dXJuIG1ha2VSYWRpbyh3cmFwcGVyLCB0aGlzLmlucHV0TmFtZSwgYW5zd2VyWzFdKS5pbnB1dDtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2O1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc0VsZW1lbnQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJhZGlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcmFkaW8gPSB0aGlzLnJhZGlvc1tpXTtcbiAgICAgIGlmIChyYWRpby5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuc3dlcnNbaV1bMF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvbkVycm9yKCdQbGVhc2UgY2hvb3NlIGFuIGFuc3dlci4nKTtcbiAgfVxuXG4gIHByb2Nlc3NSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTxUIHwgVmFsaWRhdGlvbkVycm9yPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHNob3VsZCBuZXZlciBiZSBjYWxsZWQhJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFF1ZXN0aW9uLCBWYWxpZGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vcXVlc3Rpb25cIjtcbmltcG9ydCB7IFBob3RvIH0gZnJvbSBcIi4uL3V0aWxcIjtcbmltcG9ydCB7IFdlYldpZGdldCB9IGZyb20gXCIuL2lvXCI7XG5pbXBvcnQgeyBtYWtlRWxlbWVudCB9IGZyb20gXCIuL3V0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFdlYlBob3RvUXVlc3Rpb24gZXh0ZW5kcyBRdWVzdGlvbjxQaG90bz4gaW1wbGVtZW50cyBXZWJXaWRnZXQ8UGhvdG8+IHtcbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIGxhYmVsRm9ySWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSB0ZXh0OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy5pbnB1dCA9IG1ha2VFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ2ZpbGUnIH0pO1xuICAgIHRoaXMubGFiZWxGb3JJZCA9IHRoaXMuaW5wdXQuaWQ7XG4gIH1cblxuICBwcm9jZXNzUmVzcG9uc2UocmVzcG9uc2U6IHN0cmluZyk6IFByb21pc2U8UGhvdG98VmFsaWRhdGlvbkVycm9yPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGZ1bmN0aW9uIHNob3VsZCBuZXZlciBiZSBjYWxsZWQhJyk7XG4gIH1cblxuICBnZXRFbGVtZW50KCk6IEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmlucHV0O1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc0VsZW1lbnQoKTogUHJvbWlzZTxQaG90b3xWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICBjb25zdCBmaWxlcyA9IHRoaXMuaW5wdXQuZmlsZXM7XG5cbiAgICBpZiAoIWZpbGVzIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1lvdSBtdXN0IHVwbG9hZCBhbiBpbWFnZSEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gZmlsZXNbMF07XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxQaG90bz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50LnRhcmdldCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QoJ2V2ZW50LnRhcmdldCBpcyBudWxsIScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YoZXZlbnQudGFyZ2V0LnJlc3VsdCkgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgICAvXmRhdGE6Ly50ZXN0KGV2ZW50LnRhcmdldC5yZXN1bHQpKSB7XG4gICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ2V2ZW50LnRhcmdldC5yZXN1bHQgaXMgbm90IGEgZGF0YSBVUkkhJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZVNlcmlhbGl6ZXI8Uz4ge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBrZXluYW1lOiBzdHJpbmcsIHJlYWRvbmx5IGRlZmF1bHRTdGF0ZTogUykge1xuICAgIHRoaXMua2V5bmFtZSA9IGtleW5hbWU7XG4gICAgdGhpcy5kZWZhdWx0U3RhdGUgPSBkZWZhdWx0U3RhdGU7XG4gIH1cblxuICBnZXQoKTogUyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gd2luZG93LmxvY2FsU3RvcmFnZVt0aGlzLmtleW5hbWVdO1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRTdGF0ZTtcbiAgICB9XG4gIH1cblxuICBzZXQoc3RhdGU6IFMpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IEpTT04uc3RyaW5naWZ5KHN0YXRlLCBudWxsLCAyKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlW3RoaXMua2V5bmFtZV0gPSBjb250ZW50cztcbiAgfVxufVxuIiwiaW1wb3J0IHsgbWFrZUVsZW1lbnQsIGdldEVsZW1lbnQgfSBmcm9tIFwiLi91dGlsXCI7XG5cbi8vIGh0dHBzOi8vY29tbW9ucy53aWtpbWVkaWEub3JnL3dpa2kvRmlsZTpDaHJvbWl1bXRocm9iYmVyLnN2Z1xuY29uc3QgSFRNTCA9IGBcbjxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAzMDAgMzAwXCJcbiAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjFcIj5cbiAgPHBhdGggZD1cIk0gMTUwLDBcbiAgICAgICAgICAgYSAxNTAsMTUwIDAgMCwxIDEwNi4wNjYsMjU2LjA2NlxuICAgICAgICAgICBsIC0zNS4zNTUsLTM1LjM1NVxuICAgICAgICAgICBhIC0xMDAsLTEwMCAwIDAsMCAtNzAuNzExLC0xNzAuNzExIHpcIlxuICAgICAgICBmaWxsPVwiIzAwZDFiMlwiPlxuICAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9XCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGVUeXBlPVwiWE1MXCJcbiAgICAgICAgICAgdHlwZT1cInJvdGF0ZVwiIGZyb209XCIwIDE1MCAxNTBcIiB0bz1cIjM2MCAxNTAgMTUwXCJcbiAgICAgICAgICAgYmVnaW49XCIwc1wiIGR1cj1cIjFzXCIgZmlsbD1cImZyZWV6ZVwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIC8+XG4gIDwvcGF0aD5cbjwvc3ZnPlxuYC50cmltKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VUaHJvYmJlcigpOiBTVkdFbGVtZW50IHtcbiAgY29uc3QgZGl2ID0gbWFrZUVsZW1lbnQoJ2RpdicsIHsgaW5uZXJIVE1MOiBIVE1MIH0pO1xuICBjb25zdCBzdmcgPSBkaXYucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gIGlmICghc3ZnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0aHJvYmJlciBzdmcgbm90IGZvdW5kJyk7XG4gIH1cbiAgcmV0dXJuIHN2Zztcbn1cblxuLy8gVGhpcyBpcyBhIHNtb2tlIHRlc3Qvc2FuaXR5IGNoZWNrLlxubWFrZVRocm9iYmVyKCk7XG4iLCIvKipcbiAqIEZpbmQgYW4gZWxlbWVudC5cbiAqIFxuICogQHBhcmFtIHRhZ05hbWUgVGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQncyBIVE1MIHRhZy5cbiAqIEBwYXJhbSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgZm9yIHRoZSBlbGVtZW50LCBub3QgaW5jbHVkaW5nIGl0cyBIVE1MIHRhZy5cbiAqIEBwYXJhbSBwYXJlbnQgVGhlIHBhcmVudCBub2RlIHRvIHNlYXJjaCB3aXRoaW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50PEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KFxuICB0YWdOYW1lOiBLLFxuICBzZWxlY3Rvcjogc3RyaW5nLFxuICBwYXJlbnQ6IFBhcmVudE5vZGUgPSBkb2N1bWVudFxuKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdIHtcbiAgY29uc3QgZmluYWxTZWxlY3RvciA9IGAke3RhZ05hbWV9JHtzZWxlY3Rvcn1gO1xuICBjb25zdCBub2RlID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoZmluYWxTZWxlY3Rvcik7XG4gIGlmICghbm9kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGRuJ3QgZmluZCBhbnkgZWxlbWVudHMgbWF0Y2hpbmcgXCIke2ZpbmFsU2VsZWN0b3J9XCJgKTtcbiAgfVxuICByZXR1cm4gbm9kZSBhcyBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XG59XG5cbmxldCBpZENvdW50ZXIgPSAwO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVW5pcXVlSWQoKTogc3RyaW5nIHtcbiAgaWRDb3VudGVyKys7XG4gIHJldHVybiBgdW5pcXVlX2lkXyR7aWRDb3VudGVyfWA7XG59XG5cbi8qKiBUaGlzIGRlZmluZXMgYWxsIHRoZSB2YWxpZCBDU1MgY2xhc3NlcyBpbiBvdXIgcHJvamVjdC4gKi9cbnR5cGUgQ3NzQ2xhc3NOYW1lID1cbiAgLy8gQnVsbWEgY2xhc3Nlcy5cbiAgJ2NvbnRyb2wnIHxcbiAgJ2ZpZWxkJyB8XG4gICdsYWJlbCcgfFxuICAnaGVscCcgfFxuICAnYnV0dG9uJyB8XG4gICdyYWRpbycgfFxuICAnaW5wdXQnIHxcbiAgJ2lzLWRhbmdlcicgfFxuICAnaXMtcHJpbWFyeScgfFxuICAvLyBDdXN0b20gSnVzdEZpeCBjbGFzc2VzLlxuICAnamYtcXVlc3Rpb24nO1xuXG5pbnRlcmZhY2UgTWFrZUVsZW1lbnRPcHRpb25zPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4ge1xuICAvKiogVGhlIGVsZW1lbnQncyBjbGFzc2VzIChjb3JyZXNwb25kcyB0byB0aGUgXCJjbGFzc1wiIGF0dHJpYnV0ZSkuICovXG4gIGNsYXNzZXM/OiBDc3NDbGFzc05hbWVbXSxcbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50J3MgdHlwZS4gKi9cbiAgdHlwZT86IFQgZXh0ZW5kcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTEJ1dHRvbkVsZW1lbnQgPyBzdHJpbmcgOiBuZXZlcixcbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50J3MgbmFtZS4gKi9cbiAgbmFtZT86IFQgZXh0ZW5kcyBIVE1MSW5wdXRFbGVtZW50ID8gc3RyaW5nIDogbmV2ZXIsXG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCdzIHZhbHVlLiAqL1xuICB2YWx1ZT86IFQgZXh0ZW5kcyBIVE1MSW5wdXRFbGVtZW50ID8gc3RyaW5nIDogbmV2ZXIsXG4gIC8qKiBPcHRpb25hbCBwYXJlbnQgZWxlbWVudCB0byBhcHBlbmQgdGhlIG5ld2x5LWNyZWF0ZWQgZWxlbWVudCB0by4gKi9cbiAgYXBwZW5kVG8/OiBFbGVtZW50LFxuICAvKiogT3B0aW9uYWwgY2hpbGQgZWxlbWVudHMgdG8gYXBwZW5kIHRvIHRoZSBuZXdseS1jcmVhdGVkIGVsZW1lbnQuICovXG4gIGNoaWxkcmVuPzogRWxlbWVudFtdLFxuICAvKiogVGhlIGVsZW1lbnQncyB0ZXh0IGNvbnRlbnQuICovXG4gIHRleHRDb250ZW50Pzogc3RyaW5nLFxuICAvKiogVGhlIGVsZW1lbnQncyBpbm5lciBIVE1MLiAqL1xuICBpbm5lckhUTUw/OiBzdHJpbmcsXG4gIC8qKiBUaGUgZWxlbWVudCdzIFwidGFiaW5kZXhcIiBhdHRyaWJ1dGUuICovXG4gIHRhYkluZGV4PzogMCB8IC0xLFxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBIVE1MIGVsZW1lbnQuXG4gKiBcbiAqIElmIHRoZSBlbGVtZW50IGlzIGFuIDxpbnB1dD4sIGF1dG9tYXRpY2FsbHkgYXNzaWduIGEgdW5pcXVlIElEIHRvIGl0LlxuICogXG4gKiBAcGFyYW0gdGFnTmFtZSBUaGUgbmFtZSBvZiB0aGUgZWxlbWVudCdzIEhUTUwgdGFnLlxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRWxlbWVudDxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihcbiAgdGFnTmFtZTogSyxcbiAgb3B0aW9uczogTWFrZUVsZW1lbnRPcHRpb25zPEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXT5cbik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcblxuICBpZiAob3B0aW9ucy5jbGFzc2VzKSB7XG4gICAgb3B0aW9ucy5jbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSk7XG4gIH1cbiAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCB8fCBlbCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgZWwudHlwZSA9IG9wdGlvbnMudHlwZSB8fCAnJztcbiAgfVxuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgZWwubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnJztcbiAgICBlbC52YWx1ZSA9IG9wdGlvbnMudmFsdWUgfHwgJyc7XG4gICAgZWwuaWQgPSBjcmVhdGVVbmlxdWVJZCgpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMudGV4dENvbnRlbnQpIHtcbiAgICBlbC50ZXh0Q29udGVudCA9IG9wdGlvbnMudGV4dENvbnRlbnQ7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaW5uZXJIVE1MKSB7XG4gICAgZWwuaW5uZXJIVE1MID0gb3B0aW9ucy5pbm5lckhUTUw7XG4gIH1cbiAgaWYgKG9wdGlvbnMuYXBwZW5kVG8pIHtcbiAgICBvcHRpb25zLmFwcGVuZFRvLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuICBpZiAob3B0aW9ucy5jaGlsZHJlbikge1xuICAgIG9wdGlvbnMuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBlbC5hcHBlbmRDaGlsZChjaGlsZCkpO1xuICB9XG4gIGlmICh0eXBlb2Yob3B0aW9ucy50YWJJbmRleCkgPT09ICdudW1iZXInKSB7XG4gICAgZWwudGFiSW5kZXggPSBvcHRpb25zLnRhYkluZGV4O1xuICB9XG5cbiAgcmV0dXJuIGVsO1xufVxuXG4vKipcbiAqIFdyYXAgdGhlIGdpdmVuIGVsZW1lbnQgaW4gYSA8ZGl2IGNsYXNzPVwiY29udHJvbFwiPi5cbiAqIFxuICogQHBhcmFtIGVsIFRoZSBlbGVtZW50IHRvIHdyYXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwSW5Db250cm9sRGl2KGVsOiBFbGVtZW50KTogSFRNTERpdkVsZW1lbnQge1xuICByZXR1cm4gbWFrZUVsZW1lbnQoJ2RpdicsIHtcbiAgICBjbGFzc2VzOiBbJ2NvbnRyb2wnXSxcbiAgICBjaGlsZHJlbjogW2VsXSxcbiAgfSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuIDxpbnB1dCB0eXBlPVwicmFkaW9cIj4gd3JhcHBlZCBpbiBhIDxsYWJlbD4uXG4gKiBcbiAqIEBwYXJhbSBwYXJlbnQgVGhlIHBhcmVudCBub2RlIHRvIGFwcGVuZCB0aGUgcmFkaW8gdG8uXG4gKiBAcGFyYW0gaW5wdXROYW1lIFRoZSBcIm5hbWVcIiBhdHRyaWJ1dGUgb2YgdGhlIHJhZGlvLlxuICogQHBhcmFtIGxhYmVsVGV4dCBUaGUgdGV4dCBvZiB0aGUgcmFkaW8ncyBsYWJlbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSYWRpbyhwYXJlbnQ6IEhUTUxFbGVtZW50LCBpbnB1dE5hbWU6IHN0cmluZywgbGFiZWxUZXh0OiBzdHJpbmcpOiB7XG4gIGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50LFxuICBpbnB1dDogSFRNTElucHV0RWxlbWVudFxufSB7XG4gIGNvbnN0IGxhYmVsID0gbWFrZUVsZW1lbnQoJ2xhYmVsJywgeyBjbGFzc2VzOiBbJ3JhZGlvJ10gfSk7XG4gIGNvbnN0IGlucHV0ID0gbWFrZUVsZW1lbnQoJ2lucHV0Jywge1xuICAgIHR5cGU6ICdyYWRpbycsXG4gICAgbmFtZTogaW5wdXROYW1lLFxuICAgIHZhbHVlOiBsYWJlbFRleHQsXG4gICAgYXBwZW5kVG86IGxhYmVsXG4gIH0pO1xuXG4gIGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGAgJHtsYWJlbFRleHR9YCkpO1xuXG4gIHBhcmVudC5hcHBlbmRDaGlsZChsYWJlbCk7XG5cbiAgcmV0dXJuIHsgbGFiZWwsIGlucHV0IH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbGVlcChtaWxsaXNlY29uZHM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1pbGxpc2Vjb25kcyk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgVmFsaWRhdGlvbkVycm9yLCBZZXNOb1F1ZXN0aW9uIH0gZnJvbSBcIi4uL3F1ZXN0aW9uXCI7XG5pbXBvcnQgeyBXZWJXaWRnZXQgfSBmcm9tIFwiLi9pb1wiO1xuaW1wb3J0IHsgY3JlYXRlVW5pcXVlSWQsIG1ha2VSYWRpbywgbWFrZUVsZW1lbnQgfSBmcm9tIFwiLi91dGlsXCI7XG5cblxuZXhwb3J0IGNsYXNzIFdlYlllc05vUXVlc3Rpb24gZXh0ZW5kcyBZZXNOb1F1ZXN0aW9uIGltcGxlbWVudHMgV2ViV2lkZ2V0PGJvb2xlYW4+IHtcbiAgZGl2OiBIVE1MRGl2RWxlbWVudDtcbiAgeWVzSW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIG5vSW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIGlucHV0TmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKHRleHQpO1xuICAgIHRoaXMuZGl2ID0gbWFrZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NlczogWydjb250cm9sJ10gfSk7XG4gICAgdGhpcy5pbnB1dE5hbWUgPSBjcmVhdGVVbmlxdWVJZCgpO1xuICAgIHRoaXMueWVzSW5wdXQgPSBtYWtlUmFkaW8odGhpcy5kaXYsIHRoaXMuaW5wdXROYW1lLCAnWWVzJykuaW5wdXQ7XG4gICAgdGhpcy5ub0lucHV0ID0gbWFrZVJhZGlvKHRoaXMuZGl2LCB0aGlzLmlucHV0TmFtZSwgJ05vJykuaW5wdXQ7XG4gIH1cblxuICBnZXRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5kaXY7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzRWxlbWVudCgpOiBQcm9taXNlPGJvb2xlYW58VmFsaWRhdGlvbkVycm9yPiB7XG4gICAgaWYgKHRoaXMueWVzSW5wdXQuY2hlY2tlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5vSW5wdXQuY2hlY2tlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignUGxlYXNlIGNob29zZSBhbiBhbnN3ZXIuJyk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJpbXBvcnQgeyBEYXRlU3RyaW5nIH0gZnJvbSAnLi4vbGliL3V0aWwnO1xuaW1wb3J0IHsgVGVuYW50SW50ZXJ2aWV3IH0gZnJvbSAnLi4vbGliL3RlbmFudC1pbnRlcnZpZXcnO1xuaW1wb3J0IHsgVGVuYW50IH0gZnJvbSAnLi4vbGliL3RlbmFudCc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VTZXJpYWxpemVyIH0gZnJvbSAnLi4vbGliL3dlYi9zZXJpYWxpemVyJztcbmltcG9ydCB7IFdlYkludGVydmlld0lPIH0gZnJvbSAnLi4vbGliL3dlYi9pbyc7XG5pbXBvcnQgeyBnZXRFbGVtZW50IH0gZnJvbSAnLi4vbGliL3dlYi91dGlsJztcbmltcG9ydCB7IE1vZGFsQnVpbGRlciB9IGZyb20gJy4uL2xpYi93ZWIvbW9kYWwnO1xuaW1wb3J0IHsgUmVjb3JkYWJsZUludGVydmlld0lPLCBSZWNvcmRlZEFjdGlvbiB9IGZyb20gJy4uL2xpYi9yZWNvcmRhYmxlLWlvJztcblxuaW50ZXJmYWNlIEFwcFN0YXRlIHtcbiAgZGF0ZTogRGF0ZVN0cmluZyxcbiAgdGVuYW50OiBUZW5hbnQsXG4gIHJlY29yZGluZzogUmVjb3JkZWRBY3Rpb25bXSxcbn1cblxuY29uc3QgSU5JVElBTF9BUFBfU1RBVEU6IEFwcFN0YXRlID0ge1xuICBkYXRlOiBuZXcgRGF0ZSgpLFxuICB0ZW5hbnQ6IHt9LFxuICByZWNvcmRpbmc6IFtdLFxufTtcblxuaW50ZXJmYWNlIFJlc3RhcnRPcHRpb25zIHtcbiAgcHVzaFN0YXRlOiBib29sZWFuO1xufVxuXG5sZXQgaW86IFdlYkludGVydmlld0lPfG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiByZXN0YXJ0KG9wdGlvbnM6IFJlc3RhcnRPcHRpb25zID0geyBwdXNoU3RhdGU6IHRydWUgfSkge1xuICBjb25zdCByZXNldEJ1dHRvbiA9IGdldEVsZW1lbnQoJ2J1dHRvbicsICcjcmVzZXQnKTtcbiAgY29uc3QgZGF0ZUlucHV0ID0gZ2V0RWxlbWVudCgnaW5wdXQnLCAnI2RhdGUnKTtcbiAgY29uc3QgbWFpbkRpdiA9IGdldEVsZW1lbnQoJ2RpdicsICcjbWFpbicpO1xuICBjb25zdCBtb2RhbFRlbXBsYXRlID0gZ2V0RWxlbWVudCgndGVtcGxhdGUnLCAnI21vZGFsJyk7XG5cbiAgaWYgKGlvKSB7XG4gICAgaW8uY2xvc2UoKTtcbiAgICBpbyA9IG51bGw7XG4gIH1cblxuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IExvY2FsU3RvcmFnZVNlcmlhbGl6ZXIoJ3RlbmFudEFwcFN0YXRlJywgSU5JVElBTF9BUFBfU1RBVEUpO1xuICBjb25zdCBteUlvID0gbmV3IFdlYkludGVydmlld0lPKG1haW5EaXYsIG5ldyBNb2RhbEJ1aWxkZXIobW9kYWxUZW1wbGF0ZSkpO1xuICBpbyA9IG15SW87XG5cbiAgLy8gV2Ugd2FudCB0byBiaW5kIHRoaXMgcmVzZXQgYnV0dG9uIGFzIGVhcmx5IGFzIHBvc3NpYmxlLCBzbyB0aGF0IGlmIHRoZVxuICAvLyBzZXJpYWxpemVyIHN0YXRlIGlzIGJyb2tlbiAoZS5nLiBiZWNhdXNlIHRoZSBzY2hlbWEgY2hhbmdlZCByZWNlbnRseSksXG4gIC8vIGl0J3MgYWx3YXlzIHBvc3NpYmxlIHRvIHJlc2V0LlxuICByZXNldEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgIHNlcmlhbGl6ZXIuc2V0KElOSVRJQUxfQVBQX1NUQVRFKTtcbiAgICByZXN0YXJ0KCk7XG4gIH07XG5cbiAgaWYgKG9wdGlvbnMucHVzaFN0YXRlKSB7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHNlcmlhbGl6ZXIuZ2V0KCksICcnLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc2VyaWFsaXplci5nZXQoKSwgJycsIG51bGwpO1xuICB9XG5cbiAgd2luZG93Lm9ucG9wc3RhdGUgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQuc3RhdGUpIHtcbiAgICAgIHNlcmlhbGl6ZXIuc2V0KGV2ZW50LnN0YXRlKTtcbiAgICAgIHJlc3RhcnQoeyBwdXNoU3RhdGU6IGZhbHNlIH0pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZWNvcmRhYmxlSW8gPSBuZXcgUmVjb3JkYWJsZUludGVydmlld0lPKGlvLCBzZXJpYWxpemVyLmdldCgpLnJlY29yZGluZyk7XG4gIGNvbnN0IGludGVydmlldyA9IG5ldyBUZW5hbnRJbnRlcnZpZXcoe1xuICAgIGlvOiByZWNvcmRhYmxlSW8sXG4gICAgbm93OiBuZXcgRGF0ZShzZXJpYWxpemVyLmdldCgpLmRhdGUpLFxuICB9KTtcblxuICBkYXRlSW5wdXQudmFsdWVBc0RhdGUgPSBpbnRlcnZpZXcubm93O1xuXG4gIGRhdGVJbnB1dC5vbmNoYW5nZSA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNlcmlhbGl6ZXIuc2V0KHtcbiAgICAgIC4uLnNlcmlhbGl6ZXIuZ2V0KCksXG4gICAgICByZWNvcmRpbmc6IFtdLFxuICAgICAgZGF0ZTogZGF0ZUlucHV0LnZhbHVlQXNEYXRlXG4gICAgfSk7XG4gICAgcmVzdGFydCgpO1xuICB9O1xuXG4gIHJlY29yZGFibGVJby5vbignYmVnaW4tcmVjb3JkaW5nLWFjdGlvbicsIHR5cGUgPT4ge1xuICAgIGlmICh0eXBlID09PSAnYXNrJyB8fCB0eXBlID09PSAnYXNrTWFueScgJiYgaW8gPT09IG15SW8pIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gc2VyaWFsaXplci5nZXQoKTtcbiAgICAgIGNvbnN0IHJlY29yZGluZyA9IHJlY29yZGFibGVJby5uZXdSZWNvcmRpbmc7XG4gICAgICBpZiAocmVjb3JkaW5nLmxlbmd0aCA+IHN0YXRlLnJlY29yZGluZy5sZW5ndGgpIHtcbiAgICAgICAgLy8gVGhlIGludGVydmlldyBjb250YWlucyBtdWx0aXBsZSBxdWVzdGlvbiBzdGVwcyBiZWZvcmVcbiAgICAgICAgLy8gcmV0dXJuaW5nIGEgbmV3IHN0YXRlLiBSZW1lbWJlciB3aGF0IHRoZSB1c2VyIGhhc1xuICAgICAgICAvLyBhbnN3ZXJlZCBzbyBmYXIsIHNvIHRoYXQgdGhleSBjYW4gc3RpbGwgZWFzaWx5XG4gICAgICAgIC8vIG5hdmlnYXRlIGJldHdlZW4gdGhlIHF1ZXN0aW9uIHN0ZXBzIHVzaW5nIHRoZWlyXG4gICAgICAgIC8vIGJyb3dzZXIncyBiYWNrL2ZvcndhcmQgYnV0dG9ucy5cbiAgICAgICAgc2VyaWFsaXplci5zZXQoe1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIHJlY29yZGluZyxcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzZXJpYWxpemVyLmdldCgpLCAnJywgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpbnRlcnZpZXcub24oJ2NoYW5nZScsIChfLCBuZXh0U3RhdGUpID0+IHtcbiAgICBzZXJpYWxpemVyLnNldCh7XG4gICAgICAuLi5zZXJpYWxpemVyLmdldCgpLFxuICAgICAgcmVjb3JkaW5nOiByZWNvcmRhYmxlSW8ucmVzZXRSZWNvcmRpbmcoKSxcbiAgICAgIHRlbmFudDogbmV4dFN0YXRlXG4gICAgfSk7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHNlcmlhbGl6ZXIuZ2V0KCksICcnLCBudWxsKTtcbiAgfSk7XG5cbiAgbXlJby5vbigndGl0bGUnLCB0aXRsZSA9PiB7XG4gICAgZG9jdW1lbnQudGl0bGUgPSBgJHt0aXRsZX0gLSAke2ludGVydmlldy5ub3cudG9EYXRlU3RyaW5nKCl9YDtcbiAgfSk7XG5cbiAgaW50ZXJ2aWV3LmV4ZWN1dGUoc2VyaWFsaXplci5nZXQoKS50ZW5hbnQpLnRoZW4oKHRlbmFudCkgPT4ge1xuICAgIGNvbnN0IGZvbGxvd3VwQ291bnQgPSBpbnRlcnZpZXcuZ2V0Rm9sbG93VXBzKHRlbmFudCkubGVuZ3RoO1xuICAgIGNvbnN0IHN0YXR1cyA9IGZvbGxvd3VwQ291bnQgP1xuICAgICAgYE5vIG1vcmUgcXVlc3Rpb25zIGZvciBub3csIGJ1dCAke2ZvbGxvd3VwQ291bnR9IGZvbGxvd3VwKHMpIHJlbWFpbi5gIDpcbiAgICAgIGBJbnRlcnZpZXcgY29tcGxldGUsIG5vIG1vcmUgZm9sbG93dXBzIHRvIHByb2Nlc3MuYDtcbiAgICBteUlvLnNldFN0YXR1cyhzdGF0dXMsIHsgc2hvd1Rocm9iYmVyOiBmYWxzZSB9KTtcbiAgfSk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICByZXN0YXJ0KHsgcHVzaFN0YXRlOiBmYWxzZSB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==