import { h, Component, render } from 'preact';
import { makeElement } from '../lib/web/util';

interface BoopProps {
    thing: number
}

interface BoopState {
    currThing: number;
}

export class Boop extends Component<BoopProps, BoopState> {
  timeout: any = null;

  constructor(props: BoopProps) {
    super(props);
    this.state = { currThing: props.thing };
  }
  componentDidMount() {
    this.timeout = setInterval(() => {
      this.setState({ currThing: this.state.currThing + 1 });
    }, 1000);
  }
  componentWillUnmount() {
    if (this.timeout !== null) {
      clearInterval(this.timeout);
      this.timeout = null;
    }
  }
  render(props: BoopProps, state: BoopState) {
    return <h1>hi {state.currThing}</h1>;
  }
}

window.addEventListener('load', () => {
  render(<Boop thing={50} />, makeElement('div', {
    appendTo: document.body
  }));
});

