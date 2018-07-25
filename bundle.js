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
/**
 * This Error subclass should be used when any InterviewIO-related
 * functionality fails because the IO was shutdown (e.g. if the UI
 * is web-based and the user navigated somewhere else).
 */
class IOCancellationError extends Error {
    constructor(message) {
        if (typeof (message) === 'object') {
            super(`${message.constructor.name} has shut down`);
        }
        else {
            super(message);
        }
    }
}
exports.IOCancellationError = IOCancellationError;


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
        return this.playbackOrRecord('notify', () => this.delegate.notify(text));
    }
    setStatus(text) {
        return this.playbackOrRecord('setStatus', () => this.delegate.setStatus(text));
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
            await this.io.notify("Since you’re in an eviction, it’s important to try to get legal help right away. " +
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
                await this.io.notify("Um, we really need to request your rental history to proceed.");
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
            await this.io.notify(`Alas, we will ask again in ${RENTAL_HISTORY_FOLLOWUP_DAYS} days.`);
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
            await this.io.setStatus('Requesting your rental history...');
            await util_1.sleep(3000);
            await this.io.notify(`Rental history requested! We'll ask if you've received it in ` +
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
function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
exports.sleep = sleep;


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
/**
 * A QuestionInput wraps a Question in an HTML element with an area
 * for a label, an input field tailored to the type of question
 * being asked, and an error message area.
 */
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
    /**
     * Ask for the underlying Question's current answer, if
     * it has a valid one. If it doesn't, show the error to
     * the user in the error area and return null.
     */
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
            throw new interview_io_1.IOCancellationError(this);
        }
        return this.root;
    }
    async ask(question) {
        return (await this.askMany({ question })).question;
    }
    /**
     * This gathers one or more questions to ask and embeds them
     * in a <form> element. It automatically takes care of
     * showing validation errors to the user and doesn't return
     * until all questions have been given a valid answer by
     * the user.
     *
     * @param questions The questions to ask.
     */
    async askMany(questions) {
        const form = document.createElement('form');
        const questionInputs = {};
        let foundFirstQuestion = false;
        this.ensureRoot().appendChild(form);
        await this.setStatus('');
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
    async notify(text) {
        await this.setStatus('');
        this.emit('title', text);
        await this.modalBuilder.createAndOpen(text);
    }
    async setStatus(text, options = { showThrobber: true }) {
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
const interview_io_1 = __webpack_require__(/*! ../interview-io */ "./lib/interview-io.ts");
class ModalBuilder {
    constructor(template) {
        this.template = template;
        this.modal = null;
        this.modalResolves = [];
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
        return new Promise((resolve, reject) => {
            if (this.isShutDown) {
                throw new interview_io_1.IOCancellationError(this);
            }
            this.modalResolves.push({ resolve, reject });
            if (this.modal) {
                this.modal.addText(text);
            }
            else {
                this.modal = this.create(text);
                this.modal.on('close', () => {
                    this.modal = null;
                    if (this.isShutDown) {
                        this.modalResolves.forEach(mr => {
                            mr.reject(new interview_io_1.IOCancellationError(this));
                        });
                    }
                    else {
                        this.modalResolves.forEach(mr => mr.resolve());
                    }
                    this.modalResolves = [];
                });
                this.modal.open();
            }
        });
    }
    shutdown() {
        this.isShutDown = true;
        if (this.modal) {
            this.modal.close();
        }
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
const interview_io_1 = __webpack_require__(/*! ../lib/interview-io */ "./lib/interview-io.ts");
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
        if ((type === 'ask' || type === 'askMany' || type === 'notify') && io === myIo) {
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
    interview.execute(serializer.get().tenant).then(async (tenant) => {
        const followupCount = interview.getFollowUps(tenant).length;
        const status = followupCount ?
            `No more questions for now, but ${followupCount} followup(s) remain.` :
            `Interview complete, no more followups to process.`;
        await myIo.setStatus(status, { showThrobber: false });
    }).catch((err) => {
        if (err instanceof interview_io_1.IOCancellationError && myIo !== io) {
            // The interview was waiting for some kind of user input or timeout
            // but the user has since navigated away from this interview session,
            // so this exception is to be expected.
            console.groupCollapsed(`${err.constructor.name} received, but expected; ignoring it.`);
            console.log(err);
            console.groupEnd();
            return;
        }
        throw err;
    });
}
window.addEventListener('load', () => {
    restart({ pushState: false });
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbGliL2ludGVydmlldy1pby50cyIsIndlYnBhY2s6Ly8vLi9saWIvaW50ZXJ2aWV3LnRzIiwid2VicGFjazovLy8uL2xpYi9xdWVzdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9saWIvcmVjb3JkYWJsZS1pby50cyIsIndlYnBhY2s6Ly8vLi9saWIvdGVuYW50LWludGVydmlldy50cyIsIndlYnBhY2s6Ly8vLi9saWIvdGVuYW50LnRzIiwid2VicGFjazovLy8uL2xpYi91dGlsLnRzIiwid2VicGFjazovLy8uL2xpYi93ZWIvZGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL2lvLnRzIiwid2VicGFjazovLy8uL2xpYi93ZWIvbW9kYWwudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi9tdWx0aS1jaG9pY2UudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi9waG90by50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL3NlcmlhbGl6ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi90aHJvYmJlci50cyIsIndlYnBhY2s6Ly8vLi9saWIvd2ViL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL3dlYi95ZXMtbm8udHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vd2ViL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFF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LFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDL0QsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDNUQsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUM7WUFDNUIsa0NBQWtDLGFBQWEsc0JBQXNCLENBQUMsQ0FBQztZQUN2RSxtREFBbUQsQ0FBQztRQUN0RCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDZixJQUFJLEdBQUcsWUFBWSxrQ0FBbUIsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO1lBQ3JELG1FQUFtRTtZQUNuRSxxRUFBcUU7WUFDckUsdUNBQXVDO1lBQ3ZDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksdUNBQXVDLENBQUMsQ0FBQztZQUN2RixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixPQUFPO1NBQ1I7UUFDRCxNQUFNLEdBQUcsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE9BQU8sQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vd2ViL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHtcbiAgUXVlc3Rpb24sXG4gIERhdGVRdWVzdGlvbixcbiAgTXVsdGlDaG9pY2VBbnN3ZXIsXG4gIE11bHRpQ2hvaWNlUXVlc3Rpb24sXG4gIFllc05vUXVlc3Rpb24sXG4gIE5vbkJsYW5rUXVlc3Rpb25cbn0gZnJvbSAnLi9xdWVzdGlvbic7XG5cbmltcG9ydCB7IFBob3RvIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogVGhpcyBpcyBhIG1hcHBlZCB0eXBlIFsxXSBjb25zaXN0aW5nIG9mIHByb3BlcnRpZXMgdGhhdCBjb25zaXN0XG4gKiBvZiBxdWVzdGlvbnMgd2hvc2UgYW5zd2VycyBtYXAgdG8gdGhlIG9yaWdpbmFsIHByb3BlcnR5IHR5cGVzLlxuICogXG4gKiBbMV0gaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYWR2YW5jZWQtdHlwZXMuaHRtbCNtYXBwZWQtdHlwZXNcbiAqL1xuZXhwb3J0IHR5cGUgUXVlc3Rpb25zRm9yPFQ+ID0ge1xuICBbUCBpbiBrZXlvZiBUXTogUXVlc3Rpb248VFtQXT47XG59O1xuXG4vKiogXG4gKiBUaGlzIGlzIGFueSBpbnB1dC9vdXRwdXQgbWVjaGFuaXNtIGJ5IHdoaWNoIHRoZSBpbnRlcnZpZXcgY29tbXVuaWNhdGVzIHdpdGhcbiAqIHRoZSB1c2VyLlxuICpcbiAqIFRoaXMgaW50ZXJmYWNlIGhhcyBiZWVuIGRlc2lnbmVkIHRvIGNvbmR1Y3QgaW50ZXJ2aWV3cyB1c2luZyBtdWx0aXBsZVxuICogY29tbXVuaWNhdGlvbiBtZWRpYSAodm9pY2UsIFNNUywgd2ViLCBldGMpLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW50ZXJ2aWV3SU8gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKiogXG4gICAqIEFzayBhIHF1ZXN0aW9uIG9mIHRoZSB1c2VyLiBJZiB0aGUgdXNlciBwcm92aWRlcyBpbnZhbGlkIGlucHV0LCBrZWVwIGFza2luZy5cbiAgICogQHBhcmFtIHF1ZXN0aW9uIFRoZSBxdWVzdGlvbiB0byBhc2suXG4gICAqL1xuICBhYnN0cmFjdCBhc2s8VD4ocXVlc3Rpb246IFF1ZXN0aW9uPFQ+KTogUHJvbWlzZTxUPjtcblxuICAvKipcbiAgICogQXNrIGEgbnVtYmVyIG9mIHF1ZXN0aW9ucyBvZiB0aGUgdXNlci4gU29tZSB1c2VyIGludGVyZmFjZXMsXG4gICAqIHN1Y2ggYXMgc2NyZWVucywgbWF5IHByZXNlbnQgdGhlIHF1ZXN0aW9ucyBhcyBhIHNpbmdsZSBmb3JtLlxuICAgKiBcbiAgICogQHBhcmFtIHF1ZXN0aW9ucyBBIG1hcHBpbmcgZnJvbSBzdHJpbmcga2V5cyB0byBxdWVzdGlvbnMuIFRoZVxuICAgKiAgIHJldHVybiB2YWx1ZSB3aWxsIGNvbnRhaW4gdGhlIGFuc3dlcnMsIG1hcHBlZCB1c2luZyB0aGUgc2FtZSBrZXlzLlxuICAgKi9cbiAgYWJzdHJhY3QgYXNrTWFueTxUPihxdWVzdGlvbnM6IFF1ZXN0aW9uc0ZvcjxUPik6IFByb21pc2U8VD47XG5cbiAgLyoqXG4gICAqIE5vdGlmeSB0aGUgdXNlciB3aXRoIGltcG9ydGFudCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGFic3RyYWN0IG5vdGlmeSh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgc3RhdHVzLCBzbyB0aGUgdXNlciBrbm93cyB3aGF0IGlzIGdvaW5nIG9uXG4gICAqIGlmIHRoZXJlIGFyZSBhbnkgZGVsYXlzLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0U3RhdHVzKHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHF1ZXN0aW9uIHRoYXQgYXNrcyBmb3IgYSBwaG90by5cbiAgICovXG4gIGFic3RyYWN0IGNyZWF0ZVBob3RvUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248UGhvdG8+O1xuXG4gIGNyZWF0ZURhdGVRdWVzdGlvbih0ZXh0OiBzdHJpbmcpOiBRdWVzdGlvbjxEYXRlPiB7XG4gICAgcmV0dXJuIG5ldyBEYXRlUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVNdWx0aUNob2ljZVF1ZXN0aW9uPFQ+KHRleHQ6IHN0cmluZywgYW5zd2VyczogTXVsdGlDaG9pY2VBbnN3ZXI8VD5bXSk6IFF1ZXN0aW9uPFQ+IHtcbiAgICByZXR1cm4gbmV3IE11bHRpQ2hvaWNlUXVlc3Rpb24odGV4dCwgYW5zd2Vycyk7XG4gIH1cblxuICBjcmVhdGVZZXNOb1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFllc05vUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVOb25CbGFua1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgTm9uQmxhbmtRdWVzdGlvbih0ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgRXJyb3Igc3ViY2xhc3Mgc2hvdWxkIGJlIHVzZWQgd2hlbiBhbnkgSW50ZXJ2aWV3SU8tcmVsYXRlZFxuICogZnVuY3Rpb25hbGl0eSBmYWlscyBiZWNhdXNlIHRoZSBJTyB3YXMgc2h1dGRvd24gKGUuZy4gaWYgdGhlIFVJXG4gKiBpcyB3ZWItYmFzZWQgYW5kIHRoZSB1c2VyIG5hdmlnYXRlZCBzb21ld2hlcmUgZWxzZSkuXG4gKi9cbmV4cG9ydCBjbGFzcyBJT0NhbmNlbGxhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmd8T2JqZWN0KSB7XG4gICAgaWYgKHR5cGVvZihtZXNzYWdlKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHN1cGVyKGAke21lc3NhZ2UuY29uc3RydWN0b3IubmFtZX0gaGFzIHNodXQgZG93bmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCB7IERhdGVTdHJpbmcgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgSW50ZXJ2aWV3SU8gfSBmcm9tICcuL2ludGVydmlldy1pbyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJ2aWV3T3B0aW9uczxTPiB7XG4gIC8qKiBUaGUgaW5wdXQvb3V0cHV0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgdXNlci4gKi9cbiAgaW86IEludGVydmlld0lPO1xuXG4gIC8qKiBUaGUgY3VycmVudCBkYXRlLiAqL1xuICBub3c/OiBEYXRlO1xufVxuXG4vKipcbiAqIEEgc2NoZWR1bGVkIGZvbGxvdy11cCBwb3J0aW9uIG9mIGFuIGludGVydmlldywgcGFyYW1ldGVyaXplZCBieVxuICogdGhlIHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcuIEZvciBleGFtcGxlLCBpZiB0aGVcbiAqIGludGVydmlldyBhc2tzIHRoZSB1c2VyIHRvIGRvIHNvbWV0aGluZyBpbiB0aGUgbmV4dCB3ZWVrLCBpdFxuICogbWlnaHQgc2NoZWR1bGUgYSBmb2xsb3ctdXAgZm9yIGEgd2VlayBsYXRlciB0byBhc2sgdGhlIHVzZXJcbiAqIGlmIHRoZXkndmUgZG9uZSBpdCB5ZXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRm9sbG93VXA8Uz4ge1xuICAvKiogVGhlIHNjaGVkdWxlZCBkYXRlIG9mIHRoZSBmb2xsb3ctdXAuICovXG4gIGRhdGU6IERhdGVTdHJpbmc7XG5cbiAgLyoqIFxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZm9sbG93LXVwLiBBdCB0aGUgdGltZSBvZiB0aGlzIHdyaXRpbmcsIHRoaXMgaXNuJ3RcbiAgICogYWN0dWFsbHkgdXNlZCBhbnl3aGVyZSwgYnV0IGV2ZW50dWFsbHkgaXQgbWlnaHQgYmUuXG4gICAqL1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgdGhlIGZvbGxvdy11cCBhY3Rpb24uIFRoaXMgc2hvdWxkIGFscmVhZHkgYmUgYm91bmQgdG8gYVxuICAgKiBzcGVjaWZpYyBpbnRlcnZpZXcgc3RhdGUgYnkgdGhlIGNvZGUgdGhhdCBjcmVhdGVkIHRoZSBmb2xsb3ctdXAuXG4gICAqL1xuICBleGVjdXRlOiAoKSA9PiBQcm9taXNlPFM+O1xufVxuXG4vKipcbiAqIFRoaXMgcmVwcmVzZW50cyBhIHNlcmllcyBvZiBxdWVzdGlvbnMgZm9yIGEgdXNlciwgcGFyYW1ldGVyaXplZCBieVxuICogYSB0eXBlIHRoYXQgcmVwcmVzZW50cyB0aGUgc3RhdGUgb2YgdGhlIGludGVydmlldyAoZS5nLiwgdGhlIGFuc3dlcnNcbiAqIHRvIHRoZSBxdWVzdGlvbnMgdGhlIHVzZXIgaGFzIGJlZW4gYXNrZWQpLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW50ZXJ2aWV3PFM+IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgcmVhZG9ubHkgbm93OiBEYXRlO1xuICByZWFkb25seSBpbzogSW50ZXJ2aWV3SU87XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogSW50ZXJ2aWV3T3B0aW9uczxTPikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5ub3cgPSBvcHRpb25zLm5vdyB8fCBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuaW8gPSBvcHRpb25zLmlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIGNvcmUgYWJzdHJhY3QgbWV0aG9kIHRoYXQgc3ViY2xhc3NlcyBtdXN0IGltcGxlbWVudC5cbiAgICogR2l2ZW4gYSBjdXJyZW50IHN0YXRlLCBpdCBtdXN0IGFzayBhbnkgcmVxdWlyZWQgcXVlc3Rpb25zIGFuZFxuICAgKiByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVwcmVzZW50cyB0aGUgbmV3IHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcuXG4gICAqIFxuICAgKiBOb3RlIHRoYXQgdGhlIHN0YXRlIGlzIGltbXV0YWJsZSwgc28gdGhlIG1ldGhvZCBzaG91bGQgYWx3YXlzXG4gICAqIGNyZWF0ZSBhIG5ldyBzdGF0ZSBvYmplY3QtLXVubGVzcyB0aGUgaW50ZXJ2aWV3IGlzIG92ZXIsIGluXG4gICAqIHdoaWNoIGNhc2UgaXQgc2hvdWxkIGp1c3QgcmV0dXJuIHRoZSB1bmNoYW5nZWQgc3RhdGUgaXQgd2FzXG4gICAqIHBhc3NlZCBpbi5cbiAgICogXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3LlxuICAgKi9cbiAgYWJzdHJhY3QgYXN5bmMgYXNrTmV4dChzdGF0ZTogUyk6IFByb21pc2U8Uz47XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgYW4gb3B0aW9uYWwgbWV0aG9kIHRoYXQgcnVucyB0aGUgbmV4dCBpcnJldmVyc2libGUgdGFzayB0aGF0XG4gICAqIHRoZSBpbnRlcnZpZXcgaXMgY2FwYWJsZSBvZiB1bmRlcnRha2luZyAoZS5nLiBzZW5kaW5nIGFuIGVtYWlsIG9yXG4gICAqIHJlYWwtd29ybGQgbGV0dGVyLCBmaWxpbmcgYSBjb3VydCBjYXNlLCBldGMpLlxuICAgKlxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGludGVydmlldy5cbiAgICovXG4gIGFzeW5jIHJ1bk5leHRUYXNrKHN0YXRlOiBTKTogUHJvbWlzZTxTPiB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgYW4gb3B0aW9uYWwgbWV0aG9kIHRoYXQgcmV0dXJucyBhbGwgdGhlIGZvbGxvdy11cHNcbiAgICogZm9yIHRoZSBpbnRlcnZpZXcsIGdpdmVuIGl0cyBjdXJyZW50IHN0YXRlLlxuICAgKiBcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBpbnRlcnZpZXcuXG4gICAqL1xuICBnZXRGb2xsb3dVcHMoc3RhdGU6IFMpOiBGb2xsb3dVcDxTPltdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSB0aGUgbmV4dCB2YWxpZCBmb2xsb3ctdXAsIGlmIGFueS4gSWYgbm8gdmFsaWRcbiAgICogZm9sbG93LXVwcyBhcmUgYXZhaWxhYmxlLCB0aGUgb3JpZ2luYWwgc3RhdGUgaXMgcmV0dXJuZWQuXG4gICAqIFxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGludGVydmlldy5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgZXhlY3V0ZU5leHRGb2xsb3dVcChzdGF0ZTogUyk6IFByb21pc2U8Uz4ge1xuICAgIGZvciAobGV0IGZvbGxvd1VwIG9mIHRoaXMuZ2V0Rm9sbG93VXBzKHN0YXRlKSkge1xuICAgICAgaWYgKHRoaXMubm93ID49IG5ldyBEYXRlKGZvbGxvd1VwLmRhdGUpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBmb2xsb3dVcC5leGVjdXRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIHRoZSBpbnRlcnZpZXcsIGFza2luZyB0aGUgdXNlciBxdWVzdGlvbnMgdW50aWwgdGhleVxuICAgKiBhcmUgZXhoYXVzdGVkLiBSZXR1cm5zIHRoZSBmaW5hbCBzdGF0ZSBvZiB0aGUgaW50ZXJ2aWV3LlxuICAgKiBcbiAgICogQHBhcmFtIGluaXRpYWxTdGF0ZSBcbiAgICovXG4gIGFzeW5jIGV4ZWN1dGUoaW5pdGlhbFN0YXRlOiBTKTogUHJvbWlzZTxTPiB7XG4gICAgbGV0IHN0YXRlID0gaW5pdGlhbFN0YXRlO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBuZXh0U3RhdGUgPSBhd2FpdCB0aGlzLmFza05leHQoc3RhdGUpO1xuICAgICAgaWYgKG5leHRTdGF0ZSA9PT0gc3RhdGUpIHtcbiAgICAgICAgbmV4dFN0YXRlID0gYXdhaXQgdGhpcy5leGVjdXRlTmV4dEZvbGxvd1VwKHN0YXRlKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0U3RhdGUgPT09IHN0YXRlKSB7XG4gICAgICAgIG5leHRTdGF0ZSA9IGF3YWl0IHRoaXMucnVuTmV4dFRhc2soc3RhdGUpO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRTdGF0ZSA9PT0gc3RhdGUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHN0YXRlLCBuZXh0U3RhdGUpO1xuICAgICAgc3RhdGUgPSBuZXh0U3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJ2aWV3PFM+IHtcbiAgZW1pdChldmVudDogJ2NoYW5nZScsIHByZXZTdGF0ZTogUywgbmV4dFN0YXRlOiBTKTogYm9vbGVhbjtcbiAgb24oZXZlbnQ6ICdjaGFuZ2UnLCBsaXN0ZW5lcjogKHByZXZTdGF0ZTogUywgbmV4dFN0YXRlOiBTKSA9PiB2b2lkKTogdGhpcztcbn1cbiIsIi8qKiBcbiAqIFJlcHJlc2VudHMgYSB2YWxpZGF0aW9uIGVycm9yIGZvciBhIHF1ZXN0aW9uLCBlLmcuIHdoZW4gYSB1c2VyXG4gKiBwcm92aWRlcyBhbiBpbnZhbGlkIHJlc3BvbnNlLlxuICogXG4gKiBOb3RlIHRoYXQgdGhpcyBkb2Vzbid0IGV4dGVuZCB0aGUgc3RhbmRhcmQgRXJyb3IgY2xhc3MsXG4gKiBiZWNhdXNlIGl0J3Mgbm90IGFjdHVhbGx5IGRlc2lnbmVkIHRvIGJlIHRocm93bjogdGhlIHJhdGlvbmFsZVxuICogaXMgdGhhdCB2YWxpZGF0aW9uIGVycm9ycyBhcmUgYSBub3JtYWwgb2NjdXJyZW5jZSBhbmQgb3VyXG4gKiBjb2RlIHNob3VsZCBjaGVjayBmb3IgdGhlbSBhbGwgdGhlIHRpbWUsIHJhdGhlciB0aGFuIHRocm93aW5nXG4gKiB0aGVtIGFuZCBwb3RlbnRpYWxseSBoYXZpbmcgdGhlbSBnbyB1bmNhdWdodC5cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25FcnJvciB7XG4gIC8qKlxuICAgKiBUaGUgaHVtYW4tcmVhZGFibGUgdGV4dCBleHBsYWluaW5nIHRoZSBlcnJvci4gSXQgd2lsbFxuICAgKiBiZSBzaG93biB0byB0aGUgdXNlci5cbiAgICovXG4gIG1lc3NhZ2U6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHF1ZXN0aW9uIGluIGFuIGludGVydmlldywgcGFybWV0ZXJpemVkIGJ5XG4gKiB0aGUgdHlwZSBvZiBkYXRhIHRoYXQgYSB2YWxpZCBhbnN3ZXIgcmVwcmVzZW50cy5cbiAqIFxuICogRm9yIGV4YW1wbGUsIGEgcXVlc3Rpb24gbGlrZSBcIkhvdyBvbGQgYXJlIHlvdT9cIiBtaWdodFxuICogYmUgYSBRdWVzdGlvbjxudW1iZXI+LCB3aGlsZSBcIkRvIHlvdSBsaWtlIHNhbGFkP1wiIG1pZ2h0XG4gKiBiZSBhIFF1ZXN0aW9uPGJvb2xlYW4+LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUXVlc3Rpb248VD4ge1xuICAvKiogVGhlIHRleHQgb2YgdGhlIHF1ZXN0aW9uLCBlLmcuIFwiSG93IGFyZSB5b3U/XCIuICovXG4gIGFic3RyYWN0IGdldCB0ZXh0KCk6IHN0cmluZztcblxuICAvKipcbiAgICogUHJvY2VzcyBhIHJlc3BvbnNlIGVudGVyZWQgYnkgdGhlIHVzZXIgYW5kIHJldHVybiBlaXRoZXJcbiAgICogdGhlIGRhdGEgaXQgcmVwcmVzZW50cywgb3IgYW4gZXJyb3IgZXhwbGFpbmluZyB3aHkgdGhlXG4gICAqIHJlc3BvbnNlIGlzIGludmFsaWQuXG4gICAqIFxuICAgKiBAcGFyYW0gcmVzcG9uc2UgQSByYXcgcmVzcG9uc2UgZW50ZXJlZCBieSB0aGUgdXNlci5cbiAgICovXG4gIGFic3RyYWN0IHByb2Nlc3NSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTxUfFZhbGlkYXRpb25FcnJvcj47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHZhbGlkIGFuc3dlciB0byBhIG11bHRpcGxlLWNob2ljZSBxdWVzdGlvbi5cbiAqIFRoZSBmaXJzdCBtZW1iZXIgcmVwcmVzZW50cyB0aGUgYWN0dWFsIGRhdGEgdmFsdWUsIHdoaWxlXG4gKiB0aGUgc2Vjb25kIHJlcHJlc250cyB0aGUgaHVtYW4tcmVhZGFibGUgdGV4dCBmb3IgaXQuXG4gKi9cbmV4cG9ydCB0eXBlIE11bHRpQ2hvaWNlQW5zd2VyPFQ+ID0gW1QsIHN0cmluZ107XG5cbi8qKlxuICogQSBtdWx0aXBsZS1jaG9pY2UgcXVlc3Rpb24uIEFuc3dlcnMgYXJlIGF1dG9tYXRpY2FsbHlcbiAqIG51bWJlcmVkLlxuICovXG5leHBvcnQgY2xhc3MgTXVsdGlDaG9pY2VRdWVzdGlvbjxUPiBleHRlbmRzIFF1ZXN0aW9uPFQ+IHtcbiAgLyoqIFRoZSBxdWVzdGlvbiwgZS5nLiBcIldoYXQga2luZCBvZiBsZWFzZSBkbyB5b3UgaGF2ZT9cIi4gKi9cbiAgcXVlc3Rpb246IHN0cmluZztcblxuICAvKiogUG90ZW50aWFsIGFuc3dlcnMgdG8gdGhlIHF1ZXN0aW9uLCB3aGljaCB0aGUgdXNlciBtdXN0IGNob29zZSBmcm9tLiAqL1xuICBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdO1xuXG4gIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcnM6IE11bHRpQ2hvaWNlQW5zd2VyPFQ+W10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICB0aGlzLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICB9XG5cbiAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJ0cyA9IFt0aGlzLnF1ZXN0aW9uLCAnJ107XG5cbiAgICB0aGlzLmFuc3dlcnMuZm9yRWFjaCgoW18sIGxhYmVsXSwgaSkgPT4ge1xuICAgICAgcGFydHMucHVzaChgJHtpICsgMX0gLSAke2xhYmVsfWApO1xuICAgIH0pO1xuXG4gICAgcGFydHMucHVzaCgnJywgJ0VudGVyIGEgbnVtYmVyIGZyb20gdGhlIGxpc3QgYWJvdmU6Jyk7XG5cbiAgICByZXR1cm4gcGFydHMuam9pbignXFxuJyk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzUmVzcG9uc2UocmVzcG9uc2U6IHN0cmluZyk6IFByb21pc2U8VHxWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICBjb25zdCByZXNwb25zZUludCA9IHBhcnNlSW50KHJlc3BvbnNlLCAxMCk7XG4gICAgY29uc3QgYW5zd2VyID0gdGhpcy5hbnN3ZXJzW3Jlc3BvbnNlSW50IC0gMV07XG5cbiAgICBpZiAoYW5zd2VyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBuZXcgVmFsaWRhdGlvbkVycm9yKCdQbGVhc2UgY2hvb3NlIGEgdmFsaWQgbnVtYmVyLicpO1xuICAgIH1cblxuICAgIHJldHVybiBhbnN3ZXJbMF07XG4gIH1cbn1cblxuLyoqXG4gKiBBIGJhc2ljIHF1ZXN0aW9uIHRoYXQgYWNjZXB0cyBhbnkga2luZCBvZiBub24tYmxhbmsgaW5wdXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb25CbGFua1F1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb248c3RyaW5nPiB7XG4gIC8qKiBUaGUgdGV4dCBvZiB0aGUgcXVlc3Rpb24sIGUuZy4gXCJXaGF0IGlzIHlvdXIgbmFtZT9cIi4gKi9cbiAgdGV4dDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmd8VmFsaWRhdGlvbkVycm9yPiB7XG4gICAgaWYgKCFyZXNwb25zZS50cmltKCkpIHtcbiAgICAgIHJldHVybiBuZXcgVmFsaWRhdGlvbkVycm9yKCdZb3VyIHJlc3BvbnNlIGNhbm5vdCBiZSBibGFuayEnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG59XG5cbi8qKlxuICogQSBxdWVzdGlvbiB3aG9zZSBhbnN3ZXIgbXVzdCBhbHdheXMgYmUgXCJ5ZXNcIiBvciBcIm5vXCIuXG4gKi9cbmV4cG9ydCBjbGFzcyBZZXNOb1F1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb248Ym9vbGVhbj4ge1xuICAvKiogVGhlIHRleHQgb2YgdGhlIHF1ZXN0aW9uLCBlLmcuIFwiQXJlIHlvdSBvaz9cIi4gKi9cbiAgdGV4dDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFufFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIGNvbnN0IFlFU19SRUdFWCA9IC9eXFxzKnkvaTtcbiAgICBjb25zdCBOT19SRUdFWCA9IC9eXFxzKm4vaTtcblxuICAgIGlmIChZRVNfUkVHRVgudGVzdChyZXNwb25zZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoTk9fUkVHRVgudGVzdChyZXNwb25zZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBhbnN3ZXIgd2l0aCBcInllc1wiIG9yIFwibm9cIi4nKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgcXVlc3Rpb24gdGhhdCBhc2tzIGZvciBhIGRhdGUgKG5vdCBpbmNsdWRpbmcgdGhlIHRpbWUpLlxuICovXG5leHBvcnQgY2xhc3MgRGF0ZVF1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb248RGF0ZT4ge1xuICAvKiogVGhlIHRleHQgb2YgdGhlIHF1ZXN0aW9uLCBlLmcuIFwiV2hlbiBkaWQgeW91IHJlY2VpdmUgdGhlIGxldHRlcj9cIi4gKi9cbiAgdGV4dDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTxEYXRlfFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIGNvbnN0IERBVEVfUkVHRVggPSAvXlxcZFxcZFxcZFxcZC1cXGRcXGQtXFxkXFxkJC87XG4gICAgaWYgKERBVEVfUkVHRVgudGVzdChyZXNwb25zZSkpIHtcbiAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShyZXNwb25zZSk7XG4gICAgICBpZiAoIWlzTmFOKGRhdGUuZ2V0VGltZSgpKSkge1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgZGF0ZSBpbiBZWVlZLU1NLUREIGZvcm1hdC4nKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW50ZXJ2aWV3SU8sIFF1ZXN0aW9uc0ZvciB9IGZyb20gXCIuL2ludGVydmlldy1pb1wiO1xuaW1wb3J0IHsgUXVlc3Rpb24sIE11bHRpQ2hvaWNlQW5zd2VyIH0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcbmltcG9ydCB7IFBob3RvIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5leHBvcnQgdHlwZSBJb0FjdGlvblR5cGUgPSAnYXNrJ3wnYXNrTWFueSd8J25vdGlmeSd8J3NldFN0YXR1cyc7XG5cbmV4cG9ydCB0eXBlIFJlY29yZGVkQWN0aW9uID0gW0lvQWN0aW9uVHlwZSwgYW55XTtcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNhbiBiZSB1c2VkIHRvIHJlY29yZCBpbnRlcnZpZXcgcGhhc2VzIHRoYXQgYXJlXG4gKiBvbmx5IHBhcnRpYWxseSBjb21wbGV0ZWQsIGZvciBwbGF5YmFjayBhdCBhIGxhdGVyIHRpbWUuIEl0XG4gKiBjYW4gYmUgdXNlZnVsIHRvIGUuZy4gcmVzdW1lIGEgcGFydGx5LWNvbXBsZXRlZCBzZXF1ZW5jZSBvZlxuICogaW50ZXJ2aWV3IHF1ZXN0aW9ucyB0aGF0IG9ubHkgcmV0dXJuIGEgZmluYWwgc3RhdGVcbiAqIGNoYW5nZSBhZnRlciB0aGUgZnVsbCBzZXF1ZW5jZSBpcyBhbnN3ZXJlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZGFibGVJbnRlcnZpZXdJTyBleHRlbmRzIEludGVydmlld0lPIHtcbiAgcmVhZG9ubHkgbmV3UmVjb3JkaW5nOiBSZWNvcmRlZEFjdGlvbltdO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGRlbGVnYXRlOiBJbnRlcnZpZXdJTywgcHJpdmF0ZSByZWFkb25seSByZWNvcmRpbmc6IFJlY29yZGVkQWN0aW9uW10gPSBbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uZXdSZWNvcmRpbmcgPSByZWNvcmRpbmcuc2xpY2UoKTtcbiAgfVxuXG4gIHJlc2V0UmVjb3JkaW5nKCk6IFJlY29yZGVkQWN0aW9uW10ge1xuICAgIHRoaXMucmVjb3JkaW5nLnNwbGljZSgwKTtcbiAgICB0aGlzLm5ld1JlY29yZGluZy5zcGxpY2UoMCk7XG4gICAgcmV0dXJuIHRoaXMubmV3UmVjb3JkaW5nO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwbGF5YmFja09yUmVjb3JkPFQ+KHR5cGU6IElvQWN0aW9uVHlwZSwgcmVjb3JkOiAoKSA9PiBQcm9taXNlPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5yZWNvcmRpbmcuc2hpZnQoKTtcbiAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IFthY3R1YWxUeXBlLCB2YWx1ZV0gPSByZXN1bHQ7XG4gICAgICBpZiAoYWN0dWFsVHlwZSAhPT0gdHlwZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHJlY29yZGVkIGFjdGlvbiBvZiB0eXBlICR7dHlwZX0gYnV0IGdvdCAke2FjdHVhbFR5cGV9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdiZWdpbi1yZWNvcmRpbmctYWN0aW9uJywgdHlwZSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZWNvcmQoKTtcbiAgICAgIHRoaXMubmV3UmVjb3JkaW5nLnB1c2goW3R5cGUsIHJlc3VsdF0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICBhc2s8VD4ocXVlc3Rpb246IFF1ZXN0aW9uPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMucGxheWJhY2tPclJlY29yZCgnYXNrJywgKCkgPT4gdGhpcy5kZWxlZ2F0ZS5hc2socXVlc3Rpb24pKTtcbiAgfVxuXG4gIGFza01hbnk8VD4ocXVlc3Rpb25zOiBRdWVzdGlvbnNGb3I8VD4pOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5wbGF5YmFja09yUmVjb3JkKCdhc2tNYW55JywgKCkgPT4gdGhpcy5kZWxlZ2F0ZS5hc2tNYW55KHF1ZXN0aW9ucykpO1xuICB9XG5cbiAgbm90aWZ5KHRleHQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnBsYXliYWNrT3JSZWNvcmQoJ25vdGlmeScsICgpID0+IHRoaXMuZGVsZWdhdGUubm90aWZ5KHRleHQpKTtcbiAgfVxuXG4gIHNldFN0YXR1cyh0ZXh0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF5YmFja09yUmVjb3JkKCdzZXRTdGF0dXMnLCAoKSA9PiB0aGlzLmRlbGVnYXRlLnNldFN0YXR1cyh0ZXh0KSk7XG4gIH1cblxuICBjcmVhdGVQaG90b1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPFBob3RvPiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuY3JlYXRlUGhvdG9RdWVzdGlvbih0ZXh0KTtcbiAgfVxuXG4gIGNyZWF0ZURhdGVRdWVzdGlvbih0ZXh0OiBzdHJpbmcpOiBRdWVzdGlvbjxEYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuY3JlYXRlRGF0ZVF1ZXN0aW9uKHRleHQpO1xuICB9XG5cbiAgY3JlYXRlTXVsdGlDaG9pY2VRdWVzdGlvbjxUPih0ZXh0OiBzdHJpbmcsIGFuc3dlcnM6IE11bHRpQ2hvaWNlQW5zd2VyPFQ+W10pOiBRdWVzdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuY3JlYXRlTXVsdGlDaG9pY2VRdWVzdGlvbih0ZXh0LCBhbnN3ZXJzKTtcbiAgfVxuXG4gIGNyZWF0ZVllc05vUXVlc3Rpb24odGV4dDogc3RyaW5nKTogUXVlc3Rpb248Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLmNyZWF0ZVllc05vUXVlc3Rpb24odGV4dCk7XG4gIH1cblxuICBjcmVhdGVOb25CbGFua1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLmNyZWF0ZU5vbkJsYW5rUXVlc3Rpb24odGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWNvcmRhYmxlSW50ZXJ2aWV3SU8ge1xuICBvbihldmVudDogJ2JlZ2luLXJlY29yZGluZy1hY3Rpb24nLCBsaXN0ZW5lcjogKHR5cGU6IElvQWN0aW9uVHlwZSkgPT4gdm9pZCk6IHRoaXM7XG4gIGVtaXQoZXZlbnQ6ICdiZWdpbi1yZWNvcmRpbmctYWN0aW9uJywgdHlwZTogSW9BY3Rpb25UeXBlKTogYm9vbGVhbjtcbn1cbiIsImltcG9ydCB7XG4gIFRlbmFudCxcbiAgTGVhc2VUeXBlLFxuICBSZXF1ZXN0ZWRSZW50YWxIaXN0b3J5LFxuICBSZW50YWxIaXN0b3J5XG59IGZyb20gJy4vdGVuYW50JztcblxuaW1wb3J0IHsgSW50ZXJ2aWV3LCBGb2xsb3dVcCB9IGZyb20gJy4vaW50ZXJ2aWV3JztcblxuaW1wb3J0IHsgYWRkRGF5cywgc2xlZXAgfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBSRU5UQUxfSElTVE9SWV9GT0xMT1dVUF9EQVlTID0gNztcblxuZXhwb3J0IGNsYXNzIFRlbmFudEludGVydmlldyBleHRlbmRzIEludGVydmlldzxUZW5hbnQ+IHtcbiAgYXN5bmMgYXNrRm9yTGVhc2VUeXBlKHRlbmFudDogVGVuYW50KTogUHJvbWlzZTxUZW5hbnQ+IHtcbiAgICBjb25zdCBsZWFzZVR5cGUgPSBhd2FpdCB0aGlzLmlvLmFzayh0aGlzLmlvLmNyZWF0ZU11bHRpQ2hvaWNlUXVlc3Rpb24oXG4gICAgICAnV2hhdCBraW5kIG9mIGxlYXNlIGRvIHlvdSBoYXZlPycsXG4gICAgICBbXG4gICAgICAgIFtMZWFzZVR5cGUuTWFya2V0UmF0ZSwgJ01hcmtldCByYXRlJ10sXG4gICAgICAgIFtMZWFzZVR5cGUuUmVudFN0YWJpbGl6ZWQsICdSZW50IHN0YWJpbGl6ZWQnXSxcbiAgICAgICAgW0xlYXNlVHlwZS5OWUNIQSwgJ1B1YmxpYyBob3VzaW5nIChOWUNIQSknXSxcbiAgICAgICAgW0xlYXNlVHlwZS5PdGhlciwgJ090aGVyIChlLmcuIG1vbnRoLXRvLW1vbnRoKSddLFxuICAgICAgICBbTGVhc2VUeXBlLlVua25vd24sICdOb3Qgc3VyZSddLFxuICAgICAgXVxuICAgICkpO1xuXG4gICAgcmV0dXJuIHsuLi50ZW5hbnQsIGxlYXNlVHlwZX07XG4gIH1cblxuICBhc3luYyBhc2tGb3JIb3VzaW5nSXNzdWVzKHRlbmFudDogVGVuYW50KTogUHJvbWlzZTxUZW5hbnQ+IHtcbiAgICBjb25zdCBob3VzaW5nSXNzdWVzID0gYXdhaXQgdGhpcy5pby5hc2tNYW55KHtcbiAgICAgIG5lZWRzUmVwYWlyczogdGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdEb2VzIHlvdXIgYXBhcnRtZW50IG5lZWQgcmVwYWlycz8nKSxcbiAgICAgIGlzSGFyYXNzZWQ6IHRoaXMuaW8uY3JlYXRlWWVzTm9RdWVzdGlvbignQXJlIHlvdSBiZWluZyBoYXJhc3NlZCBieSB5b3VyIGxhbmRsb3JkPycpLFxuICAgICAgaXNGYWNpbmdFdmljdGlvbjogdGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdBcmUgeW91IGZhY2luZyBldmljdGlvbj8nKSxcbiAgICAgIGhhc0xlYXNlSXNzdWVzOiB0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0FyZSB5b3UgaGF2aW5nIGlzc3VlcyB3aXRoIHlvdXIgbGVhc2U/JyksXG4gICAgICBoYXNOb1NlcnZpY2VzOiB0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0FyZSB5b3UgbGl2aW5nIHdpdGhvdXQgZXNzZW50aWFsIHNlcnZpY2VzLCBsaWtlIGhlYXQvZ2FzL2hvdCB3YXRlcj8nKSxcbiAgICAgIGhhc090aGVyOiB0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0RvIHlvdSBoYXZlIGFueSBvdGhlciBhcGFydG1lbnQgaXNzdWVzPycpLFxuICAgIH0pO1xuXG4gICAgaWYgKGhvdXNpbmdJc3N1ZXMuaXNGYWNpbmdFdmljdGlvbikge1xuICAgICAgYXdhaXQgdGhpcy5pby5ub3RpZnkoXG4gICAgICAgIFwiU2luY2UgeW914oCZcmUgaW4gYW4gZXZpY3Rpb24sIGl04oCZcyBpbXBvcnRhbnQgdG8gdHJ5IHRvIGdldCBsZWdhbCBoZWxwIHJpZ2h0IGF3YXkuIFwiICtcbiAgICAgICAgXCJXZeKAmWxsIHBvaW50IHlvdSB0byBhIHJlc291cmNlIHRoYXQgY2FuIGhlbHAgeW91IGZpbmQgYSBsYXd5ZXIgaW4ganVzdCBhIGZldyBtb21lbnRzLlwiXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB7Li4udGVuYW50LCBob3VzaW5nSXNzdWVzfTtcbiAgfVxuXG4gIGFzeW5jIGFza0ZvclJlbnRhbEhpc3RvcnkodGVuYW50OiBUZW5hbnQpOiBQcm9taXNlPFRlbmFudD4ge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBwZXJtaXNzaW9uID0gYXdhaXQgdGhpcy5pby5hc2sodGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdDYW4gd2UgcmVxdWVzdCB5b3VyIHJlbnRhbCBoaXN0b3J5IGZyb20geW91ciBsYW5kbG9yZD8nKSk7XG4gICAgICBpZiAocGVybWlzc2lvbikge1xuICAgICAgICByZXR1cm4geyAuLi50ZW5hbnQsIHJlbnRhbEhpc3Rvcnk6IHsgc3RhdHVzOiAnYWNjZXB0ZWQnIH0gfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHRoaXMuaW8ubm90aWZ5KFwiVW0sIHdlIHJlYWxseSBuZWVkIHRvIHJlcXVlc3QgeW91ciByZW50YWwgaGlzdG9yeSB0byBwcm9jZWVkLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBmb2xsb3d1cFJlbnRhbEhpc3RvcnkocmVudGFsSGlzdG9yeTogUmVxdWVzdGVkUmVudGFsSGlzdG9yeSk6IFByb21pc2U8UmVudGFsSGlzdG9yeT4ge1xuICAgIGNvbnN0IHdhc1JlY2VpdmVkID0gYXdhaXQgdGhpcy5pby5hc2sodGhpcy5pby5jcmVhdGVZZXNOb1F1ZXN0aW9uKCdIYXZlIHlvdSByZWNlaXZlZCB5b3VyIHJlbnRhbCBoaXN0b3J5IHlldD8nKSk7XG5cbiAgICBpZiAod2FzUmVjZWl2ZWQpIHtcbiAgICAgIGNvbnN0IGRldGFpbHMgPSBhd2FpdCB0aGlzLmlvLmFza01hbnkoe1xuICAgICAgICBkYXRlUmVjZWl2ZWQ6IHRoaXMuaW8uY3JlYXRlRGF0ZVF1ZXN0aW9uKCdXaGVuIGRpZCB5b3UgcmVjZWl2ZSB5b3VyIHJlbnRhbCBoaXN0b3J5PycpLFxuICAgICAgICBpc1JlbnRTdGFiaWxpemVkOiB0aGlzLmlvLmNyZWF0ZVllc05vUXVlc3Rpb24oJ0FyZSB5b3UgcmVudCBzdGFiaWxpemVkPycpLFxuICAgICAgICBwaG90bzogdGhpcy5pby5jcmVhdGVQaG90b1F1ZXN0aW9uKCdQbGVhc2Ugc3VibWl0IGEgcGhvdG9ncmFwaCBvZiB5b3VyIHJlbnRhbCBoaXN0b3J5LicpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1czogJ3JlY2VpdmVkJyxcbiAgICAgICAgZGF0ZVJlcXVlc3RlZDogcmVudGFsSGlzdG9yeS5kYXRlUmVxdWVzdGVkLFxuICAgICAgICAuLi5kZXRhaWxzXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLmlvLm5vdGlmeShgQWxhcywgd2Ugd2lsbCBhc2sgYWdhaW4gaW4gJHtSRU5UQUxfSElTVE9SWV9GT0xMT1dVUF9EQVlTfSBkYXlzLmApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ucmVudGFsSGlzdG9yeSxcbiAgICAgICAgbmV4dFJlbWluZGVyOiBhZGREYXlzKHRoaXMubm93LCBSRU5UQUxfSElTVE9SWV9GT0xMT1dVUF9EQVlTKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBhc2tOZXh0KHRlbmFudDogVGVuYW50KTogUHJvbWlzZTxUZW5hbnQ+IHtcbiAgICBpZiAoIXRlbmFudC5uYW1lKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50ZW5hbnQsXG4gICAgICAgIG5hbWU6IGF3YWl0IHRoaXMuaW8uYXNrKHRoaXMuaW8uY3JlYXRlTm9uQmxhbmtRdWVzdGlvbignV2hhdCBpcyB5b3VyIG5hbWU/JykpXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghdGVuYW50LmhvdXNpbmdJc3N1ZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmFza0ZvckhvdXNpbmdJc3N1ZXModGVuYW50KTtcbiAgICB9XG5cbiAgICBpZiAoIXRlbmFudC5sZWFzZVR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmFza0ZvckxlYXNlVHlwZSh0ZW5hbnQpO1xuICAgIH1cblxuICAgIGlmICghdGVuYW50LnBob25lTnVtYmVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50ZW5hbnQsXG4gICAgICAgIHBob25lTnVtYmVyOiBhd2FpdCB0aGlzLmlvLmFzayh0aGlzLmlvLmNyZWF0ZU5vbkJsYW5rUXVlc3Rpb24oJ1doYXQgaXMgeW91ciBwaG9uZSBudW1iZXI/JykpXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghdGVuYW50LnJlbnRhbEhpc3RvcnkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFza0ZvclJlbnRhbEhpc3RvcnkodGVuYW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVuYW50O1xuICB9XG5cbiAgYXN5bmMgcnVuTmV4dFRhc2sodGVuYW50OiBUZW5hbnQpOiBQcm9taXNlPFRlbmFudD4ge1xuICAgIGlmICh0ZW5hbnQucmVudGFsSGlzdG9yeSAmJiB0ZW5hbnQucmVudGFsSGlzdG9yeS5zdGF0dXMgPT09ICdhY2NlcHRlZCcpIHtcbiAgICAgIC8vIFRPRE86IEFjdHVhbGx5IHJlcXVlc3QgcmVudGFsIGhpc3RvcnkuXG4gICAgICBhd2FpdCB0aGlzLmlvLnNldFN0YXR1cygnUmVxdWVzdGluZyB5b3VyIHJlbnRhbCBoaXN0b3J5Li4uJyk7XG4gICAgICBhd2FpdCBzbGVlcCgzMDAwKTtcblxuICAgICAgYXdhaXQgdGhpcy5pby5ub3RpZnkoXG4gICAgICAgIGBSZW50YWwgaGlzdG9yeSByZXF1ZXN0ZWQhIFdlJ2xsIGFzayBpZiB5b3UndmUgcmVjZWl2ZWQgaXQgaW4gYCArXG4gICAgICAgIGAke1JFTlRBTF9ISVNUT1JZX0ZPTExPV1VQX0RBWVN9IGRheXMuYFxuICAgICAgKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRlbmFudCxcbiAgICAgICAgcmVudGFsSGlzdG9yeToge1xuICAgICAgICAgIHN0YXR1czogJ3JlcXVlc3RlZCcsXG4gICAgICAgICAgZGF0ZVJlcXVlc3RlZDogdGhpcy5ub3csXG4gICAgICAgICAgbmV4dFJlbWluZGVyOiBhZGREYXlzKHRoaXMubm93LCBSRU5UQUxfSElTVE9SWV9GT0xMT1dVUF9EQVlTKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB0ZW5hbnQ7XG4gIH1cblxuICBnZXRGb2xsb3dVcHModGVuYW50OiBUZW5hbnQpOiBGb2xsb3dVcDxUZW5hbnQ+W10ge1xuICAgIGNvbnN0IGZvbGxvd1VwczogRm9sbG93VXA8VGVuYW50PltdID0gW107XG5cbiAgICBjb25zdCByZW50YWxIaXN0b3J5ID0gdGVuYW50LnJlbnRhbEhpc3Rvcnk7XG4gICAgaWYgKHJlbnRhbEhpc3RvcnkgJiYgcmVudGFsSGlzdG9yeS5zdGF0dXMgPT09ICdyZXF1ZXN0ZWQnKSB7XG4gICAgICBmb2xsb3dVcHMucHVzaCh7XG4gICAgICAgIGRhdGU6IHJlbnRhbEhpc3RvcnkubmV4dFJlbWluZGVyLFxuICAgICAgICBuYW1lOiAnUmVudGFsIGhpc3RvcnkgZm9sbG93LXVwJyxcbiAgICAgICAgZXhlY3V0ZTogYXN5bmMgKCkgPT4gKHtcbiAgICAgICAgICAuLi50ZW5hbnQsXG4gICAgICAgICAgcmVudGFsSGlzdG9yeTogYXdhaXQgdGhpcy5mb2xsb3d1cFJlbnRhbEhpc3RvcnkocmVudGFsSGlzdG9yeSlcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sbG93VXBzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEYXRlU3RyaW5nLCBQaG90byB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBlbnVtIExlYXNlVHlwZSB7XG4gIC8qKiBNYXJrZXQgcmF0ZSBvciBmcmVlIG1hcmtldCBsZWFzZS4gKi9cbiAgTWFya2V0UmF0ZSA9ICdtcicsXG5cbiAgLyoqIFJlbnQgc3RhYmlsaXplZCAob3IgcmVudCBjb250cm9sbGVkKS4gKi9cbiAgUmVudFN0YWJpbGl6ZWQgPSAncnMnLFxuXG4gIC8qKiBQdWJsaWMgaG91c2luZy4gKi9cbiAgTllDSEEgPSAnbnljaGEnLFxuXG4gIC8qKiBPdGhlciBob3VzaW5nIGNhbiBiZSBlLmcuIG1vbnRoIHRvIG1vbnRoIHdpdGhvdXQgYSBsZWFzZSwgY29vcCwgc2hlbHRlciwgc3VibGV0LCBNaXRjaGVsbCBMYW1hLiAqL1xuICBPdGhlciA9ICdvdGhlcicsXG5cbiAgLyoqIFRoZSB0ZW5hbnQgaXMgdW5jZXJ0YWluIG9mIHRoZWlyIGFjdHVhbCBsZWFzZSB0eXBlLiAqL1xuICBVbmtub3duID0gJ3Vua25vd24nLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEhvdXNpbmdJc3N1ZXMge1xuICAvKiogV2hldGhlciB0aGUgdGVuYW50IG5lZWRzIHJlcGFpcnMgaW4gdGhlaXIgYXBhcnRtZW50LiAqL1xuICBuZWVkc1JlcGFpcnM6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRlbmFudCBpcyBiZWluZyBoYXJhc3NlZCBieSB0aGVpciBsYW5kbG9yZC4gKi9cbiAgaXNIYXJhc3NlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgdGVuYW50IGlzIGJlaW5nIGZhY2VkIHdpdGggZXZpY3Rpb24uICovXG4gIGlzRmFjaW5nRXZpY3Rpb246IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRlbmFudCBpcyBoYXZpbmcgaXNzdWVzIHdpdGggdGhlaXIgbGVhc2UuICovXG4gIGhhc0xlYXNlSXNzdWVzOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZW5hbnQgaXMgbGl2aW5nIHdpdGhvdXQgZXNzZW50aWFsIHNlcnZpY2VzIChoZWF0L2dhcy9ob3Qgd2F0ZXIpLiAqL1xuICBoYXNOb1NlcnZpY2VzOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZW5hbnQgaXMgZmFjaW5nIGFueSBvdGhlciBpc3N1ZXMuICovXG4gIGhhc090aGVyOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY2VwdGVkUmVudGFsSGlzdG9yeSB7XG4gIC8qKlxuICAgKiBUaGUgc3RhdGUgaW5kaWNhdGluZyB0aGF0IHRoZSB1c2VyIGhhcyBnaXZlbiB0aGVpciBwZXJtaXNzaW9uIGZvciB1c1xuICAgKiB0byByZXF1ZXN0IHRoZWlyIHJlbnRhbCBoaXN0b3J5LlxuICAgKi9cbiAgc3RhdHVzOiAnYWNjZXB0ZWQnO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RlZFJlbnRhbEhpc3Rvcnkge1xuICBzdGF0dXM6ICdyZXF1ZXN0ZWQnO1xuXG4gIC8qKiBXaGVuIHRoZSB0ZW5hbnQgcmVxdWVzdGVkIHRoZWlyIHJlbnRhbCBoaXN0b3J5LiAqL1xuICBkYXRlUmVxdWVzdGVkOiBEYXRlU3RyaW5nO1xuXG4gIC8qKiBUaGUgZGF0ZSB3aGVuIHdlJ2xsIG5leHQgYXNrIHRoZSB0ZW5hbnQgaWYgdGhleSd2ZSByZWNlaXZlZCB0aGUgaGlzdG9yeSB5ZXQuICovXG4gIG5leHRSZW1pbmRlcjogRGF0ZVN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWNlaXZlZFJlbnRhbEhpc3Rvcnkge1xuICBzdGF0dXM6ICdyZWNlaXZlZCc7XG5cbiAgZGF0ZVJlcXVlc3RlZDogRGF0ZVN0cmluZztcblxuICAvKiogV2hlbiB0aGUgdGVuYW50IHJlY2VpdmVkIHRoZWlyIHJlbnRhbCBoaXN0b3J5LiAqL1xuICBkYXRlUmVjZWl2ZWQ6IERhdGVTdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJlbnRhbCBoaXN0b3J5IGFzc2VydHMgdGhhdCB0aGUgdGVuYW50J3MgZHdlbGxpbmcgaXMgcmVudCBzdGFiaWxpemVkLiAqL1xuICBpc1JlbnRTdGFiaWxpemVkOiBib29sZWFuO1xuXG4gIC8qKiBUaGUgdXNlcidzIHBob3RvZ3JhcGggb2YgdGhlaXIgcmVudGFsIGhpc3RvcnkuICovXG4gIHBob3RvOiBQaG90bztcbn1cblxuZXhwb3J0IHR5cGUgUmVudGFsSGlzdG9yeSA9IEFjY2VwdGVkUmVudGFsSGlzdG9yeSB8IFJlcXVlc3RlZFJlbnRhbEhpc3RvcnkgfCBSZWNlaXZlZFJlbnRhbEhpc3Rvcnk7XG5cbmludGVyZmFjZSBfVGVuYW50IHtcbiAgLyoqIFRoZSB0ZW5hbnQncyBmdWxsIG5hbWUuICovXG4gIG5hbWU6IHN0cmluZztcblxuICAvKiogVGhlIHRlbmFudCdzIHBob25lIG51bWJlci4gKFRPRE86IGhvdyBzaG91bGQgdGhpcyBiZSBmb3JtYXR0ZWQ/KSAqL1xuICBwaG9uZU51bWJlcjogc3RyaW5nO1xuXG4gIGxlYXNlVHlwZTogTGVhc2VUeXBlO1xuICBob3VzaW5nSXNzdWVzOiBIb3VzaW5nSXNzdWVzO1xuICByZW50YWxIaXN0b3J5OiBSZW50YWxIaXN0b3J5O1xufVxuXG5leHBvcnQgdHlwZSBUZW5hbnQgPSBSZWFkb25seTxQYXJ0aWFsPF9UZW5hbnQ+PjtcbiIsIi8qKlxuICogQSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIGEgZGF0ZSBpbiBJU08gZm9ybWF0LCAqb3IqIGEgbmF0aXZlIERhdGUgKHdoaWNoIGlzIGNvbnZlcnRlZCB0b1xuICogYW4gSVNPIHN0cmluZyB1cG9uIEpTT04gc2VyaWFsaXphdGlvbikuXG4gKi9cbmV4cG9ydCB0eXBlIERhdGVTdHJpbmcgPSBEYXRlfHN0cmluZztcblxuLyoqIEEgcGhvdG8gaXMganVzdCBhIFVSTCB0byBhbiBpbWFnZS4gKi9cbmV4cG9ydCB0eXBlIFBob3RvID0gc3RyaW5nO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzY3NDU1MC8yNDIyMzk4XG5leHBvcnQgZnVuY3Rpb24gYWRkRGF5cyhkYXRlOiBEYXRlU3RyaW5nLCBkYXlzOiBudW1iZXIpOiBEYXRlIHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IERhdGUoZGF0ZSk7XG4gIHJlc3VsdC5zZXREYXRlKHJlc3VsdC5nZXREYXRlKCkgKyBkYXlzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1pbGxpc2Vjb25kczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbWlsbGlzZWNvbmRzKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBEYXRlUXVlc3Rpb24sIFZhbGlkYXRpb25FcnJvciB9IGZyb20gXCIuLi9xdWVzdGlvblwiO1xuaW1wb3J0IHsgV2ViV2lkZ2V0IH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IHdyYXBJbkNvbnRyb2xEaXYsIG1ha2VFbGVtZW50IH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5leHBvcnQgY2xhc3MgV2ViRGF0ZVF1ZXN0aW9uIGV4dGVuZHMgRGF0ZVF1ZXN0aW9uIGltcGxlbWVudHMgV2ViV2lkZ2V0PERhdGU+IHtcbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgdGV4dDogc3RyaW5nKSB7XG4gICAgc3VwZXIodGV4dCk7XG4gICAgdGhpcy5pbnB1dCA9IG1ha2VFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ2RhdGUnLCBjbGFzc2VzOiBbJ2lucHV0J10gfSlcbiAgICB0aGlzLmNvbnRhaW5lciA9IHdyYXBJbkNvbnRyb2xEaXYodGhpcy5pbnB1dCk7XG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgfVxuXG4gIHByb2Nlc3NFbGVtZW50KCkge1xuICAgIGNvbnN0IGlzTW9kZXJuQnJvd3NlciA9ICd2YWx1ZUFzRGF0ZScgaW4gPGFueT50aGlzLmlucHV0O1xuICAgIGlmIChpc01vZGVybkJyb3dzZXIpIHtcbiAgICAgIGlmICghdGhpcy5pbnB1dC52YWx1ZUFzRGF0ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBkYXRlIScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQudmFsdWVBc0RhdGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb2Nlc3NSZXNwb25zZSh0aGlzLmlucHV0LnZhbHVlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW50ZXJ2aWV3SU8sIFF1ZXN0aW9uc0ZvciwgSU9DYW5jZWxsYXRpb25FcnJvciB9IGZyb20gJy4uL2ludGVydmlldy1pbyc7XG5pbXBvcnQgeyBRdWVzdGlvbiwgVmFsaWRhdGlvbkVycm9yLCBNdWx0aUNob2ljZUFuc3dlciB9IGZyb20gJy4uL3F1ZXN0aW9uJztcbmltcG9ydCB7IFBob3RvIH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgeyBXZWJQaG90b1F1ZXN0aW9uIH0gZnJvbSAnLi9waG90byc7XG5pbXBvcnQgeyBXZWJZZXNOb1F1ZXN0aW9uIH0gZnJvbSAnLi95ZXMtbm8nO1xuaW1wb3J0IHsgd3JhcEluQ29udHJvbERpdiwgbWFrZUVsZW1lbnQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgTW9kYWxCdWlsZGVyIH0gZnJvbSAnLi9tb2RhbCc7XG5pbXBvcnQgeyBXZWJEYXRlUXVlc3Rpb24gfSBmcm9tICcuL2RhdGUnO1xuaW1wb3J0IHsgV2ViTXVsdGlDaG9pY2VRdWVzdGlvbiB9IGZyb20gJy4vbXVsdGktY2hvaWNlJztcbmltcG9ydCBtYWtlVGhyb2JiZXIgZnJvbSAnLi90aHJvYmJlcic7XG5cbi8qKlxuICogQSBXZWJXaWRnZXQgaXMgYW4gYWRkaXRpb25hbCBpbnRlcmZhY2UgdGhhdCBjYW4gYmUgaW1wbGVtZW50ZWQgb25cbiAqIGEgUXVlc3Rpb24gdG8gaW5kaWNhdGUgdGhhdCBpdCBoYXMgbmF0aXZlIHdlYiBzdXBwb3J0LCBhbmQgZG9lc24ndFxuICogbmVlZCB0byBqdXN0IGJlIGEgdGV4dCBpbnB1dCBmaWVsZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBXZWJXaWRnZXQ8VD4ge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgbmF0aXZlIEhUTUwgZWxlbWVudCBmb3IgdGhlIHF1ZXN0aW9uLlxuICAgKi9cbiAgZ2V0RWxlbWVudDogKCkgPT4gRWxlbWVudDtcblxuICAvKipcbiAgICogUHJvY2Vzc2VzIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBxdWVzdGlvbidzIHdlYiBpbnRlcmZhY2VcbiAgICogYW5kIHJldHVybnMgaXRzIHZhbHVlIChvciBhIHZhbGlkYXRpb24gZXJyb3IgaWYgaXQncyBpbnZhbGlkKS5cbiAgICovXG4gIHByb2Nlc3NFbGVtZW50OiAoKSA9PiBQcm9taXNlPFR8VmFsaWRhdGlvbkVycm9yPjtcblxuICAvKipcbiAgICogSWYgdGhlIG5hdGl2ZSBIVE1MIGVsZW1lbnQgY29udGFpbnMgYW4gPGlucHV0PiB0aGF0IG5lZWRzIGEgbGFiZWwsXG4gICAqIHRoaXMgY2FuIGJlIHNldCB0byB0aGUgXCJpZFwiIGF0dHJpYnV0ZSBvZiB0aGUgPGlucHV0Pi4gQ2FsbGluZyBjb2RlXG4gICAqIGlzIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyBhIDxsYWJlbD4gd2l0aCBhIFwiZm9yXCIgYXR0cmlidXRlIHBvaW50aW5nXG4gICAqIHRvIHRoZSBpZC5cbiAgICovXG4gIGxhYmVsRm9ySWQ/OiBzdHJpbmc7XG59XG5cbi8qKiBBIFdlYlF1ZXN0aW9uIGlzIGp1c3QgYSBRdWVzdGlvbiB0aGF0IHN1cHBvcnRzIHRoZSBXZWJXaWRnZXQgaW50ZXJmYWNlLiAqL1xudHlwZSBXZWJRdWVzdGlvbjxUPiA9IFdlYldpZGdldDxUPiAmIFF1ZXN0aW9uPFQ+O1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gUXVlc3Rpb24gaGFzIG5hdGl2ZSB3ZWIgc3VwcG9ydC5cbiAqIFxuICogQHBhcmFtIHF1ZXN0aW9uIEEgUXVlc3Rpb24gaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGlzV2ViUXVlc3Rpb248VD4ocXVlc3Rpb246IFF1ZXN0aW9uPFQ+KTogcXVlc3Rpb24gaXMgV2ViUXVlc3Rpb248VD4ge1xuICByZXR1cm4gdHlwZW9mKCg8V2ViUXVlc3Rpb248VD4+cXVlc3Rpb24pLmdldEVsZW1lbnQpID09PSAnZnVuY3Rpb24nO1xufVxuXG4vKiogXG4gKiBHaXZlbiBhIFF1ZXN0aW9uLCByZXR1cm4gYSB3ZWItZW5hYmxlZCB2ZXJzaW9uIG9mIGl0LiBJZiB0aGVcbiAqIFF1ZXN0aW9uIGRvZXNuJ3QgaGF2ZSBuYXRpdmUgd2ViIHN1cHBvcnQsIHdlIHdyYXAgaXQgaW4gYVxuICogc2ltcGxlIHRleHQgaW5wdXQgZmllbGQgYXMgYSBmYWxsYmFjay5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlV2ViV2lkZ2V0PFQ+KHF1ZXN0aW9uOiBRdWVzdGlvbjxUPik6IFdlYldpZGdldDxUPiB7XG4gIGlmIChpc1dlYlF1ZXN0aW9uKHF1ZXN0aW9uKSkge1xuICAgIHJldHVybiBxdWVzdGlvbjtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpbnB1dCA9IG1ha2VFbGVtZW50KCdpbnB1dCcsIHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIG5hbWU6IHF1ZXN0aW9uLnRleHQsXG4gICAgICBjbGFzc2VzOiBbJ2lucHV0J10sXG4gICAgfSk7XG4gICAgY29uc3QgY29udHJvbCA9IHdyYXBJbkNvbnRyb2xEaXYoaW5wdXQpO1xuICAgIHJldHVybiB7XG4gICAgICBnZXRFbGVtZW50OiAoKSA9PiBjb250cm9sLFxuICAgICAgcHJvY2Vzc0VsZW1lbnQ6ICgpID0+IHF1ZXN0aW9uLnByb2Nlc3NSZXNwb25zZShpbnB1dC52YWx1ZSksXG4gICAgICBsYWJlbEZvcklkOiBpbnB1dC5pZFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIGEgbWFwcGVkIHR5cGUgWzFdIGNvbnNpc3Rpbmcgb2YgcHJvcGVydGllcyB0aGF0IGNvbnNpc3RcbiAqIG9mIHF1ZXN0aW9uIGlucHV0cyB3aG9zZSBhbnN3ZXJzIG1hcCB0byB0aGUgb3JpZ2luYWwgcHJvcGVydHkgdHlwZXMuXG4gKiBcbiAqIFsxXSBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlc1xuICovXG5leHBvcnQgdHlwZSBRdWVzdGlvbklucHV0c0ZvcjxUPiA9IHtcbiAgW1AgaW4ga2V5b2YgVF06IFF1ZXN0aW9uSW5wdXQ8VFtQXT47XG59O1xuXG4vKipcbiAqIEEgUXVlc3Rpb25JbnB1dCB3cmFwcyBhIFF1ZXN0aW9uIGluIGFuIEhUTUwgZWxlbWVudCB3aXRoIGFuIGFyZWFcbiAqIGZvciBhIGxhYmVsLCBhbiBpbnB1dCBmaWVsZCB0YWlsb3JlZCB0byB0aGUgdHlwZSBvZiBxdWVzdGlvblxuICogYmVpbmcgYXNrZWQsIGFuZCBhbiBlcnJvciBtZXNzYWdlIGFyZWEuXG4gKi9cbmV4cG9ydCBjbGFzcyBRdWVzdGlvbklucHV0PFQ+IHtcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcbiAgd2lkZ2V0OiBXZWJXaWRnZXQ8VD47XG4gIGVycm9yOiBIVE1MUGFyYWdyYXBoRWxlbWVudHxudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHF1ZXN0aW9uOiBRdWVzdGlvbjxUPikge1xuICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICB0aGlzLmNvbnRhaW5lciA9IG1ha2VFbGVtZW50KCdkaXYnLCB7IGNsYXNzZXM6IFsnZmllbGQnXSB9KTtcblxuICAgIGNvbnN0IGxhYmVsID0gbWFrZUVsZW1lbnQoJ2xhYmVsJywge1xuICAgICAgY2xhc3NlczogWydqZi1xdWVzdGlvbicsICdsYWJlbCddLFxuICAgICAgdGV4dENvbnRlbnQ6IHF1ZXN0aW9uLnRleHQsXG4gICAgICBhcHBlbmRUbzogdGhpcy5jb250YWluZXIsXG4gICAgfSk7XG5cbiAgICB0aGlzLndpZGdldCA9IGNyZWF0ZVdlYldpZGdldChxdWVzdGlvbik7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy53aWRnZXQuZ2V0RWxlbWVudCgpKTtcbiAgICBpZiAodGhpcy53aWRnZXQubGFiZWxGb3JJZCkge1xuICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCB0aGlzLndpZGdldC5sYWJlbEZvcklkKTtcbiAgICB9XG4gICAgdGhpcy5lcnJvciA9IG51bGw7XG4gIH1cblxuICBzaG93RXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmVycm9yKSB7XG4gICAgICB0aGlzLmVycm9yID0gbWFrZUVsZW1lbnQoJ3AnLCB7XG4gICAgICAgIGNsYXNzZXM6IFsnaGVscCcsICdpcy1kYW5nZXInXSxcbiAgICAgICAgYXBwZW5kVG86IHRoaXMuY29udGFpbmVyXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5lcnJvci50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gIH1cblxuICBoaWRlRXJyb3IoKSB7XG4gICAgaWYgKHRoaXMuZXJyb3IpIHtcbiAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMuZXJyb3IpO1xuICAgICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzayBmb3IgdGhlIHVuZGVybHlpbmcgUXVlc3Rpb24ncyBjdXJyZW50IGFuc3dlciwgaWZcbiAgICogaXQgaGFzIGEgdmFsaWQgb25lLiBJZiBpdCBkb2Vzbid0LCBzaG93IHRoZSBlcnJvciB0b1xuICAgKiB0aGUgdXNlciBpbiB0aGUgZXJyb3IgYXJlYSBhbmQgcmV0dXJuIG51bGwuXG4gICAqL1xuICBhc3luYyByZXNwb25kKCk6IFByb21pc2U8VHxudWxsPiB7XG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy53aWRnZXQucHJvY2Vzc0VsZW1lbnQoKTtcblxuICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikge1xuICAgICAgdGhpcy5zaG93RXJyb3IocmVzcG9uc2UubWVzc2FnZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5oaWRlRXJyb3IoKTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYkludGVydmlld0lPIGV4dGVuZHMgSW50ZXJ2aWV3SU8ge1xuICByb290OiBFbGVtZW50fG51bGw7XG4gIHN0YXR1c0RpdjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3Iocm9vdDogRWxlbWVudCwgcmVhZG9ubHkgbW9kYWxCdWlsZGVyOiBNb2RhbEJ1aWxkZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgdGhpcy5tb2RhbEJ1aWxkZXIgPSBtb2RhbEJ1aWxkZXI7XG4gICAgdGhpcy5zdGF0dXNEaXYgPSBtYWtlRWxlbWVudCgnZGl2JywgeyBhcHBlbmRUbzogcm9vdCB9KTtcbiAgfVxuXG4gIGVuc3VyZVJvb3QoKTogRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgIHRocm93IG5ldyBJT0NhbmNlbGxhdGlvbkVycm9yKHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yb290O1xuICB9XG5cbiAgYXN5bmMgYXNrPFQ+KHF1ZXN0aW9uOiBRdWVzdGlvbjxUPik6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5hc2tNYW55KHsgcXVlc3Rpb24gfSkpLnF1ZXN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZ2F0aGVycyBvbmUgb3IgbW9yZSBxdWVzdGlvbnMgdG8gYXNrIGFuZCBlbWJlZHMgdGhlbVxuICAgKiBpbiBhIDxmb3JtPiBlbGVtZW50LiBJdCBhdXRvbWF0aWNhbGx5IHRha2VzIGNhcmUgb2ZcbiAgICogc2hvd2luZyB2YWxpZGF0aW9uIGVycm9ycyB0byB0aGUgdXNlciBhbmQgZG9lc24ndCByZXR1cm5cbiAgICogdW50aWwgYWxsIHF1ZXN0aW9ucyBoYXZlIGJlZW4gZ2l2ZW4gYSB2YWxpZCBhbnN3ZXIgYnlcbiAgICogdGhlIHVzZXIuXG4gICAqIFxuICAgKiBAcGFyYW0gcXVlc3Rpb25zIFRoZSBxdWVzdGlvbnMgdG8gYXNrLlxuICAgKi9cbiAgYXN5bmMgYXNrTWFueTxUPihxdWVzdGlvbnM6IFF1ZXN0aW9uc0ZvcjxUPik6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgY29uc3QgcXVlc3Rpb25JbnB1dHMgPSB7fSBhcyBRdWVzdGlvbklucHV0c0ZvcjxUPjtcbiAgICBsZXQgZm91bmRGaXJzdFF1ZXN0aW9uID0gZmFsc2U7XG5cbiAgICB0aGlzLmVuc3VyZVJvb3QoKS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgICBhd2FpdCB0aGlzLnNldFN0YXR1cygnJyk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gcXVlc3Rpb25zKSB7XG4gICAgICBpZiAoIWZvdW5kRmlyc3RRdWVzdGlvbikge1xuICAgICAgICBmb3VuZEZpcnN0UXVlc3Rpb24gPSB0cnVlO1xuICAgICAgICB0aGlzLmVtaXQoJ3RpdGxlJywgcXVlc3Rpb25zW2tleV0udGV4dCk7XG4gICAgICB9XG4gICAgICBjb25zdCBxaSA9IG5ldyBRdWVzdGlvbklucHV0KHF1ZXN0aW9uc1trZXldKTtcbiAgICAgIHF1ZXN0aW9uSW5wdXRzW2tleV0gPSBxaTtcbiAgICAgIGZvcm0uYXBwZW5kQ2hpbGQocWkuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJtaXQgPSBtYWtlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICBjbGFzc2VzOiBbJ2J1dHRvbicsICdpcy1wcmltYXJ5J10sXG4gICAgICB0ZXh0Q29udGVudDogJ1N1Ym1pdCcsXG4gICAgICBhcHBlbmRUbzogZm9ybSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldFJlc3BvbnNlcyA9IGFzeW5jICgpOiBQcm9taXNlPFR8bnVsbD4gPT4ge1xuICAgICAgY29uc3QgcmVzcG9uc2VzID0ge30gYXMgVDtcbiAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgIGZvciAobGV0IGtleSBpbiBxdWVzdGlvbklucHV0cykge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHF1ZXN0aW9uSW5wdXRzW2tleV0ucmVzcG9uZCgpO1xuICAgICAgICBpZiAocmVzcG9uc2UgIT09IG51bGwpIHtcbiAgICAgICAgICByZXNwb25zZXNba2V5XSA9IHJlc3BvbnNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlzVmFsaWQgPyByZXNwb25zZXMgOiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmb3JtLm9uc3VibWl0ID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBnZXRSZXNwb25zZXMoKS50aGVuKHJlc3BvbnNlcyA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlcykge1xuICAgICAgICAgICAgdGhpcy5lbnN1cmVSb290KCkucmVtb3ZlQ2hpbGQoZm9ybSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXNwb25zZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBub3RpZnkodGV4dDogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy5zZXRTdGF0dXMoJycpO1xuICAgIHRoaXMuZW1pdCgndGl0bGUnLCB0ZXh0KTtcbiAgICBhd2FpdCB0aGlzLm1vZGFsQnVpbGRlci5jcmVhdGVBbmRPcGVuKHRleHQpO1xuICB9XG5cbiAgYXN5bmMgc2V0U3RhdHVzKHRleHQ6IHN0cmluZywgb3B0aW9uczogeyBzaG93VGhyb2JiZXI/OiBib29sZWFuIH0gPSB7IHNob3dUaHJvYmJlcjogdHJ1ZSB9KSB7XG4gICAgdGhpcy5lbnN1cmVSb290KCk7XG4gICAgdGhpcy5zdGF0dXNEaXYudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGlmICh0ZXh0KSB7XG4gICAgICBpZiAob3B0aW9ucy5zaG93VGhyb2JiZXIpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKSk7XG4gICAgICAgIHRoaXMuc3RhdHVzRGl2LmFwcGVuZENoaWxkKG1ha2VUaHJvYmJlcigpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdCgndGl0bGUnLCB0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVQaG90b1F1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPFBob3RvPiB7XG4gICAgcmV0dXJuIG5ldyBXZWJQaG90b1F1ZXN0aW9uKHRleHQpO1xuICB9XG5cbiAgY3JlYXRlWWVzTm9RdWVzdGlvbih0ZXh0OiBzdHJpbmcpOiBRdWVzdGlvbjxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBXZWJZZXNOb1F1ZXN0aW9uKHRleHQpO1xuICB9XG5cbiAgY3JlYXRlRGF0ZVF1ZXN0aW9uKHRleHQ6IHN0cmluZyk6IFF1ZXN0aW9uPERhdGU+IHtcbiAgICByZXR1cm4gbmV3IFdlYkRhdGVRdWVzdGlvbih0ZXh0KTtcbiAgfVxuXG4gIGNyZWF0ZU11bHRpQ2hvaWNlUXVlc3Rpb248VD4odGV4dDogc3RyaW5nLCBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdKSB7XG4gICAgcmV0dXJuIG5ldyBXZWJNdWx0aUNob2ljZVF1ZXN0aW9uKHRleHQsIGFuc3dlcnMpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5lbnN1cmVSb290KCkuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLm1vZGFsQnVpbGRlci5zaHV0ZG93bigpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2ViSW50ZXJ2aWV3SU8ge1xuICBvbihldmVudDogJ3RpdGxlJywgbGlzdGVuZXI6ICh0aXRsZTogc3RyaW5nKSA9PiB2b2lkKTogdGhpcztcbiAgZW1pdChldmVudDogJ3RpdGxlJywgdGl0bGU6IHN0cmluZyk6IGJvb2xlYW47XG59XG4iLCJpbXBvcnQgeyBnZXRFbGVtZW50LCBtYWtlRWxlbWVudCB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gXCJldmVudHNcIjtcbmltcG9ydCB7IElPQ2FuY2VsbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vaW50ZXJ2aWV3LWlvXCI7XG5cbmV4cG9ydCBjbGFzcyBNb2RhbEJ1aWxkZXIge1xuICBtb2RhbDogTW9kYWx8bnVsbCA9IG51bGw7XG4gIG1vZGFsUmVzb2x2ZXM6IHsgcmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoZXJyOiBFcnJvcikgPT4gdm9pZCB9W10gPSBbXTtcbiAgaXNTaHV0RG93bjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRlbXBsYXRlOiBIVE1MVGVtcGxhdGVFbGVtZW50KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIHRoaXMuY3JlYXRlKCd0aGlzIGlzIGEgc21va2UgdGVzdCB0byBtYWtlIHN1cmUgdGhlIHRlbXBsYXRlIGlzIHZhbGlkIScpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGUodGV4dDogc3RyaW5nKTogTW9kYWwge1xuICAgIHJldHVybiBuZXcgTW9kYWwodGhpcy50ZW1wbGF0ZSwgdGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgc2ltcGxlIG1vZGFsIHdpdGggc29tZSB0ZXh0IGFuZCBhbiBPSyBidXR0b24sIGFuZCBzaG93IGl0LlxuICAgKiBcbiAgICogQHBhcmFtIHRleHQgVGhlIHRleHQgdG8gZGlzcGxheSBpbiB0aGUgbW9kYWwuXG4gICAqL1xuICBjcmVhdGVBbmRPcGVuKHRleHQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1NodXREb3duKSB7XG4gICAgICAgIHRocm93IG5ldyBJT0NhbmNlbGxhdGlvbkVycm9yKHRoaXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5tb2RhbFJlc29sdmVzLnB1c2goeyByZXNvbHZlLCByZWplY3QgfSk7XG4gICAgICBpZiAodGhpcy5tb2RhbCkge1xuICAgICAgICB0aGlzLm1vZGFsLmFkZFRleHQodGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vZGFsID0gdGhpcy5jcmVhdGUodGV4dCk7XG4gICAgICAgIHRoaXMubW9kYWwub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubW9kYWwgPSBudWxsO1xuICAgICAgICAgIGlmICh0aGlzLmlzU2h1dERvd24pIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWxSZXNvbHZlcy5mb3JFYWNoKG1yID0+IHtcbiAgICAgICAgICAgICAgbXIucmVqZWN0KG5ldyBJT0NhbmNlbGxhdGlvbkVycm9yKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1vZGFsUmVzb2x2ZXMuZm9yRWFjaChtciA9PiBtci5yZXNvbHZlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLm1vZGFsUmVzb2x2ZXMgPSBbXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubW9kYWwub3BlbigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2h1dGRvd24oKSB7XG4gICAgdGhpcy5pc1NodXREb3duID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5tb2RhbCkge1xuICAgICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBNb2RhbCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIG1vZGFsRGl2OiBIVE1MRGl2RWxlbWVudDtcbiAgb2tCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuICBjbG9zZUJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gIGNvbnRlbnRFbDogSFRNTERpdkVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGU6IEhUTUxUZW1wbGF0ZUVsZW1lbnQsIHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3QgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXG4gICAgdGhpcy5tb2RhbERpdiA9IGdldEVsZW1lbnQoJ2RpdicsICcubW9kYWwnLCBjbG9uZSk7XG4gICAgdGhpcy5jb250ZW50RWwgPSBnZXRFbGVtZW50KCdkaXYnLCAnW2RhdGEtbW9kYWwtY29udGVudF0nLCB0aGlzLm1vZGFsRGl2KTtcbiAgICB0aGlzLm9rQnV0dG9uID0gZ2V0RWxlbWVudCgnYnV0dG9uJywgJy5pcy1wcmltYXJ5JywgdGhpcy5tb2RhbERpdik7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IGdldEVsZW1lbnQoJ2J1dHRvbicsICcubW9kYWwtY2xvc2UnLCB0aGlzLm1vZGFsRGl2KTtcblxuICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVLZXlVcCA9IHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY29udGVudEVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm1vZGFsRGl2KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXApO1xuICAgIHRoaXMub2tCdXR0b24uZm9jdXMoKTtcbiAgICB0aGlzLm9rQnV0dG9uLm9uY2xpY2sgPSB0aGlzLmNsb3NlQnV0dG9uLm9uY2xpY2sgPSB0aGlzLmNsb3NlO1xuICAgIC8vIFRPRE86IFRyYXAga2V5Ym9hcmQgZm9jdXMgYW5kIGFsbCB0aGUgb3RoZXIgYWNjZXNzaWJpbGl0eSBiaXRzLlxuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm1vZGFsRGl2KTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXApO1xuICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcbiAgfVxuXG4gIGFkZFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgbWFrZUVsZW1lbnQoJ2JyJywgeyBhcHBlbmRUbzogdGhpcy5jb250ZW50RWwgfSk7XG4gICAgbWFrZUVsZW1lbnQoJ2JyJywgeyBhcHBlbmRUbzogdGhpcy5jb250ZW50RWwgfSk7XG4gICAgdGhpcy5jb250ZW50RWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVLZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTXVsdGlDaG9pY2VBbnN3ZXIsIFZhbGlkYXRpb25FcnJvciwgUXVlc3Rpb24gfSBmcm9tIFwiLi4vcXVlc3Rpb25cIjtcbmltcG9ydCB7IFdlYldpZGdldCB9IGZyb20gXCIuL2lvXCI7XG5pbXBvcnQgeyBtYWtlRWxlbWVudCwgY3JlYXRlVW5pcXVlSWQsIG1ha2VSYWRpbyB9IGZyb20gXCIuL3V0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFdlYk11bHRpQ2hvaWNlUXVlc3Rpb248VD4gZXh0ZW5kcyBRdWVzdGlvbjxUPiBpbXBsZW1lbnRzIFdlYldpZGdldDxUPiB7XG4gIGRpdjogSFRNTERpdkVsZW1lbnQ7XG4gIGlucHV0TmFtZTogc3RyaW5nO1xuICByYWRpb3M6IEhUTUxJbnB1dEVsZW1lbnRbXTtcbiAgdGV4dDogc3RyaW5nO1xuICBhbnN3ZXJzOiBNdWx0aUNob2ljZUFuc3dlcjxUPltdO1xuXG4gIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcnM6IE11bHRpQ2hvaWNlQW5zd2VyPFQ+W10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGV4dCA9IHF1ZXN0aW9uO1xuICAgIHRoaXMuYW5zd2VycyA9IGFuc3dlcnM7XG4gICAgdGhpcy5kaXYgPSBtYWtlRWxlbWVudCgnZGl2JywgeyBjbGFzc2VzOiBbJ2NvbnRyb2wnXSB9KTtcbiAgICB0aGlzLmlucHV0TmFtZSA9IGNyZWF0ZVVuaXF1ZUlkKCk7XG4gICAgdGhpcy5yYWRpb3MgPSBhbnN3ZXJzLm1hcChhbnN3ZXIgPT4ge1xuICAgICAgY29uc3Qgd3JhcHBlciA9IG1ha2VFbGVtZW50KCdwJywgeyBhcHBlbmRUbzogdGhpcy5kaXYgfSk7XG4gICAgICByZXR1cm4gbWFrZVJhZGlvKHdyYXBwZXIsIHRoaXMuaW5wdXROYW1lLCBhbnN3ZXJbMV0pLmlucHV0O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXY7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzRWxlbWVudCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCByYWRpbyA9IHRoaXMucmFkaW9zW2ldO1xuICAgICAgaWYgKHJhZGlvLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5zd2Vyc1tpXVswXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBjaG9vc2UgYW4gYW5zd2VyLicpO1xuICB9XG5cbiAgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPFQgfCBWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCEnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUXVlc3Rpb24sIFZhbGlkYXRpb25FcnJvciB9IGZyb20gXCIuLi9xdWVzdGlvblwiO1xuaW1wb3J0IHsgUGhvdG8gfSBmcm9tIFwiLi4vdXRpbFwiO1xuaW1wb3J0IHsgV2ViV2lkZ2V0IH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IG1ha2VFbGVtZW50IH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5leHBvcnQgY2xhc3MgV2ViUGhvdG9RdWVzdGlvbiBleHRlbmRzIFF1ZXN0aW9uPFBob3RvPiBpbXBsZW1lbnRzIFdlYldpZGdldDxQaG90bz4ge1xuICBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcbiAgbGFiZWxGb3JJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRleHQ6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICB0aGlzLmlucHV0ID0gbWFrZUVsZW1lbnQoJ2lucHV0JywgeyB0eXBlOiAnZmlsZScgfSk7XG4gICAgdGhpcy5sYWJlbEZvcklkID0gdGhpcy5pbnB1dC5pZDtcbiAgfVxuXG4gIHByb2Nlc3NSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKTogUHJvbWlzZTxQaG90b3xWYWxpZGF0aW9uRXJyb3I+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgZnVuY3Rpb24gc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCEnKTtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKTogRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXQ7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzRWxlbWVudCgpOiBQcm9taXNlPFBob3RvfFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5pbnB1dC5maWxlcztcblxuICAgIGlmICghZmlsZXMgfHwgZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25FcnJvcignWW91IG11c3QgdXBsb2FkIGFuIGltYWdlIScpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSBmaWxlc1swXTtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFBob3RvPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmICghZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdCgnZXZlbnQudGFyZ2V0IGlzIG51bGwhJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZihldmVudC50YXJnZXQucmVzdWx0KSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICAgIC9eZGF0YTovLnRlc3QoZXZlbnQudGFyZ2V0LnJlc3VsdCkpIHtcbiAgICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCgnZXZlbnQudGFyZ2V0LnJlc3VsdCBpcyBub3QgYSBkYXRhIFVSSSEnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlU2VyaWFsaXplcjxTPiB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGtleW5hbWU6IHN0cmluZywgcmVhZG9ubHkgZGVmYXVsdFN0YXRlOiBTKSB7XG4gICAgdGhpcy5rZXluYW1lID0ga2V5bmFtZTtcbiAgICB0aGlzLmRlZmF1bHRTdGF0ZSA9IGRlZmF1bHRTdGF0ZTtcbiAgfVxuXG4gIGdldCgpOiBTIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlW3RoaXMua2V5bmFtZV07XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdFN0YXRlO1xuICAgIH1cbiAgfVxuXG4gIHNldChzdGF0ZTogUykge1xuICAgIGNvbnN0IGNvbnRlbnRzID0gSlNPTi5zdHJpbmdpZnkoc3RhdGUsIG51bGwsIDIpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2VbdGhpcy5rZXluYW1lXSA9IGNvbnRlbnRzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBtYWtlRWxlbWVudCwgZ2V0RWxlbWVudCB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gaHR0cHM6Ly9jb21tb25zLndpa2ltZWRpYS5vcmcvd2lraS9GaWxlOkNocm9taXVtdGhyb2JiZXIuc3ZnXG5jb25zdCBIVE1MID0gYFxuPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDMwMCAzMDBcIlxuICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiPlxuICA8cGF0aCBkPVwiTSAxNTAsMFxuICAgICAgICAgICBhIDE1MCwxNTAgMCAwLDEgMTA2LjA2NiwyNTYuMDY2XG4gICAgICAgICAgIGwgLTM1LjM1NSwtMzUuMzU1XG4gICAgICAgICAgIGEgLTEwMCwtMTAwIDAgMCwwIC03MC43MTEsLTE3MC43MTEgelwiXG4gICAgICAgIGZpbGw9XCIjMDBkMWIyXCI+XG4gICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT1cInRyYW5zZm9ybVwiIGF0dHJpYnV0ZVR5cGU9XCJYTUxcIlxuICAgICAgICAgICB0eXBlPVwicm90YXRlXCIgZnJvbT1cIjAgMTUwIDE1MFwiIHRvPVwiMzYwIDE1MCAxNTBcIlxuICAgICAgICAgICBiZWdpbj1cIjBzXCIgZHVyPVwiMXNcIiBmaWxsPVwiZnJlZXplXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgLz5cbiAgPC9wYXRoPlxuPC9zdmc+XG5gLnRyaW0oKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZVRocm9iYmVyKCk6IFNWR0VsZW1lbnQge1xuICBjb25zdCBkaXYgPSBtYWtlRWxlbWVudCgnZGl2JywgeyBpbm5lckhUTUw6IEhUTUwgfSk7XG4gIGNvbnN0IHN2ZyA9IGRpdi5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgaWYgKCFzdmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Rocm9iYmVyIHN2ZyBub3QgZm91bmQnKTtcbiAgfVxuICByZXR1cm4gc3ZnO1xufVxuXG4vLyBUaGlzIGlzIGEgc21va2UgdGVzdC9zYW5pdHkgY2hlY2suXG5tYWtlVGhyb2JiZXIoKTtcbiIsIi8qKlxuICogRmluZCBhbiBlbGVtZW50LlxuICogXG4gKiBAcGFyYW0gdGFnTmFtZSBUaGUgbmFtZSBvZiB0aGUgZWxlbWVudCdzIEhUTUwgdGFnLlxuICogQHBhcmFtIHNlbGVjdG9yIFRoZSBzZWxlY3RvciBmb3IgdGhlIGVsZW1lbnQsIG5vdCBpbmNsdWRpbmcgaXRzIEhUTUwgdGFnLlxuICogQHBhcmFtIHBhcmVudCBUaGUgcGFyZW50IG5vZGUgdG8gc2VhcmNoIHdpdGhpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnQ8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oXG4gIHRhZ05hbWU6IEssXG4gIHNlbGVjdG9yOiBzdHJpbmcsXG4gIHBhcmVudDogUGFyZW50Tm9kZSA9IGRvY3VtZW50XG4pOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10ge1xuICBjb25zdCBmaW5hbFNlbGVjdG9yID0gYCR7dGFnTmFtZX0ke3NlbGVjdG9yfWA7XG4gIGNvbnN0IG5vZGUgPSBwYXJlbnQucXVlcnlTZWxlY3RvcihmaW5hbFNlbGVjdG9yKTtcbiAgaWYgKCFub2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZG4ndCBmaW5kIGFueSBlbGVtZW50cyBtYXRjaGluZyBcIiR7ZmluYWxTZWxlY3Rvcn1cImApO1xuICB9XG4gIHJldHVybiBub2RlIGFzIEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcbn1cblxubGV0IGlkQ291bnRlciA9IDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVbmlxdWVJZCgpOiBzdHJpbmcge1xuICBpZENvdW50ZXIrKztcbiAgcmV0dXJuIGB1bmlxdWVfaWRfJHtpZENvdW50ZXJ9YDtcbn1cblxuLyoqIFRoaXMgZGVmaW5lcyBhbGwgdGhlIHZhbGlkIENTUyBjbGFzc2VzIGluIG91ciBwcm9qZWN0LiAqL1xudHlwZSBDc3NDbGFzc05hbWUgPVxuICAvLyBCdWxtYSBjbGFzc2VzLlxuICAnY29udHJvbCcgfFxuICAnZmllbGQnIHxcbiAgJ2xhYmVsJyB8XG4gICdoZWxwJyB8XG4gICdidXR0b24nIHxcbiAgJ3JhZGlvJyB8XG4gICdpbnB1dCcgfFxuICAnaXMtZGFuZ2VyJyB8XG4gICdpcy1wcmltYXJ5JyB8XG4gIC8vIEN1c3RvbSBKdXN0Rml4IGNsYXNzZXMuXG4gICdqZi1xdWVzdGlvbic7XG5cbmludGVyZmFjZSBNYWtlRWxlbWVudE9wdGlvbnM8VCBleHRlbmRzIEhUTUxFbGVtZW50PiB7XG4gIC8qKiBUaGUgZWxlbWVudCdzIGNsYXNzZXMgKGNvcnJlc3BvbmRzIHRvIHRoZSBcImNsYXNzXCIgYXR0cmlidXRlKS4gKi9cbiAgY2xhc3Nlcz86IENzc0NsYXNzTmFtZVtdLFxuICAvKiogVGhlIGlucHV0IGVsZW1lbnQncyB0eXBlLiAqL1xuICB0eXBlPzogVCBleHRlbmRzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MQnV0dG9uRWxlbWVudCA/IHN0cmluZyA6IG5ldmVyLFxuICAvKiogVGhlIGlucHV0IGVsZW1lbnQncyBuYW1lLiAqL1xuICBuYW1lPzogVCBleHRlbmRzIEhUTUxJbnB1dEVsZW1lbnQgPyBzdHJpbmcgOiBuZXZlcixcbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50J3MgdmFsdWUuICovXG4gIHZhbHVlPzogVCBleHRlbmRzIEhUTUxJbnB1dEVsZW1lbnQgPyBzdHJpbmcgOiBuZXZlcixcbiAgLyoqIE9wdGlvbmFsIHBhcmVudCBlbGVtZW50IHRvIGFwcGVuZCB0aGUgbmV3bHktY3JlYXRlZCBlbGVtZW50IHRvLiAqL1xuICBhcHBlbmRUbz86IEVsZW1lbnQsXG4gIC8qKiBPcHRpb25hbCBjaGlsZCBlbGVtZW50cyB0byBhcHBlbmQgdG8gdGhlIG5ld2x5LWNyZWF0ZWQgZWxlbWVudC4gKi9cbiAgY2hpbGRyZW4/OiBFbGVtZW50W10sXG4gIC8qKiBUaGUgZWxlbWVudCdzIHRleHQgY29udGVudC4gKi9cbiAgdGV4dENvbnRlbnQ/OiBzdHJpbmcsXG4gIC8qKiBUaGUgZWxlbWVudCdzIGlubmVyIEhUTUwuICovXG4gIGlubmVySFRNTD86IHN0cmluZyxcbiAgLyoqIFRoZSBlbGVtZW50J3MgXCJ0YWJpbmRleFwiIGF0dHJpYnV0ZS4gKi9cbiAgdGFiSW5kZXg/OiAwIHwgLTEsXG59XG5cbi8qKlxuICogQ3JlYXRlIGFuIEhUTUwgZWxlbWVudC5cbiAqIFxuICogSWYgdGhlIGVsZW1lbnQgaXMgYW4gPGlucHV0PiwgYXV0b21hdGljYWxseSBhc3NpZ24gYSB1bmlxdWUgSUQgdG8gaXQuXG4gKiBcbiAqIEBwYXJhbSB0YWdOYW1lIFRoZSBuYW1lIG9mIHRoZSBlbGVtZW50J3MgSFRNTCB0YWcuXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFbGVtZW50PEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KFxuICB0YWdOYW1lOiBLLFxuICBvcHRpb25zOiBNYWtlRWxlbWVudE9wdGlvbnM8SFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdPlxuKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdIHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXG4gIGlmIChvcHRpb25zLmNsYXNzZXMpIHtcbiAgICBvcHRpb25zLmNsYXNzZXMuZm9yRWFjaChjbGFzc05hbWUgPT4gZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpKTtcbiAgfVxuICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50IHx8IGVsIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICBlbC50eXBlID0gb3B0aW9ucy50eXBlIHx8ICcnO1xuICB9XG4gIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICBlbC5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICcnO1xuICAgIGVsLnZhbHVlID0gb3B0aW9ucy52YWx1ZSB8fCAnJztcbiAgICBlbC5pZCA9IGNyZWF0ZVVuaXF1ZUlkKCk7XG4gIH1cblxuICBpZiAob3B0aW9ucy50ZXh0Q29udGVudCkge1xuICAgIGVsLnRleHRDb250ZW50ID0gb3B0aW9ucy50ZXh0Q29udGVudDtcbiAgfVxuICBpZiAob3B0aW9ucy5pbm5lckhUTUwpIHtcbiAgICBlbC5pbm5lckhUTUwgPSBvcHRpb25zLmlubmVySFRNTDtcbiAgfVxuICBpZiAob3B0aW9ucy5hcHBlbmRUbykge1xuICAgIG9wdGlvbnMuYXBwZW5kVG8uYXBwZW5kQ2hpbGQoZWwpO1xuICB9XG4gIGlmIChvcHRpb25zLmNoaWxkcmVuKSB7XG4gICAgb3B0aW9ucy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IGVsLmFwcGVuZENoaWxkKGNoaWxkKSk7XG4gIH1cbiAgaWYgKHR5cGVvZihvcHRpb25zLnRhYkluZGV4KSA9PT0gJ251bWJlcicpIHtcbiAgICBlbC50YWJJbmRleCA9IG9wdGlvbnMudGFiSW5kZXg7XG4gIH1cblxuICByZXR1cm4gZWw7XG59XG5cbi8qKlxuICogV3JhcCB0aGUgZ2l2ZW4gZWxlbWVudCBpbiBhIDxkaXYgY2xhc3M9XCJjb250cm9sXCI+LlxuICogXG4gKiBAcGFyYW0gZWwgVGhlIGVsZW1lbnQgdG8gd3JhcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyYXBJbkNvbnRyb2xEaXYoZWw6IEVsZW1lbnQpOiBIVE1MRGl2RWxlbWVudCB7XG4gIHJldHVybiBtYWtlRWxlbWVudCgnZGl2Jywge1xuICAgIGNsYXNzZXM6IFsnY29udHJvbCddLFxuICAgIGNoaWxkcmVuOiBbZWxdLFxuICB9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gPGlucHV0IHR5cGU9XCJyYWRpb1wiPiB3cmFwcGVkIGluIGEgPGxhYmVsPi5cbiAqIFxuICogQHBhcmFtIHBhcmVudCBUaGUgcGFyZW50IG5vZGUgdG8gYXBwZW5kIHRoZSByYWRpbyB0by5cbiAqIEBwYXJhbSBpbnB1dE5hbWUgVGhlIFwibmFtZVwiIGF0dHJpYnV0ZSBvZiB0aGUgcmFkaW8uXG4gKiBAcGFyYW0gbGFiZWxUZXh0IFRoZSB0ZXh0IG9mIHRoZSByYWRpbydzIGxhYmVsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZVJhZGlvKHBhcmVudDogSFRNTEVsZW1lbnQsIGlucHV0TmFtZTogc3RyaW5nLCBsYWJlbFRleHQ6IHN0cmluZyk6IHtcbiAgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQsXG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50XG59IHtcbiAgY29uc3QgbGFiZWwgPSBtYWtlRWxlbWVudCgnbGFiZWwnLCB7IGNsYXNzZXM6IFsncmFkaW8nXSB9KTtcbiAgY29uc3QgaW5wdXQgPSBtYWtlRWxlbWVudCgnaW5wdXQnLCB7XG4gICAgdHlwZTogJ3JhZGlvJyxcbiAgICBuYW1lOiBpbnB1dE5hbWUsXG4gICAgdmFsdWU6IGxhYmVsVGV4dCxcbiAgICBhcHBlbmRUbzogbGFiZWxcbiAgfSk7XG5cbiAgbGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCAke2xhYmVsVGV4dH1gKSk7XG5cbiAgcGFyZW50LmFwcGVuZENoaWxkKGxhYmVsKTtcblxuICByZXR1cm4geyBsYWJlbCwgaW5wdXQgfTtcbn1cbiIsImltcG9ydCB7IFZhbGlkYXRpb25FcnJvciwgWWVzTm9RdWVzdGlvbiB9IGZyb20gXCIuLi9xdWVzdGlvblwiO1xuaW1wb3J0IHsgV2ViV2lkZ2V0IH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IGNyZWF0ZVVuaXF1ZUlkLCBtYWtlUmFkaW8sIG1ha2VFbGVtZW50IH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5cbmV4cG9ydCBjbGFzcyBXZWJZZXNOb1F1ZXN0aW9uIGV4dGVuZHMgWWVzTm9RdWVzdGlvbiBpbXBsZW1lbnRzIFdlYldpZGdldDxib29sZWFuPiB7XG4gIGRpdjogSFRNTERpdkVsZW1lbnQ7XG4gIHllc0lucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICBub0lucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICBpbnB1dE5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSB0ZXh0OiBzdHJpbmcpIHtcbiAgICBzdXBlcih0ZXh0KTtcbiAgICB0aGlzLmRpdiA9IG1ha2VFbGVtZW50KCdkaXYnLCB7IGNsYXNzZXM6IFsnY29udHJvbCddIH0pO1xuICAgIHRoaXMuaW5wdXROYW1lID0gY3JlYXRlVW5pcXVlSWQoKTtcbiAgICB0aGlzLnllc0lucHV0ID0gbWFrZVJhZGlvKHRoaXMuZGl2LCB0aGlzLmlucHV0TmFtZSwgJ1llcycpLmlucHV0O1xuICAgIHRoaXMubm9JbnB1dCA9IG1ha2VSYWRpbyh0aGlzLmRpdiwgdGhpcy5pbnB1dE5hbWUsICdObycpLmlucHV0O1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZGl2O1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc0VsZW1lbnQoKTogUHJvbWlzZTxib29sZWFufFZhbGlkYXRpb25FcnJvcj4ge1xuICAgIGlmICh0aGlzLnllc0lucHV0LmNoZWNrZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ub0lucHV0LmNoZWNrZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1BsZWFzZSBjaG9vc2UgYW4gYW5zd2VyLicpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaW1wb3J0IHsgRGF0ZVN0cmluZyB9IGZyb20gJy4uL2xpYi91dGlsJztcbmltcG9ydCB7IFRlbmFudEludGVydmlldyB9IGZyb20gJy4uL2xpYi90ZW5hbnQtaW50ZXJ2aWV3JztcbmltcG9ydCB7IFRlbmFudCB9IGZyb20gJy4uL2xpYi90ZW5hbnQnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlU2VyaWFsaXplciB9IGZyb20gJy4uL2xpYi93ZWIvc2VyaWFsaXplcic7XG5pbXBvcnQgeyBXZWJJbnRlcnZpZXdJTyB9IGZyb20gJy4uL2xpYi93ZWIvaW8nO1xuaW1wb3J0IHsgZ2V0RWxlbWVudCB9IGZyb20gJy4uL2xpYi93ZWIvdXRpbCc7XG5pbXBvcnQgeyBNb2RhbEJ1aWxkZXIgfSBmcm9tICcuLi9saWIvd2ViL21vZGFsJztcbmltcG9ydCB7IFJlY29yZGFibGVJbnRlcnZpZXdJTywgUmVjb3JkZWRBY3Rpb24gfSBmcm9tICcuLi9saWIvcmVjb3JkYWJsZS1pbyc7XG5pbXBvcnQgeyBJT0NhbmNlbGxhdGlvbkVycm9yIH0gZnJvbSAnLi4vbGliL2ludGVydmlldy1pbyc7XG5cbmludGVyZmFjZSBBcHBTdGF0ZSB7XG4gIGRhdGU6IERhdGVTdHJpbmcsXG4gIHRlbmFudDogVGVuYW50LFxuICByZWNvcmRpbmc6IFJlY29yZGVkQWN0aW9uW10sXG59XG5cbmNvbnN0IElOSVRJQUxfQVBQX1NUQVRFOiBBcHBTdGF0ZSA9IHtcbiAgZGF0ZTogbmV3IERhdGUoKSxcbiAgdGVuYW50OiB7fSxcbiAgcmVjb3JkaW5nOiBbXSxcbn07XG5cbmludGVyZmFjZSBSZXN0YXJ0T3B0aW9ucyB7XG4gIHB1c2hTdGF0ZTogYm9vbGVhbjtcbn1cblxubGV0IGlvOiBXZWJJbnRlcnZpZXdJT3xudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gcmVzdGFydChvcHRpb25zOiBSZXN0YXJ0T3B0aW9ucyA9IHsgcHVzaFN0YXRlOiB0cnVlIH0pIHtcbiAgY29uc3QgcmVzZXRCdXR0b24gPSBnZXRFbGVtZW50KCdidXR0b24nLCAnI3Jlc2V0Jyk7XG4gIGNvbnN0IGRhdGVJbnB1dCA9IGdldEVsZW1lbnQoJ2lucHV0JywgJyNkYXRlJyk7XG4gIGNvbnN0IG1haW5EaXYgPSBnZXRFbGVtZW50KCdkaXYnLCAnI21haW4nKTtcbiAgY29uc3QgbW9kYWxUZW1wbGF0ZSA9IGdldEVsZW1lbnQoJ3RlbXBsYXRlJywgJyNtb2RhbCcpO1xuXG4gIGlmIChpbykge1xuICAgIGlvLmNsb3NlKCk7XG4gICAgaW8gPSBudWxsO1xuICB9XG5cbiAgY29uc3Qgc2VyaWFsaXplciA9IG5ldyBMb2NhbFN0b3JhZ2VTZXJpYWxpemVyKCd0ZW5hbnRBcHBTdGF0ZScsIElOSVRJQUxfQVBQX1NUQVRFKTtcbiAgY29uc3QgbXlJbyA9IG5ldyBXZWJJbnRlcnZpZXdJTyhtYWluRGl2LCBuZXcgTW9kYWxCdWlsZGVyKG1vZGFsVGVtcGxhdGUpKTtcbiAgaW8gPSBteUlvO1xuXG4gIC8vIFdlIHdhbnQgdG8gYmluZCB0aGlzIHJlc2V0IGJ1dHRvbiBhcyBlYXJseSBhcyBwb3NzaWJsZSwgc28gdGhhdCBpZiB0aGVcbiAgLy8gc2VyaWFsaXplciBzdGF0ZSBpcyBicm9rZW4gKGUuZy4gYmVjYXVzZSB0aGUgc2NoZW1hIGNoYW5nZWQgcmVjZW50bHkpLFxuICAvLyBpdCdzIGFsd2F5cyBwb3NzaWJsZSB0byByZXNldC5cbiAgcmVzZXRCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICBzZXJpYWxpemVyLnNldChJTklUSUFMX0FQUF9TVEFURSk7XG4gICAgcmVzdGFydCgpO1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnB1c2hTdGF0ZSkge1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzZXJpYWxpemVyLmdldCgpLCAnJywgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHNlcmlhbGl6ZXIuZ2V0KCksICcnLCBudWxsKTtcbiAgfVxuXG4gIHdpbmRvdy5vbnBvcHN0YXRlID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LnN0YXRlKSB7XG4gICAgICBzZXJpYWxpemVyLnNldChldmVudC5zdGF0ZSk7XG4gICAgICByZXN0YXJ0KHsgcHVzaFN0YXRlOiBmYWxzZSB9KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVjb3JkYWJsZUlvID0gbmV3IFJlY29yZGFibGVJbnRlcnZpZXdJTyhpbywgc2VyaWFsaXplci5nZXQoKS5yZWNvcmRpbmcpO1xuICBjb25zdCBpbnRlcnZpZXcgPSBuZXcgVGVuYW50SW50ZXJ2aWV3KHtcbiAgICBpbzogcmVjb3JkYWJsZUlvLFxuICAgIG5vdzogbmV3IERhdGUoc2VyaWFsaXplci5nZXQoKS5kYXRlKSxcbiAgfSk7XG5cbiAgZGF0ZUlucHV0LnZhbHVlQXNEYXRlID0gaW50ZXJ2aWV3Lm5vdztcblxuICBkYXRlSW5wdXQub25jaGFuZ2UgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBzZXJpYWxpemVyLnNldCh7XG4gICAgICAuLi5zZXJpYWxpemVyLmdldCgpLFxuICAgICAgcmVjb3JkaW5nOiBbXSxcbiAgICAgIGRhdGU6IGRhdGVJbnB1dC52YWx1ZUFzRGF0ZVxuICAgIH0pO1xuICAgIHJlc3RhcnQoKTtcbiAgfTtcblxuICByZWNvcmRhYmxlSW8ub24oJ2JlZ2luLXJlY29yZGluZy1hY3Rpb24nLCB0eXBlID0+IHtcbiAgICBpZiAoKHR5cGUgPT09ICdhc2snIHx8IHR5cGUgPT09ICdhc2tNYW55JyB8fCB0eXBlID09PSAnbm90aWZ5JykgJiYgaW8gPT09IG15SW8pIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gc2VyaWFsaXplci5nZXQoKTtcbiAgICAgIGNvbnN0IHJlY29yZGluZyA9IHJlY29yZGFibGVJby5uZXdSZWNvcmRpbmc7XG4gICAgICBpZiAocmVjb3JkaW5nLmxlbmd0aCA+IHN0YXRlLnJlY29yZGluZy5sZW5ndGgpIHtcbiAgICAgICAgLy8gVGhlIGludGVydmlldyBjb250YWlucyBtdWx0aXBsZSBxdWVzdGlvbiBzdGVwcyBiZWZvcmVcbiAgICAgICAgLy8gcmV0dXJuaW5nIGEgbmV3IHN0YXRlLiBSZW1lbWJlciB3aGF0IHRoZSB1c2VyIGhhc1xuICAgICAgICAvLyBhbnN3ZXJlZCBzbyBmYXIsIHNvIHRoYXQgdGhleSBjYW4gc3RpbGwgZWFzaWx5XG4gICAgICAgIC8vIG5hdmlnYXRlIGJldHdlZW4gdGhlIHF1ZXN0aW9uIHN0ZXBzIHVzaW5nIHRoZWlyXG4gICAgICAgIC8vIGJyb3dzZXIncyBiYWNrL2ZvcndhcmQgYnV0dG9ucy5cbiAgICAgICAgc2VyaWFsaXplci5zZXQoe1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIHJlY29yZGluZyxcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzZXJpYWxpemVyLmdldCgpLCAnJywgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpbnRlcnZpZXcub24oJ2NoYW5nZScsIChfLCBuZXh0U3RhdGUpID0+IHtcbiAgICBzZXJpYWxpemVyLnNldCh7XG4gICAgICAuLi5zZXJpYWxpemVyLmdldCgpLFxuICAgICAgcmVjb3JkaW5nOiByZWNvcmRhYmxlSW8ucmVzZXRSZWNvcmRpbmcoKSxcbiAgICAgIHRlbmFudDogbmV4dFN0YXRlXG4gICAgfSk7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHNlcmlhbGl6ZXIuZ2V0KCksICcnLCBudWxsKTtcbiAgfSk7XG5cbiAgbXlJby5vbigndGl0bGUnLCB0aXRsZSA9PiB7XG4gICAgZG9jdW1lbnQudGl0bGUgPSBgJHt0aXRsZX0gLSAke2ludGVydmlldy5ub3cudG9EYXRlU3RyaW5nKCl9YDtcbiAgfSk7XG5cbiAgaW50ZXJ2aWV3LmV4ZWN1dGUoc2VyaWFsaXplci5nZXQoKS50ZW5hbnQpLnRoZW4oYXN5bmMgKHRlbmFudCkgPT4ge1xuICAgIGNvbnN0IGZvbGxvd3VwQ291bnQgPSBpbnRlcnZpZXcuZ2V0Rm9sbG93VXBzKHRlbmFudCkubGVuZ3RoO1xuICAgIGNvbnN0IHN0YXR1cyA9IGZvbGxvd3VwQ291bnQgP1xuICAgICAgYE5vIG1vcmUgcXVlc3Rpb25zIGZvciBub3csIGJ1dCAke2ZvbGxvd3VwQ291bnR9IGZvbGxvd3VwKHMpIHJlbWFpbi5gIDpcbiAgICAgIGBJbnRlcnZpZXcgY29tcGxldGUsIG5vIG1vcmUgZm9sbG93dXBzIHRvIHByb2Nlc3MuYDtcbiAgICBhd2FpdCBteUlvLnNldFN0YXR1cyhzdGF0dXMsIHsgc2hvd1Rocm9iYmVyOiBmYWxzZSB9KTtcbiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBJT0NhbmNlbGxhdGlvbkVycm9yICYmIG15SW8gIT09IGlvKSB7XG4gICAgICAvLyBUaGUgaW50ZXJ2aWV3IHdhcyB3YWl0aW5nIGZvciBzb21lIGtpbmQgb2YgdXNlciBpbnB1dCBvciB0aW1lb3V0XG4gICAgICAvLyBidXQgdGhlIHVzZXIgaGFzIHNpbmNlIG5hdmlnYXRlZCBhd2F5IGZyb20gdGhpcyBpbnRlcnZpZXcgc2Vzc2lvbixcbiAgICAgIC8vIHNvIHRoaXMgZXhjZXB0aW9uIGlzIHRvIGJlIGV4cGVjdGVkLlxuICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZChgJHtlcnIuY29uc3RydWN0b3IubmFtZX0gcmVjZWl2ZWQsIGJ1dCBleHBlY3RlZDsgaWdub3JpbmcgaXQuYCk7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aHJvdyBlcnI7XG4gIH0pO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgcmVzdGFydCh7IHB1c2hTdGF0ZTogZmFsc2UgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=