interface BaseQ {
  type: string;
  text: string;
}

interface YesNoQ extends BaseQ {
  type: 'yesno';
}

interface TextQ extends BaseQ {
  type: 'text';
  canBeBlank?: true;
}

interface QResultMap {
  'yesno': boolean;
  'text': string;
}

type Q = YesNoQ | TextQ;

type QsFor<T> = {
  [P in keyof T]:
    T[P] extends boolean ? YesNoQ :
    T[P] extends string ? TextQ :
    never;
};

type QResult<T extends Q> = QResultMap[T['type']];

interface MultiQuestions<T> {
  [key: string]: boolean | string;
}

function askMany<S, T extends MultiQuestions<S>>(questions: QsFor<T>): T {
  const result = {} as T;

  for (let key in questions) {
    const question = questions[key];
    const answer = ask(question);
    result[key] = answer;
  }

  return result;
}

function ask<T extends Q>(question: T): QResult<T> {
  // These all provide fake answers.
  switch (question.type) {
    case 'yesno':
    return true;

    case 'text':
    return 'blah';
  }
}

// Example code

type BlargFluffle = {
  thing: string;
  meh: boolean;
};

let blargQuestions: QsFor<BlargFluffle> = {
  thing: {type: 'text', text: 'what is thing?'},
  meh: {type: 'yesno', text: 'are you meh?'},
};

let fluffle = askMany({
  thing: {type: 'text', text: 'what is thing?'},
  meh: {type: 'yesno', text: 'are you meh?'},
} as QsFor<BlargFluffle>);
