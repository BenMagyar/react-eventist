import { Component, Children } from 'react';
import PropTypes from 'prop-types';

export function createEventist(eventistKey = 'eventist') {

  class Eventist extends Component {

    constructor(props, context) {
      super(props, context);
      this[eventistKey] = { pre: props.pre, post: props.post, };
    }

    getChildContext() {
      return { [eventistKey]: this[eventistKey] };
    }

    render() {
      return Children.only(this.props.children);
    }

  };

  Eventist.propTypes = {
    pre: PropTypes.array,
    post: PropTypes.array,
    children: PropTypes.element.isRequired,
  };

  Eventist.defaultProps = {
    pre: [],
    post: [],
  };

  Eventist.childContextTypes = {
    [eventistKey]: PropTypes.object,
  };

  return Eventist;

};

export default createEventist();
